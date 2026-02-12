import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import { vi } from "vitest"
import SignUp from "./SignUp"
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

describe("SignUp Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  test("SignUp page renders properly", () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    )
    expect(screen.getByText("Sign Up")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument()
  })

  it("shows error for empty fields and invalid email", async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    )
    const user = userEvent.setup()
    await user.click(screen.getByText("Create Account"))
    expect(screen.getByText("Please enter your name")).toBeInTheDocument()
    await user.type(screen.getByPlaceholderText("Name"), "Mehwish")
    await user.click(screen.getByText("Create Account"))
    expect(screen.getByText("Please enter a valid email")).toBeInTheDocument()
    await user.type(screen.getByPlaceholderText("Email"), "invalidemail")
    await user.click(screen.getByText("Create Account"))
    expect(screen.getByText("Please enter a valid email")).toBeInTheDocument()
    await user.clear(screen.getByPlaceholderText("Email"))
    await user.type(screen.getByPlaceholderText("Email"), "test@gmail.com")
    await user.click(screen.getByText("Create Account"))
    expect(screen.getByText("Please enter the password")).toBeInTheDocument()
  })

  it("successful signup calls API and navigates", async () => {
    axiosInstance.post.mockResolvedValue({
      data: { accessToken: "abc123" },
    })
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    )
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Name"), "Mehwish")
    await user.type(screen.getByPlaceholderText("Email"), "test@gmail.com")
    await user.type(screen.getByPlaceholderText("Password"), "123456")
    await user.click(screen.getByText("Create Account"))
    expect(axiosInstance.post).toHaveBeenCalledWith("/create-account", {
      fullName: "Mehwish",
      email: "test@gmail.com",
      password: "123456",
    })
    expect(mockedNavigate).toHaveBeenCalledWith("/dashboard")
    expect(localStorage.getItem("token")).toBe("abc123")
  })
})
