import { I18nManager, type Resources } from "@shared-ts/i18n";
import { inject } from "@vercel/analytics";

const resources: Resources = {
	ja: {
		"gl.title": "作品利用ガイドライン - ONIGIRI GAME PORTAL",
		"gl.header": "GUIDELINES",
		"gl.subtitle": "作品利用ガイドライン",
		"gl.card_title": "実況・配信・収益化 大歓迎！",
		"gl.rule.monetization":
			"実況・配信・動画投稿による<strong>収益化OK</strong>です！",
		"gl.rule.no_permission":
			"事前の連絡や<strong>許可は不要</strong>です。自由に遊んでください！",
		"gl.rule.processing":
			"<strong>素材の加工OK！</strong> 動画のサムネイル作成などに自由に使ってください。",
		"gl.rule.link":
			"ポータルサイトや各ゲームへのリンクはあると嬉しいですが、<strong>必須ではありません</strong>。",
		"gl.assets_title": "素材・アセット",
		"gl.assets_desc":
			"動画制作やサムネイルに使える画像素材です。クリックすると別タブで表示されます。",
		"gl.back_to_portal": "← ポータルへ戻る",
		"gl.app_name.mesugaki_pong": "メスガキポンポン",
		"gl.app_name.quantum_maguro": "量子マグロ亭",
		"portal.copyright": "&copy; 2026 HappyOnigiri. All rights reserved.",
	},
	en: {
		"gl.title": "Streaming Guidelines - ONIGIRI GAME PORTAL",
		"gl.header": "GUIDELINES",
		"gl.subtitle": "Streaming Guidelines",
		"gl.card_title": "Streaming & Monetization are Welcome!",
		"gl.rule.monetization":
			"<strong>Monetization</strong> via streaming and video uploads is <strong>OK</strong>!",
		"gl.rule.no_permission":
			"<strong>No prior contact or permission</strong> is required. Feel free to play!",
		"gl.rule.processing":
			"<strong>Editing assets is OK!</strong> Feel free to use them for thumbnails, etc.",
		"gl.rule.link":
			"Links to the portal or games are appreciated, but <strong>not required</strong>.",
		"gl.assets_title": "Materials & Assets",
		"gl.assets_desc":
			"Image assets for video production and thumbnails. Click to open in a new tab.",
		"gl.back_to_portal": "← Back to Portal",
		"gl.app_name.mesugaki_pong": "MESUGAKI PONG",
		"gl.app_name.quantum_maguro": "Quantum Maguro",
		"portal.copyright": "&copy; 2026 HappyOnigiri. All rights reserved.",
	},
};

const i18n = new I18nManager(resources);
i18n.updatePage();
i18n.setupLanguageButtons();

inject({ mode: import.meta.env.PROD ? "production" : "development" });
