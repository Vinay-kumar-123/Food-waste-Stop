"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authAPI } from "@/lib/api";

export default function signup() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    userId: "",
    organizationId: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!isLogin) {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords don't match");
          return;
        }
        if (!formData.organizationId) {
          setError("Please enter your organization ID");
          return;
        }

        const response = await authAPI.signup({
          name: formData.name,
          userId: formData.userId,
          password: formData.password,
          type: "student",
          mobile: formData.mobile,
          organizationId: formData.organizationId,
        });

        localStorage.setItem("student", JSON.stringify(response.data.user));
      } else {
        const response = await authAPI.login({
          userId: formData.userId,
          password: formData.password,
        });

        localStorage.setItem("student", JSON.stringify(response.data.user));
      }

      router.push("/student-dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-foreground hover:text-primary transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              Food Not Waste
            </span>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {isLogin ? "Student Login" : "Create Student Account"}
            </h1>
            <p className="text-gray-600 mb-6">
              {isLogin
                ? "Sign in to your student account"
                : "Join your college mess and start saving food"}
            </p>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />

                  <Input
                    label="Mobile Number"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    required
                  />
                </>
              )}

              <Input
                label="Organization ID"
                name="organizationId"
                value={formData.organizationId}
                onChange={handleChange}
                placeholder={
                  isLogin ? "Your organization ID" : "Ask your mess manager"
                }
                required
              />
              <p className="text-xs text-gray-500">
                This is provided by your college/mess
              </p>

              <Input
                label="Student Id"
                name="userId"
                type="number"
                value={formData.userId}
                onChange={handleChange}
                placeholder="Enter your id"
                required
              />

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-6"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600 text-sm">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </p>
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="w-full mt-2 px-4 py-2 text-primary font-semibold hover:bg-green-50 rounded-lg transition"
              >
                {isLogin ? "Sign Up Instead" : "Sign In Instead"}
              </button>
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">
              By signing up, you agree to our Terms of Service
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-bold text-primary">7</div>
              <p className="text-sm text-gray-600">Days Free Trial</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-bold text-primary">0</div>
              <p className="text-sm text-gray-600">Credit Card Required</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
