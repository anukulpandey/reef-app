import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import headerLogo from "../assets/header-logo-reef.png";
import { useAuth } from "../contexts/AuthContext";
import React from "react";
// Zod validation schema
const loginSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to dashboard if already logged in
  React.useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate("/points/dashboard", { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Required field validation (best practice: check before schema validation)
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    // If required fields are missing, show those errors only
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Validate form data with zod
      const validatedData = loginSchema.parse(formData);
      // Attempt login with validated data
      const response = await login(validatedData);
      console.log("🚀 ~ handleSubmit ~ response:", response);

      setErrors({});
      navigate("/points/dashboard");
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
      // Zod validation errors
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else if (error?.response?.data?.message) {
        // Show backend error message directly
        setErrors({
          general: error.response.data.message,
        });
      } else if (error?.message) {
        // Show error.message if present
        setErrors({
          general: error.message,
        });
      } else {
        setErrors({
          general: "Login failed. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-[Inter,sans-serif] bg-gradient-to-br from-white via-purple-50 to-pink-50">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8 flex flex-col items-center space-y-2">
          <div className="flex items-center justify-center space-x-2 flex-shrink-0">
            <img
              src={headerLogo}
              alt="Reef-swap"
              className="w-38 h-auto drop-shadow-md"
            />
          </div>
          {/* <p
            className="text-lg font-semibold text-gray-800 tracking-wide"
            style={{ fontFamily: "Inter, sans-serif", letterSpacing: "0.01em" }}
          >
            Welcome back to{" "}
            <span className="font-bold bg-gradient-to-r from-[#A93185] to-[#5D3BAD] bg-clip-text text-transparent">
              ReefSwap
            </span>
          </p> */}
        </div>

        {/* Login Card */}
        <div className="bg-white/90 rounded-xl shadow-2xl border border-gray-200/50 overflow-hidden">
          {/* Card Header */}
          <div className="px-6 pt-6 pb-4 text-center">
            <h1
              className="text-3xl font-bold mb-1 bg-gradient-to-r from-[#A93185] to-[#5D3BAD] bg-clip-text text-transparent"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Sign In
            </h1>
            <p
              className="text-gray-500 text-base font-medium"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Enter your credentials to access your account
            </p>
          </div>

          {/* Card Content */}
          <div className="px-8 pb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-gray-700 tracking-wide"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  className={`w-full h-12 px-4 border-2 placeholder:text-sm rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-200/40 ${
                    errors.username
                      ? "border-red-300 focus:border-red-500 bg-red-50/50"
                      : "border-gray-200 focus:border-purple-500 bg-white hover:border-gray-100"
                  }`}
                />
                {errors.username && (
                  <p
                    className="text-xs text-red-600 mt-1 flex items-center font-medium"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 tracking-wide"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={`w-full h-12 px-4 placeholder:text-sm pr-12 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-200/40 ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 bg-red-50/50"
                        : "border-gray-200 focus:border-purple-500 bg-white hover:border-gray-100"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-100 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p
                    className="text-xs text-red-600 mt-1 flex items-center font-medium"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-xs text-purple-600 hover:text-purple-700 font-semibold transition-colors hover:underline focus:outline-none cursor-pointer"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Forgot your password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-br from-[#ae27a5] to-[#742cb2] shadow-[0_5px_20px_-10px_#742cb2] hover:from-[#742cb2] hover:to-[#ae27a5] text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-purple-500/25 cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* General error message */}
              {errors.general && (
                <p
                  className="text-xs text-red-600 mt-2 text-center font-medium"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {errors.general}
                </p>
              )}
            </form>

            {/* <div className="mt-6 text-center">
              <p
                className="text-sm text-gray-700"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {"Don't have an account? "}
                <button
                  className="text-purple-600 hover:text-pink-600 font-semibold transition-colors hover:underline focus:outline-none cursor-pointer"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Sign up here
                </button>
              </p>
            </div> */}
          </div>
        </div>

        {/* Footer */}
        {/* <div
          className="mt-8 text-center text-xs text-gray-400 tracking-wide"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <p>
            © 2024{" "}
            <span className="font-semibold text-purple-500">ReefSwap</span>. All
            rights reserved.
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default LoginPage;
