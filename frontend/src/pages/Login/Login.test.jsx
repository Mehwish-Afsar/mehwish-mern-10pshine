import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import { vi } from "vitest"
import Login from "./Login"
import axiosInstance from "../../utils/axiosInstance"

const mockedNavigate = vi.fn()

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  }
})

vi.mock("../../utils/axiosInstance", () => ({
  default: {
    post: vi.fn(),
  },
}))

describe("Login Page", () => {
  test("Login page renders properly", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument()
  })

  it("shows error for invalid email", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )
    await userEvent.type(screen.getByPlaceholderText("Email"), "wrongemail");
    await userEvent.type(screen.getByPlaceholderText("Password"), "123456");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(screen.getByText("Please enter a valid email address.")).toBeInTheDocument()
  })

  it("successful login redirects user", async () => {
    axiosInstance.post.mockResolvedValue({
      data: { accessToken: "abc123" },
    })
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )
    await userEvent.type(screen.getByPlaceholderText("Email"), "test@gmail.com")
    await userEvent.type(screen.getByPlaceholderText("Password"), "123456")
    await userEvent.click(screen.getByRole("button", { name: /login/i }))
    expect(axiosInstance.post).toHaveBeenCalled()
    expect(mockedNavigate).toHaveBeenCalledWith("/dashboard")
    expect(localStorage.getItem("token")).toBe("abc123")
  })
})
