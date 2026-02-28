"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminAPI } from "@/lib/api";
import { Crown } from "lucide-react";

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin-login");
      return;
    }

    adminAPI.stats()
      .then(res => setStats(res.data))
      .catch(() => router.push("/admin-login"));

  }, []);

  if (!stats) return <p className="p-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <Crown className="text-yellow-500" />
        Super Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-white shadow rounded-xl p-6">
          <p className="text-gray-500">Total Organisations</p>
          <h2 className="text-3xl font-bold">{stats.totalOrganizations}</h2>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <p className="text-gray-500">Total Students</p>
          <h2 className="text-3xl font-bold">{stats.totalStudents}</h2>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <p className="text-gray-500">Active Subscriptions</p>
          <h2 className="text-3xl font-bold">{stats.activeSubscriptions}</h2>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <p className="text-gray-500">Total Revenue</p>
          <h2 className="text-3xl font-bold">₹ {stats.totalRevenue}</h2>
        </div>

      </div>
    </div>
  );
}