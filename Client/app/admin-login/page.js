"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import { Button } from "@/components/ui/Button";

export default function AdminLogin() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await authAPI.login({ userId, password });

      if (res.data.user.type !== "super_admin") {
        setError("Unauthorized");
        return;
      }

      localStorage.setItem("token", res.data.token);
      router.push("/Dashboard/super-admin");

    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow w-96">
        <h2 className="text-xl font-bold mb-4">Super Admin Login</h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <input
          className="w-full border p-2 mb-3"
          placeholder="Admin ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button className="w-full">Login</Button>
      </form>
    </div>
  );
}