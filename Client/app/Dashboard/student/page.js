"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function StudentDashboard() {
  const [menu, setMenu] = useState(null);
  const [bill, setBill] = useState(null);

  useEffect(() => {
    api.get("/menu/today").then(res => setMenu(res.data));
    api.get("/student/bill").then(res => setBill(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>

      {menu && (
        <div className="bg-white p-4 rounded mb-4">
          <h3 className="font-semibold">Today's Menu</h3>
          <p>🍳 Breakfast: {menu.breakfast}</p>
          <p>🍛 Lunch: {menu.lunch}</p>
          <p>🍽 Dinner: {menu.dinner}</p>
        </div>
      )}

      {bill && (
        <div className="bg-white p-4 rounded">
          <p>Total Meals: {bill.totalMeals}</p>
          <p className="font-bold">Amount: ₹{bill.totalAmount}</p>
        </div>
      )}
    </div>
  );
}


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

export default function StudentDashboard() {
  const router = useRouter();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (!storedStudent) {
      router.push("/student-signup");
      return;
    }
    setStudent(JSON.parse(storedStudent));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("student");
    router.push("/");
  };

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Welcome back</p>
                <p className="text-lg font-bold text-foreground">
                  {student.name}
                </p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardBody>
              <p className="text-sm text-gray-600 mb-1">Student ID</p>
              <p className="text-lg font-bold text-foreground">
                {student.studentId}
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-sm text-gray-600 mb-1">Organization</p>
              <p className="text-lg font-bold text-foreground">
                {student.organizationId}
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="text-lg font-bold text-foreground text-xs">
                {student.email}
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className="text-lg font-bold text-primary">Active</p>
            </CardBody>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardBody>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Today's Menu
            </h2>
            <p className="text-gray-600 mb-6">
              Menu will be loaded from the API. This is a placeholder.
            </p>

            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-foreground">Paneer Tikka</h3>
                <p className="text-sm text-gray-600">
                  200 cal • ₹100 • Vegetarian
                </p>
                <div className="mt-3 flex gap-2">
                  <Button variant="primary" size="sm">
                    Eat
                  </Button>
                  <Button variant="outline" size="sm">
                    Skip
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-foreground">
                  Butter Chicken
                </h3>
                <p className="text-sm text-gray-600">
                  280 cal • ₹120 • Non-Veg
                </p>
                <div className="mt-3 flex gap-2">
                  <Button variant="primary" size="sm">
                    Eat
                  </Button>
                  <Button variant="outline" size="sm">
                    Skip
                  </Button>
                </div>
              </div>
            </div>

            <Button variant="primary" size="lg" className="w-full mt-6">
              Submit Selection
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
