import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Navbar from "./Navbar";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock("../Cards/ProfileInfo.jsx", () => ({
  default: ({ onLogout }) => (
    <button onClick={onLogout}>Logout</button>
  ),
}))

vi.mock("../SearchBar/SearchBar.jsx", () => ({
  default: ({ value, onChange, handleSearch, onClearSearch }) => (
    <div>
      <input
        data-testid="search-input"
        value={value}
        onChange={onChange}
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={onClearSearch}>Clear</button>
    </div>
  ),
}))

describe("Navbar Component", () => {

  const defaultProps = {
    userInfo: { name: "Mehwish" },
    onSearchNote: vi.fn(),
    handleClearSearch: vi.fn(),
  };

  it("renders app title", () => {
    render(<Navbar {...defaultProps} />)
    expect(screen.getByText("Notexa")).toBeInTheDocument()
  })

  it("calls onSearchNote when search is triggered", () => {
    render(<Navbar {...defaultProps} />)
    const input = screen.getByTestId("search-input")
    fireEvent.change(input, { target: { value: "test" } })
    fireEvent.click(screen.getByText("Search"))
    expect(defaultProps.onSearchNote).toHaveBeenCalledWith("test")
  })

  it("clears search and calls handleClearSearch", () => {
    render(<Navbar {...defaultProps} />)
    fireEvent.click(screen.getByText("Clear"))
    expect(defaultProps.handleClearSearch).toHaveBeenCalled()
  })

  it("renders ProfileInfo when userInfo exists", () => {
    render(<Navbar {...defaultProps} />)
    expect(screen.getByText("Logout")).toBeInTheDocument()
  })

  it("does not render ProfileInfo when userInfo is null", () => {
    render(<Navbar {...defaultProps} userInfo={null} />)
    expect(screen.queryByText("Logout")).not.toBeInTheDocument()
  })

  it("clears localStorage and navigates on logout", () => {
    render(<Navbar {...defaultProps} />)
    fireEvent.click(screen.getByText("Logout"))
    expect(mockNavigate).toHaveBeenCalledWith("/login")
  })

})
