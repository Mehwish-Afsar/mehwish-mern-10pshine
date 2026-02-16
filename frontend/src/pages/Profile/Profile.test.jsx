import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import Profile from "./Profile"
import axiosInstance from "../../utils/axiosInstance"

const mockNavigate = vi.fn()

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock("../../utils/axiosInstance", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}))

vi.mock("../../utils/constant", () => ({
  BASE_URL: "http://localhost:5000",
}))

describe("Profile Component", () => {
  const mockUser = {
    fullName: "Mehwish Khan",
    email: "mehwish@test.com",
    image: "/uploads/profile.png",
  }
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it("fetches and displays user data on mount", async () => {
    axiosInstance.get.mockResolvedValue({
      data: { user: mockUser },
    })
    render(<Profile />)
    expect(await screen.findByText("Mehwish Khan")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Mehwish Khan")).toBeInTheDocument()
    expect(screen.getByDisplayValue("mehwish@test.com")).toBeInTheDocument()
  })

  it("redirects to login if fetching user fails", async () => {
    axiosInstance.get.mockRejectedValue(new Error("Unauthorized"))
    render(<Profile />)
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login")
    })
  });


  it("updates profile successfully", async () => {
    axiosInstance.get.mockResolvedValue({
      data: { user: mockUser },
    })
    axiosInstance.put.mockResolvedValue({data: { user: { ...mockUser, fullName: "Updated Name" } }})
    render(<Profile />);
    await screen.findByText("Mehwish Khan");
    fireEvent.change(screen.getByDisplayValue("Mehwish Khan"), {
      target: { value: "Updated Name" },
    })
    fireEvent.click(screen.getByText("Save Profile"))
    expect(await screen.findByText("Profile updated successfully")).toBeInTheDocument()
  })

  it("shows error if profile update fails", async () => {
    axiosInstance.get.mockResolvedValue({
      data: { user: mockUser },
    })
    axiosInstance.put.mockRejectedValue(new Error("Error"))
    render(<Profile />)
    await screen.findByText("Mehwish Khan")
    fireEvent.click(screen.getByText("Save Profile"))
    expect(await screen.findByText("Failed to update profile")).toBeInTheDocument()
  })

  it("changes password successfully", async () => {
    axiosInstance.get.mockResolvedValue({
      data: { user: mockUser },
    })
    axiosInstance.put.mockResolvedValue({});
    render(<Profile />)
    await screen.findByText("Mehwish Khan");
    fireEvent.change(
      screen.getByPlaceholderText("Current password"),
      { target: { value: "old123" } }
    )
    fireEvent.change(
      screen.getByPlaceholderText("New password"),
      { target: { value: "new123" } }
    )
    fireEvent.click(screen.getByText("Change Password"));
    expect(await screen.findByText("Password updated successfully")).toBeInTheDocument();
  })

  it("shows error if password change fails", async () => {
    axiosInstance.get.mockResolvedValue({
      data: { user: mockUser },
    })
    axiosInstance.put.mockRejectedValue(new Error("Wrong password"));
    render(<Profile />);
    await screen.findByText("Mehwish Khan");
    fireEvent.change(
      screen.getByPlaceholderText("Current password"),
      { target: { value: "wrong" } }
    )
    fireEvent.change(
      screen.getByPlaceholderText("New password"),
      { target: { value: "new123" } }
    )
    fireEvent.click(screen.getByText("Change Password"))
    expect(await screen.findByText("Current password is incorrect")).toBeInTheDocument()
  })

  it("logs out and redirects to login", async () => {
    axiosInstance.get.mockResolvedValue({
      data: { user: mockUser },
    })
    render(<Profile />)
    await screen.findByText("Mehwish Khan")
    fireEvent.click(screen.getByText("Log out"))
    expect(mockNavigate).toHaveBeenCalledWith("/login")
  })

  it("navigates back to dashboard", async () => {
    axiosInstance.get.mockResolvedValue({
      data: { user: mockUser },
    })
    render(<Profile />)
    await screen.findByText("Mehwish Khan")
    fireEvent.click(screen.getByText("Back"))
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard")
  })

})
