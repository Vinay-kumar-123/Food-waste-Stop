"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

export default function OrganizationDashboard() {
  const router = useRouter();

  const [organization, setOrganization] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [item, setItem] = useState({ name: "", price: "" });

  const [summary, setSummary] = useState({
    orders: [],
    foodEaten: 0,
    foodSkipped: 0,
  });

  /* ================= LOAD ORG + SUMMARY ================= */
  useEffect(() => {
    const stored = localStorage.getItem("organization");
    if (!stored) {
      router.push("/Signup/org");
      return;
    }

    const org = JSON.parse(stored);
    setOrganization(org);

    loadTodaySummary(org.organizationId);
  }, []);

  /* ================= SUMMARY LOGIC ================= */
  const loadTodaySummary = async (orgId) => {
    try {
      // 1️⃣ get active menu
      const menuRes = await fetch(`http://127.0.0.1:8000/menu/active/${orgId}`);
      const menu = await menuRes.json();

      if (!menu || !menu._id) {
        setSummary({ orders: [], foodEaten: 0, foodSkipped: 0 });
        return;
      }

      // 2️⃣ get summary for active menu
      const summaryRes = await fetch(
        `http://127.0.0.1:8000/dashboard/org/today/${orgId}/${menu._id}`
      );
      const data = await summaryRes.json();

      setSummary(data);
    } catch (err) {
      console.error("Summary error", err);
      setSummary({ orders: [], foodEaten: 0, foodSkipped: 0 });
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("organization");
    router.push("/");
  };

  /* ================= MENU ================= */
  const addItem = () => {
    if (!item.name || !item.price) return;
    setMenuItems([...menuItems, item]);
    setItem({ name: "", price: "" });
  };

  const uploadMenu = async () => {
    if (!menuItems.length) return;

    await fetch("http://127.0.0.1:8000/menu/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organizationId: organization.organizationId,
        items: menuItems,
        validMinutes: 60,
      }),
    });

    alert("Menu uploaded");
    setMenuItems([]);
    loadTodaySummary(organization.organizationId);
  };

  if (!organization) return null;

  const total = summary.foodEaten + summary.foodSkipped;
  const efficiency =
    total === 0 ? "0%" : `${((summary.foodEaten / total) * 100).toFixed(1)}%`;

  return (
    <div className="min-h-screen bg-orange-50">
      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
          <Link href="/Dashboard/admin" className="flex gap-3">
            <Leaf className="text-green-600" />
            <div>
              <p className="font-bold">{organization.name}</p>
              <p className="text-sm text-blue-500">
                ID: {organization.organizationId}
              </p>
            </div>
          </Link>

          <button onClick={handleLogout} className="flex gap-2 items-center">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-4">
          <Stat title="Food Eaten" value={summary.foodEaten} />
          <Stat title="Food Skipped" value={summary.foodSkipped} />
          <Stat title="Efficiency" value={efficiency} />
          <Stat title="Responses" value={summary.orders.length} />
        </div>

        {/* MENU */}
        <Card>
          <CardBody>
            <h2 className="font-semibold text-lg mb-4">Build Today’s Menu</h2>

            {/* Add Item Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-sm text-gray-600">Item Name</label>
                <input
                  placeholder="e.g. Rice, Dal"
                  className="border p-2 rounded w-full mt-1"
                  value={item.name}
                  onChange={(e) => setItem({ ...item, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Price (₹)</label>
                <input
                  placeholder="e.g. 40"
                  type="number"
                  className="border p-2 rounded w-full mt-1"
                  value={item.price}
                  onChange={(e) => setItem({ ...item, price: +e.target.value })}
                />
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="mb-4"
              onClick={addItem}
            >
              + Add Item
            </Button>

            {/* Menu Preview */}
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
                <Button variant="outline" className="px-8" onClick={uploadMenu}>
                  Upload Menu
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* STUDENT SUMMARY */}
        <Card>
          <CardBody>
            <h2 className="font-bold mb-3">Today’s Student Summary</h2>

            {summary.orders.length === 0 ? (
              <p className="text-gray-500">No responses yet</p>
            ) : (
              <table className="w-full border text-sm capitalize">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Student</th>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Item Name</th>
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
                    ))
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

/* ===== SMALL STAT CARD ===== */
function Stat({ title, value }) {
  return (
    <Card>
      <CardBody>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </CardBody>
    </Card>
  );
}
