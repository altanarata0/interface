import * as React from "react";
import { useState, useRef, useCallback } from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";
import { AutoComplete, type Option } from "@/components/ui/autocomplete";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { ProjectStatus, Phase, Step, Project } from "@/components/screens/projects-tracker/types";

interface CreateProjectDialogContentProps {
  transloaditApiKey: string;
  transloaditTemplateId: string;
  addProject: () => void;
}

type DialogStep = "fileUpload" | "addressInput";

export const CreateProjectDialogContent: React.FC<
  CreateProjectDialogContentProps
> = ({ transloaditApiKey, transloaditTemplateId, addProject }) => {
  const [currentStep, setCurrentStep] = useState<DialogStep>("fileUpload");
  const [selectedAddress, setSelectedAddress] = useState<Option | undefined>(
    undefined,
  );
  const [hasUploadedFiles, setHasUploadedFiles] = useState<boolean>(false);
  const [addressLine1, setAddressLine1] = useState<string>("");
  const [addressLine2, setAddressLine2] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAddressOptions = useCallback(
    async (query: string): Promise<Option[]> => {
      return new Promise((resolvePromise) => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }

        if (!query.trim()) {
          resolvePromise([]);
          return;
        }

        debounceTimeoutRef.current = setTimeout(async () => {
          try {
            const response = await fetch(
              `/api/addresses/autocomplete?prefix=${encodeURIComponent(query)}`,
            );
            if (!response.ok) {
              console.error(
                "Failed to fetch addresses:",
                response.statusText,
                await response.text(),
              );
              resolvePromise([]);
              return;
            }
            const suggestionsFromApi = await response.json();

            if (!Array.isArray(suggestionsFromApi)) {
              console.error(
                "Fetched data is not an array:",
                suggestionsFromApi,
              );
              resolvePromise([]);
              return;
            }

            const options: Option[] = suggestionsFromApi.map(
              (suggestion: any) => ({
                value: suggestion.fullAddress, // Using fullAddress as a unique value
                label: suggestion.fullAddress,
                streetLine: suggestion.streetLine,
                secondary: suggestion.secondary,
                city: suggestion.city,
                state: suggestion.state,
                zipcode: suggestion.zipcode,
              }),
            );
            resolvePromise(options);
          } catch (error) {
            console.error("Error fetching or processing addresses:", error);
            resolvePromise([]);
          }
        }, 300); // 300ms debounce
      });
    },
    [],
  );

  const navigate = useNavigate();

  React.useEffect(() => {
    if (selectedAddress) {
      setAddressLine1(selectedAddress.streetLine || "");
      setAddressLine2(selectedAddress.secondary || "");
      setCity(selectedAddress.city || "");
      setState(selectedAddress.state || "");
      setZipCode(selectedAddress.zipcode || "");
    } else {
      // Clear fields if selectedAddress is null or undefined
      setAddressLine1("");
      setAddressLine2("");
      setCity("");
      setState("");
      setZipCode("");
    }
  }, [selectedAddress]);

  const handleCreateProject = async () => {
    if (!selectedAddress) {
      console.error("No address selected, cannot create project.");
      return;
    }

    // const newProjectId = "mOs1kn_26";
    // const newProjectAddress = selectedAddress.label; // Or selectedAddress.value

    // const newProject: Project = getNewProject({
    //   newProjectAddress,
    //   city: selectedAddress.city ?? "",
    // });

    const projectId = await addProject();
    // console.log(
    //   "Creating project with address:",
    //   selectedAddress,
    //   "New project data:",
    //   project
    // );

    // Navigate to the intake form for the new project
    navigate({
      to: `/projects/${projectId}/intake-form`,
    });
  };

  return (
    <div className="flex flex-col">
      <DialogHeader>
        <DialogTitle>New Project</DialogTitle>
        <DialogDescription className="sr-only">
          {currentStep === "fileUpload"
            ? "Upload your project files."
            : "Enter the project address."}
        </DialogDescription>
      </DialogHeader>
      <div className="px-6 py-4 flex flex-col h-fit min-h-0">
        {currentStep === "fileUpload" && (
          <>
            <label className="block text-xl font-semibold mb-4">
              Would you like to upload files?
            </label>
            <div className="h-[350px]">
              <FileUploader
                transloaditApiKey={transloaditApiKey}
                transloaditTemplateId={transloaditTemplateId}
                onUpload={(files) => {
                  setHasUploadedFiles(true);
                  // Autofill address when files are uploaded
                  const defaultAddress: Option = {
                    value: "1482 34th Ave, Santa Clara, CA 95051",
                    label: "1482 34th Ave, Santa Clara, CA 95051",
                    streetLine: "1482 34th Ave",
                    secondary: "", // Assuming no secondary line for this address
                    city: "Santa Clara",
                    state: "CA",
                    zipcode: "95051",
                  };
                  setSelectedAddress(defaultAddress);
                }}
              />
            </div>
          </>
        )}
        {currentStep === "addressInput" && (
          <>
            <label className="block text-xl font-semibold mb-4">
              Select your project&#39;s address
            </label>
            <div className="space-y-6 h-[350px] overflow-y-auto pt-1 px-1">
              <AutoComplete
                options={[]}
                optionsFetch={fetchAddressOptions}
                emptyMessage="No address found. Type to search."
                placeholder="Search for an address..."
                value={selectedAddress}
                onValueChange={setSelectedAddress}
              />
              <div>
                <label
                  htmlFor="addressLine1"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Address Line 1
                </label>
                <Input
                  id="addressLine1"
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="Street address, P.O. box, company name, c/o"
                  className="mt-3"
                />
              </div>
              <div>
                <label
                  htmlFor="addressLine2"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Address Line 2 (Optional)
                </label>
                <Input
                  id="addressLine2"
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  className="mt-3"
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <div className="flex-1 sm:w-1/2">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    City
                  </label>
                  <Input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-3"
                  />
                </div>
                <div className="flex-1 sm:w-1/4 mt-4 sm:mt-0">
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    State
                  </label>
                  <Input
                    id="state"
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="mt-3"
                  />
                </div>
                <div className="flex-1 sm:w-1/4 mt-4 sm:mt-0">
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Zip Code
                  </label>
                  <Input
                    id="zipCode"
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="mt-3"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <DialogFooter>
        {currentStep === "fileUpload" && hasUploadedFiles && (
          <DialogClose asChild>
            <Button
              variant="outline"
              className="cursor-pointer transition-none"
            >
              Cancel
            </Button>
          </DialogClose>
        )}
        {currentStep === "addressInput" && (
          <Button
            variant="outline"
            className="cursor-pointer transition-none"
            onClick={() => setCurrentStep("fileUpload")}
          >
            Previous
          </Button>
        )}
        {currentStep === "fileUpload" ? (
          hasUploadedFiles ? (
            <Button
              className="cursor-pointer transition-none"
              onClick={() => setCurrentStep("addressInput")}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="outline"
              className="cursor-pointer transition-none"
              onClick={() => setCurrentStep("addressInput")}
            >
              Skip
            </Button>
          )
        ) : (
          <Button
            className="cursor-pointer transition-none"
            onClick={handleCreateProject}
            disabled={!selectedAddress} // Disable if no address is selected
          >
            Create Project
          </Button>
        )}
      </DialogFooter>
    </div>
  );
};
