import { Button } from "@/components/ui/button";
import {
  Save,
  Bold,
  Italic,
  Heading2,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Unlink,
  FileText,
  Edit,
} from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";
import { EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { Editor } from "@tiptap/core";
import { useAppStore } from "@/providers/app-store-provider";

export const TipTapEditor = ({ editor }: { editor: Editor | null }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);

  const { setPclMode } = useAppStore((state) => state);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate saving - in a real app, you would save the HTML content
    const htmlContent = editor?.getHTML();
    console.log("Saving content:", htmlContent);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    setLinkUrl(previousUrl || "");
    setShowLinkInput(true);

    // Focus the input after it's rendered
    setTimeout(() => {
      if (linkInputRef.current) {
        linkInputRef.current.focus();
      }
    }, 50);
  }, [editor]);

  const saveLink = useCallback(() => {
    if (!editor) return;

    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    }
    setShowLinkInput(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  // Close link input when clicking outside
  useEffect(() => {
    if (!showLinkInput) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        linkInputRef.current &&
        !linkInputRef.current.contains(e.target as Node)
      ) {
        setShowLinkInput(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLinkInput]);

  if (!editor) {
    return <div className="p-4">Loading editor...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-sm ml-4 mr-auto">
            Plan Check Letter Editor
          </h4>
          <div className="ml-6 flex rounded-md overflow-hidden border border-gray-300 mr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPclMode("view")}
              className={`rounded-none `}
            >
              <FileText className="h-4 w-4 mr-1" />
              View PDF
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPclMode("edit")}
              className="rounded-none bg-gray-100"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-1" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 overflow-y-auto flex flex-col">
          {editor && (
            <BubbleMenu
              editor={editor}
              options={{
                placement: "top",
              }}
              className="bg-white shadow-lg rounded-md border border-gray-200 p-1 flex flex-nowrap gap-1 min-w-[400px]"
            >
              {/* Text formatting group */}
              <div className="flex gap-1 border-r border-gray-200 pr-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 ${
                    editor.isActive("bold") ? "bg-gray-200" : ""
                  }`}
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  title="Bold"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 ${
                    editor.isActive("italic") ? "bg-gray-200" : ""
                  }`}
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  title="Italic"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 ${
                    editor.isActive("heading", { level: 2 })
                      ? "bg-gray-200"
                      : ""
                  }`}
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  title="Heading"
                >
                  <Heading2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Lists group */}
              <div className="flex gap-1 border-r border-gray-200 pr-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 ${
                    editor.isActive("bulletList") ? "bg-gray-200" : ""
                  }`}
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  title="Bullet List"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 ${
                    editor.isActive("orderedList") ? "bg-gray-200" : ""
                  }`}
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  title="Numbered List"
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
              </div>

              {/* Alignment group */}
              <div className="flex gap-1 border-r border-gray-200 pr-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 ${
                    editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
                  }`}
                  onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                  }
                  title="Align Left"
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 ${
                    editor.isActive({ textAlign: "center" })
                      ? "bg-gray-200"
                      : ""
                  }`}
                  onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                  }
                  title="Align Center"
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 ${
                    editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
                  }`}
                  onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                  }
                  title="Align Right"
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Link group */}
              <div className="flex gap-1">
                {showLinkInput ? (
                  <div className="flex items-center">
                    <input
                      ref={linkInputRef}
                      type="text"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="h-8 w-40 px-2 text-sm border rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          saveLink();
                        }
                        if (e.key === "Escape") {
                          setShowLinkInput(false);
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-l-none"
                      onClick={saveLink}
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 ${
                        editor.isActive("link") ? "bg-gray-200" : ""
                      }`}
                      onClick={setLink}
                      title="Add Link"
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => editor.chain().focus().unsetLink().run()}
                      disabled={!editor.isActive("link")}
                      title="Remove Link"
                    >
                      <Unlink className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </BubbleMenu>
          )}
          <EditorContent editor={editor} className="flex-1" />
        </div>
      </div>
    </div>
  );
};
