import requests
from flask import Flask, render_template, request, make_response,jsonify,send_from_directory
from flask_restful import Resource, Api, reqparse
import json
from flask_jwt import JWT, jwt_required, current_identity
from services.mongo import MongoDBconnect
from settings.security import authenticate, identity
from flask_cors import CORS
from datetime import datetime, date
from bson import json_util, ObjectId
import werkzeug



app = Flask(__name__)
app.config['SECRET_KEY'] = 'super-secret'
api = Api(app)
CORS(app)
jwt = JWT(app, authenticate, identity)



class Login(Resource):
   
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('mail')
        parser.add_argument('password')
        req = parser.parse_args()
        db = MongoDBconnect.mongodbConnect()
        users=db.users.find({'mail': req['mail']})
        for user in users:
            if user != "":
                if user["password"]==req['password']:
                    return req #logeado exitosamente
                else:
                    return "Contraseña Inválida", 401
        else:
            return "Usuario No Encontrado", 404
    
class News(Resource):
    # poner decordado JWT para peticiones con Token
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('Titulo')
        parser.add_argument('Bajada')
        parser.add_argument('Entradilla')
        parser.add_argument('Cuerpo')
        parser.add_argument('Imagen')
        req = parser.parse_args()
        dateToday = datetime.now()
        db = MongoDBconnect.mongodbConnect()
        db.news.insert({
         "Fecha": dateToday,
         "Titulo": req["Titulo"],
         "Bajada": req["Bajada"],
         "Entradilla": req["Entradilla"],
         "Cuerpo": req["Cuerpo"],
         "Imagen": req["Imagen"]
        })
        return "Guardado en la Base de Datos"
    
    def get(self):
        db = MongoDBconnect.mongodbConnect()
        News=db.news.find({})
        allNews = []
        for news in News:
            news["Fecha"] = news["Fecha"].strftime("%m/%d/%Y, %H:%M:%S")
            allNews.append(news)
        allNewsJSON = {"Noticias": allNews}
        return json.loads(json_util.dumps(allNewsJSON,default=str))

class UploadFile(Resource):
   def post(self):
     parse = reqparse.RequestParser()
     parse.add_argument('file', type=werkzeug.datastructures.FileStorage, location='files')
     args = parse.parse_args()
     image_file = args['file']
     filename=image_file.filename
     image_file.save("assets/documentos/"+filename)
     return "archivo subido", 200   

class DownloadFile(Resource):
    def get(self, fileName):
        print(fileName)
        return send_from_directory('assets/documentos', fileName, as_attachment=True)



api.add_resource(Login, '/login')
api.add_resource(News, '/news')
api.add_resource(UploadFile, '/uploadFile')
api.add_resource(DownloadFile, '/downloadFile/<string:fileName>')


if __name__ == '__main__':
    app.run(host="0.0.0.0")

