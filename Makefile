# SHELL:=/bin/bash
packageversion = $(shell cat package.json | jq -r '.version')

.EXPORT_ALL_VARIABLES:
docker_image_cjs=$(shell docker images -q bgg-ts-client:cjs)
docker_image_esm=$(shell docker images -q bgg-ts-client:esm)
docker_image_react=$(shell docker images -q bgg-ts-client:react)

cjs-build-tag:
	@echo 'create tag cjs -> package version build test: $(packageversion)'
	docker build --pull --rm -f "Dockerfile.buildtest.cjs" -t bgg-ts-client:cjs --build-arg VERSION=$(packageversion) "."
cjs-run:
	docker run bgg-ts-client:cjs
cjs-build-run: cjs-build-tag
	docker run bgg-ts-client:cjs
esm-build-tag:
	@echo 'create tag esm -> package version build test: $(packageversion)'
	docker build --pull --rm -f "Dockerfile.buildtest.esm" -t bgg-ts-client:esm --build-arg VERSION=$(packageversion) "."
esm-build-run: esm-build-tag
	docker run bgg-ts-client:esm
react-build-tag:
	@echo 'create tag react -> package version build test: $(packageversion)'
	docker build --pull --rm -f "Dockerfile.buildtest.react" -t bgg-ts-client:react --build-arg VERSION=$(packageversion) "."
react-build-run: react-build-tag
	docker run -p 3000:3000 bgg-ts-client:react
build-run-all: cjs-build-run esm-build-run react-build-run