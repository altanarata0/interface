import * as React from "react";
import {
  SectionCard,
  SectionCardContent,
} from "@/components/ui/section-card";
import Map, { Marker, Popup, type MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPinIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Project } from "../projects-tracker/types";
import { ProjectStatus } from "../projects-tracker/types";

interface MapBoxProps {
  projects: Project[];
  mapboxAccessToken: string;
  starredProjects?: Set<string>;
  onToggleStar?: (projectId: string) => void;
}

interface PopupInfo {
  project: Project;
  longitude: number;
  latitude: number;
}

export const projectStatusStyles: Record<ProjectStatus, string> = {
  [ProjectStatus.OnTrack]: "text-green-500 fill-green-200",
  [ProjectStatus.AtRisk]: "text-yellow-500 fill-yellow-200",
  [ProjectStatus.Delayed]: "text-red-500 fill-red-200",
  [ProjectStatus.Completed]: "text-blue-500 fill-blue-200",
  [ProjectStatus.Canceled]: "text-gray-500 fill-gray-200",
} as const;

export function MapBox({ projects, mapboxAccessToken }: MapBoxProps) {
  const mapRef = React.useRef<MapRef>(null);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [clickPopupInfo, setClickPopupInfo] = React.useState<PopupInfo | null>(
    null,
  );
  const [hoverPopupInfo, setHoverPopupInfo] = React.useState<PopupInfo | null>(
    null,
  );
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const initialLongitude = -98.5795; // Center of US (generic default)
  const initialLatitude = 39.8283; // Center of US (generic default)
  const initialZoom = 4; // Zoomed out (generic default for map component)

  const previousProjectsLengthRef = React.useRef(projects.length);
  const hasProjectsChangedRef = React.useRef(false);

  const validProjects = React.useMemo(() => {
    return projects.filter((proj) => {
      const props = proj.feature?.properties;
      return (
        typeof props?.centroid_latitude === "number" &&
        typeof props?.centroid_longitude === "number" &&
        !isNaN(props.centroid_latitude) &&
        !isNaN(props.centroid_longitude)
      );
    });
  }, [projects]);

  const fitMapToProjects = React.useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    map.resize();

    if (validProjects.length === 0) {
      map.flyTo({
        center: [initialLongitude, initialLatitude],
        zoom: initialZoom,
        duration: 800,
      });
      return;
    }

    const coordinates = validProjects.map((proj) => {
      const props = proj.feature?.properties;
      return [props.centroid_longitude, props.centroid_latitude] as [
        number,
        number,
      ];
    });

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
          [minLng, minLat], // Southwestern corner
          [maxLng, maxLat], // Northeastern corner
        ],
        { padding: 50, duration: 800 },
      );
    } else if (coordinates.length === 1) {
      // Exactly one point, fly to it
      map.flyTo({
        center: coordinates[0],
        zoom: 16,
        duration: 800,
      });
    }
  }, [validProjects, initialLongitude, initialLatitude, initialZoom]);

  React.useEffect(() => {
    const currentProjectsLength = validProjects.length;
    const previousProjectsLength = previousProjectsLengthRef.current;
    const isSignificantChange =
      Math.abs(currentProjectsLength - previousProjectsLength) > 0;

    if (!isSignificantChange && hasProjectsChangedRef.current) {
      return;
    }

    const delay = 300;
    const viewChangeTimer = setTimeout(fitMapToProjects, delay);

    previousProjectsLengthRef.current = currentProjectsLength;
    hasProjectsChangedRef.current = true;

    return () => {
      clearTimeout(viewChangeTimer);
    };
  }, [validProjects, fitMapToProjects]);

  React.useEffect(() => {
    const containerElement = containerRef.current;
    if (!containerElement) return;

    let resizeTimer: NodeJS.Timeout;
    const debouncedFitMap = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const map = mapRef.current?.getMap();
        if (map) {
          map.resize();
          // Give it a moment for the resize to take effect before fitting
          setTimeout(() => {
            fitMapToProjects();
          }, 100);
        }
      }, 200); // Increased debounce delay
    };

    const resizeObserver = new ResizeObserver(debouncedFitMap);
    resizeObserver.observe(containerElement);

    // Cleanup observer on unmount
    return () => {
      resizeObserver.unobserve(containerElement);
      clearTimeout(resizeTimer);
    };
  }, [fitMapToProjects]);

  // Close click-triggered popup when clicking outside the popup itself and reposition map
  const handleMapClick = React.useCallback(() => {
    setClickPopupInfo(null);
    fitMapToProjects();
  }, [fitMapToProjects]);

  // Debounced hover handlers
  const handleMouseEnter = React.useCallback(
    (project: Project, longitude: number, latitude: number) => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (!clickPopupInfo || clickPopupInfo.project.id !== project.id) {
        setHoverPopupInfo({ project, longitude, latitude });
      }
    },
    [clickPopupInfo],
  );

  const handleMouseLeave = React.useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverPopupInfo(null);
    }, 100);
  }, []);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <SectionCard ref={containerRef} className="h-full border overflow-hidden">
      <SectionCardContent className="p-0 h-full overflow-hidden">
        <Map
          ref={mapRef}
          mapboxAccessToken={mapboxAccessToken}
          trackResize={true}
          initialViewState={{
            longitude: initialLongitude,
            latitude: initialLatitude,
            zoom: initialZoom,
          }}
          mapStyle="mapbox://styles/mapbox/light-v11"
          onClick={handleMapClick}
        >
          {validProjects.map((proj) => {
            const props = proj.feature?.properties;
            const longitude = props.centroid_longitude;
            const latitude = props.centroid_latitude;

            return (
              <Marker
                key={proj.id}
                longitude={longitude}
                latitude={latitude}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setClickPopupInfo({
                    project: proj,
                    longitude: longitude,
                    latitude: latitude,
                  });
                  setHoverPopupInfo(null);
                  const map = mapRef.current?.getMap();
                  if (map) {
                    map.flyTo({
                      center: [longitude, latitude+0.0005],
                      zoom: 17,
                      duration: 1200,
                    });
                  }
                }}
              >
                <div
                  className="marker-container"
                  onMouseEnter={() =>
                    handleMouseEnter(proj, longitude, latitude)
                  }
                  onMouseLeave={handleMouseLeave}
                  style={{
                    padding: "2px",
                    margin: "-2px",
                  }}
                >
                  <MapPinIcon
                    className={cn(
                      "w-6 h-6 cursor-pointer transition-all duration-200",
                      projectStatusStyles[proj.status] || "text-gray-500 fill-gray-200",
                      "hover:scale-110",
                      hoverPopupInfo &&
                        hoverPopupInfo.project.id === proj.id &&
                        "scale-110",
                      clickPopupInfo &&
                        clickPopupInfo.project.id === proj.id
                    )}
                  />
                </div>
              </Marker>
            );
          })}

          {hoverPopupInfo && (
            <Popup
              longitude={hoverPopupInfo.longitude}
              latitude={hoverPopupInfo.latitude}
              closeButton={false}
              closeOnClick={false}
              anchor="bottom"
              offset={30}
              className="hover-popup z-10"
            >
              <div className="flex justify-between items-start">
                <div className="p-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-semibold text-foreground break-words pr-2">
                      {hoverPopupInfo.project.address}
                    </h3>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-0.5 mt-2">
                    <p>
                      CustomerName:{" "}
                      <span className="font-medium text-foreground">
                        {hoverPopupInfo.project.customerName}
                      </span>
                    </p>
                    <p>
                      Status:{" "}
                      <span className="font-medium text-foreground">
                        {hoverPopupInfo.project.status}
                      </span>
                    </p>
                    <p>
                      Phase:{" "}
                      <span className="font-medium text-foreground">
                        {hoverPopupInfo.project.progress.phase}
                      </span>
                    </p>
                    <p>
                      Ball in Court:{" "}
                      <span className="font-medium text-foreground">
                        {hoverPopupInfo.project.ballInCourt}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </Popup>
          )}

          {clickPopupInfo && (
            <Popup
              longitude={clickPopupInfo.longitude}
              latitude={clickPopupInfo.latitude}
              onClose={() => setClickPopupInfo(null)}
              closeButton={false}
              closeOnClick={false}
              anchor="bottom"
              offset={30}
              className="click-popup z-10"
            >
              <div className="flex justify-between items-start">
                <div className="p-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-semibold text-foreground break-words pr-2">
                      {clickPopupInfo.project.address}
                    </h3>
                    <button
                      onClick={() => setClickPopupInfo(null)}
                      className="p-0.5 rounded hover:bg-muted flex-shrink-0"
                      aria-label="Close popup"
                    >
                      <XIcon className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-0.5 mt-2">
                    <p>
                      CustomerName:{" "}
                      <span className="font-medium text-foreground">
                        {clickPopupInfo.project.customerName}
                      </span>
                    </p>
                    <p>
                      Status:{" "}
                      <span className="font-medium text-foreground">
                        {clickPopupInfo.project.status}
                      </span>
                    </p>
                    <p>
                      Phase:{" "}
                      <span className="font-medium text-foreground">
                        {clickPopupInfo.project.progress.phase}
                      </span>
                    </p>
                    <p>
                      Ball in Court:{" "}
                      <span className="font-medium text-foreground">
                        {clickPopupInfo.project.ballInCourt}
                      </span>
                    </p>
                    <p>
                      Last Update:{" "}
                      {format(
                        new Date(clickPopupInfo.project.lastUpdate),
                        "MM/dd/yyyy",
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </Popup>
          )}
        </Map>
      </SectionCardContent>
    </SectionCard>
  );
}

export default MapBox;

