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

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const stored = localStorage.getItem("student");
    if (!stored) {
      router.push("/Signup/student");
      return;
    }

    const s = JSON.parse(stored);
    setStudent(s);

    // 1️⃣ Fetch active menu
    fetch(`http://127.0.0.1:8000/menu/active/${s.organizationId}`)
      .then((res) => res.json())
      .then(async (menuData) => {
        if (!menuData.active) {
          setMenu(null);
          setSubmitted(false);
          return;
        }

        setMenu(menuData);

        // 2️⃣ Fetch student orders
        const orderRes = await fetch(
          `http://127.0.0.1:8000/orders/student/${s.userId}`
        );
        const orders = await orderRes.json();
        setHistory(orders);

        // ✅ correct submit check (student + menu)
        const already = orders.find(
          (o) => o.menuId === menuData._id && o.studentId === s.userId
        );
        setSubmitted(!!already);

        
      })
      .catch(() => {
        setMenu(null);
        setSubmitted(false);
      });
  }, [router]);

  /* ================= ACTIONS ================= */
  const handleLogout = () => {
    localStorage.removeItem("student");
    router.push("/");
  };

  const selectItem = (name, status) => {
    setSelection((prev) => ({ ...prev, [name]: status }));
  };

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

    const res = await fetch("http://127.0.0.1:8000/orders/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: student.userId,
        studentName: student.name,
        organizationId: student.organizationId,
        menuId: menu._id,
        items,
      }),
    });

    if (!res.ok) {
      alert("You already submitted for this menu");
      return;
    }

    setSubmitted(true);
    alert("Order submitted successfully");
  };

  if (!student) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
          <Link href="/Dashboard/student" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="text-green-500" />
            </div>
            <div>
              <p className="font-bold">Welcome, {student.name}</p>
              <p className="text-sm text-gray-500">ID: {student.userId}</p>
              <p className="text-sm text-gray-500">
                ORG: {student.organizationId}
              </p>
            </div>
          </Link>

          <button onClick={handleLogout} className="flex gap-2 items-center">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* TODAY MENU */}
        <Card>
          <CardBody>
            <h2 className="text-xl font-bold mb-3">Today’s Menu</h2>

            {!menu && (
              <p className="text-gray-500">
                No menu available right now. Please wait.
              </p>
            )}

            {menu && submitted && (
              <p className="text-green-600 font-medium">
                ✔ You have already submitted today’s order
              </p>
            )}

            {menu && !submitted && (
              <div className="space-y-4">
                {menu.items.map((item) => (
                  <div
                    key={item.name}
                    className="p-4 border rounded-lg bg-gray-50"
                  >
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">₹{item.price}</p>

                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant={
                          selection[item.name] === "Eat" ? "primary" : "outline"
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
                ))}

                <Button className="w-full mt-4" onClick={submitOrder}>
                  Submit Selection
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* PREVIOUS ORDERS */}
        <Card>
          <CardBody>
            <h2 className="text-xl font-bold mb-4">Previous Orders (Last 7)</h2>

            {history.length === 0 && (
              <p className="text-gray-500">No previous orders found</p>
            )}

            {history.map((order) => (
              <div key={order._id} className="border-b py-3 text-sm space-y-1">
                <p className="font-medium">
                  {new Date(order.createdAt).toDateString()}
                </p>

                {order.items.map((i, idx) => (
                  <p key={idx}>
                    {i.name} –{" "}
                    <span
                      className={
                        i.status === "Eat" ? "text-green-600" : "text-red-500"
                      }
                    >
                      {i.status}
                    </span>
                  </p>
                ))}
              </div>
            ))}
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
