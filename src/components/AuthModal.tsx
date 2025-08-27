import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { XMarkIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useUserAuth } from "@/lib/hooks/useUserAuth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const { signUp, signIn } = useUserAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    walletUsername: "",
  });

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      // Email validation
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }

      // Password validation
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      // Confirm password validation (only for registration)
      if (!isLoginMode) {
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
      }
    } else if (step === 2 && !isLoginMode) {
      // Wallet username validation (only for registration)
      if (!formData.walletUsername) {
        newErrors.walletUsername = "Wallet username is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep === 1) {
      if (!validateStep(1)) {
        return;
      }

      if (isLoginMode) {
        // For login, submit directly
        await submitForm();
      } else {
        // For registration, go to next step
        setCurrentStep(2);
        setErrors({});
      }
    } else if (currentStep === 2) {
      if (!validateStep(2)) {
        return;
      }

      // Submit the complete form
      await submitForm();
    }
  };

  const submitForm = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      if (isLoginMode) {
        // FAST LOGIN: Sign in with immediate redirect
        const { error } = await signIn(formData.email, formData.password);

        if (error) {
          setMessage({
            type: "error",
            text: "Login failed. Please check your credentials.",
          });
          setIsLoading(false);
          return;
        }

        // FAST LOGIN: Immediate redirect, no delay
        onClose();
        router.push("/huddle");
      } else {
        // Sign up
        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.walletUsername
        );

        if (error) {
          setMessage({
            type: "error",
            text: "Account creation failed. Please try again.",
          });
          setIsLoading(false);
          return;
        }

        setMessage({
          type: "success",
          text: "Account created successfully!",
        });

        // Redirect to huddle page after success
        setTimeout(() => {
          onClose();
          router.push("/huddle");
        }, 1500);
      }
    } catch {
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      walletUsername: "",
    });
    setErrors({});
    setMessage(null);
    setCurrentStep(1);
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    resetForm();
  };

  const goBack = () => {
    setCurrentStep(1);
    setErrors({});
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-white/10 backdrop-blur-md transition-all duration-500 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 transition-all duration-500 transform ${
          isAnimating
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute top-4 left-4 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute top-8 right-8 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-purple-300 rounded-full animate-bounce"></div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110 hover:rotate-90"
        >
          <XMarkIcon className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 animate-pulse">
            {isLoginMode
              ? "Welcome Back!"
              : currentStep === 1
              ? "Join the Huddle"
              : "Wallet Setup"}
          </h2>
          <p className="text-gray-600">
            {isLoginMode
              ? "Sign in to your account"
              : currentStep === 1
              ? "Create your account to get started"
              : "Set up your wallet username"}
          </p>

          {/* Step Indicator */}
          {!isLoginMode && (
            <div className="flex justify-center mt-4 space-x-2">
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentStep >= 1 ? "bg-purple-600" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentStep >= 2 ? "bg-purple-600" : "bg-gray-300"
                }`}
              ></div>
            </div>
          )}
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm font-medium ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Email, Password, Confirm Password */}
          {currentStep === 1 && (
            <>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password (only for registration) */}
              {!isLoginMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
                        errors.confirmPassword
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="w-4 h-4" />
                      ) : (
                        <EyeIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {/* Step 2: Wallet Username */}
          {currentStep === 2 && !isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wallet Username
              </label>
              <input
                type="text"
                value={formData.walletUsername}
                onChange={(e) =>
                  handleInputChange("walletUsername", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
                  errors.walletUsername ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter your wallet username"
              />
              {errors.walletUsername && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.walletUsername}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {/* Back Button (only on step 2) */}
            {currentStep === 2 && !isLoginMode && (
              <Button
                type="button"
                onClick={goBack}
                variant="outline"
                className="flex-1 hover:scale-105 transition-all duration-200 hover:shadow-md"
              >
                Back
              </Button>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className={`${
                currentStep === 2 && !isLoginMode ? "flex-1" : "w-full"
              } bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg transform disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isLoginMode
                    ? "Signing in..."
                    : currentStep === 1
                    ? "Next"
                    : "Creating account..."}
                </div>
              ) : isLoginMode ? (
                "Sign In"
              ) : currentStep === 1 ? (
                "Next"
              ) : (
                "Create Account"
              )}
            </Button>
          </div>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <button
            onClick={toggleMode}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors duration-200"
          >
            {isLoginMode
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
