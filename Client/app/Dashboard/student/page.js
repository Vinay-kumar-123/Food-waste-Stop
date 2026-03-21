
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf, LogOut } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

export default function StudentDashboard() {
  const router = useRouter();

  const [student, setStudent] = useState(null);

  const [menu, setMenu] = useState(null);

  const [selection, setSelection] = useState({});

  const [submitted, setSubmitted] = useState(false);

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const stored = localStorage.getItem("student");

    if (!stored) {
      router.push("/Signup/student");

      return;
    }

    const s = JSON.parse(stored);

    if (s.type !== "student") {
      alert("Invalid login");

      router.push("/Signup/student");

      return;
    }

    setStudent(s);

    const loadData = async () => {
      try {
        /* ===== ACTIVE MENU ===== */

        const menuRes = await fetch(
          `https://food-waste-stop-fastapi.onrender.com/menu/active/${s.organizationId}`,
        );

        const menuData = await menuRes.json();

        if (!menuData.active) {
          setMenu(null);

          setSubmitted(false);
        } else {
          setMenu(menuData);
        }

        /* ===== STUDENT ORDERS ===== */

        const orderRes = await fetch(
          `https://food-waste-stop-fastapi.onrender.com/orders/student/${s.userId}`,
        );

        const orders = await orderRes.json();

        setHistory(orders);

        /* ===== CHECK SUBMITTED ===== */

        if (menuData?.active) {
          const already = orders.some(
            (o) => o.menuId === menuData._id && o.studentId === s.userId,
          );

          setSubmitted(already);
        }
      } catch (err) {
        console.error("Dashboard error", err);

        setMenu(null);

        setHistory([]);

        setSubmitted(false);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const interval = setInterval(loadData, 15000);

    return () => clearInterval(interval);
  }, [router]);

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    localStorage.removeItem("student");

    router.push("/");
  };

  /* ================= SELECT ITEM ================= */

  const selectItem = (name, status) => {
    setSelection((prev) => ({
      ...prev,

      [name]: status,
    }));
  };

  /* ================= SUBMIT ORDER ================= */

  const submitOrder = async () => {
    if (!menu) return;

    const items = Object.keys(selection).map((name) => ({
      name,

      status: selection[name],
    }));

    if (!items.length) {
      alert("Please select Eat or Skip");

      return;
    }

    const res = await fetch("https://food-waste-stop-fastapi.onrender.com/orders/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId: student.userId,

        studentName: student.name,

        organizationId: student.organizationId,

        menuId: menu._id,

        items,
      }),
    });

    if (!res.ok) {
      alert("You already submitted");

      return;
    }

    setSubmitted(true);

    setSelection({});

    alert("Order submitted successfully");
  };

  if (loading) return <p className="p-6">Loading...</p>;

  if (!student) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* HEADER */}

      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
          <Link href="/Dashboard/student" className="flex items-center gap-3">
            <Leaf className="text-green-600" />

            <div>
              <p className="font-bold">Welcome, {student.name}</p>

              <p className="text-sm text-gray-500">ID: {student.userId}</p>

              <p className="text-sm text-gray-500">
                ORG: {student.organizationId}
              </p>
            </div>
          </Link>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex gap-2 items-center"
          >
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* TODAY MENU */}

        <Card>
          <CardBody>
            <h2 className="text-xl font-bold mb-4">Today's Menu</h2>

            {!menu && (
              <p className="text-gray-500">No menu available right now</p>
            )}

            {menu && submitted && (
              <p className="text-green-600 font-medium">
                ✔ You already submitted today's order
              </p>
            )}

            {menu && !submitted && (
              <div className="space-y-6">
                {menu.sections?.map((section) => (
                  <div key={section.name}>
                    <h3 className="text-lg font-bold mb-3 text-green-700">
                      {section.name}
                    </h3>

                    {section.items.map((item) => (
                      <div
                        key={item.name}
                        className="p-4 border rounded-lg bg-gray-50 mb-3"
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="font-semibold">{item.name}</p>

                            <p className="text-sm text-gray-500">
                              ₹{item.price}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={
                                selection[item.name] === "Eat"
                                  ? "primary"
                                  : "outline"
                              }
                              onClick={() => selectItem(item.name, "Eat")}
                            >
                              Eat
                            </Button>

                            <Button
                              size="sm"
                              variant={
                                selection[item.name] === "Skip"
                                  ? "primary"
                                  : "outline"
                              }
                              onClick={() => selectItem(item.name, "Skip")}
                            >
                              Skip
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                <Button className="w-full mt-4" onClick={submitOrder}>
                  Submit Selection
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* ORDER HISTORY */}

        <Card>
          <CardBody>
            <h2 className="text-xl font-bold mb-4">
              Previous Orders (Last 30 Days)
            </h2>

            {history.length === 0 && <p>No previous orders found</p>}

            {history.map((order) => (
              <div
                key={order._id}
                className="border rounded-lg p-4 mb-4 bg-white"
              >
                <div className="text-sm font-semibold mb-3">
                  {new Date(order.createdAt).toLocaleString()}
                </div>

                {order.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="font-bold">{i.name}</span>

                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        i.status === "Eat"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {i.status}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
