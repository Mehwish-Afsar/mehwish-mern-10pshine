import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import SearchBar from "./SearchBar";

vi.mock("lucide-react", () => ({
  Search: (props) => <button data-testid="search-icon" {...props} />,
  X: (props) => <button data-testid="clear-icon" {...props} />,
}))

describe("SearchBar Component", () => {

  const defaultProps = {
    value: "",
    onChange: vi.fn(),
    handleSearch: vi.fn(),
    onClearSearch: vi.fn(),
  }

  it("renders input with placeholder", () => {
    render(<SearchBar {...defaultProps} />)
    expect(screen.getByPlaceholderText("Search notes..."))
      .toBeInTheDocument();
  })

  it("calls onChange when typing", () => {
    render(<SearchBar {...defaultProps} />)
    const input = screen.getByPlaceholderText("Search notes...")
    fireEvent.change(input, { target: { value: "react" } })
    expect(defaultProps.onChange).toHaveBeenCalled()
  })

  it("calls handleSearch when search icon is clicked", () => {
    render(<SearchBar {...defaultProps} />)    
    fireEvent.click(screen.getByTestId("search-icon"))
    expect(defaultProps.handleSearch).toHaveBeenCalled()
  })

  it("calls handleSearch when Enter key is pressed", () => {
    render(<SearchBar {...defaultProps} />)
    const input = screen.getByPlaceholderText("Search notes...")
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" })
    expect(defaultProps.handleSearch).toHaveBeenCalled()
  })

  it("shows clear icon when value exists", () => {
    render(<SearchBar {...defaultProps} value="test" />)
    expect(screen.getByTestId("clear-icon")).toBeInTheDocument()
  })

  it("does not show clear icon when value is empty", () => {
    render(<SearchBar {...defaultProps} value="" />)
    expect(screen.queryByTestId("clear-icon"))
      .not.toBeInTheDocument();
  })

  it("calls onClearSearch and handleSearch when clear icon is clicked", () => {
    render(<SearchBar {...defaultProps} value="test" />)
    fireEvent.click(screen.getByTestId("clear-icon"))
    expect(defaultProps.onClearSearch).toHaveBeenCalled()
    expect(defaultProps.handleSearch).toHaveBeenCalled()
  })

})
