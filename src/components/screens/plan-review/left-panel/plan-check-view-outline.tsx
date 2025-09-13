import { cn } from "@/lib/utils";
import { PageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { FileText, ChevronRight, List } from "lucide-react";
import { useState } from "react";

interface OutlineItem {
  id: string;
  title: string;
  page: number;
  children?: OutlineItem[];
}

export const PlanCheckViewOutline = ({
  pageNavigationPlugin,
}: {
  pageNavigationPlugin: PageNavigationPlugin;
}) => {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    "section-1": true,
    "section-2": true,
    "section-3": true,
  });

  const { jumpToPage } = pageNavigationPlugin;

  const outline: OutlineItem[] = [
    {
      id: "section-1",
      title: "Project Information",
      page: 1,
      children: [
        { id: "section-1-1", title: "Project Details", page: 1 },
        { id: "section-1-2", title: "Applicant Information", page: 1 },
        { id: "section-1-3", title: "Building Information", page: 2 },
      ],
    },
    {
      id: "section-2",
      title: "Code Compliance Review",
      page: 3,
      children: [
        { id: "section-2-1", title: "Building Code Analysis", page: 3 },
        { id: "section-2-2", title: "Zoning Requirements", page: 4 },
        { id: "section-2-3", title: "Fire Safety Provisions", page: 5 },
        { id: "section-2-4", title: "Accessibility Requirements", page: 6 },
      ],
    },
    {
      id: "section-3",
      title: "Plan Check Comments",
      page: 7,
      children: [
        { id: "section-3-1", title: "Critical Issues", page: 7 },
        { id: "section-3-2", title: "Major Issues", page: 8 },
        { id: "section-3-3", title: "Minor Issues", page: 10 },
      ],
    },
    {
      id: "section-4",
      title: "Required Corrections",
      page: 12,
      children: [
        { id: "section-4-1", title: "Architectural", page: 12 },
        { id: "section-4-2", title: "Structural", page: 14 },
        { id: "section-4-3", title: "Mechanical", page: 15 },
        { id: "section-4-4", title: "Electrical", page: 16 },
        { id: "section-4-5", title: "Plumbing", page: 17 },
      ],
    },
    {
      id: "section-5",
      title: "Next Steps",
      page: 18,
    },
    {
      id: "section-6",
      title: "Appendices",
      page: 19,
      children: [
        { id: "section-6-1", title: "Referenced Codes", page: 19 },
        { id: "section-6-2", title: "Fee Schedule", page: 20 },
        { id: "section-6-3", title: "Contact Information", page: 21 },
      ],
    },
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // const navigateToPage = (page: number) => {
  //   // Set the target page in the app store
  //   const {  } = useAppStore((state) => state);
  //   setPdfTargetPage(page);
  //   // Switch to the PDF viewer tab
  //   setTab("pcl");
  // };

  const renderOutlineItem = (item: OutlineItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="mb-1">
        <div
          className={cn(
            "flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer",
            "text-sm text-gray-700",
          )}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          {hasChildren ? (
            <div
              className="flex items-center gap-2 flex-1"
              onClick={() => toggleSection(item.id)}
            >
              <ChevronRight
                className={cn(
                  "w-4 h-4 text-gray-500 transition-transform",
                  expandedSections[item.id] && "transform rotate-90",
                )}
              />
              <span className="flex-1">{item.title}</span>
            </div>
          ) : (
            <>
              <FileText className="w-4 h-4 text-gray-500 ml-4" />
              <span className="flex-1">{item.title}</span>
            </>
          )}
          <span
            className="text-xs text-blue-600 hover:underline"
            onClick={() => jumpToPage(item.page - 1)}
          >
            Page {item.page}
          </span>
        </div>

        {hasChildren && expandedSections[item.id] && (
          <div className="mt-1">
            {item.children!.map((child) => renderOutlineItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="border-b border-gray-200 p-3 flex items-center gap-2">
        <List className="w-5 h-5 text-gray-700" />
        <h3 className="font-medium text-gray-800">Document Outline</h3>
      </div>
      <div className="overflow-y-auto flex-1 p-2">
        {outline.map((item) => renderOutlineItem(item))}
      </div>
    </div>
  );
};
