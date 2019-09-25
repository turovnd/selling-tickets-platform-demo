# DEMO Selling tickets platform
The product is NOT working, the full version of the platform is in private repository.

The project has two parts:
1. Backend  - API Server (Express.js)
2. Frontend - Vue application 


## Production guide
1. Install `docker-compose` on Ubuntu 18.04 ([link](https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-18-04)), 
`docker` ([link](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04)).
Additional: `node v12` ([link](https://websiteforstudents.com/how-to-install-node-js-10-11-12-on-ubuntu-16-04-18-04-via-apt-and-snap/)),
firewall `ufw` ([link](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-18-04)), 
`git` ([link](https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu-18-04)).

    ```
    # Install docker-compose
    sudo apt update
    sudo curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    docker-compose --version
    
    # Install docker
    sudo apt update
    sudo apt install apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
    sudo apt update
    sudo apt install docker-ce
    sudo systemctl status docker
    
    # Install node.js
    curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
    sudo apt install nodejs
    node -v
    
    # Install git
    sudo apt update
    sudo apt install git
    git --version
    ```
2. Edit configurations files:
    - Backend: move to `backend` directory and create `.env` file from `.env.sample`. Change all `SENDPULSE_*` values.
    - Frontend: move to `frontend/src/congig` directory and edit the `index.js` file if some values were changed. 
    It is required to add a new case in the next format:
        ```
        switch (location) {
            ...
            case '138.68.44.224':
                API = 'http://138.68.44.224:3100';
                maxDiscount = 0.2;
                break;
            ...
        }
        ```
3. Docker-compose file (`docker-compose.yml`)
    - `MONGO_INITDB_ROOT_USERNAME` - Admin user name for MongoDB
    - `MONGO_INITDB_ROOT_PASSWORD` - Admin user password for MongoDB (should be hard)
    - `ME_CONFIG_MONGODB_ADMINUSERNAME` same as `MONGO_INITDB_ROOT_USERNAME`
    - `ME_CONFIG_MONGODB_ADMINPASSWORD` same as `MONGO_INITDB_ROOT_PASSWORD`
    - `ME_CONFIG_SITE_BASEURL` the url should be the same as route in `nginx.conf` (default: `/database-secure`)
    - `ME_CONFIG_BASICAUTH_USERNAME` username for login to Mongo Express UI 
    - `ME_CONFIG_BASICAUTH_PASSWORD` password for login to Mongo Express UI
    - `ME_CONFIG_MONGODB_AUTH_DATABASE` same as `MONGO_DATABASE` in `backend/.env` file 
    - `ME_CONFIG_MONGODB_AUTH_USERNAME` same as `MONGO_USER` in `backend/.env` file
    - `ME_CONFIG_MONGODB_AUTH_PASSWORD` same as `MONGO_PASSWORD` in `backend/.env` file
4. Go to the project directory and run the command for creating components:
    ```
    docker-compose up -d --build
    ```
    For stop the containers use:
    ```
    docker-compose down
    ```


## Deployment to the site
The NGINX web server is used for deploying the frontend to site. 
1. You need to update the next lines in `nginx.conf` file and rerun the containers.
    ```
    server {
        ...
        server_name  site.com;
        ...
    }
    ```
2. Update the config files of frontend `frontend/src/congig/congig.js` and form `form/js/config.js`. 
The path to API server is `https://site.com/api`


## Adding new SSL
If the new SSL sertificate was generated, it's required to copy sertificates and rename them. 
Basically, sertificates located in `/etc/ssl/private/site_name.key` and `/etc/ssl/certs/site_name.pem`.
It's required to copy them to the folder `~/ssl` in the project directory and rename them to `private.key` 
and `public.pem`.


## Cloudflare caching
If the API endpoint is not loaded (always redirection to `not-found` page), it's required to add page rule in 
Cloudflare service:
1. Go to `Page rules` page
2. Click on `Create Page Rule`
3. Enter URL mask: `site.com/api/v1/*`
4. Add the next rules:
    - Always online: OFF
    - Cache level: BYPASS
5. Click on `Save and deploy` button


## Developer guide

### Docker
Contains docker-compose file for creating a backend, frontend, DB containers via Dockerfiles:
- `backend/Dockerfile` Dockerfile for running backend
- `frontend/Dockerfile` Dockerfile for running frontend

#### Useful commands
They should be run in the directory with `Dockerfile` 
- Building the image
    ```
    docker build -t container_name .
    ```
- Run the image
    ```
    docker run -p 3200:3100 -d container_name
    ``` 
-  Go inside the container
    ```
    docker exec -it container_name /bin/bash 
    ```  
-  Get logs
    ```
    docker ps
    docker logs <container id> 
    ```  


#### Instruction
1. For creating all containers use the command: (`-d` optional - creates a demon)
    ```
    docker-compose up -d
    ``` 
3. For stop all containers use the command:
    ```
    docker-compose down
    ``` 
    

### Backend
API Server on Express application  

#### Backend structure
- `_source` consist of that returns to the front. It was done to simplify making changes in 
park description, ticket prices, courses. In the first running of the server the data import to DB if it does not there.
- `controllers` used for business logic of application
- `models` describe the table that creates in DB. File name is a table name. 
- `routes` describe the routes for  API server
- `services` the third-party services that integrated to the app 
- `static` stores the static data that shows in UI
- `.env.sample` file for creating `.env`

#### Instruction
1. Navigate to the `backend` folder and run the command for installing all dependencies:
    ```
    npm install
    ```
2. Create the `.env` file from the `.env.sample` and change settings
3. For running the server on the `SERVER_PORT` use the command:
   - For development
        ```
        npm run dev
        ```
   - For production (it runs demon via `pm2`. If `pm2` does not install use: `npm install -g pm2`)
        ```
        npm run prod
        ```  
        
### Frontend
        
#### Backend structure
- `public` the public data of the frontend part, include index.html, favicon, robot.txt files
- `dist` the production code of application
- `src` the source code of application
    - `api` module for work with API endpoint, it has functions for simplify making CRUD requests and set query attributes:
        - `.submit(method, url, data)` Send custom request with data
        - `.all()` Send GET request for retrieve all entities from the endpoint
        - `.find(id)` Send GET request for retrieve entity by id from the endpoint
        - `.create(data)` Send POST request with data to the endpoint
        - `.update(id, data)` Send PUT request with id and data to the endpoint
        - `.destroy(id)` Send DELETE request with id to the endpoint
        - `.setParameters({key: value})` Set query parameters to the request `?key=value`
        - `.setParameter(key, value)` Set query parameter to the request `?key=value`
        - `.removeParameters([key,key1])` Remove query parameters from the request
        - `.removeParameter(key)` Remove query parameter from the request
        - `.getParameterString()` Return query parameter string `?key=value&key1=value1`
    - `assets` static files that will copy while building
        - `images` all custom images
        - `scss` styles
    - `components` common components that used in views
    - `config` configuration files. Has the API endpoint address
    - `locale` i18n translation files
    - `plugins` plugins that add to vue by `Vue.use` or `Vue.component`
    - `routes` the description of routes in the application 
    - `store` Vuex store
    - `transformers` used for transforming API responses before commit to Vuex
        - `.fetchCollections(array)` method used to transform fetched collections by calling `.fetch` method
        - `.fetch(item)` method used to transform a fetched collection
        - `.sendCollections(array)` method used to transform collections to be send by calling `.send` method
        - `.send(item)` method used to transform a collection to be send     
    - `views` all pages of the application 


#### Instruction
1. Navigate to the `frontend` folder and run the command for installing all dependencies:
    ```
    npm install
    ```
2. Build production / run development
    - Compiles and hot-reloads for development
        ```
        npm run serve
        ```
    - Compiles and minifies for production
        ```
        npm run build
        ```
    - Lints and fixes files
        ```
        npm run lint
        ```


## Links
- [Dockerhub: mongo](https://hub.docker.com/_/mongo)
- [Dockerhub: mongo-express](https://hub.docker.com/_/mongo-express)
- [Secured MongoDB container](https://medium.com/@MaxouMask/secured-mongodb-container-6b602ef67885)
- [How To Install Docker Compose on Ubuntu 18.04](https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-18-04)
- [How To Install and Use Docker on Ubuntu 18.04](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04)
- [How To Install Node.Js 10 / 11 / 12 On Ubuntu 16.04 | 18.04](https://websiteforstudents.com/how-to-install-node-js-10-11-12-on-ubuntu-16-04-18-04-via-apt-and-snap)
- [How To Set Up a Firewall with UFW on Ubuntu 18.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-18-04)
- [How To Install Git on Ubuntu 18.04](https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu-18-04)
