import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Message from "./Message";

describe("Message Component", () => {

  it("does not render when isShown is false", () => {
    const { container } = render(
      <Message isShown={false} message="Test message" />
    )
    expect(container.firstChild).toBeNull()
  })

  it("does not render when message is empty", () => {
    const { container } = render(
      <Message isShown={true} message="" />
    )
    expect(container.firstChild).toBeNull()
  })

  it("renders message when isShown is true", () => {
    render(<Message isShown={true} message="Success!" />)
    expect(screen.getByText("Success!")).toBeInTheDocument()
  });

  it("renders success icon by default", () => {
    const { container } = render(
      <Message isShown={true} message="Saved!" />
    )
    const icon = container.querySelector(".text-green-500")
    expect(icon).toBeInTheDocument()
  })

  it("renders delete icon when type is delete", () => {
    const { container } = render(
      <Message isShown={true} message="Deleted!" type="delete" />
    )
    const icon = container.querySelector(".text-red-500")
    expect(icon).toBeInTheDocument()
  });

  it("calls onClose after 3 seconds", async () => {
    vi.useFakeTimers()
    const onClose = vi.fn()
    render(<Message isShown={true} message="Auto close" onClose={onClose}/>)
    vi.advanceTimersByTime(3000)
    expect(onClose).toHaveBeenCalled()
    vi.useRealTimers()
  })

})

