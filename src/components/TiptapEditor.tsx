"use client";
import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import {
  BsTypeBold,
  BsTypeItalic,
  BsTypeUnderline,
  BsTextLeft,
  BsTextCenter,
  BsTextRight,
  BsListUl,
  BsListOl,
} from "react-icons/bs";
import { MdFormatColorText, MdUndo, MdRedo } from "react-icons/md";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  onInit?: () => void;
  immediatelyRender?: boolean;
  editorProps?: {
    attributes?: {
      class?: string;
    };
  };
}

const TiptapEditor = ({
  content,
  onChange,
  onInit,
  immediatelyRender = false,
  editorProps = {
    attributes: {
      class: "prose focus:outline-none max-w-full",
    },
  },
}: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["paragraph", "heading"],
      }),
      Underline,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: editorProps,
    immediatelyRender: immediatelyRender,
  });

  useEffect(() => {
    if (editor) {
      onInit?.();
    }

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor, onInit]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const colors = [
    { name: "Black", value: "#000000" },
    { name: "Red", value: "#EF4444" },
    { name: "Blue", value: "#3B82F6" },
    { name: "Green", value: "#10B981" },
    { name: "Purple", value: "#8B5CF6" },
  ];

  return (
    <div className="border border-gray-300 rounded-lg">
      {/* Toolbar */}
      <div className="border-b border-gray-300 p-2 bg-gray-50 flex flex-wrap gap-2">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("bold") ? "bg-gray-200" : ""
            }`}
            title="Bold"
          >
            <BsTypeBold />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("italic") ? "bg-gray-200" : ""
            }`}
            title="Italic"
          >
            <BsTypeItalic />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("underline") ? "bg-gray-200" : ""
            }`}
            title="Underline"
          >
            <BsTypeUnderline />
          </button>
        </div>

        {/* Text Alignment */}
        <div className="flex gap-1 border-r pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
            }`}
            title="Align Left"
          >
            <BsTextLeft />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
            }`}
            title="Align Center"
          >
            <BsTextCenter />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
            }`}
            title="Align Right"
          >
            <BsTextRight />
          </button>
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("bulletList") ? "bg-gray-200" : ""
            }`}
            title="Bullet List"
          >
            <BsListUl />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("orderedList") ? "bg-gray-200" : ""
            }`}
            title="Numbered List"
          >
            <BsListOl />
          </button>
        </div>

        {/* Text Color */}
        <div className="flex gap-1 border-r pr-2">
          <div className="relative group">
            <button
              type="button"
              className="p-2 rounded hover:bg-gray-200"
              title="Text Color"
            >
              <MdFormatColorText />
            </button>
            <div className="absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded-lg p-2 z-10">
              {colors.map((color) => (
                <button
                  type="button"
                  key={color.value}
                  onClick={() =>
                    editor.chain().focus().setColor(color.value).run()
                  }
                  className="p-2 hover:bg-gray-100 rounded flex items-center"
                >
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: color.value }}
                  />
                  {color.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            className="p-2 rounded hover:bg-gray-200"
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <MdUndo />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            className="p-2 rounded hover:bg-gray-200"
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <MdRedo />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="p-4 min-h-[200px]" />
    </div>
  );
};

export default TiptapEditor;
