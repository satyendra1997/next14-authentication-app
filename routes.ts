/**
 * An array of routes that iare accessible to public
 * These routes not required authentication
 * @type {String[]}
 */
export const publicRoutes=["/","/auth/new-verification"]

/**
 * An array of routes that are not accessible to public
 * These routes not required authentication
 * these routes redirect logged in user to /settings 
 * @type {String[]},
 */
export const authRoutes=["/auth/login","/auth/register","/auth/error","/auth/reset","/auth/new-password"]
/**
 * This prefix for API authentication routes
 * routes start with this prefix used for API authentication purpose
 * 
 * @type {string}
 */

export const apiRoutePrefix='/api/auth'

/**
 * Default Redirect Path after logged in
 
 * 
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT='/settings'