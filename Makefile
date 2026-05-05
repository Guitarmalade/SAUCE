install:
	pnpm install

dev:
	pnpm dev

prototype-zip:
	@mkdir -p references/exports
	@stamp=$$(date +"%Y-%m-%d-%H%M%S"); \
	out="references/exports/Guitarmalade-SAUCE-App-$$stamp.zip"; \
	cd references && zip -rq "exports/$$(basename "$$out")" guitarmalade-sauce-pack; \
	echo "$$out"

build:
	pnpm build

lint:
	pnpm lint

typecheck:
	pnpm typecheck

test:
	pnpm test
