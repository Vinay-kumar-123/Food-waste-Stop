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
      const menuRes = await fetch(
        `http://127.0.0.1:8000/menu/active/${orgId}`
      );
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
              <p className="text-sm text-gray-500">
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
            <h2 className="font-bold mb-3">Upload Menu</h2>

            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Item Name"
                className="border p-2 rounded"
                value={item.name}
                onChange={(e) => setItem({ ...item, name: e.target.value })}
              />
              <input
                placeholder="Price"
                type="number"
                className="border p-2 rounded"
                value={item.price}
                onChange={(e) => setItem({ ...item, price: +e.target.value })}
              />
            </div>

            <Button className="mt-3" onClick={addItem}>
              Add Item
            </Button>

            {menuItems.map((m, i) => (
              <p key={i} className="text-sm">
                • {m.name} – ₹{m.price}
              </p>
            ))}

            {menuItems.length > 0 && (
              <Button className="w-full mt-4" onClick={uploadMenu}>
                Upload Menu
              </Button>
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
              <table className="w-full border text-sm">
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
