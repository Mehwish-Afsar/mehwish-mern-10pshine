import { render, screen, fireEvent } from "@testing-library/react";
import NoteCard from "./NoteCard";
import { vi } from "vitest";

const defaultProps = {
  title: "Test Note",
  content: "This is a test content for the note component. It is long enough to be sliced.",
  date: "2026-02-11",
  tags: ["tag1", "tag2"],
  isPlanned: false,
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  onPinNote: vi.fn(),
}

describe("NoteCard Component", () => {

  it("renders title, formatted date, content slice, and tags", () => {
  render(<NoteCard {...defaultProps} />)
  expect(screen.getByText("Test Note")).toBeInTheDocument()
  expect(screen.getByText("11 Feb 2026")).toBeInTheDocument()
  expect(screen.getByText(/#tag1/)).toBeInTheDocument()
  expect(screen.getByText(/#tag2/)).toBeInTheDocument()
})


  it("calls onEdit when Pencil icon is clicked", () => {
    const { container } = render(<NoteCard {...defaultProps} />)
    const editIcon = container.querySelector(".lucide-pencil")
    fireEvent.click(editIcon)
    expect(defaultProps.onEdit).toHaveBeenCalled()
  })

  it("calls onDelete when Trash icon is clicked", () => {
    const { container } = render(<NoteCard {...defaultProps} />)
    const deleteIcon = container.querySelector(".lucide-trash-2")
    fireEvent.click(deleteIcon)
    expect(defaultProps.onDelete).toHaveBeenCalled()
  })

  it("calls onPinNote when Pin icon is clicked", () => {
    const { container } = render(<NoteCard {...defaultProps} />)
    const pinIcon = container.querySelector(".lucide-pin")
    fireEvent.click(pinIcon)
    expect(defaultProps.onPinNote).toHaveBeenCalled()
  })

  it("Pin icon color changes when isPlanned is true", () => {
    const { container } = render(
      <NoteCard {...defaultProps} isPlanned={true} />
    )
    const pinIcon = container.querySelector(".lucide-pin")
    expect(pinIcon).toHaveClass("text-blue-400")
  })

})
