import fs from "node:fs";
import { resolve } from "node:path";
import { type Plugin, defineConfig, loadEnv } from "vite";

function getAppDirectories(rootDir: string) {
	return fs
		.readdirSync(rootDir, { withFileTypes: true })
		.filter(
			(dirent) =>
				dirent.isDirectory() &&
				!dirent.name.startsWith(".") &&
				!dirent.name.startsWith("_") &&
				dirent.name !== "node_modules",
		)
		.map((dirent) => dirent.name);
}

function getAppsConfig(rootDir: string) {
	const appsConfigPath = resolve(rootDir, "apps.json");
	if (!fs.existsSync(appsConfigPath)) {
		return {};
	}
	try {
		const content = fs.readFileSync(appsConfigPath, "utf8");
		return JSON.parse(content);
	} catch (error) {
		throw new Error(
			`Failed to parse apps.json at ${appsConfigPath}: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

function getVersionsConfig(rootDir: string) {
	const versionsPath = resolve(rootDir, ".release-please-manifest.json");
	if (!fs.existsSync(versionsPath)) {
		return {};
	}
	try {
		const content = fs.readFileSync(versionsPath, "utf8");
		return JSON.parse(content);
	} catch (error) {
		return {};
	}
}

function getRollupInputs(rootDir: string) {
	const dirs = getAppDirectories(rootDir);
	const appsConfig = getAppsConfig(rootDir);
	const inputs: Record<string, string> = {
		main: resolve(rootDir, "index.html"),
	};
	for (const dir of dirs) {
		const indexPath = resolve(rootDir, dir, "index.html");
		if (
			fs.existsSync(indexPath) &&
			Object.prototype.hasOwnProperty.call(appsConfig, dir)
		) {
			inputs[dir] = indexPath;
		}
	}
	inputs.guidelines = resolve(rootDir, "guidelines.html");
	return inputs;
}

function generatePortalCardsPlugin(): Plugin {
	return {
		name: "generate-portal-cards",
		transformIndexHtml(html: string) {
			if (!html.includes("<!-- PORTAL_CARDS -->")) return html;

			const rootDir = __dirname;
			const dirs = getAppDirectories(rootDir);
			const appsConfig = getAppsConfig(rootDir);
			const versions = getVersionsConfig(rootDir);

			const cards: string[] = [];

			for (const dir of dirs) {
				const indexPath = resolve(rootDir, dir, "index.html");

				// アプリであることを判定 (index.html と apps.json 内にキーが存在)
				if (
					fs.existsSync(indexPath) &&
					Object.prototype.hasOwnProperty.call(appsConfig, dir)
				) {
					const appConfig = appsConfig[dir];
					const title = appConfig.title || dir;
					const description = appConfig.description || "";
					const image = appConfig.image;
					const version = versions[dir] || "0.0.0";

					// 画像HTMLの生成
					const imageHtml = image
						? `<div class="card-image"><img src="${image}" alt="${title}"></div>`
						: "";

					// カードHTMLの生成
					const cardHtml = `
    <a href="./${dir}/" class="card">
      ${imageHtml}
      <div class="card-content">
        <h2 data-i18n="app.${dir}.title">${title}</h2>
        <p data-i18n="app.${dir}.description">${description}</p>
        <span class="card-version">v${version}</span>
      </div>
    </a>`;
					cards.push(cardHtml);
				}
			}

			return html.replace("<!-- PORTAL_CARDS -->", cards.join("\n"));
		},
	};
}

function generateRobotsPlugin(): Plugin {
	return {
		name: "generate-robots-txt",
		generateBundle() {
			this.emitFile({
				type: "asset",
				fileName: "robots.txt",
				source: "User-agent: *\nAllow: /\n",
			});
		},
		configureServer(server) {
			server.middlewares.use((req, res, next) => {
				if (req.url === "/robots.txt") {
					res.setHeader("Content-Type", "text/plain");
					res.end("User-agent: *\nAllow: /\n");
					return;
				}
				next();
			});
		},
	};
}

function resolveSharedAliasPlugin(): Plugin {
	return {
		name: "resolve-shared-alias",
		enforce: "pre",
		transformIndexHtml: {
			order: "pre",
			handler(html: string) {
				// Replace @shared/ with /src/assets/shared/ for dev and build
				// This allows using <img src="@shared/..." /> in index.html (and srcset, href, etc.)
				return html.replace(
					/(src|srcset|href|data-src)=("|'|`)(.*?)@shared\/(.*?)\2/g,
					(match, attr, quote, p1, p2) => {
						const value = `${p1}@shared/${p2}`;
						return `${attr}=${quote}${value.replace(/@shared\//g, "/src/assets/shared/")}${quote}`;
					},
				);
			},
		},
	};
}

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	return {
		resolve: {
			alias: {
				"@shared": resolve(__dirname, "src/assets/shared"),
				"@shared-ts": resolve(__dirname, "src/shared"),
			},
		},
		plugins: [
			generatePortalCardsPlugin(),
			generateRobotsPlugin(),
			resolveSharedAliasPlugin(),
		],
		server: {
			port: 5181,
		},
		build: {
			rollupOptions: {
				input: getRollupInputs(__dirname),
			},
		},
	};
});
