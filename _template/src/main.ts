import appConfig from "../app.json";
import "./style.css";

console.log("Template app initialized!");

const appVersion = document.getElementById("app-version");
if (appVersion) {
	appVersion.textContent = `v${appConfig.version}`;
}
