export const ADMIN_COOKIE_NAME = "taymaz_admin_token";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12; // 12 ساعت

export const ADMIN_ROUTES = {
  login: "/admins/login",
  dashboard: "/admins/dashboard",
} as const;

export const ADMIN_LOGIN_REDIRECT = ADMIN_ROUTES.dashboard;
