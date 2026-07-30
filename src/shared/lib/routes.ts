/**
 * Centralized route configuration for the application
 */
export const ROUTES = {
  HOME: "/",
  PROTECTED: "/protected",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  FORGOT_PASSWORD: "/forgot-password",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

/**
 * Helper function to get route path
 */
export const getRoute = (route: RouteKey): RoutePath => {
  return ROUTES[route];
};

/**
 * Routes that require authentication
 */
export const PROTECTED_ROUTES: RoutePath[] = [ROUTES.PROTECTED];

/**
 * Routes that should redirect authenticated users away
 */
export const PUBLIC_ONLY_ROUTES: RoutePath[] = [
  // Currently none, but can be added later (e.g., standalone register/signup pages)
];

/**
 * Check if a route requires authentication
 */
export const isProtectedRoute = (path: string): boolean => {
  return PROTECTED_ROUTES.includes(path as RoutePath);
};

/**
 * Check if a route should redirect authenticated users
 */
export const isPublicOnlyRoute = (path: string): boolean => {
  return PUBLIC_ONLY_ROUTES.includes(path as RoutePath);
};
