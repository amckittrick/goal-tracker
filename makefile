backend-test:
	rm -rf ./backend/temp
	mkdir ./backend/temp
	docker compose -f compose.test.yaml up --build backend-test postgres --abort-on-container-exit --exit-code-from backend-test
	rm -rf ./backend/temp

backend-format:
	./backend/venv/bin/black backend

backend-build:
	docker build backend -t amckittrick/goal-tracker-backend:latest

backend-push:
	docker push amckittrick/goal-tracker-backend:latest

frontend-test:
	docker compose -f compose.test.yaml up --build frontend-test --with-dependencies --abort-on-container-exit --exit-code-from frontend-test

frontend-build:
	docker build frontend -t amckittrick/goal-tracker-frontend:latest

frontend-push:
	docker push amckittrick/goal-tracker-frontend:latest

docker-build: backend-build frontend-build

docker-push: backend-push frontend-push

run:
	docker compose up -d --build
