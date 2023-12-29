from flask import Flask, Response, request
from flask.json import jsonify
import pymongo
from flask_cors import CORS
from bson import json_util

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})

MONGODB_HOST = 'localhost'

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
    print('✅ [Identity] Succesfully connected to MongoDB!')
except Exception as e:
    print(e)
    print('❌ [Identity] Error - Cannot connect to database!')
    exit()

# ############################## PROFILE #####################################

@app.route('/api/validate-user', methods=['POST'])
def validate_user():
    try:
        payload = request.get_json()
        email = payload['email']
        password = payload['password']
        result = db.users.find_one({'email': email, 'password': password})

        if result:
            print("[Identity] User validation successful!")
            return Response(status=200)
        
        print("[Identity] User validation failed!")
        return Response(status=400)
    except Exception as ex:
        print(ex)
        return Response(status=500)
        

@app.route('/api/login', methods=['POST'])
def login():
    try:
        payload = request.get_json()
        email = payload['email']
        password = payload['password']
        
        result = db.users.find_one({'email': email, 'password': password})
        if result:
            response = json_util.dumps(result)
            return response, 200
        return jsonify({'message': 'Login unsuccessful'}), 400
    except Exception as ex:
        print(ex)
        return Response(status=500)


@app.route('/api/register', methods=['POST'])
def register():
    try:
        payload = request.get_json()
        new_user = {
            'id': str(uuid.uuid4()),
            'name': payload['name'],
            'email': payload['email'],
            'phone': payload['phone'],
            'password': payload['password'],
            'phone': payload['phone'],
            'userType': payload['userType'],
            'group': payload['group'],
            'topics': payload['topics'],
        }
        new_subscriber = {
            'authorId': new_user['id'],
            'name': new_user['name'],
            'topics': payload['topics']
        }
            
        db.users.insert_one(new_user)
        db.subscribers.insert_one(new_subscriber)
        
        result = db.users.find_one({'email': new_user['email']})
        print(result)
        response = json_util.dumps(result)
        return response, 201
        
    except Exception as ex:
        print(ex)
        return Response(status=500)


@app.route('/api/profile', methods=['GET'])
def get_profile():
    try:
        args = request.args.to_dict()
        print(args['email'])
        response = db.users.find_one({'email': args['email']})
        response = json_util.dumps(response)
        return response, 200
    except Exception as ex:
        print(ex)
        return Response(status=500)

# ############################## MAIN #######################################
@app.route('/')
def get_message():
    return '✅ [Identity] Server working!'

if __name__ == '__main__':
    app.run('0.0.0.0', port=7021, debug=True)