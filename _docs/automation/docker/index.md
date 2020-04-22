---
title: DOCKER
permalink: /docs/automation/docker/
---
---
title: Docker - Build Image
category: Automation
---

**Login to DockerHub:**
```
docker login
```

**Build image based on Dockerfile on . and tag as x/x:latest:**
```
docker build -t x/x:latest .
```

**Push built image to DockerHub:**
```
docker push x/x:latest
```

**Spin-up container based on built image:**
```
docker run -it -d --name x --publish 8080:80 x/x:latest
```
>Will download image from DockerHub if it doesn't exist locally
---
title: Docker - Default Bridge Linux
category: Automation
---

**Edit or create /etc/docker/daemon.json:**
```
{
  "bip": "172.26.0.1/16"
}
```

***
**Sources:**
*https://success.docker.com/article/how-do-i-configure-the-default-bridge-docker0-network-for-docker-engine-to-a-different-subnet
---
title: Docker - Default Bridge MacOS
category: Automation
---

**On Docker Desktop daemon go to advanced, paste "bip" line below and restart:**
```
{
  "debug" : true,
  "experimental" : true,
  "bip" : "192.168.200.1/24"
}
```
---
title: Docker - mongoapp_database.js
category: Automation
---

```
module.exports = {
    url: 'mongodb://root:x@mongo-prod:27017/x?authSource=admin&w=1'
}
```
---
title: Docker - nodejsapp_docker-compose.yml
category: Automation
---

```
version: "2"
services:
  app-prod:
    container_name: app-prod
    image: node:10.10
    restart: always
    working_dir: /usr/src/app
    command: sh -c 'npm install >> /var/log/console.log 2>&1; npm start >> /var/log/console.log 2>&1'
    volumes:
      - ../../:/usr/src/app
      - ./log:/var/log/
    ports:
      - "3000:3000"
    links:
      - mongo-prod
    network_mode: bridge
  mongo-prod:
    container_name: mongo-prod
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: 'x'
    image: mongo:4.0.1
    restart: always
    volumes:
      - mongodata-prod:/data/db
    network_mode: bridge
    command: mongod --port 27017 --bind_ip_all
volumes:
  mongodata-prod:
```
---
title: Docker - Portainer
category: Automation
---

```
docker volume create portainer_data
docker run -d -p 9000:9000 --restart always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer
```
---
title: Docker - Random
category: Automation
---

**Pull repo from Docker hub:**
```
docker pull ubuntu:latest
```

**Run command on container and quit:**
```
docker run --name disposable --rm -it disposable:16.04 cat /etc/issue
```

**Run command on container on file mounted from current folder and quit:**
```
docker run --name disposable -v $(pwd):/mnt/ --rm -it disposable:16.04 sh -c 'echo "test" > /mnt/test'
```

**Run bash on container CMD+P CMD+Q to leave running:**
```
docker run --name disposable -v $(pwd):/mnt/ --rm -it disposable:16.04 bash
```

**Run container with systemctl daemon in background and launch bash on it:**
```
docker run --rm -ti --name disposable -d --privileged=true -p 2222:22 disposable:16.04
docker exec -ti disposable bash
```

**List Docker images:**
```
docker images
```

**List Docker running containers:**
```
docker container ls
```

**List all docker running and non-running containers:**
```
docker container ls -a
```

**Run an image as container:**
```
docker run -it <image>:<tag>  --restart always [/bin/bash]
```
> -d for daemon  
> --name for name  
> -p to expose port  

**Stop docker container gracefully:**
```
docker stop <container id|name>
```

**Stop all running containers:**
```
docker stop $(docker ps -a -q)
```

**Start docker container:**
```
docker start <container id>
```

**Start all containers:**
```
docker start $(docker ps -a -q)
```

**Kill container immediately:**
```
docker kill <container id>
```

**Output logs from docker container proxying stdout:**
```
docker logs -f <container id>
```

**Exec command on docker container:**
```
docker exec -it /bin/bash
```

**Search images in docker hub:**
```
docker search <search term>
```

**Change the name that has been randomly generated for the container:**
```
docker rename <current_container_name> <new_container_name>
```

**Take a peek inside our containers:**
```
docker stats <container_name>
```

**List of all running processes inside the container:**
docker top <container_name>

**Remove container:**
```
docker rm <container>
```
>-v to remove with volume

**Remove all existing containers:**
```
docker rm $(docker ps -a -q)
```
>If some containers are still running as a daemon, use -f (force) param immediately after rm command.

**Remove all containers with status=exited:**
```
docker rm $(docker ps -q -f status=exited)
```

**Remove image:**
```
docker rmi <image>
```
