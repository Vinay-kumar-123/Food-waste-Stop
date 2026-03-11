import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://food-waste-stop-fastapi.onrender.com";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* 🔐 AUTO ATTACH JWT TOKEN */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // 🔑 SAME token jo login pe save hota hai
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);




/* AUTH */
export const authAPI = {
  signup: (data) => apiClient.post("/auth/signup", data),
  login: (data) => apiClient.post("/auth/login", data),
};

/* ORGANIZATION */
export const organizationAPI = {
  generateOrgId: () => apiClient.get("/organization/generate-id"),
};

/* MENU */
export const menuAPI = {
  upload: (data) => apiClient.post("/menu/upload", data),
  getActive: (orgId) => apiClient.get(`/menu/active/${orgId}`),
};

/* ORDERS */
export const ordersAPI = {
  submit: (data) => apiClient.post("/orders/submit", data),
  getStudentHistory: (studentId) =>
    apiClient.get(`/orders/student/${studentId}`),
};

/* DASHBOARD */
export const dashboardAPI = {
  todaySummary: (orgId, menuId) =>
    apiClient.get(`/dashboard/org/today/${orgId}/${menuId}`),
};

/* 🔔 SUBSCRIPTION */
export const subscriptionAPI = {
  status: () => apiClient.get("/subscription/status"),
  info: () => apiClient.get("/subscription/info"),
  createOrder: () => apiClient.post("/subscription/create-order"),
  verifyPayment: (data) => apiClient.post("/subscription/verify-payment", data),
};


export const adminAPI = {
  stats: () => apiClient.get("/admin/stats"),
};