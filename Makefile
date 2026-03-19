.PHONY: ci ci-check ts-check-diff ts-fix-diff html-check-diff html-fix-diff check-ts watch-ui build-ui repomix check-ts-rules sync-rule setup
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
	$(MAKE) check-sushi-data

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

# 寿司データのチェック
check-sushi-data:
	@echo "Checking sushi data in quantum-maguro..."
	@cd quantum-maguro && \
	scripts=$$(ls check_scripts/*.mjs check_scripts/*.js check_scripts/*.py check_scripts/*.sh 2>/dev/null); \
	if [ -z "$$scripts" ]; then \
		echo "No check scripts found in check_scripts/"; \
	else \
		for script in $$scripts; do \
			echo "Running $$script..."; \
			case "$$script" in \
				*.py) python3 $$script || exit 1 ;; \
				*.sh) sh $$script || exit 1 ;; \
				*) node $$script || exit 1 ;; \
			esac; \
		done; \
	fi

# TS/TSXの静的解析（Biome使用）
ts-check-diff:
	@files="$$( ( \
		if [ "$$CI" = "true" ]; then \
			git ls-files '*.ts' '*.tsx' | grep -v '^_template/'; \
		else \
			git diff --name-only --diff-filter=ACMRTUXB HEAD -- '*.ts' '*.tsx' 2>/dev/null; \
			git diff --cached --name-only --diff-filter=ACMRTUXB HEAD -- '*.ts' '*.tsx' 2>/dev/null; \
			git ls-files --others --exclude-standard -- '*.ts' '*.tsx' 2>/dev/null; \
		fi \
	) | sort -u )"; \
	if [ -z "$$files" ]; then \
		echo "No TS/TSX files to check."; \
		exit 0; \
	fi; \
	echo "Checking TS/TSX files:"; \
	echo "$$files" | sed 's/^/ - /'; \
	npx biome check $$files

# TS/TSXの自動修正
ts-fix-diff:
	@files="$$( ( \
		if [ "$$CI" = "true" ]; then \
			git ls-files '*.ts' '*.tsx' | grep -v '^_template/'; \
		else \
			git diff --name-only --diff-filter=ACMRTUXB HEAD -- '*.ts' '*.tsx' 2>/dev/null; \
			git diff --cached --name-only --diff-filter=ACMRTUXB HEAD -- '*.ts' '*.tsx' 2>/dev/null; \
			git ls-files --others --exclude-standard -- '*.ts' '*.tsx' 2>/dev/null; \
		fi \
	) | sort -u )"; \
	if [ -z "$$files" ]; then \
		echo "No TS/TSX files to fix."; \
		exit 0; \
	fi; \
	echo "Fixing TS/TSX files:"; \
	echo "$$files" | sed 's/^/ - /'; \
	npx biome check --write $$files

# HTMLのチェック（Prettier使用）
html-check-diff:
	@files="$$( ( \
		if [ "$$CI" = "true" ]; then \
			git ls-files '*.html' | grep -v '^_template/'; \
		else \
			git diff --name-only --diff-filter=ACMRTUXB HEAD -- '*.html' 2>/dev/null; \
			git diff --cached --name-only --diff-filter=ACMRTUXB HEAD -- '*.html' 2>/dev/null; \
			git ls-files --others --exclude-standard -- '*.html' 2>/dev/null; \
		fi \
	) | sort -u )"; \
	if [ -z "$$files" ]; then \
		echo "No HTML files to check."; \
		exit 0; \
	fi; \
	echo "Checking HTML files:"; \
	echo "$$files" | sed 's/^/ - /'; \
	npx prettier --check $$files

# HTMLの自動修正
html-fix-diff:
	@files="$$( ( \
		if [ "$$CI" = "true" ]; then \
			git ls-files '*.html' | grep -v '^_template/'; \
		else \
			git diff --name-only --diff-filter=ACMRTUXB HEAD -- '*.html' 2>/dev/null; \
			git diff --cached --name-only --diff-filter=ACMRTUXB HEAD -- '*.html' 2>/dev/null; \
			git ls-files --others --exclude-standard -- '*.html' 2>/dev/null; \
		fi \
	) | sort -u )"; \
	if [ -z "$$files" ]; then \
		echo "No HTML files to fix."; \
		exit 0; \
	fi; \
	echo "Fixing HTML files:"; \
	echo "$$files" | sed 's/^/ - /'; \
	npx prettier --write $$files

# 各アプリケーションの repomix を作成
repomix-apps:
	@mkdir -p tmp/repomix/apps
	@apps=$$(jq -r 'keys[] | select(. != "_template")' apps.json); \
	for app in $$apps; do \
		echo "Generating repomix for $$app..."; \
		npx repomix $$app --ignore "**/node_modules/**,**/*.png,**/*.jpg,**/*.jpeg,**/*.gif,**/*.svg,**/*.ico" --output tmp/repomix/apps/$$app.txt; \
	done

# プロジェクト全体を一つのファイルにまとめる (LLM用)
repomix: repomix-apps
	@mkdir -p tmp/repomix
	# フルバージョン
	npx repomix --output tmp/repomix/repomix-full.txt
	# ロックファイル、画像、ライセンス等を除外したバージョン
	npx repomix --ignore "**/package-lock.json,**/node_modules/**,**/*.png,**/*.jpg,**/*.jpeg,**/*.gif,**/*.svg,**/*.ico,LICENSE,**/.agent/**" --output tmp/repomix/repomix-lite.txt
	# さらにテストファイルを除外したバージョン
	npx repomix --ignore "**/package-lock.json,**/node_modules/**,**/*.png,**/*.jpg,**/*.jpeg,**/*.gif,**/*.svg,**/*.ico,LICENSE,**/.agent/**,**/*.test.ts,**/test/**,public/robots.txt,public/sitemap.xml,public/site.webmanifest,.gitignore,scripts/*.py,Makefile,vitest.config.ts,README.md" --output tmp/repomix/repomix-lite-no-tests.txt

# rule configuration の適用
sync-rule:
	@sh scripts/sync_rule.sh

setup:
	@if [ -e .git/hooks/post-merge ]; then echo "setup: skipping post-merge (already exists)"; else printf '#!/bin/sh\nmake sync-rule\n' > .git/hooks/post-merge && chmod +x .git/hooks/post-merge; fi
	@if [ -e .git/hooks/post-checkout ]; then echo "setup: skipping post-checkout (already exists)"; else printf '#!/bin/sh\nmake sync-rule\n' > .git/hooks/post-checkout && chmod +x .git/hooks/post-checkout; fi
	@echo "setup: git hooks installed"
	$(MAKE) sync-rule
	npm ci
