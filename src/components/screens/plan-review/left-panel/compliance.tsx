import { CircleCheck, CircleX } from "lucide-react";
import { useMemo, useCallback, useEffect } from "react";
import { useAppStore } from "@/providers/app-store-provider";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Regulation } from "@/components/screens/projects-tracker/types";

// Define columns for DataTable
const columns: ColumnDef<Regulation>[] = [
  {
    accessorKey: "isCompliant",
    header: "",
    cell: ({ row }) => {
      const isCompliant = row.getValue("isCompliant");
      return isCompliant ? (
        <CircleCheck className="w-5 h-5 text-green-600 mx-auto my-auto" />
      ) : (
        <CircleX className="w-5 h-5 text-red-600 mx-auto my-auto" />
      );
    },
    size: 55,
    enableSorting: false,
  },
  {
    accessorKey: "regulation",
    header: "Regulation",
    minSize: 130,
    cell: ({ row }) => {
      const regulationText = row.getValue("regulation") as string;
      return (
        <div className="whitespace-normal break-words">{regulationText}</div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div
          className={cn(
            status === "In-Review" ? "text-yellow-600" : "text-green-600"
          )}
        >
          {status}
        </div>
      );
    },
    size: 100,
  },
];

export const Compliance = () => {
  const {
    projects,
    selectRegulation,
    setTab,
    selectedFileId,
    getFileById,
    selectedRegulationId,
  } = useAppStore((state) => state);

  const file = useMemo(
    () => getFileById(selectedFileId ?? ""),
    [selectedFileId, getFileById]
  );

  useEffect(() => {
    console.log("file", file);
  }, [file]);

  const complianceData = file?.regulations;
  const total = complianceData?.length ?? 0;

  const failed =
    useMemo(
      () => complianceData?.filter((item) => !item.isCompliant).length,
      [complianceData]
    ) ?? 0;

  const critical =
    useMemo(
      () =>
        complianceData?.filter((item) => item.severity === "Critical").length,
      [complianceData]
    ) ?? 0;

  const stats = useMemo(
    () => [
      {
        name: "Total Violations",
        value: failed,
      },
      {
        name: "Compliance Rate",
        value: `${Math.round(((total - failed) / total) * 100)}%`,
      },
      {
        name: "Critical Violations",
        value: critical,
      },
    ],
    [failed, total, critical]
  );

  useEffect(() => {
    console.log("complianceData", complianceData);
    if (complianceData && complianceData.length > 0) {
      const currentSelectionIsValid =
        selectedRegulationId &&
        complianceData.some((reg) => reg.id === selectedRegulationId);

      if (!currentSelectionIsValid) {
        selectRegulation(complianceData[0].id);
        setTab("code-review");
      }
    } else {
      // TODO: include this
      // if (selectedRegulation !== null) {
      //   setSelectedRegulation(null);
      // }
    }
  }, [complianceData, selectedRegulationId, selectRegulation, setTab]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <dl className="mt-1 mb-3 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="overflow-hidden rounded-lg bg-muted border border-gray-200 px-4 shadow-sm py-2"
          >
            <dt className="truncate text-sm font-medium text-gray-500">
              {item.name}
            </dt>
            <dd className="mt-1 text-xl details-containerfont-semibold tracking-tight text-gray-900">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grow flex flex-col overflow-hidden">
        <DataTable
          columns={columns}
          data={complianceData ?? []}
          filters={{
            query: {
              placeholder: "Filter regulations...",
              column: "regulation",
            },
          }}
          visibility={false}
          selectedRowId={selectedRegulationId}
          onRowSelect={useCallback(
            (row: Regulation | null) => {
              if (row) {
                selectRegulation(row.id); // Ensure row is cast to Regulation
                setTab("code-review");
              } else {
                // Handle deselection if necessary, e.g., setSelectedRegulation(null)
                // For now, it matches the behavior of only acting on selection.
              }
            },
            [selectRegulation, setTab] // Dependencies for useCallback
          )}
        />
      </div>
    </div>
  );
};
