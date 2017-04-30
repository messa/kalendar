run:
	yarn run dev

docker-image:
	docker build -t kalendar .

docker-run: docker-image
	docker run --rm -p 8000:8000 kalendar
