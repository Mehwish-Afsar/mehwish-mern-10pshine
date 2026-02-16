import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import ForgotPassword from "./ForgotPassword"
import axiosInstance from "../../utils/axiosInstance"

vi.mock("../../utils/axiosInstance", () => ({
  default: {
    post: vi.fn(),
  },
}))

describe("ForgotPassword Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders the forgot password form", () => {
    render(<ForgotPassword />);
    expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Send Reset Link/i })).toBeInTheDocument()
  })

  it("shows validation error if email is empty", async () => {
    render(<ForgotPassword />);
    fireEvent.click(screen.getByRole("button", { name: /Send Reset Link/i }))
    await waitFor(() => {
      expect(screen.getByText(/Please enter your email/i)).toBeInTheDocument()
    })
  })

  it("shows success message when API call succeeds", async () => {
    axiosInstance.post.mockResolvedValue({ data: {} })
    render(<ForgotPassword />)
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: "test@example.com" },
    })
    fireEvent.click(screen.getByRole("button", { name: /Send Reset Link/i }))
    await waitFor(() => {
      expect(screen.getByText(/Password reset link sent to your email/i)).toBeInTheDocument()
    })
    expect(screen.queryByText(/Please enter your email/i)).not.toBeInTheDocument()
  })

  it("shows error message when API call fails", async () => {
    axiosInstance.post.mockRejectedValue(new Error("Email not found"))
    render(<ForgotPassword />)
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: "wrong@example.com" },
    })
    fireEvent.click(screen.getByRole("button", { name: /Send Reset Link/i }))
    await waitFor(() => {
      expect(screen.getByText(/Email not found/i)).toBeInTheDocument()
    })
  })
})
