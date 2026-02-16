import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Modal from "react-modal"
import Home from "./Home"
import axiosInstance from "../../utils/axiosInstance"

Modal.setAppElement(document.createElement("div"))

vi.mock("../../utils/axiosInstance")

vi.mock("../../components/Navbar/Navbar.jsx", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}))

vi.mock("../../components/Cards/NoteCard.jsx", () => ({
  default: ({ title }) => <div>{title}</div>,
}))

vi.mock("./AddEditNotes.jsx", () => ({
  default: ({ type }) => <div>{type === "add" ? "Add Note" : "Edit Note"}</div>,
}))

describe("Home Page", () => {
  beforeEach(() => {
    axiosInstance.get.mockImplementation((url) => {
      if (url === "/get-user") {
        return Promise.resolve({
          data: { user: { fullName: "Test User" } },
        })
      }

      if (url === "/get-all-notes") {
        return Promise.resolve({
          data: {
            notes: [
              {
                _id: "1",
                title: "Test Note",
                content: "Note content",
                tags: [],
                isPinned: false,
                createdOn: "2025-01-01",
              },
            ],
          },
        })
      }
    })
  })

  it("renders Home and fetches user info and notes", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    expect(await screen.findByText("Test Note")).toBeInTheDocument()
    expect(screen.getByTestId("navbar")).toBeInTheDocument()
  })

  it("opens Add Note modal when Add button is clicked", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    const addButton = screen.getByRole("button")
    fireEvent.click(addButton);
    await waitFor(() => {
      expect(screen.getByText("Add Note")).toBeInTheDocument()
    })
  })
})
