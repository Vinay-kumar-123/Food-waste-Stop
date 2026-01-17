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
  });

  const [itemDemand, setItemDemand] = useState({});

  /* ================= LOAD ORG ================= */

  useEffect(() => {
    const stored = localStorage.getItem("organization");
    if (!stored) {
      router.push("/Signup/org");
      return;
    }

    const org = JSON.parse(stored);
    setOrganization(org);

    // 🔹 First load
    loadDashboard(org.organizationId);

    // 🔁 Auto refresh every 15 seconds
    const interval = setInterval(() => {
      loadDashboard(org.organizationId);
    }, 15000);

    // 🔴 Cleanup (VERY IMPORTANT)
    return () => clearInterval(interval);
  }, []);

  /* ================= LOAD DASHBOARD ================= */
  const loadDashboard = async (orgId) => {
    try {
      // 1️⃣ active menu
      const menuRes = await fetch(`http://127.0.0.1:8000/menu/active/${orgId}`);
      const menu = await menuRes.json();

      if (!menu || !menu._id) {
        setSummary({ orders: [] });
        setItemDemand({});
        return;
      }

      // 2️⃣ student summary
      const summaryRes = await fetch(
        `http://127.0.0.1:8000/dashboard/org/today/${orgId}/${menu._id}`
      );
      const data = await summaryRes.json();
      setSummary(data);

      // 3️⃣ item-wise demand calculation
      const demand = {};
      data.orders.forEach((o) => {
        o.items.forEach((i) => {
          if (i.status === "Eat") {
            demand[i.name] = (demand[i.name] || 0) + 1;
          }
        });
      });

      setItemDemand(demand);
    } catch (err) {
      console.error("Dashboard error", err);
      setSummary({ orders: [] });
      setItemDemand({});
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

    alert("Menu uploaded successfully");
    setMenuItems([]);
    loadDashboard(organization.organizationId);
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

          <button onClick={handleLogout} className="flex gap-2 items-center">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
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
                    <p className="font-semibold capitalize text-lg">{name}</p>
                    <p className="font-bold text-gray-600">
                      {count} students will eat
                    </p>
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

            {/* Add Item Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {" "}
              <div>
                <label className="text-sm text-gray-600">Item Name</label>{" "}
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
