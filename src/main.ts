import { I18nManager, type Resources } from "@shared-ts/i18n";
import { inject } from "@vercel/analytics";
import appsRaw from "../apps.json";

interface AppConfig {
	title: string;
	title_en?: string;
	version: string;
	description: string;
	description_en?: string;
	image?: string;
}

const apps = appsRaw as Record<string, AppConfig>;

const resources: Resources = {
	ja: {
		"portal.title": "ONIGIRI GAME PORTAL",
		"portal.copyright": "&copy; 2026 HappyOnigiri. All rights reserved.",
	},
	en: {
		"portal.title": "ONIGIRI GAME PORTAL",
		"portal.copyright": "&copy; 2026 HappyOnigiri. All rights reserved.",
	},
};

// apps.json からタイトルと説明を抽出してリソースに追加
for (const [dir, config] of Object.entries(apps)) {
	if (dir.startsWith("_") || dir.startsWith(".")) continue;
	resources.ja[`app.${dir}.title`] = config.title;
	resources.ja[`app.${dir}.description`] = config.description;
	resources.en[`app.${dir}.title`] = config.title_en || config.title;
	resources.en[`app.${dir}.description`] =
		config.description_en || config.description;
}

const i18n = new I18nManager(resources);
i18n.updatePage();
i18n.setupLanguageButtons();

inject({ mode: import.meta.env.PROD ? "production" : "development" });
