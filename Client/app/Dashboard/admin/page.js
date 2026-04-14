"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf, LogOut, Crown, Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

import { subscriptionAPI } from "@/lib/api";
import UpgradeButton from "@/components/UpgradeButton";
import SubscriptionBadge from "@/components/SubscriptionBadge";

export default function OrganizationDashboard() {
  const router = useRouter();

  const [organization, setOrganization] = useState(null);

  const [subInfo, setSubInfo] = useState(null);

  const [copied, setCopied] = useState(false);

  const [canUsePremium, setCanUsePremium] = useState(true);

  const [sections, setSections] = useState([]);

  const [sectionName, setSectionName] = useState("");

  const [item, setItem] = useState({ name: "", price: "" });

  const [summary, setSummary] = useState({ students: [] });

  const [itemDemand, setItemDemand] = useState({});

  const [refreshDashboard, setRefreshDashboard] = useState(true);

  /* ================= SUBSCRIPTION STATUS ================= */

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    subscriptionAPI
      .status()
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
      alert("Invalid login");

      router.push("/Signup/org");

      return;
    }

    setOrganization(org);
  }, [router]);

  /* ================= DASHBOARD REFRESH ================= */

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
      const menuRes = await fetch(
        `https://food-waste-stop-fastapi.onrender.com/menu/active/${orgId}`,
      );

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

      setItemDemand(data.itemDemand || {});
    } catch (err) {
      console.error("Dashboard error", err);

      setSummary({ orders: [] });

      setItemDemand({});
    }
  };

  /* ================= ADD SECTION ================= */

  const addSection = () => {
    if (!sectionName) return;

    setSections([...sections, { name: sectionName, items: [] }]);

    setSectionName("");
  };

  /* ================= ADD ITEM ================= */

  const addItem = (index) => {
    if (!item.name || !item.price) return;

    const updated = [...sections];

    updated[index].items.push(item);

    setSections(updated);

    setItem({ name: "", price: "" });
  };

  /* ================= UPLOAD MENU ================= */

  const uploadMenu = async () => {
    if (!sections.length || !canUsePremium) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired");

      return;
    }

    const res = await fetch(
      "https://food-waste-stop-fastapi.onrender.com/menu/upload",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          organizationId: organization.organizationId,

          sections,

          validMinutes: 200,
        }),
      },
    );

    if (!res.ok) {
      alert("Menu upload failed");

      return;
    }

    alert("Menu uploaded successfully");

    setSections([]);
  };

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    localStorage.removeItem("organization");

    router.push("/");
  };

  if (!organization) return null;

  const copyOrgId = () => {
    navigator.clipboard.writeText(organization.organizationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* HEADER */}

      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
          <Link href="/Dashboard/admin" className="flex gap-3 items-center">
            <Leaf className="text-green-600" />

            <div>
              <p className="font-bold">{organization.name}</p>
              <div className="flex gap-3">
                <p className="text-sm text-gray-500">
                  ID: {organization.organizationId}
                </p>
                <button type="button" onClick={copyOrgId}>
                  {copied ? <Check /> : <Copy />}
                </button>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <SubscriptionBadge info={subInfo} />

            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex gap-2 items-center"
            >
              <LogOut size={16} /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* UPGRADE BANNER */}

        {!canUsePremium && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-5 flex justify-between">
            <p className="text-red-700 font-semibold">
              Trial expired — Upgrade ₹1099/month
            </p>

            <UpgradeButton
              onSuccess={() => {
                setRefreshDashboard(false);
                window.location.reload();
              }}
            />
          </div>
        )}

        {/* DEMAND */}

        <Card>
          <CardBody>
            <h2 className="text-xl font-bold mb-4">Today's Demand</h2>

            {Object.keys(itemDemand).length === 0 ? (
              <p>No responses yet</p>
            ) : (
              Object.entries(itemDemand).map(([section, items]) => (
                <div key={section} className="mb-6">
                  <h3 className="font-bold text-lg mb-3">{section}</h3>

                  <div className="grid md:grid-cols-3 gap-4">
                    {Object.entries(items).map(([name, count]) => (
                      <div
                        key={name}
                        className="border rounded-lg p-4 bg-green-50"
                      >
                        <p className="font-semibold capitalize">{name}</p>

                        <p>{count} students will eat</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardBody>
        </Card>
        {/* MENU BUILDER */}

        <Card>
          <CardBody>
            <h2 className="font-bold text-lg mb-4">Build Menu Sections</h2>

            {!canUsePremium && (
              <p className="text-red-600 mb-4 font-medium">
                Subscription required to upload menu
              </p>
            )}

            <div className="flex gap-3 mb-5">
              <input
                placeholder="Section name (Breakfast)"
                disabled={!canUsePremium}
                className="border p-2 rounded"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
              />

              <Button
                variant="primary"
                onClick={addSection}
                disabled={!canUsePremium}
              >
                Add Section
              </Button>
            </div>

            {sections.map((section, index) => (
              <div key={index} className="border p-4 mb-4 rounded bg-gray-50">
                <h3 className="font-bold mb-3">{section.name}</h3>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <input
                    placeholder="Item name"
                    className="border p-2 rounded"
                    value={item.name}
                    onChange={(e) => setItem({ ...item, name: e.target.value })}
                  />

                  <input
                    type="number"
                    placeholder="Price"
                    className="border p-2 rounded"
                    value={item.price}
                    onChange={(e) =>
                      setItem({ ...item, price: +e.target.value })
                    }
                  />
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => addItem(index)}
                  disabled={!canUsePremium}
                >
                  Add Item
                </Button>

                <div className="mt-3 space-y-1">
                  {section.items.map((i, k) => (
                    <div
                      key={k}
                      className="flex justify-between bg-white p-2 rounded"
                    >
                      <span>{i.name}</span>

                      <span>₹{i.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {sections.length > 0 && (
              <Button
                variant="outline"
                className="flex justify-center items-center mt-4"
                onClick={uploadMenu}
              >
                Upload Menu
              </Button>
            )}
          </CardBody>
        </Card>
        {/* ================= STUDENT SUMMARY ================= */}
        <Card>
          <CardBody>
            <h2 className="font-bold mb-3">Today’s Student Summary</h2>

            {!summary?.students || summary.students.length === 0 ? (
              <p>No responses yet</p>
            ) : (
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Student</th>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Selected Items</th>
                  </tr>
                </thead>

                <tbody>
                  {summary.students.map((s, i) => (
                    <tr key={i}>
                      <td className="border p-2">{s.studentName}</td>
                      <td className="border p-2">{s.studentId}</td>
                      <td className="border p-2">{s.items.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
