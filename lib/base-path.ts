/**
 * GitHub Pages serves this repo from https://<user>.github.io/<repo>/, so the
 * app runs under a basePath. `next/link` and the router apply it automatically;
 * `next/image` src and plain `<a href>`/metadata paths do NOT — those must be
 * wrapped in `asset()`. See node_modules/next/dist/docs/.../basePath.md.
 */
export const basePath = "/portfolio_website";

/** Prefix a /public-relative path with the deployment basePath. */
export const asset = (p: string) => `${basePath}${p}`;
