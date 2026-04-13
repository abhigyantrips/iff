"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  TextBIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  ListBulletsIcon,
  ListNumbersIcon,
  QuotesIcon,
  CodeIcon,
  ArrowUUpLeftIcon,
  ArrowUUpRightIcon,
  TextHOneIcon,
  TextHTwoIcon,
  TextHThreeIcon,
  ParagraphIcon,
} from "@phosphor-icons/react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-stone dark:prose-invert max-w-none min-h-[300px] p-4 focus:outline-none",
      },
    },
  });

  if (!editor) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-md border bg-muted/50">
        <span className="text-muted-foreground">Loading editor...</span>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border bg-background">
      <div className="flex flex-wrap items-center gap-1 border-b bg-muted/50 p-2">
        <Button
          type="button"
          variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className="size-8 p-0"
        >
          <TextHOneIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="size-8 p-0"
        >
          <TextHTwoIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className="size-8 p-0"
        >
          <TextHThreeIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("paragraph") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className="size-8 p-0"
        >
          <ParagraphIcon className="size-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button
          type="button"
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="size-8 p-0"
        >
          <TextBIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="size-8 p-0"
        >
          <TextItalicIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("strike") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className="size-8 p-0"
        >
          <TextStrikethroughIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("code") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className="size-8 p-0"
        >
          <CodeIcon className="size-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button
          type="button"
          variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="size-8 p-0"
        >
          <ListBulletsIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="size-8 p-0"
        >
          <ListNumbersIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="size-8 p-0"
        >
          <QuotesIcon className="size-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="size-8 p-0"
        >
          <ArrowUUpLeftIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="size-8 p-0"
        >
          <ArrowUUpRightIcon className="size-4" />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
