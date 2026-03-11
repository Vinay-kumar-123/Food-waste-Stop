"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf, LogOut, Crown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { subscriptionAPI } from "@/lib/api";
import UpgradeButton from "@/components/UpgradeButton";
import SubscriptionBadge from "@/components/SubscriptionBadge";

export default function OrganizationDashboard() {
  const router = useRouter();
  const [subInfo, setSubInfo] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [item, setItem] = useState({ name: "", price: "" });
  const [canUsePremium, setCanUsePremium] = useState(true);

  const [summary, setSummary] = useState({ orders: [] });
  const [itemDemand, setItemDemand] = useState({});

  // 🔑 IMPORTANT: control auto refresh
  const [refreshDashboard, setRefreshDashboard] = useState(true);

  /* ================= SUBSCRIPTION STATUS ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    subscriptionAPI
      .status({
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCanUsePremium(res.data.allowed))
      .catch(() => setCanUsePremium(false));
  }, []);

  useEffect(() => {
    subscriptionAPI
      .info()
      .then((res) => setSubInfo(res.data))
      .catch(() => setSubInfo(null));
  }, []);

  /* ================= LOAD ORGANIZATION ================= */
  useEffect(() => {
    const stored = localStorage.getItem("organization");
    if (!stored) {
      router.push("/Signup/org");
      return;
    }

    const org = JSON.parse(stored);
    if (org.type !== "organization") {
    alert("Invalid login. Please login as organization.");
    router.push("/Signup/org");
    return;
  }
    setOrganization(org);
  }, [router]);

  /* ================= DASHBOARD AUTO REFRESH ================= */
  useEffect(() => {
    if (!organization || !refreshDashboard) return;

    loadDashboard(organization.organizationId);

    const interval = setInterval(() => {
      loadDashboard(organization.organizationId);
    }, 15000);

    return () => clearInterval(interval);
  }, [organization, refreshDashboard]);

  /* ================= LOAD DASHBOARD ================= */
  const loadDashboard = async (orgId) => {
    try {
      const menuRes = await fetch(`https://food-waste-stop-fastapi.onrender.com/menu/active/${orgId}`);
      const menu = await menuRes.json();

      if (!menu || !menu._id) {
        setSummary({ orders: [] });
        setItemDemand({});
        return;
      }

      const summaryRes = await fetch(
        `https://food-waste-stop-fastapi.onrender.com/dashboard/org/today/${orgId}/${menu._id}`,
      );
      const data = await summaryRes.json();
      setSummary(data);

      const demand = {};
      data.orders.forEach((o) =>
        o.items.forEach((i) => {
          if (i.status === "Eat") {
            demand[i.name] = (demand[i.name] || 0) + 1;
          }
        }),
      );
      setItemDemand(demand);
    } catch (err) {
      console.error("Dashboard error", err);
      setSummary({ orders: [] });
      setItemDemand({});
    }
  };

  /* ================= MENU ================= */
  const addItem = () => {
    if (!item.name || !item.price) return;
    setMenuItems([...menuItems, item]);
    setItem({ name: "", price: "" });
  };

  const uploadMenu = async () => {
    if (!menuItems.length || !canUsePremium) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please login again.");
      return;
    }

    const res = await fetch("https://food-waste-stop-fastapi.onrender.com/menu/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 🔥 THIS WAS MISSING
      },
      body: JSON.stringify({
        organizationId: organization.organizationId,
        items: menuItems,
        validMinutes: 60,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.detail || "Menu upload failed");
      return;
    }

    alert("Menu uploaded successfully");
    setMenuItems([]);
    loadDashboard(organization.organizationId);
  };

  const handleLogout = () => {
    localStorage.removeItem("organization");
    router.push("/");
  };

  if (!organization) return null;

  return (
    <div className="min-h-screen bg-orange-50">
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
          <Link href="/Dashboard/admin" className="flex gap-3 items-center">
            <Leaf className="text-green-600" />
            <div>
              <p className="font-bold">{organization.name}</p>
              <p className="text-sm text-gray-500">
                ID: {organization.organizationId}
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <SubscriptionBadge info={subInfo} />
           
          </div>
           <Button  variant="outline" onClick={handleLogout} className="flex gap-2 items-center cursor-pointer">
              <LogOut size={16} /> Logout
            </Button>
          
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* 🚨 UPGRADE BANNER */}
        {!canUsePremium && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="text-red-600" />
              <p className="text-red-700 font-semibold">
                Trial expired. Upgrade your profile — ₹1500/month only.
              </p>
            </div>

            <UpgradeButton
              onSuccess={() => {
                // 🔑 STOP interval while payment finishes
                setRefreshDashboard(false);
                window.location.reload();
              }}
            />
          </div>
        )}

        {/* ================= ITEM DEMAND ================= */}
        <Card>
          <CardBody>
            <h2 className="text-xl font-bold mb-4">Today’s Item-wise Demand</h2>

            {Object.keys(itemDemand).length === 0 ? (
              <p className="text-gray-500">No student responses yet</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(itemDemand).map(([name, count]) => (
                  <div key={name} className="border rounded-lg p-4 bg-green-50">
                    <p className="font-semibold capitalize">{name}</p>
                    <p className="text-gray-700">{count} students will eat</p>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* ================= MENU UPLOAD ================= */}
        <Card>
          <CardBody>
            <h2 className="font-semibold text-lg mb-4">Build Today’s Menu</h2>

            {!canUsePremium && (
              <p className="text-red-600 mb-4 font-medium">
                Subscription required to upload menu
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                placeholder="Item Name"
                className="border p-2 rounded"
                value={item.name}
                disabled={!canUsePremium}
                onChange={(e) => setItem({ ...item, name: e.target.value })}
              />
              <input
                placeholder="Price"
                type="number"
                className="border p-2 rounded"
                value={item.price}
                disabled={!canUsePremium}
                onChange={(e) => setItem({ ...item, price: +e.target.value })}
              />
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={addItem}
              disabled={!canUsePremium}
            >
              + Add Item
            </Button>

            {menuItems.length > 0 && (
              <div className="border rounded-lg p-3 bg-gray-100 space-y-2">
                <p className="text-sm font-medium text-blue-700 mb-2">
                  Menu Preview
                </p>

                {menuItems.map((m, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center   bg-white px-3 py-2 rounded"
                  >
                    <span className="capitalize text-gray-800">{m.name}</span>
                    <span className="font-medium text-gray-700">
                      ₹{m.price}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Upload CTA */}
            {menuItems.length > 0 && (
              <div className="flex justify-end mt-5">
                <Button
                  variant="outline"
                  className="px-8"
                  onClick={uploadMenu}
                  disabled={!canUsePremium}
                >
                  Upload Menu
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* ================= STUDENT SUMMARY ================= */}
        <Card>
          <CardBody>
            <h2 className="font-bold mb-3">Today’s Student Summary</h2>

            {summary.orders.length === 0 ? (
              <p className="text-gray-500">No responses yet</p>
            ) : (
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Student</th>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Item</th>
                    <th className="border p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.orders.map((o, idx) =>
                    o.items.map((i, k) => (
                      <tr key={`${idx}-${k}`}>
                        <td className="border p-2">{o.studentName}</td>
                        <td className="border p-2">{o.studentId}</td>
                        <td className="border p-2">{i.name}</td>
                        <td
                          className={`border p-2 font-semibold ${
                            i.status === "Eat"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {i.status}
                        </td>
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            )}
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
