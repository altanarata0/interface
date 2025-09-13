import * as React from "react";
import { SectionCard, SectionCardContent } from "@/components/ui/section-card";
import Map, { Marker, type MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPinIcon, ZoomOutIcon } from "lucide-react";
import { Project } from "@/components/screens/projects-tracker/types";
import { cn } from "@/lib/utils";

interface ProjectsMapSectionProps {
  selectedProject: Project | null;
  allProjects: Project[];
  onMapPinClick: (project: Project) => void;
  mapboxAccessToken: string;
  className?: string;
  starredProjects: Set<string>;
  onToggleStar: (projectId: string) => void;
}

interface PopupInfo {
  project: Project;
  longitude: number;
  latitude: number;
}

const getProjectCoordinates = (projects: Project[]) => {
  return projects
    .map((proj) => proj.feature?.properties)
    .filter(
      (
        props,
      ): props is {
        centroid_latitude: number;
        centroid_longitude: number;
      } =>
        typeof props?.centroid_latitude === "number" &&
        typeof props?.centroid_longitude === "number",
    )
    .map(
      (props) =>
        [props.centroid_longitude, props.centroid_latitude] as [number, number],
    );
};

const fitMapToBounds = (map: mapboxgl.Map, coordinates: [number, number][]) => {
  if (coordinates.length > 1) {
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
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: 40, duration: 800 },
    );
  } else if (coordinates.length === 1) {
    map.flyTo({
      center: coordinates[0],
      zoom: 16,
      duration: 800,
    });
  } else {
    map.flyTo({
      center: [-98.5795, 39.8283],
      zoom: 3,
      duration: 800,
    });
  }
};

export const ProjectsMapSection: React.FC<ProjectsMapSectionProps> = ({
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

  const initialLongitude = -98.5795;
  const initialLatitude = 39.8283;
  const initialZoom = 4;

  const wasSelectedProjectRef = React.useRef(!!selectedProject);

  // Handle marker click - use useCallback to prevent infinite re-renders
  const handleMarkerClick = React.useCallback(
    (project: Project, e: any) => {
      e.originalEvent.stopPropagation();
      onMapPinClick(project);
      setPopupInfo(null); // Close any open popup
    },
    [onMapPinClick],
  );

  // Memoize projects to show to prevent unnecessary re-renders
  const memoizedProjectsToShow = React.useMemo(
    () => allProjects,
    [allProjects],
  );

  const handleZoomOut = React.useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const coordinates = getProjectCoordinates(allProjects);
    fitMapToBounds(map, coordinates);
  }, [allProjects]);

  React.useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) {
      return;
    }

    const resizeAndAnimate = () => {
      map.resize();

      if (
        selectedProject?.feature?.properties?.centroid_longitude &&
        selectedProject?.feature?.properties?.centroid_latitude
      ) {
        const lng = selectedProject.feature.properties.centroid_longitude;
        const lat = selectedProject.feature.properties.centroid_latitude;

        map.flyTo({
          center: [lng, lat],
          zoom: 14,
          duration: 800,
        });
        return;
      }

      const coordinates = getProjectCoordinates(allProjects);
      fitMapToBounds(map, coordinates);
    };

    const isTransitioningLayout =
      wasSelectedProjectRef.current !== !!selectedProject;
    const delay = isTransitioningLayout ? 550 : 50;

    const viewChangeTimer = setTimeout(resizeAndAnimate, delay);

    wasSelectedProjectRef.current = !!selectedProject;

    return () => {
      clearTimeout(viewChangeTimer);
    };
  }, [selectedProject, allProjects]);

  return (
    <SectionCard
      className={cn(
        "h-full gap-0 flex flex-col overflow-hidden",
        className,
        !selectedProject && "bg-muted",
      )}
    >
      <SectionCardContent className="p-0 flex flex-col flex-grow">
        <div
          className={cn(
            "border-b relative transition-all duration-500 ease-in-out min-h-0",
            "h-full",
          )}
        >
          <Map
            ref={mapRef}
            mapboxAccessToken={mapboxAccessToken}
            trackResize={true}
            initialViewState={{
              longitude: initialLongitude,
              latitude: initialLatitude,
              zoom: initialZoom,
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/light-v11"
          >
            <div className="absolute top-2 right-2 z-10">
              <button
                className="bg-white shadow px-2 py-1 rounded text-sm hover:bg-gray-100 transition"
                onClick={handleZoomOut}
              >
                <ZoomOutIcon className="w-5 h-5 text-gray-800" />
              </button>
            </div>
            {memoizedProjectsToShow.map((proj) => {
              const props = proj.feature?.properties;
              if (props?.centroid_latitude && props?.centroid_longitude) {
                const isSelected = selectedProject?.id === proj.id;
                return (
                  <Marker
                    key={proj.id}
                    longitude={props.centroid_longitude}
                    latitude={props.centroid_latitude}
                    anchor="bottom"
                    onClick={(e) => handleMarkerClick(proj, e)}
                  >
                    <MapPinIcon
                      className={cn(
                        "w-6 h-6 cursor-pointer transition-colors",
                        isSelected
                          ? "text-blue-800 fill-blue-600"
                          : "text-blue-600 fill-blue-400 hover:text-blue-800 hover:fill-blue-600",
                      )}
                    />
                  </Marker>
                );
              }
              return null;
            })}
          </Map>
        </div>
      </SectionCardContent>
    </SectionCard>
  );
};

