# Make commands for common interface

.PHONY: clean
clean:
	rm -rf build/*
	rm -rf node_modules/*

.PHONY: install
install:
	npm install

.PHONY: dev
dev:
	PORT=3333 node server.js

.PHONY: run
run:
	NODE_ENV=production npm run start

.PHONY: build
build:
	rm -rf build/*
	NODE_ENV=production npm run build

.PHONY: deploy
deploy:
	gcloud --verbosity=debug --project janky-shop app deploy ./app.yaml --version $(filter-out $@,$(MAKECMDGOALS))

.PHONY: test
test:
	npm test
