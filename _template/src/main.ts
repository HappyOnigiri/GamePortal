import { inject } from "@vercel/analytics";

import "./style.css";

inject({ mode: import.meta.env.PROD ? "production" : "development" });

import releaseManifest from "../../.release-please-manifest.json";

const appVersionString =
	(releaseManifest as Record<string, string>)._template || "1.0.0"; // Fallback for template

console.log("Template app initialized!");

const appVersion = document.getElementById("app-version");
if (appVersion) {
	appVersion.textContent = `v${appVersionString}`;
}
