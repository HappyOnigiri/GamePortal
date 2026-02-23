import apps from "../../apps.json";
import "./style.css";

const appConfig = apps._template;

console.log("Template app initialized!");

const appVersion = document.getElementById("app-version");
if (appVersion) {
	appVersion.textContent = `v${appConfig.version}`;
}
