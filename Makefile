.PHONY: ci build-ui watch-ui check-ts lint

# =============================================================================
# Any Products Makefile
# =============================================================================

# CI: 全てのチェックを実行
ci: check-ts

# ポータルのビルド
build-ui:
	npm run build

# ポータルの開発サーバー起動
watch-ui:
	npm run dev

# 各プロジェクトディレクトリで TypeScript の型チェックを実行
# tsconfig.json があるディレクトリを探して tsc --noEmit を実行します
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
