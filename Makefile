docker_image_name=kalendar
container_name_prefix=kalender_messa_cz
live_port=10006
temp_port=10007
docker_deploy_args=--restart unless-stopped -e "KALENDAR_MESSA_CZ_GA_ID=$(shell cat ~/.config/kalendar_messa_cz_ga_id)"


run:
	yarn run dev

docker-image:
	docker build -t $(docker_image_name) .

docker-run: docker-image
	docker run --rm -p 8000:8000 $(docker_image_name)

deploy:
	git pull --ff-only
	make docker-image
	make deploy-temp
	sleep 5
	curl -f http://localhost:$(temp_port)/ || ( make stop-temp; false )
	make deploy-live
	sleep 5
	curl -f http://localhost:$(live_port)/
	make stop-temp
	@echo Done

deploy-live:
	docker stop $(container_name_prefix)_live || true
	docker rm   $(container_name_prefix)_live || true
	docker run -d --name $(container_name_prefix)_live -p $(live_port):8000 $(docker_deploy_args) $(docker_image_name)

deploy-temp:
	docker stop $(container_name_prefix)_temp || true
	docker rm   $(container_name_prefix)_temp || true
	docker run -d --name $(container_name_prefix)_temp -p $(temp_port):8000 $(docker_deploy_args) $(docker_image_name)

stop-temp:
	docker stop $(container_name_prefix)_temp || true

