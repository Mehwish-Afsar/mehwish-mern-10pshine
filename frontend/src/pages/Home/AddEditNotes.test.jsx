import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import AddEditNotes from "./AddEditNotes"
import axiosInstance from "../../utils/axiosInstance"

vi.mock("../../utils/axiosInstance", () => ({
  default: {
    post: vi.fn(),
    put: vi.fn(),
  },
}))

vi.mock("../../components/Input/TagInput", () => ({
  default: ({ tags }) => <div data-testid="tags">Tags: {tags.length}</div>,
}))

vi.mock("@tiptap/starter-kit", () => ({ default: {} }));
vi.mock("@tiptap/extension-underline", () => ({ default: {} }))
vi.mock("@tiptap/extension-link", () => ({
  default: { configure: () => ({}) },
}))

vi.mock("@tiptap/extension-text-align", () => ({
  default: { configure: () => ({}) },
}))

vi.mock("@tiptap/react", () => ({
  EditorContent: () => <div data-testid="editor">Editor</div>,
  useEditor: () => ({
    getText: () => "Some content",
    getHTML: () => "<p>Some content</p>",
    chain: () => ({
      focus: () => ({
        toggleBold: () => ({ run: vi.fn() }),
        toggleItalic: () => ({ run: vi.fn() }),
        toggleUnderline: () => ({ run: vi.fn() }),
        toggleBulletList: () => ({ run: vi.fn() }),
        toggleOrderedList: () => ({ run: vi.fn() }),
        setTextAlign: () => ({ run: vi.fn() }),
        setLink: () => ({ run: vi.fn() }),
      }),
    }),
    isActive: () => false,
  }),
}))

describe("AddEditNotes Component", () => {
  const mockClose = vi.fn()
  const mockGetAllNotes = vi.fn()
  const mockShowMessage = vi.fn()
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders Add mode correctly", () => {
    render(
      <AddEditNotes
        type="add"
        onClose={mockClose}
        getAllNotes={mockGetAllNotes}
        showMessage={mockShowMessage}
      />
    )
    expect(screen.getByPlaceholderText("Untitled")).toBeInTheDocument()
    expect(screen.getByTestId("editor")).toBeInTheDocument()
    expect(screen.getByText("Add")).toBeInTheDocument()
  })

  it("shows error if title is empty", async () => {
    render(
      <AddEditNotes
        type="add"
        onClose={mockClose}
        getAllNotes={mockGetAllNotes}
        showMessage={mockShowMessage}
      />
    )
    fireEvent.click(screen.getByText("Add"));
    expect(await screen.findByText("Title is required")).toBeInTheDocument()
  })

  it("adds note successfully", async () => {
    axiosInstance.post.mockResolvedValue({data: { note: { id: "1" } }})
    render(
      <AddEditNotes
        type="add"
        onClose={mockClose}
        getAllNotes={mockGetAllNotes}
        showMessage={mockShowMessage}
      />
    )
    fireEvent.change(screen.getByPlaceholderText("Untitled"), {
      target: { value: "My Note" },
    })
    fireEvent.click(screen.getByText("Add"));
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith(
        "/add-notes",
        {
          title: "My Note",
          content: "<p>Some content</p>",
          tags: [],
        }
      );
      expect(mockShowMessage).toHaveBeenCalledWith("Note Added Successfully")
      expect(mockGetAllNotes).toHaveBeenCalled()
      expect(mockClose).toHaveBeenCalled()
    })
  })

  it("updates note successfully in edit mode", async () => {
    axiosInstance.put.mockResolvedValue({data: { note: { id: "1" } }})
    render(
      <AddEditNotes
        type="edit"
        noteData={{
          _id: "1",
          title: "Old Title",
          content: "Old content",
          tags: [],
        }}
        onClose={mockClose}
        getAllNotes={mockGetAllNotes}
        showMessage={mockShowMessage}
      />
    )
    fireEvent.change(screen.getByPlaceholderText("Untitled"), {target: { value: "Updated Title" }})
    fireEvent.click(screen.getByText("Update"))
    await waitFor(() => {expect(axiosInstance.put).toHaveBeenCalledWith("/edit-notes/1",
        {
          title: "Updated Title",
          content: "<p>Some content</p>",
          tags: [],
        }
      )
      expect(mockShowMessage).toHaveBeenCalledWith("Note Updated Successfully")
      expect(mockGetAllNotes).toHaveBeenCalled()
      expect(mockClose).toHaveBeenCalled()
    })
  })

  it("shows error when API fails", async () => {
    axiosInstance.post.mockRejectedValue(new Error("API Error"))
    render(
      <AddEditNotes
        type="add"
        onClose={mockClose}
        getAllNotes={mockGetAllNotes}
        showMessage={mockShowMessage}
      />
    )
    fireEvent.change(screen.getByPlaceholderText("Untitled"), {target: { value: "My Note" }})
    fireEvent.click(screen.getByText("Add"))
    expect(
      await screen.findByText("Something went wrong")).toBeInTheDocument()
    })

})
