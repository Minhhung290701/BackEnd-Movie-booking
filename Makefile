up-dev:
	@ docker-compose --project-name node-app -f deploy/dev/docker-compose.yaml up -d --force-recreate --build 