"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Eye, EyeOff, ArrowLeft, Copy, Check, Import } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authAPI } from "@/lib/api";


export default function OrganizationSignup() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedOrgId, setCopiedOrgId] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [generatedOrgId, setGeneratedOrgId] = useState(null);

  const generateOrgId = () => `ORG${Date.now().toString().slice(-8)}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleCopyOrgId = () => {
    if (generatedOrgId) {
      navigator.clipboard.writeText(generatedOrgId);
      setCopiedOrgId(true);
      setTimeout(() => setCopiedOrgId(false), 2000);
    }
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

        const orgId = generatedOrgId || generateOrgId();

        const response = await authAPI.signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          type: "organization",
          organizationId: orgId,
        });

        localStorage.setItem(
          "organization",
          JSON.stringify(response.data.user),
        );
      } else {
        const response = await authAPI.login({
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem(
          "organization",
          JSON.stringify(response.data.user),
        );
      }

      router.push("/org-dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const displayOrgId = generatedOrgId || generateOrgId();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex flex-col">
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
              {isLogin ? "Organization Login" : "Register Your Organization"}
            </h1>
            <p className="text-gray-600 mb-6">
              {isLogin
                ? "Sign in to manage your mess"
                : "Create an account for your college/mess"}
            </p>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <Input
                  label="Organization Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="College/Mess Name"
                  required
                />
              )}

              {!isLogin && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Your Organization ID (Auto-Generated)
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono text-foreground flex items-center">
                      {displayOrgId}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyOrgId}
                      className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-green-600 transition"
                    >
                      {copiedOrgId ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Share this ID with your students so they can join your
                    organization
                  </p>
                </div>
              )}

              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="organization@email.com"
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
                  setGeneratedOrgId(null);
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

          {/* Features */}
          <div className="mt-8 space-y-3">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm font-semibold text-foreground mb-1">
                Multi-College Support
              </p>
              <p className="text-xs text-gray-600">
                Manage multiple messes from one account
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm font-semibold text-foreground mb-1">
                7-Day Free Trial
              </p>
              <p className="text-xs text-gray-600">
                Try all features risk-free
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}