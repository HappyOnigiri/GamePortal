.PHONY: ci ci-check ts-check-diff ts-fix-diff html-check-diff html-fix-diff check-ts watch-ui build-ui repomix check-ts-rules

# =============================================================================
# Any Products Makefile
# =============================================================================

# CI: 全てのチェックを実行 (自動修正あり)
ci:
	python3 scripts/run_ci.py

# CI (サーバ) 向け: 自動修正せず、差分があれば失敗
ci-check:
	$(MAKE) ts-check-diff
	$(MAKE) html-check-diff
	$(MAKE) check-ts
	$(MAKE) check-ts-rules

# ポータルのビルド
build-ui:
	npm run build

# ポータルの開発サーバー起動
watch-ui:
	npm run dev

# 各プロジェクトディレクトリで TypeScript の型チェックを実行
check-ts:
	@echo "Checking TypeScript in all projects..."
	@for dir in $$(find . -maxdepth 2 -name "tsconfig.json" -not -path "*/node_modules/*" -not -path "./_template/*" -exec dirname {} \;) ; do \
		if [ "$$dir" != "." ] && [ "$$dir" != "./_template" ]; then \
			echo "------------------------------------------------------------"; \
			echo "Checking: $$dir"; \
			(cd $$dir && npx -p typescript tsc --noEmit) || exit 1; \
		fi \
	done
	@echo "------------------------------------------------------------"
	@echo "TypeScript check completed successfully."

# カスタムルールのチェック
check-ts-rules:
	python3 scripts/check_ts_rules.py

# TS/TSXの静的解析（Biome使用）
ts-check-diff:
	@files="$$( ( \
		git diff --name-only --diff-filter=ACMRTUXB HEAD -- '*.ts' '*.tsx' 2>/dev/null; \
		git diff --cached --name-only --diff-filter=ACMRTUXB HEAD -- '*.ts' '*.tsx' 2>/dev/null; \
		git ls-files --others --exclude-standard -- '*.ts' '*.tsx' 2>/dev/null \
	) | sort -u )"; \
	if [ -z "$$files" ]; then \
		echo "No changed TS/TSX files."; \
		exit 0; \
	fi; \
	echo "$$files" | sed 's/^/ - /'; \
	npx biome check $$files

# TS/TSXの自動修正
ts-fix-diff:
	@files="$$( ( \
		git diff --name-only --diff-filter=ACMRTUXB HEAD -- '*.ts' '*.tsx' 2>/dev/null; \
		git diff --cached --name-only --diff-filter=ACMRTUXB HEAD -- '*.ts' '*.tsx' 2>/dev/null; \
		git ls-files --others --exclude-standard -- '*.ts' '*.tsx' 2>/dev/null \
	) | sort -u )"; \
	if [ -z "$$files" ]; then \
		echo "No changed TS/TSX files."; \
		exit 0; \
	fi; \
	echo "$$files" | sed 's/^/ - /'; \
	npx biome check --write $$files

# HTMLのチェック（Prettier使用）
html-check-diff:
	@files="$$( ( \
		git diff --name-only --diff-filter=ACMRTUXB HEAD -- '*.html' 2>/dev/null; \
		git diff --cached --name-only --diff-filter=ACMRTUXB HEAD -- '*.html' 2>/dev/null; \
		git ls-files --others --exclude-standard -- '*.html' 2>/dev/null \
	) | sort -u )"; \
	if [ -z "$$files" ]; then \
		echo "No changed HTML files."; \
		exit 0; \
	fi; \
	echo "$$files" | sed 's/^/ - /'; \
	npx prettier --check $$files

# HTMLの自動修正
html-fix-diff:
	@files="$$( ( \
		git diff --name-only --diff-filter=ACMRTUXB HEAD -- '*.html' 2>/dev/null; \
		git diff --cached --name-only --diff-filter=ACMRTUXB HEAD -- '*.html' 2>/dev/null; \
		git ls-files --others --exclude-standard -- '*.html' 2>/dev/null \
	) | sort -u )"; \
	if [ -z "$$files" ]; then \
		echo "No changed HTML files."; \
		exit 0; \
	fi; \
	echo "$$files" | sed 's/^/ - /'; \
	npx prettier --write $$files

# プロジェクト全体を一つのファイルにまとめる (LLM用)
repomix:
	@mkdir -p tmp/repomix
	# フルバージョン
	npx repomix --output tmp/repomix/repomix-full.txt
	# ロックファイル、画像、ライセンス等を除外したバージョン
	npx repomix --ignore "**/package-lock.json,**/node_modules/**,**/*.png,**/*.jpg,**/*.jpeg,**/*.gif,**/*.svg,**/*.ico,LICENSE,**/.agent/**" --output tmp/repomix/repomix-lite.txt
	# さらにテストファイルを除外したバージョン
	npx repomix --ignore "**/package-lock.json,**/node_modules/**,**/*.png,**/*.jpg,**/*.jpeg,**/*.gif,**/*.svg,**/*.ico,LICENSE,**/.agent/**,**/*.test.ts,**/test/**,public/robots.txt,public/sitemap.xml,public/site.webmanifest,.gitignore,scripts/*.py,Makefile,vitest.config.ts,README.md" --output tmp/repomix/repomix-lite-no-tests.txt
