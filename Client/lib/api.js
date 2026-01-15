import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

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

// Menu API calls
// export const menuAPI = {
//   getToday: (organizationId) =>
//     apiClient.get("/menu/today", { params: { organizationId } }),
//   upload: (data) => apiClient.post("/menu/upload", data),
//   getHistory: (organizationId, limit = 7) =>
//     apiClient.get("/menu/history", { params: { organizationId, limit } }),
// };

// // Orders API calls
// export const ordersAPI = {
//   submit: (data) => apiClient.post("/orders/submit", data),
//   getToday: () => apiClient.get("/orders/today"),
//   getStudent: (studentId) =>
//     apiClient.get("/orders/student", { params: { studentId } }),
//   getStats: (startDate, endDate) =>
//     apiClient.get("/orders/stats", { params: { startDate, endDate } }),
// };

// Donations API calls
export const donationsAPI = {
  mark: (data) => apiClient.post("/donations/mark", data),
  getLeftover: (organizationId, donated) =>
    apiClient.get("/donations/leftover", {
      params: { organizationId, donated },
    }),
  add: (data) => apiClient.post("/donations/add", data),
  getNGO: (startDate, endDate) =>
    apiClient.get("/donations/ngo", { params: { startDate, endDate } }),
  getStats: () => apiClient.get("/donations/stats"),
};

// Subscription API calls
export const subscriptionAPI = {
  get: (organizationId) =>
    apiClient.get("/subscription/get", { params: { organizationId } }),
  payment: (data) => apiClient.post("/subscription/payment", data),
  getPlans: () => apiClient.get("/subscription/plans"),
  trialStatus: (organizationId) =>
    apiClient.get("/subscription/trial-status", { params: { organizationId } }),
};

// AI API calls
export const aiAPI = {
  getInsights: (organizationId) =>
    apiClient.get("/ai/insights", { params: { organizationId } }),
  getSuggestions: (studentId) =>
    apiClient.get("/ai/suggestions", { params: { studentId } }),
  getAnalytics: (organizationId, date) =>
    apiClient.get("/ai/analytics", { params: { organizationId, date } }),
  getTips: (organizationId) =>
    apiClient.get("/ai/tips", { params: { organizationId } }),
};

export default apiClient;