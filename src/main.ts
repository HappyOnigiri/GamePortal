import { I18nManager, type Resources } from "@shared-ts/i18n";
import { inject } from "@vercel/analytics";
import apps from "../apps.json";

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
	// @ts-expect-error config object can have en properties
	resources.en[`app.${dir}.title`] = config.title_en || config.title;
	// @ts-expect-error config object can have en properties
	resources.en[`app.${dir}.description`] =
		config.description_en || config.description;
}

const i18n = new I18nManager(resources);
i18n.updatePage();
i18n.setupLanguageButtons();

inject({ mode: import.meta.env.PROD ? "production" : "development" });
