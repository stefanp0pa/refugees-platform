# How to run the project as a monolith

* Set up the Docker container: `docker run -d --name my_mongo_container -p 27017:27017 mongo`
* Run the seeder process with `python3 seeder/seeder.py` to insert data
* Run the identity process with `python3 identity/identity.py`, with default port `7021`
* Run the main server process with `python3 server/server.py`, with default port `7020` 
* Run the client process from the `client/` folder with `npm run dev`, with default port `3000`

# How to run the project as a microservice

* Set up the Docker container: `docker run -d --name my_mongo_container -p 27017:27017 mongo`
* Set up the Docker container: `docker run -d --name my_rabbitmq_container -p 5672:5672 rabbitmq`
* Run the seeder process with `python3 seeder/seeder.py` to insert data
* Run the identity process with `python3 identity/identity.py`, with default port `7021`
* Run the offers server with `python3 server/offers_server.py`, with default port `7022`
* Run the requests server with `python3 server/requests_server.py`, with default port `7023`
* Run the client process from the `client/` folder with `npm run dev`, with default port `3000`

Please use any other browser than **Google Chrome** for running the client-side application!