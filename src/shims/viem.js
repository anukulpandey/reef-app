// Shim module for `viem`.
//
// Some dependencies (e.g. @formo/analytics) try to `require("viem")` optionally.
// We don't need viem in reef-app, but Webpack still needs the module to exist at
// build time. This shim makes the require succeed while behaving as "viem not available".
//
// Intentionally exports nothing.
module.exports = {};

