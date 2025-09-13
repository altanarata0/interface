import { Panel } from "react-resizable-panels";
import { Skeleton } from "@/components/ui/skeleton";
import { CollapsibleProgressItem } from "./collapsible-progress-item";
import { PacketSectionData } from "./types";

interface SubmittalPacketPanelProps {
  showParsingModal?: boolean;
  isNavStructureReady: boolean;
  submittalPacketData: PacketSectionData[];
  openItemId: string | null;
  onTogglePacketItem: (id: string, open: boolean) => void;
  onQuestionSelect: (id: string) => void;
  onSectionSelect: (id: string) => void;
  activeQuestionId?: string;
}

export function SubmittalPacketPanel(props: SubmittalPacketPanelProps) {
  const {
    showParsingModal,
    isNavStructureReady,
    submittalPacketData,
    openItemId,
    onTogglePacketItem,
    onQuestionSelect,
    onSectionSelect,
    activeQuestionId,
  } = props;

  return (
    <Panel
      defaultSize={30}
      className="flex-shrink-0 py-0 flex flex-col min-w-[350px]"
    >
      <div className="w-full h-full space-y-0 overflow-y-auto flex-grow py-3 pr-2.5">
        {showParsingModal && !isNavStructureReady
          ? Array.from({ length: 7 }).map((_, index, arr) => (
              <div key={`skeleton-${index}`} className="flex items-stretch">
                <div className="flex flex-col items-center w-10 mr-1 xl:mr-2">
                  {index > 0 ? (
                    <div className="h-[1.125rem] w-0.5 bg-muted"></div>
                  ) : (
                    <div className="h-[1.125rem]"></div>
                  )}
                  <div className="flex-shrink-0">
                    <div className="w-4 h-4 bg-muted rounded-full"></div>
                  </div>
                  {index < arr.length - 1 && (
                    <div className="flex-grow w-0.5 bg-muted"></div>
                  )}
                </div>
                <div
                  className={`flex-1 ${
                    index < arr.length - 1 ? "pb-3 md:pb-4" : ""
                  }`}
                >
                  <div className="p-4 border rounded-lg shadow-sm bg-card h-[76px]">
                    <Skeleton className="h-5 w-3/4 mb-2.5" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            ))
          : submittalPacketData.map((section, index, arr) => (
              <div key={section.id} className="flex items-stretch">
                <div className="flex flex-col items-center w-10 mr-1 xl:mr-2">
                  {index > 0 ? (
                    <div className="h-[1.125rem] w-0.5 bg-emerald-700"></div>
                  ) : (
                    <div className="h-[1.125rem]"></div>
                  )}
                  <div className="flex-shrink-0">
                    {openItemId === section.id ? (
                      <div className="w-4 h-4 border-2 border-emerald-700 bg-white rounded-full"></div>
                    ) : (
                      <div className="w-4 h-4 bg-emerald-700 rounded-full"></div>
                    )}
                  </div>
                  {index < arr.length - 1 && (
                    <div className="flex-grow w-0.5 bg-emerald-700"></div>
                  )}
                </div>
                <div
                  className={`flex-1 ${
                    index < arr.length - 1 ? "pb-3 md:pb-4" : ""
                  }`}
                >
                  <CollapsibleProgressItem
                    id={section.id}
                    title={section.title}
                    percentage={section.percentage}
                    items={section.items}
                    isOpen={openItemId === section.id}
                    onToggle={onTogglePacketItem}
                    onSubItemClick={onQuestionSelect}
                    onSectionTitleClick={onSectionSelect}
                    activeQuestionId={activeQuestionId}
                  />
                </div>
              </div>
            ))}
      </div>
    </Panel>
  );
}
