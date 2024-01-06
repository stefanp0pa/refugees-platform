from flask import Flask, Response, request
from flask.json import jsonify
import json
import pymongo
import datetime
import pika
import time
from flask_cors import CORS
from bson import json_util

import requests
import uuid

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})

MONGODB_HOST = 'localhost'

# DEV_MODE = False
# RABBITMQ_HOST = 'localhost' if DEV_MODE else 'rabbitmq'
# MONGODB_HOST = 'localhost' if DEV_MODE else 'mongo-database'


class User:
    def __init__(self, id, name, email, password, phone, userType, group):
        self.__dict__.update(locals())
        del self.__dict__['self']

class Request:
    def __init__(self, id, title, location, phone, author, email, group, description, identifiers, authorId, accepted):
        self.__dict__.update(locals())
        del self.__dict__['self']

class Offer:
    def __init__(self, id, title, location, phone, author, email, description, identifiers, authorId, accepted):
        self.__dict__.update(locals())
        del self.__dict__['self']

class Subscriber:
    def __init__(self, authorId, name, topics):
        self.__dict__.update(locals())
        del self.__dict__['self']

try:
    app.config['MONGO_URI'] = 'mongodb://localhost:27017/refugeesApp'
    mongo = pymongo.MongoClient(app.config['MONGO_URI'])
    db = mongo.refugeesApp
    mongo.server_info()
    print('✅ Succesfully connected to MongoDB!')
except Exception as e:
    print(e)
    print('❌ Error - Cannot connect to database!')
    exit()


@app.before_request
def before_request():
    user_validation_endpoint = "http://localhost:7021/api/validate-user"
    if 'login' not in request.url and 'register' not in request.url and request.method == 'POST':
        try:
            response = requests.post(user_validation_endpoint, json = request.get_json(), headers = {'Content-Type': 'application/json'})
            if response.status_code == 200:
                print("Validation middleware successful!")
            else:
                return jsonify({'message': 'User validation unsuccessful'}), 400
        except Exception as ex:
            print(ex)
        

# ############################## REQUESTS #####################################

def send_request_accept_email(request_author, accepter):
    print(f">>>> 📧 Sending email to {request_author} that {accepter} has accepted their help request...")
    print(">>>> 📧 Email sent!")

def broadcast_request(request_title, subscribers):
    print(f">>>> 📧 Broadcasting request {request_title} to subscribers...")
    for subscriber in subscribers:
        print(f">>>> 📧 Sending email to {subscriber} that a new request has been posted...")
        print(">>>> 📧 Email sent!")

# Posting a new request
@app.route('/api/requests', methods=['POST'])
def post_request():
    payload = request.get_json()
    try:
        new_request = {
            'id': str(uuid.uuid4()),
            'title': payload['title'],
            'location': payload['location'],
            'phone': payload['phone'],
            'author': payload['author'],
            'email': payload['email'],
            'group': payload['group'],
            'description': payload['description'],
            'identifiers': payload['identifiers'],
            'authorId': payload['authorId'],
            'accepted': False
        }
        db.requests.insert_one(new_request)
        
        required_topics = payload['identifiers']
        if required_topics is None or len(required_topics) == 0:
            print(">>>> There are no topics attached on this request, no subscriber will be notified!")
            return Response(status=201)
        
        user = db.users.find_one({"id": payload['authorId']})

        subscriberUserType = "refugee" if user['userType'] == "helper" else "helper"
        subscriberUsers = db.users.find({"userType": subscriberUserType})
        
        subscribers = db.subscribers.find()
        filtered_subscribers = [subscriber for subscriber in subscribers if any(topic in required_topics for topic in subscriber["topics"])]
        filtered_subscribers = [subscriber for subscriber in filtered_subscribers if any(subscriberUser['id'] == subscriber['authorId'] for subscriberUser in subscriberUsers)]
        filtered_subscribers_names = [filtered_subscriber["name"] for filtered_subscriber in filtered_subscribers]
        
        broadcast_request(payload['title'], filtered_subscribers_names)
        
        return Response(status=201)
    except Exception as ex:
        print(ex)
        return Response(status=500)

# Accept request
@app.route('/api/requests/accept', methods=['POST'])
def accept_request():
    try:
        payload = request.get_json(silent=True)
        accepter = payload['accepter']
        accepterId = payload['accepterId']
        requestId = payload['requestId']
        
        db.requests.update_one({"id": requestId}, {"$set": {"accepted": True}})
        
        requestt = db.requests.find_one({"id": requestId})
        request_author = requestt['author']
        
        send_request_accept_email(request_author, accepter)

        return Response(status=200)
    except Exception as ex:
        print(ex)
        return Response(status=500)

# Retrieve all requests that were not accepted yet
@app.route('/api/requests', methods=['GET'])
def get_requests():
    try:
        # Get all the requests from the database
        requests_cursor = db.requests.find({"accepted": False})

        # Convert the cursor to a list and remove the '_id' field inserted by MongoDB
        requests = [{k: v for k, v in elem.items() if k != '_id'} for elem in requests_cursor]

        # Create a JSON response with the requests
        response = jsonify(requests)

        # Set the 'Access-Control-Allow-Origin' header to allow cross-origin requests
        response.headers.add('Access-Control-Allow-Origin', '*')

        return response, 200
    except Exception as ex:
        print(ex)
        return Response(status=500)
    
# Retrieve all requests
@app.route('/api/requests/all', methods=['GET'])
def get_requests_all():
    try:
        # Get all the requests from the database
        requests_cursor = db.requests.find()

        # Convert the cursor to a list and remove the '_id' field inserted by MongoDB
        requests = [{k: v for k, v in elem.items() if k != '_id'} for elem in requests_cursor]

        # Create a JSON response with the requests
        response = jsonify(requests)

        # Set the 'Access-Control-Allow-Origin' header to allow cross-origin requests
        response.headers.add('Access-Control-Allow-Origin', '*')

        return response, 200
    except Exception as ex:
        print(ex)
        return Response(status=500)


# Retrieving request details
@app.route('/api/request-details', methods=['GET'])
def get_requests_details():
    try:
        args = request.args.to_dict()
        response = db.requests.find_one({'id': args['id']})
        response = json_util.dumps(response)
        return response, 200
    except Exception as ex:
        print(ex)
        return Response(status=500)

# ############################## MAIN #######################################
@app.route('/')
def get_message():
    return '✅ Refugees app REQUESTS server working!'

if __name__ == '__main__':
    print('✅ Refugees app REQUESTS server starting...')
    app.run('0.0.0.0', port=7023, debug=True)