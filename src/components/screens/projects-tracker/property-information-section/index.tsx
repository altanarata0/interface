import * as React from "react";
import {
  SectionCard,
  SectionCardContent,
  SectionCardDescription,
  SectionCardHeader,
  SectionCardTitle,
} from "@/components/ui/section-card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Map, { Marker, Popup, type MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPinIcon, StarIcon, XIcon } from "lucide-react";
import { Project } from "@/components/screens/projects-tracker/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface PropertyInformationSectionProps {
  selectedProject: Project | null;
  allProjects: Project[];
  onMapPinClick: (project: Project) => void;
  mapboxAccessToken: string;
  className?: string;
  starredProjects: Set<string>;
  onToggleStar: (projectId: string) => void;
}

// Define projectStatusStyles locally or import if centralized and needed here
// For simplicity, assuming it might be passed or defined if needed for popup status color
// However, the parent index.tsx already has this, so we can pass it if needed,
// or just use text for now. For this change, we'll use text.

interface PopupInfo {
  project: Project;
  longitude: number;
  latitude: number;
}

function camelToTitleCase(text: string) {
  const result = text.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export const PropertyInformationSection: React.FC<
  PropertyInformationSectionProps
> = ({
  selectedProject,
  allProjects,
  onMapPinClick,
  mapboxAccessToken,
  className,
  starredProjects,
  onToggleStar,
}) => {
  const mapRef = React.useRef<MapRef>(null);
  const [popupInfo, setPopupInfo] = React.useState<PopupInfo | null>(null);
  const projectsToShowOnMap = selectedProject ? [selectedProject] : allProjects;
  const isOverviewMap = !selectedProject;

  const initialLongitude = -98.5795; // Center of US (generic default)
  const initialLatitude = 39.8283; // Center of US (generic default)
  const initialZoom = 4; // Zoomed out (generic default for map component)

  // Ref to track if the previous state had a selected project.
  // This helps differentiate between (null -> project) vs (projectA -> projectB) transitions.
  const ছিলSelectedProjectRef = React.useRef(!!selectedProject);

  React.useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) {
      return;
    }

    const resizeAndAnimate = () => {
      map.resize(); // Ensure map is sized correctly first

      if (!selectedProject) {
        // Overview map: fit all pins
        const coordinates = allProjects
          .map((proj) => proj.feature?.properties)
          .filter(
            (
              props,
            ): props is {
              centroid_latitude: number;
              centroid_longitude: number;
            } => // Type guard
              typeof props?.centroid_latitude === "number" &&
              typeof props?.centroid_longitude === "number",
          )
          .map(
            (props) =>
              [props.centroid_longitude, props.centroid_latitude] as [
                number,
                number,
              ],
          );

        if (coordinates.length > 1) {
          // More than one point, calculate bounds manually
          let minLng = coordinates[0][0];
          let minLat = coordinates[0][1];
          let maxLng = coordinates[0][0];
          let maxLat = coordinates[0][1];

          for (const coord of coordinates) {
            minLng = Math.min(minLng, coord[0]);
            minLat = Math.min(minLat, coord[1]);
            maxLng = Math.max(maxLng, coord[0]);
            maxLat = Math.max(maxLat, coord[1]);
          }
          map.fitBounds(
            [
              [minLng, minLat], // Southwestern corner
              [maxLng, maxLat], // Northeastern corner
            ],
            { padding: 0, duration: 800 }, // Explicit zero padding
          );
        } else if (coordinates.length === 1) {
          // Exactly one point, fly to it
          map.flyTo({
            center: coordinates[0],
            zoom: 16,
            duration: 800,
          });
        } else {
          map.flyTo({
            center: [-98.5795, 39.8283], // Center of US
            zoom: 3,
            duration: 800,
          });
        }
      } else {
        // Single project selected: fly to it
        let targetLongitude = -122.4194; // Default SF if selected project has no coords
        let targetLatitude = 37.7749; // Default SF
        const targetZoom = 14;

        if (
          selectedProject.feature?.properties?.centroid_longitude &&
          selectedProject.feature?.properties?.centroid_latitude
        ) {
          targetLongitude =
            selectedProject.feature.properties.centroid_longitude;
          targetLatitude = selectedProject.feature.properties.centroid_latitude;
        }
        map.flyTo({
          center: [targetLongitude, targetLatitude],
          zoom: targetZoom,
          duration: 800,
        });
      }
    };

    // Delay to allow CSS transitions on the container to complete
    // Only apply the long delay if we are transitioning to/from the full-width map state
    const isTransitioningLayout =
      ছিলSelectedProjectRef.current !== !!selectedProject;
    const delay = isTransitioningLayout ? 550 : 50; // Shorter delay if just flying between selected projects

    const viewChangeTimer = setTimeout(resizeAndAnimate, delay);

    // Update the ref for the next render
    ছিলSelectedProjectRef.current = !!selectedProject;

    return () => {
      clearTimeout(viewChangeTimer);
    };
  }, [selectedProject, allProjects]);

  return (
    <SectionCard
      className={cn(
        "h-full gap-0 flex flex-col overflow-hidden",
        className,
        !selectedProject && "bg-muted", // Add bg-muted when no project is selected
      )}
    >
      <SectionCardHeader
        className={cn(
          "transition-all duration-500 ease-in-out",
          selectedProject
            ? "h-auto opacity-100 py-2 px-4" // Default padding/height for header
            : "h-0 opacity-0 p-0 border-0 overflow-hidden",
        )}
      >
        <SectionCardTitle>Property Information</SectionCardTitle>
        <SectionCardDescription className="sr-only">
          Detailed property information including map and attributes.
        </SectionCardDescription>
      </SectionCardHeader>
      <SectionCardContent className="p-0 flex flex-col flex-grow">
        <div // Map container
          className={cn(
            "border-b relative transition-all duration-500 ease-in-out min-h-0", // min-h-0 to allow shrinking
            selectedProject ? "h-1/2" : "h-full",
          )}
        >
          <Map
            ref={mapRef} // Assign the ref here
            mapboxAccessToken={mapboxAccessToken}
            trackResize={true} // Added trackResize prop
            // Removed key prop to prevent remounting
            initialViewState={{
              // This sets the view only on the first render
              longitude: initialLongitude,
              latitude: initialLatitude,
              zoom: initialZoom,
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/light-v11"
          >
            {projectsToShowOnMap.map((proj) => {
              const props = proj.feature?.properties;
              if (props?.centroid_latitude && props?.centroid_longitude) {
                return (
                  <Marker
                    key={proj.id}
                    longitude={props.centroid_longitude}
                    latitude={props.centroid_latitude}
                    anchor="bottom"
                    onClick={(e) => {
                      if (isOverviewMap) {
                        e.originalEvent.stopPropagation();
                        // When on overview map, clicking a pin shows popup, doesn't select project for main view
                        setPopupInfo({
                          project: proj,
                          longitude: props.centroid_longitude,
                          latitude: props.centroid_latitude,
                        });
                      } else {
                        // If a project is already selected, clicking its pin on the map does nothing here
                        // (or could re-center, but current logic focuses on overview map interaction)
                      }
                    }}
                  >
                    <MapPinIcon
                      className={cn(
                        "w-6 h-6 cursor-pointer",
                        selectedProject && proj.id === selectedProject.id
                          ? "text-red-600 fill-red-400" // Highlight selected
                          : "text-blue-600 fill-blue-400",
                        !isOverviewMap &&
                          selectedProject &&
                          proj.id !== selectedProject.id
                          ? "opacity-50"
                          : "", // Dim others if one is selected
                      )}
                    />
                  </Marker>
                );
              }
              return null;
            })}

            {popupInfo && isOverviewMap && (
              <Popup
                longitude={popupInfo.longitude}
                latitude={popupInfo.latitude}
                onClose={() => setPopupInfo(null)}
                closeButton={false}
                closeOnClick={false} // Keep popup open if map is clicked elsewhere
                anchor="bottom"
                offset={30} // Offset from the pin
                className="z-10" // Removed rounded-lg, shadow-lg from Popup itself
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-semibold text-foreground break-words">
                    {popupInfo.project.address}
                  </h3>
                  <button
                    onClick={() => setPopupInfo(null)}
                    className="p-0.5 rounded hover:bg-muted -mt-1 -mr-1"
                    aria-label="Close popup"
                  >
                    <XIcon className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                <div className="text-xs text-muted-foreground space-y-0.5">
                  <p>
                    Status:{" "}
                    <span className="font-medium text-foreground">
                      {popupInfo.project.status}
                    </span>
                  </p>
                  <p>
                    Last Update:{" "}
                    {format(
                      new Date(popupInfo.project.lastUpdate),
                      "MM/dd/yyyy",
                    )}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <button
                    onClick={() => onMapPinClick(popupInfo.project)} // This button will select the project for the main view
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStar(popupInfo.project.id);
                    }}
                    className="p-1 -m-1"
                    aria-label="Toggle star"
                  >
                    <StarIcon
                      className={cn(
                        "w-4 h-4 text-muted-foreground transition-colors",
                        starredProjects.has(popupInfo.project.id)
                          ? "fill-yellow-400 text-yellow-600"
                          : "hover:fill-yellow-400/50 hover:text-yellow-600",
                      )}
                    />
                  </button>
                </div>
              </Popup>
            )}
          </Map>
        </div>
        <div // Table container
          className={cn(
            "overflow-y-auto transition-all duration-500 ease-in-out min-h-0", // min-h-0 to allow shrinking
            selectedProject && selectedProject.property
              ? "h-1/2 opacity-100"
              : "h-0 opacity-0 p-0 border-0",
          )}
        >
          {selectedProject && selectedProject.property ? (
            <Table>
              <TableBody>
                {Object.entries(selectedProject.property)
                  .filter(([key]) => key !== "geojson")
                  .map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="py-2 px-3 text-muted-foreground font-medium">
                        {camelToTitleCase(key)}
                      </TableCell>
                      <TableCell className="py-2 px-3 text-foreground">
                        {typeof value === "number" && key === "landValue"
                          ? `$${(value / 1000000).toFixed(1)} M`
                          : String(value)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            // This part will be hidden by parent's opacity/height when no project is selected
            <p className="p-4 text-sm text-muted-foreground">
              No property information available.
            </p>
          )}
        </div>
      </SectionCardContent>
    </SectionCard>
  );
};
