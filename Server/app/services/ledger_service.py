import calendar
from datetime import datetime, timezone
import math
from app.db.mongodb import db
from bson import ObjectId

orders = db.orders
menus = db.menus
users = db.users

MONTH_NAMES = {
    "january": 1, "february": 2, "march": 3, "april": 4, "may": 5, "june": 6,
    "july": 7, "august": 8, "september": 9, "october": 10, "november": 11, "december": 12
}

def get_organization_monthly_ledger(
    org_id: str,
    month: str = "July",
    year: str = "2026",
    search: str = "",
    page: int = 1,
    limit: int = 10
):
    # Parse month & year
    m_lower = str(month).lower()
    month_num = MONTH_NAMES.get(m_lower, datetime.now(timezone.utc).month)
    try:
        year_num = int(year)
    except ValueError:
        year_num = datetime.now(timezone.utc).year

    # 1. Query all orders for this organization
    org_orders = list(orders.find({"organizationId": org_id}))

    # 2. Collect menu prices map: { menuId: { itemName: price } }
    menu_ids = set()
    for o in org_orders:
        if "menuId" in o and o["menuId"]:
            menu_ids.add(o["menuId"])

    menu_price_map = {}
    dynamic_sections_set = set()

    for mid in menu_ids:
        try:
            menu_obj = menus.find_one({"_id": ObjectId(mid)})
        except Exception:
            menu_obj = menus.find_one({"_id": mid})

        if menu_obj and "sections" in menu_obj:
            prices = {}
            for sec in menu_obj["sections"]:
                sec_name = sec.get("name", "General")
                dynamic_sections_set.add(sec_name)
                for item in sec.get("items", []):
                    item_name = item.get("name")
                    try:
                        price = float(item.get("price", 0))
                    except (ValueError, TypeError):
                        price = 0.0
                    if item_name:
                        prices[item_name] = price
            menu_price_map[mid] = prices

    if not dynamic_sections_set:
        dynamic_sections_set = {"Breakfast", "Lunch", "Snacks", "Dinner"}

    sections_list = sorted(list(dynamic_sections_set))

    # 3. Filter orders matching month & year
    matching_month_orders = []
    today_orders = []
    today_iso = datetime.now(timezone.utc).date().isoformat()

    for o in org_orders:
        created_dt = o.get("createdAt")
        if isinstance(created_dt, str):
            try:
                created_dt = datetime.fromisoformat(created_dt)
            except Exception:
                created_dt = None

        if created_dt:
            if created_dt.year == year_num and created_dt.month == month_num:
                matching_month_orders.append(o)
            if created_dt.date().isoformat() == today_iso:
                today_orders.append(o)
        else:
            # Fallback to dateOnly field if available
            d_str = o.get("dateOnly", "")
            if d_str:
                if d_str.startswith(f"{year_num}-{month_num:02d}"):
                    matching_month_orders.append(o)
                if d_str == today_iso:
                    today_orders.append(o)

    # 4. Group by student
    student_map = {}

    for o in matching_month_orders:
        sid = o.get("studentId")
        sname = o.get("studentName", "Student")
        mid = o.get("menuId")
        prices = menu_price_map.get(mid, {})

        if sid not in student_map:
            # Check user record for department if available
            u_doc = users.find_one({"userId": sid})
            dept = u_doc.get("department", "General") if u_doc else "General"
            student_map[sid] = {
                "studentId": sid,
                "studentName": sname,
                "department": dept,
                "year": str(year_num),
                "month": month.capitalize(),
                "daily_records": {},  # { date_str: { dailyCost, sections } }
                "totalMeals": 0,
                "monthlyBill": 0.0,
            }

        # Date string for daily register
        created_dt = o.get("createdAt")
        if isinstance(created_dt, datetime):
            date_str = created_dt.date().isoformat()
        else:
            date_str = o.get("dateOnly", "2026-07-01")

        if date_str not in student_map[sid]["daily_records"]:
            student_map[sid]["daily_records"][date_str] = {
                "date": date_str,
                "dailyCost": 0.0,
                "sections": {s: "N/A" for s in sections_list}
            }

        daily_entry = student_map[sid]["daily_records"][date_str]

        for item in o.get("items", []):
            iname = item.get("name")
            istatus = item.get("status", "Skip")
            if istatus == "Eat":
                item_price = prices.get(iname, 0.0)
                daily_entry["dailyCost"] += item_price
                student_map[sid]["monthlyBill"] += item_price
                student_map[sid]["totalMeals"] += 1

                # Map section status
                sec_assigned = False
                for sec_name in sections_list:
                    if sec_name.lower() in iname.lower() or not sec_assigned:
                        daily_entry["sections"][sec_name] = "Eat"
                        sec_assigned = True
                        break

    # Calculate Today's Revenue
    today_revenue = 0.0
    for o in today_orders:
        mid = o.get("menuId")
        prices = menu_price_map.get(mid, {})
        for item in o.get("items", []):
            if item.get("status") == "Eat":
                today_revenue += prices.get(item.get("name"), 0.0)

    # 5. Convert student_map to list & apply Search Filter
    all_students = list(student_map.values())
    if search:
        search_lower = search.lower()
        all_students = [
            s for s in all_students
            if search_lower in s["studentName"].lower() or search_lower in s["studentId"].lower()
        ]

    all_students.sort(key=lambda s: s["studentName"])

    # 6. Overall Monthly KPI Summary
    active_students_count = len(all_students)
    total_meals_served = sum(s["totalMeals"] for s in all_students)
    monthly_revenue = sum(s["monthlyBill"] for s in all_students)
    avg_student_bill = (monthly_revenue / active_students_count) if active_students_count > 0 else 0.0

    # 7. Pagination
    total_count = len(all_students)
    total_pages = math.ceil(total_count / limit) if total_count > 0 else 1
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paginated_students = all_students[start_idx:end_idx]

    # Format output records
    formatted_students = []
    for s in paginated_students:
        daily_reg = list(s["daily_records"].values())
        daily_reg.sort(key=lambda d: d["date"], reverse=True)
        formatted_students.append({
            "studentId": s["studentId"],
            "studentName": s["studentName"],
            "department": s["department"],
            "year": s["year"],
            "month": s["month"],
            "totalMeals": s["totalMeals"],
            "monthlyBill": round(s["monthlyBill"], 2),
            "dailyRegister": daily_reg
        })

    return {
        "orgId": org_id,
        "month": month,
        "year": str(year_num),
        "sections": sections_list,
        "kpi": {
            "activeStudents": active_students_count,
            "totalMealsServed": total_meals_served,
            "monthlyRevenue": round(monthly_revenue, 2),
            "avgStudentBill": round(avg_student_bill, 2),
            "todayRevenue": round(today_revenue, 2)
        },
        "pagination": {
            "currentPage": page,
            "pageSize": limit,
            "totalStudents": total_count,
            "totalPages": total_pages
        },
        "students": formatted_students
    }
