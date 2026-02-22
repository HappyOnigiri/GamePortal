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

function getRollupInputs(rootDir: string) {
	const dirs = getAppDirectories(rootDir);
	const inputs: Record<string, string> = {
		main: resolve(rootDir, "index.html"),
	};
	for (const dir of dirs) {
		const indexPath = resolve(rootDir, dir, "index.html");
		const appConfigPath = resolve(rootDir, dir, "app.json");
		if (fs.existsSync(indexPath) && fs.existsSync(appConfigPath)) {
			inputs[dir] = indexPath;
		}
	}
	return inputs;
}

function generatePortalCardsPlugin(): Plugin {
	return {
		name: "generate-portal-cards",
		transformIndexHtml(html: string) {
			if (!html.includes("<!-- PORTAL_CARDS -->")) return html;

			const rootDir = __dirname;
			const dirs = getAppDirectories(rootDir);

			const cards: string[] = [];

			for (const dir of dirs) {
				const indexPath = resolve(rootDir, dir, "index.html");
				const appConfigPath = resolve(rootDir, dir, "app.json");

				// アプリであることを判定 (index.html と app.json の両方が存在)
				if (fs.existsSync(indexPath) && fs.existsSync(appConfigPath)) {
					const appConfig = JSON.parse(fs.readFileSync(appConfigPath, "utf8"));
					const title = appConfig.title || dir;
					const description = appConfig.description || "";
					const image = appConfig.image;

					// 画像HTMLの生成
					const imageHtml = image
						? `<div class="card-image"><img src="${image}" alt="${title}"></div>`
						: "";

					// カードHTMLの生成
					const cardHtml = `
    <a href="./${dir}/" class="card">
      ${imageHtml}
      <div class="card-content">
        <h2>${title}</h2>
        <p>${description}</p>
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

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	return {
		plugins: [generatePortalCardsPlugin(), generateRobotsPlugin()],
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
