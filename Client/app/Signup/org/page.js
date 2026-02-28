"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Eye, EyeOff, ArrowLeft, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authAPI, organizationAPI } from "@/lib/api";

export default function OrganizationSignup() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [organizationId, setOrganizationId] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    userId: "",
    password: "",
    confirmPassword: "",
  });

  /* 🔑 GET ORG ID */
  useEffect(() => {
    if (!isLogin) {
      organizationAPI
        .generateOrgId()
        .then((res) => setOrganizationId(res.data.organizationId))
        .catch(() => setError("Failed to generate organization ID"));
    }
  }, [isLogin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;

      if (!isLogin) {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        response = await authAPI.signup({
          name: formData.name,
          userId: formData.userId,
          password: formData.password,
          type: "organization",
          organizationId,
        });
      } else {
        response = await authAPI.login({
          userId: formData.userId,
          password: formData.password,
        });
      }

      /* 🔥 MOST IMPORTANT FIX */
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.type);
      localStorage.setItem(
        "organization",
        JSON.stringify(response.data.user)
      );

      router.push("/Dashboard/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const copyOrgId = () => {
    navigator.clipboard.writeText(organizationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="bg-white border-b px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>

      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow border">
          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="text-white" />
            </div>
            <h1 className="text-xl font-bold">Food Not Waste</h1>
          </div>

          <h2 className="text-xl font-bold mb-3">
            {isLogin ? "Organization Login" : "Register Organization"}
          </h2>

          {error && (
            <div className="mb-4 text-sm bg-red-50 text-red-700 p-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <Input
                  label="Organization Name"
                  name="name"
                  onChange={handleChange}
                  required
                />

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium mb-1">
                    Organization ID (Share with students)
                  </p>
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 bg-white px-3 py-2 rounded border font-mono">
                      {organizationId}
                    </div>
                    <button type="button" onClick={copyOrgId}>
                      {copied ? <Check /> : <Copy />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <Input
              label="Admin Login ID"
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

            <Button variant="outline" className="w-full" disabled={loading}>
              {loading
                ? "Please wait..."
                : isLogin
                ? "Login"
                : "Create Account"}
            </Button>
          </form>

          <Button
            variant="outline"
            onClick={() => setIsLogin(!isLogin)}
            className="mt-4 text-sm text-primary w-full"
          >
            {isLogin ? "Create new account" : "Already have an account?"}
          </Button>
        </div>
      </div>
    </div>
  );
}
