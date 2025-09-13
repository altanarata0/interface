import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Link2 from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  getHierarchicalIndexes,
  TableOfContentDataItem,
  TableOfContents,
} from "@tiptap/extension-table-of-contents";

import { CONTENT } from "@/lib/data/tiptap-content";
import { useState } from "react";

export const useCustomEditor = () => {
  const [items, setItems] = useState<TableOfContentDataItem[]>([]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link2.configure({
        openOnClick: true,
        linkOnPaste: true,
      }),
      Placeholder.configure({
        placeholder: "Start writing your plan check letter...",
      }),
      TableOfContents.configure({
        getIndex: getHierarchicalIndexes,
        onUpdate(content) {
          setItems(content);
        },
      }),
    ],
    content: CONTENT,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none p-4",
      },
    },
    immediatelyRender: false,
  });

  return { editor, items };
};
