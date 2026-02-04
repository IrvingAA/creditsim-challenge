ENV_FILE := $(if $(wildcard .env),.env,.env.example)

.PHONY: dev-up dev-down dev-logs api-local test-compose dev-migrate
dev-migrate:
	docker compose --env-file $(ENV_FILE) -f compose.dev.yml up -d --build db redis
	docker compose --env-file $(ENV_FILE) -f compose.dev.yml up --build --force-recreate migrate

dev-up:
	docker compose --env-file $(ENV_FILE) -f compose.dev.yml up -d --build db redis
	docker compose --env-file $(ENV_FILE) -f compose.dev.yml up --build --force-recreate migrate

dev-down:
	docker compose --env-file $(ENV_FILE) -f compose.dev.yml down -v --remove-orphans

dev-logs:
	docker compose -f compose.dev.yml logs -f

api-local:
	cd creditsim-api && python -m venv .venv && . .venv/bin/activate && \
	pip install -U pip && pip install . && \
	uvicorn app.main:app --reload

test-compose:
	docker compose --env-file $(ENV_FILE) -f compose.test.yml up --build --abort-on-container-exit --exit-code-from api_test --remove-orphans
	docker compose -f compose.test.yml down -v

# Convenience aliases for common Make targets
.PHONY: up down logs ps
up:
	$(MAKE) dev-up

down:
	$(MAKE) dev-down

logs:
	docker compose -f compose.dev.yml logs -f

ps:
	docker compose -f compose.dev.yml ps
