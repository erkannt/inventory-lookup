.PHONY: dev test

.DEFAULT_GOAL := check-and-fix

node_modules: package.json package-lock.json
	npm install

check-and-fix: typecheck test fix

dev: node_modules
	npx ts-node-dev --project tsconfig.json --transpile-only --watch src ./src/index.ts

prod: check-and-fix
	docker build . -t dmun-inventar-scanner && docker run -p 8080:8080 dmun-inventar-scanner

test: node_modules
	npx jest --passWithNoTests

typecheck: node_modules
	npx tsc --noEmit

lint: node_modules
	npx eslint .
	npx prettier --ignore-unknown --check '**'

fix: node_modules
	npx eslint --fix .
	npx prettier --ignore-unknown --check '**' --write
