"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authAPI } from "@/lib/api";

export default function StudentSignup() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ message: "", type: "" });

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    userId: "",
    organizationId: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError({ message: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({ message: "", type: "" });

    try {
      let response;

      if (!isLogin) {
        if (formData.password !== formData.confirmPassword) {
          setError({ message: "Passwords don't match", type: "validation" });
          setLoading(false);
          return;
        }

        response = await authAPI.signup({
          name: formData.name,
          userId: formData.userId,
          password: formData.password,
          type: "student",
          mobile: formData.mobile,
          organizationId: formData.organizationId,
        });
      } else {
        response = await authAPI.login({
          userId: formData.userId,
          password: formData.password,
        });
      }

      /* 🔑🔥 MOST IMPORTANT FIX */
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.type);
      localStorage.setItem("student", JSON.stringify(response.data.user));

      router.push("/Dashboard/student");
    } catch (err) {
      setError({
        message: err.response?.data?.message || "Authentication failed",
        type: "auth",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col">
      <div className="bg-white border-b px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-2xl shadow border">
            <h1 className="text-2xl font-bold mb-4">
              {isLogin ? "Student Login" : "Create Student Account"}
            </h1>

            {error.message && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
                {error.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <Input label="Full Name" name="name" onChange={handleChange} required />
                  <Input label="Mobile" name="mobile" onChange={handleChange} required />
                  <Input
                    label="Organization ID"
                    name="organizationId"
                    onChange={handleChange}
                    required
                  />
                </>
              )}

              <Input
                label="Student ID"
                name="userId"
                onChange={handleChange}
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {!isLogin && (
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  onChange={handleChange}
                  required
                />
              )}

              <Button variant="outline" className="w-full mt-4" disabled={loading}>
                {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <Button
              variant="outline"
              onClick={() => setIsLogin(!isLogin)}
              className="mt-4 text-green-600 text-sm w-full"
            >
              {isLogin ? "Create new account" : "Already have an account?"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
