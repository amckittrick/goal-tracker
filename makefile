backend-test:
	rm -rf ./backend/temp
	mkdir ./backend/temp
	docker compose --file compose.test.yaml up --build backend-test postgres --abort-on-container-exit --exit-code-from backend-test
	rm -rf ./backend/temp

backend-format:
	./backend/venv/bin/black backend

backend-build:
	docker build backend -t amckittrick/goal-tracker-backend:latest

backend-push:
	docker push amckittrick/goal-tracker-backend:latest

frontend-test:
	docker compose --file compose.test.yaml up --build frontend-test --abort-on-container-exit --exit-code-from frontend-test

frontend-build:
	docker build frontend -t amckittrick/goal-tracker-frontend:latest

frontend-push:
	docker push amckittrick/goal-tracker-frontend:latest

frontend-compile:
	cd frontend && npm run compile

docker-build: backend-build frontend-build

docker-push: backend-push frontend-push

restart-backend:
	docker compose up -d --build goal-tracker-backend-service

restart-frontend:
	docker compose up -d --build goal-tracker-frontend-service

run-dev:
	docker compose --file compose.dev.yaml up -d --build

run:
	docker compose up -d --build

stop:
	docker compose down

stop-dev:
	docker compose --file compose.dev.yaml down
