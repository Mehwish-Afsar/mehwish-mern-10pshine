import { render, screen, fireEvent } from "@testing-library/react"
import { vi } from "vitest"
import ProfileInfo from "./ProfileInfo"
import { useNavigate } from "react-router-dom"

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}))

describe("ProfileInfo Component", () => {
  const mockNavigate = vi.fn()
  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate)
  })

  const userWithImage = {
    fullName: "John Doe",
    image: "/profile.jpg",
  }

  const userWithoutImage = {
    fullName: "Jane Smith",
    image: null,
  }

  it("renders user full name and 'View profile'", () => {
    render(<ProfileInfo userInfo={userWithImage} />)
    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("View profile")).toBeInTheDocument()
  })

  it("renders profile image if user has image", () => {
    render(<ProfileInfo userInfo={userWithImage} />)
    const img = screen.getByAltText("profile")
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute("src", expect.stringContaining(userWithImage.image))
  })

  it("renders initials if user has no image", () => {
    render(<ProfileInfo userInfo={userWithoutImage} />)
    expect(screen.getByText("JS")).toBeInTheDocument()
  })

  it("navigates to /profile on click", () => {
    render(<ProfileInfo userInfo={userWithImage} />)
    fireEvent.click(screen.getByText("John Doe").closest("div"))
    expect(mockNavigate).toHaveBeenCalledWith("/profile")
  })
})
