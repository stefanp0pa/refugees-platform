# How to run the project

* Set up the Docker container: `docker run -d --name my_mongo_container -p 27017:27017 mongo`
* Run the seeder process with `python3 seeder/seeder.py` to insert data
* Run the identity process with `python3 identity/identity.py`, with default port `7020`
* Run the main server process with `python3 server/server.py`, with default port `7021`
* Run the client process from the `client/` folder with `npm run dev`, with default port `3000`