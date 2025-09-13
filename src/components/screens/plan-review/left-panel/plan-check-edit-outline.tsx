import { Editor } from "@tiptap/core";
import { TableOfContentDataItem } from "@tiptap/extension-table-of-contents";
import { TableOfContents } from "./toc";

export const PlanCheckEditOutline = ({
  editor,
}: {
  editor: Editor | null;
  items: TableOfContentDataItem[];
}) => {
  if (!editor) return null;

  return (
    <div className="flex flex-col gap-2">
      <TableOfContents editor={editor} />
    </div>
  );
};
