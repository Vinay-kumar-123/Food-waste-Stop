"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LedgerHeader } from "@/components/ledger/LedgerHeader";
import { LedgerStats } from "@/components/ledger/LedgerStats";
import { LedgerFilters } from "@/components/ledger/LedgerFilters";
import { LedgerTable } from "@/components/ledger/LedgerTable";
import { LedgerDrawer } from "@/components/ledger/LedgerDrawer";
import { LedgerPagination } from "@/components/ledger/LedgerPagination";
import { LedgerEmptyState } from "@/components/ledger/LedgerEmptyState";
import { LedgerLoadingState } from "@/components/ledger/LedgerLoadingState";

export default function StudentMealLedgerPage() {
  const router = useRouter();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [exporting, setExporting] = useState(false);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("July");
  const [selectedYear, setSelectedYear] = useState("2026");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  /* ================= LOAD ORGANIZATION & LEDGER DATA ================= */
  useEffect(() => {
    const stored = localStorage.getItem("organization");
    if (!stored) {
      router.push("/Signup/org");
      return;
    }

    const org = JSON.parse(stored);
    if (org.type !== "organization") {
      alert("Invalid organization session");
      router.push("/Signup/org");
      return;
    }

    setOrganization(org);
    fetchLedgerData(org.organizationId);
  }, [router]);

  const fetchLedgerData = async (orgId) => {
    setLoading(true);
    try {
      // 1. Fetch active menu to get item prices
      const menuRes = await fetch(
        `https://food-waste-stop-fastapi.onrender.com/menu/active/${orgId}`
      );
      const menu = await menuRes.json();

      const priceMap = {};
      if (menu && menu.sections) {
        menu.sections.forEach((sec) => {
          if (sec.items) {
            sec.items.forEach((item) => {
              priceMap[item.name] = Number(item.price) || 0;
            });
          }
        });
      }

      if (!menu || !menu._id) {
        setStudents([]);
        setLoading(false);
        return;
      }

      // 2. Fetch today's student summary
      const summaryRes = await fetch(
        `https://food-waste-stop-fastapi.onrender.com/dashboard/org/today/${orgId}/${menu._id}`
      );
      const summaryData = await summaryRes.json();

      if (!summaryData.students || !Array.isArray(summaryData.students)) {
        setStudents([]);
        setLoading(false);
        return;
      }

      // 3. Transform database records into production ledger data
      const ledgerRecords = summaryData.students.map((s) => {
        let dailyCost = 0;
        const itemPrices = {};

        (s.items || []).forEach((itemName) => {
          const price = priceMap[itemName] || 0;
          dailyCost += price;
          itemPrices[itemName] = price;
        });

        return {
          studentId: s.studentId,
          studentName: s.studentName,
          department: "General",
          year: "2026",
          month: selectedMonth,
          items: s.items || [],
          itemPrices,
          dailyCost,
          monthlyCost: dailyCost,
        };
      });

      setStudents(ledgerRecords);
    } catch (err) {
      console.error("Failed to load ledger data:", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTERING & COMPUTATION ================= */
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [students, searchTerm]);

  // Aggregate stats
  const totalStudentsCount = filteredStudents.length;
  const totalMealsCount = filteredStudents.reduce(
    (acc, curr) => acc + (curr.items?.length || 0),
    0
  );
  const totalAmountSum = filteredStudents.reduce(
    (acc, curr) => acc + (curr.monthlyCost || 0),
    0
  );
  const avgCostPerStudent =
    totalStudentsCount > 0 ? totalAmountSum / totalStudentsCount : 0;

  // Pagination slicing
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  /* ================= EXPORT CSV FUNCTIONALITY ================= */
  const handleExportCSV = () => {
    if (filteredStudents.length === 0) {
      alert("No ledger data available to export.");
      return;
    }

    setExporting(true);

    const headers = [
      "Student ID",
      "Student Name",
      "Department",
      "Month",
      "Year",
      "Selected Meals",
      "Daily Cost (INR)",
      "Monthly Ledger Total (INR)",
    ];

    const rows = filteredStudents.map((s) => [
      `"${s.studentId}"`,
      `"${s.studentName}"`,
      `"${s.department}"`,
      `"${s.month}"`,
      `"${s.year}"`,
      `"${(s.items || []).join("; ")}"`,
      s.dailyCost,
      s.monthlyCost,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Student_Meal_Ledger_${organization?.organizationId}_${selectedMonth}_${selectedYear}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExporting(false);
  };

  if (!organization) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <LedgerHeader
        orgName={organization.name}
        onExport={handleExportCSV}
        exporting={exporting}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1 w-full">
        {/* Metric Cards */}
        <LedgerStats
          totalStudents={totalStudentsCount}
          totalMeals={totalMealsCount}
          totalAmount={totalAmountSum}
          avgCostPerStudent={avgCostPerStudent}
        />

        {/* Filter Controls */}
        <LedgerFilters
          searchTerm={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />

        {/* Content Section */}
        {loading ? (
          <LedgerLoadingState />
        ) : filteredStudents.length === 0 ? (
          <LedgerEmptyState
            onResetFilters={() => {
              setSearchTerm("");
              setSelectedMonth("July");
              setSelectedYear("2026");
            }}
          />
        ) : (
          <div className="space-y-4">
            <LedgerTable
              students={paginatedStudents}
              onSelectStudent={setSelectedStudent}
            />

            <LedgerPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredStudents.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </main>

      {/* Detail Drawer */}
      <LedgerDrawer
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
