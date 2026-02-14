import React, { useState } from "react";
import { X } from "lucide-react";
import TagInput from "../../components/Input/TagInput";
import axiosInstance from "../../utils/axiosInstance";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
} from "lucide-react";

const AddEditNotes = ({ noteData, type, getAllNotes, onClose, showMessage }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["paragraph"] }),
    ],
    content: noteData?.content || "",
  });

  if (!editor) return null;

  const wordCount = editor
    .getText()
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const saveNote = async () => {
    if (!title) return setError("Title is required");
    if (!editor.getText().trim())
      return setError("Write something first");

    const payload = {
      title,
      content: editor.getHTML(),
      tags,
    };

    try {
      const url = type === "edit" ? `/edit-notes/${noteData._id}` : "/add-notes";
      const method = type === "edit" ? "put" : "post";

      const res = await axiosInstance[method](url, payload);

      if (res.data?.note) {
        showMessage(type === "edit" ? "Note Updated Successfully": "Note Added Successfully"
        );
        getAllNotes();
        onClose();
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="relative px-1">
      <button onClick={onClose} className="absolute -top-3 -right-3 w-9 h-9 rounded-full flex 
      items-center justify-center bg-white shadow hover:bg-slate-100">
        <X size={18} />
      </button>

      <input
        className="w-full text-3xl font-semibold outline-none placeholder:text-slate-300 mb-4"
        placeholder="Untitled" value={title} onChange={(e) => setTitle(e.target.value)}
      />

      <div className="flex items-center gap-1 mb-2 text-slate-600">
        <ToolbarBtn icon={<Bold size={15} />} onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} />
        <ToolbarBtn icon={<Italic size={15} />} onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} />
        <ToolbarBtn icon={<UnderlineIcon size={15} />} onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} />

        <Divider />

        <ToolbarBtn icon={<List size={15} />} onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} />
        <ToolbarBtn icon={<ListOrdered size={15} />} onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} />

        <Divider />

        <ToolbarBtn icon={<AlignLeft size={15} />} onClick={() => editor.chain().focus().setTextAlign("left").run()} />
        <ToolbarBtn icon={<AlignCenter size={15} />} onClick={() => editor.chain().focus().setTextAlign("center").run()} />
        <ToolbarBtn icon={<AlignRight size={15} />} onClick={() => editor.chain().focus().setTextAlign("right").run()} />

        <Divider />

        <ToolbarBtn
          icon={<LinkIcon size={15} />}
          onClick={() => {
            const url = prompt("Enter link");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          active={editor.isActive("link")}
        />
      </div>

      <div className="bg-slate-50 rounded-xl p-4 min-h-[220px] hover:bg-slate-100 transition
                      focus-within:ring-0 focus-within:outline-none">
        <EditorContent editor={editor} className="prose prose-sm max-w-none focus:outline-none
                                                  [&_*]:focus:outline-none prose-p:leading-relaxed"/>
      </div>

      <div className="flex justify-between items-center mt-3 text-xs text-slate-400">
        <span>{wordCount} words</span>
      </div>

      <div className="mt-4ss">
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

      <button
        onClick={saveNote}
        className="w-full mt-5 bg-indigo-600 text-white rounded-lg py-2 hover:opacity-90 transition">
        {type === "edit" ? "Update" : "Add"}
      </button>
    </div>
  );
};

export default AddEditNotes;


const ToolbarBtn = ({ icon, onClick, active }) => (
  <button onClick={onClick} className={`p-1.5 rounded-md transition ${active ? "bg-slate-200 text-black"
     : "hover:bg-slate-200"}`}>
    {icon}
  </button>
);

const Divider = () => (
  <div className="w-px h-4 bg-slate-300 mx-1" />
);
