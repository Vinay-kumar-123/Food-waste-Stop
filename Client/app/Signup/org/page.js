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
  const [copiedOrgId, setCopiedOrgId] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔑 FORM DATA
  const [formData, setFormData] = useState({
    name: "",
    userId: "",
    password: "",
    confirmPassword: "",
  });

  // 🔑 BACKEND GENERATED ORG ID
  const [organizationId, setOrganizationId] = useState("");

  /* =========================
     FETCH ORG ID FROM BACKEND
     ========================= */
  useEffect(() => {
    if (!isLogin) {
      organizationAPI
        .generateOrgId()
        .then((res) => setOrganizationId(res.data.organizationId))
        .catch(() => setError("Failed to generate Organization ID"));
    }
  }, [isLogin]);

  /* =========================
     HANDLERS
     ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleCopyOrgId = () => {
    navigator.clipboard.writeText(organizationId);
    setCopiedOrgId(true);
    setTimeout(() => setCopiedOrgId(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!isLogin) {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return;
        }

        const response = await authAPI.signup({
          name: formData.name,
          userId: formData.userId,
          password: formData.password,
          type: "organization",          // 🔒 FIXED
          organizationId: organizationId // 🔑 BACKEND GENERATED
        });

        localStorage.setItem(
          "organization",
          JSON.stringify(response.data.user)
        );
      } else {
        const response = await authAPI.login({
          userId: formData.userId, // ✅ CORRECT
          password: formData.password,
        });

        localStorage.setItem(
          "organization",
          JSON.stringify(response.data.user)
        );
      }

      router.push("/Dashboard/admin");
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
     ========================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex flex-col">
      <div className="bg-white border-b px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">

          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="text-white" />
            </div>
            <h1 className="text-xl font-bold">Food Not Waste</h1>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow">
            <h2 className="text-xl font-bold mb-2">
              {isLogin ? "Organization Login" : "Register Organization"}
            </h2>

            {error && (
              <div className="mb-4 text-red-600 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {!isLogin && (
                <Input
                  label="Organization Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              )}

              {!isLogin && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium mb-1">
                    Organization ID (Share with students)
                  </p>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-white px-3 py-2 rounded border font-mono">
                      {organizationId}
                    </div>
                    <button type="button" onClick={handleCopyOrgId}>
                      {copiedOrgId ? <Check /> : <Copy />}
                    </button>
                  </div>
                </div>
              )}

              <Input
                label="Admin / Mess Login ID"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
              />

              <div>
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
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
                  required
                />
              )}

              <Button className="w-full" disabled={loading}>
                {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
              </Button>
            </form>

            <button
              onClick={() => setIsLogin(!isLogin)}
              className="mt-4 text-sm text-primary w-full"
            >
              {isLogin ? "Create new account" : "Already have an account?"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
