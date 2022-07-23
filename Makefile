.PHONY: dev test

.DEFAULT_GOAL := check-and-fix

node_modules: package.json package-lock.json
	npm install

check-and-fix: typecheck test fix

dev: 
	docker-compose up --build --abort-on-container-exit

prod: check-and-fix
	docker-compose up --build -f docker-compose.prod.yaml

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
