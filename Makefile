.PHONY: up build down test logs

down:
	docker-compose down -v

build:
	docker-compose build

up: build
	docker-compose up -d

logs: up
	docker-compose logs -f
