import { inject } from "@vercel/analytics";
import apps from "../../apps.json";
import "./style.css";

inject({ mode: import.meta.env.PROD ? "production" : "development" });

const appConfig = (apps as Record<string, { version: string } | undefined>)
	._template;
if (!appConfig) {
	const errorMsg = "Missing configuration for '_template' in apps.json";
	console.error(errorMsg);
	throw new Error(errorMsg);
}

console.log("Template app initialized!");

const appVersion = document.getElementById("app-version");
if (appVersion) {
	appVersion.textContent = `v${appConfig.version}`;
}
