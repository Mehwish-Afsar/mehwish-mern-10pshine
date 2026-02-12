import { render, screen } from "@testing-library/react";
import EmptyCard from "./EmptyCard";

describe("EmptyCard Component", () => {

  const defaultProps = {
    imgSrc: "/test-image.png",
    message: "No notes available",
  }

  it("renders image with correct src and alt text", () => {
    render(<EmptyCard {...defaultProps} />)
    const image = screen.getByAltText("No-notes")
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("src", "/test-image.png")
  })

  it("renders the message correctly", () => {
    render(<EmptyCard {...defaultProps} />)
    expect(screen.getByText("No notes available")).toBeInTheDocument()
  })

})
