import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import ResetPassword from "./ResetPassword"
import axiosInstance from "../../utils/axiosInstance"
import { vi } from "vitest"

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ token: "dummy-token" }), 
  }
})

vi.mock("../../utils/axiosInstance", () => ({
  default: {
    post: vi.fn(),
  },
}))

describe("ResetPassword Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders reset password form", () => {
    render(<ResetPassword />);
    expect(screen.getByRole("heading", { name: /Reset Password/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/New Password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Reset Password/i })).toBeInTheDocument()
  })

  it("resets password successfully and redirects", async () => {
    axiosInstance.post.mockResolvedValue({
      data: { message: "Password reset successful" },
    })

    render(<ResetPassword />)
    fireEvent.change(screen.getByPlaceholderText(/New Password/i), {
      target: { value: "newpass123" },
    })
    fireEvent.click(screen.getByRole("button", { name: /Reset Password/i }))
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login")
    })
  })

  it("shows error if reset fails", async () => {
  axiosInstance.post.mockRejectedValue(new Error("Invalid"))
  render(<ResetPassword />);
  fireEvent.change(screen.getByPlaceholderText(/New Password/i), {
    target: { value: "newpass123" },
  })
  fireEvent.click(screen.getByRole("button", { name: /Reset Password/i }))
  await waitFor(() => {
    expect(screen.getByText(/Invalid or expired reset link/i)).toBeInTheDocument()
  })
})

})
