import { Editor as CoreEditor } from "@tiptap/core";
import { memo } from "react";
import { TableOfContentsStorage } from "@tiptap/extension-table-of-contents";
import { useEditorState } from "@tiptap/react";
import { List } from "lucide-react";

export type TableOfContentsProps = {
  editor: CoreEditor;
};

export const TableOfContents = memo(({ editor }: TableOfContentsProps) => {
  const content: TableOfContentsStorage["content"] = useEditorState({
    editor,
    selector: (ctx) => {
      // @ts-expect-error works and exists but not in ts
      return ctx.editor.storage.tableOfContents.content;
    },
    equalityFn: (a, b) => a === b,
  });

  // Function to handle smooth scrolling
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Optional: Highlight the element briefly
      const originalBackground = element.style.backgroundColor;
      element.style.backgroundColor = "rgba(176, 217, 230, 0.3)";
      setTimeout(() => {
        element.style.backgroundColor = originalBackground;
      }, 1500);
    }
  };

  return (
    <div className="px-4 w-full overflow-hidden">
      <div className="border-b border-gray-200 pb-2 mb-3 flex items-center gap-2">
        <List className="w-5 h-5 text-gray-700" />
        <h3 className="font-medium text-gray-800">Document Outline</h3>
      </div>

      {content.length > 0 ? (
        <div className="flex flex-col gap-1 pt-1 overflow-x-hidden">
          {content.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleLinkClick(e, item.id)}
              style={{ paddingLeft: `${(item.level - 1) * 0.75}rem` }}
              className="block font-medium text-neutral-500 dark:text-neutral-300 p-1 rounded bg-opacity-10 text-sm hover:text-neutral-800 transition-all hover:bg-gray-100 truncate w-full"
            >
              {item.itemIndex}. {item.textContent}
            </a>
          ))}
        </div>
      ) : (
        <div className="text-sm text-neutral-500 pt-3">
          Start adding headlines to your document …
        </div>
      )}
    </div>
  );
});

TableOfContents.displayName = "TableOfContents";
