import { render, screen, fireEvent } from "@testing-library/react"
import { vi } from "vitest"
import PasswordInput from "./PasswordInput"

describe("PasswordInput Component", () => {

  const defaultProps = {
    value: "",
    onChange: vi.fn(),
    placeholder: "Enter password",
  }

  it("renders input with default type password", () => {
    render(<PasswordInput {...defaultProps} />)
    const input = screen.getByPlaceholderText("Enter password")
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute("type", "password")
  })

  it("calls onChange when typing", () => {
    render(<PasswordInput {...defaultProps} />)
    const input = screen.getByPlaceholderText("Enter password")
    fireEvent.change(input, { target: { value: "123456" } })
    expect(defaultProps.onChange).toHaveBeenCalled()
  })

  it("toggles password visibility when icon is clicked", () => {
    const { container } = render(<PasswordInput {...defaultProps} />)
    const input = screen.getByPlaceholderText("Enter password")
    expect(input).toHaveAttribute("type", "password")
    const icon = container.querySelector("svg")
    fireEvent.click(icon)
    expect(input).toHaveAttribute("type", "text")
    fireEvent.click(container.querySelector("svg"))
    expect(input).toHaveAttribute("type", "password")
  })

})
