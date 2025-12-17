import { create } from "zustand";

const readRoleFromStorage = () => {
  const raw = localStorage.getItem("role");
  if (!raw) return null;
  const normalized = String(raw).trim().toUpperCase();
  if (normalized === "ADMIN" || normalized === "USER") return normalized;
  return null;
};

const useAuthStore = create((set) => ({
  isLoggedIn: !!localStorage.getItem("access_token"),
  role: readRoleFromStorage(),
  login: () => set({ isLoggedIn: true, role: readRoleFromStorage() }),
  logout: () => set({ isLoggedIn: false, role: null }),
}));

export default useAuthStore;
