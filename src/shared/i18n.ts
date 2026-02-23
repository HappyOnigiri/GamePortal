// i18n.ts
export type Language = "ja" | "en";
export type Translations = Record<string, string>;
export type Resources = Record<Language, Translations>;

export class I18nManager {
	private currentLang: Language;
	private resources: Resources;
	private langKey = "game-portal-lang";
	private _langBtnController?: AbortController;

	constructor(resources: Resources) {
		this.resources = resources;
		this.currentLang = this.detectLanguage();
	}

	private detectLanguage(): Language {
		const savedLang = localStorage.getItem(this.langKey) as Language;
		if (savedLang === "ja" || savedLang === "en") {
			return savedLang;
		}
		// Default to Japanese if browser language starts with ja, otherwise English
		if (navigator.language.startsWith("ja")) {
			return "ja";
		}
		return "en";
	}

	public getLanguage(): Language {
		return this.currentLang;
	}

	public setLanguage(lang: Language): void {
		if (lang !== "ja" && lang !== "en") return;
		this.currentLang = lang;
		localStorage.setItem(this.langKey, lang);
		this.updatePage();
	}

	public toggleLanguage(): void {
		this.setLanguage(this.currentLang === "ja" ? "en" : "ja");
	}

	public t(key: string, params?: Record<string, string | number>): string {
		const langResources = this.resources[this.currentLang] || this.resources.en;
		let text = langResources[key];

		if (text === undefined) {
			console.warn(`[i18n] Missing translation for key: ${key}`);
			// Fallback to English if missing in ja, or return key
			if (this.currentLang !== "en" && this.resources.en[key] !== undefined) {
				text = this.resources.en[key];
			} else {
				return key;
			}
		}

		if (params) {
			for (const [pKey, pVal] of Object.entries(params)) {
				text = text.replaceAll(`{${String(pKey)}}`, String(pVal));
			}
		}
		return text;
	}

	public updatePage(): void {
		document.documentElement.lang = this.currentLang;

		// update textContent
		const elements = document.querySelectorAll<HTMLElement>("[data-i18n]");
		for (const el of elements) {
			const key = el.getAttribute("data-i18n");
			if (key) {
				if (el.hasAttribute("data-i18n-html")) {
					// RESTRICTION: Only known-trusted translations should be used with data-i18n-html to prevent XSS.
					// Assert that the translation doesn't unexpectedly contain harmful script tags.
					const translated = this.t(key);
					if (translated.includes("<script")) {
						console.error(
							"[i18n] Possible XSS detected in translation key:",
							key,
						);
					}
					el.innerHTML = translated;
				} else {
					el.textContent = this.t(key);
				}
			}
		}

		// update attributes (e.g., data-i18n-attr="placeholder:attr.placeholder.auto,title:attr.title.zoom_toggle")
		const attrElements =
			document.querySelectorAll<HTMLElement>("[data-i18n-attr]");
		for (const el of attrElements) {
			const attrDef = el.getAttribute("data-i18n-attr");
			if (attrDef) {
				const parts = attrDef.split(",");
				for (const part of parts) {
					const [attrName, key] = part.split(":");
					if (attrName && key) {
						el.setAttribute(attrName.trim(), this.t(key.trim()));
					}
				}
			}
		}
	}

	public setupLanguageButtons(): void {
		if (this._langBtnController) {
			this._langBtnController.abort();
		}
		this._langBtnController = new AbortController();

		const btns = document.querySelectorAll<HTMLElement>("[data-lang-btn]");
		for (const btn of btns) {
			// 初期状態の設定
			const lang = btn.getAttribute("data-lang-btn");
			if (lang === this.currentLang) {
				btn.classList.add("active");
			} else {
				btn.classList.remove("active");
			}

			// クリックイベントの登録 (AbortControllerにより重複防止)
			btn.addEventListener(
				"click",
				(e) => {
					e.preventDefault();
					const targetLang = btn.getAttribute("data-lang-btn") as Language;
					if (targetLang) {
						this.setLanguage(targetLang);
						// activeクラスの付け替え
						for (const b of btns) {
							b.classList.remove("active");
						}
						btn.classList.add("active");
					}
				},
				{ signal: this._langBtnController.signal },
			);
		}
	}
}
