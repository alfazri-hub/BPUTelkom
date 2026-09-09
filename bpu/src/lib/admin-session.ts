const ADMIN_SESSION_KEY = "bpu-admin-session";

export function setAdminSession() {
  sessionStorage.setItem(ADMIN_SESSION_KEY, "active");
}

export function hasAdminSession() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "active";
}

export function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}
