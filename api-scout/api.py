import requests
from flask import Flask, render_template, request, make_response,jsonify,send_from_directory
from flask_restful import Resource, Api, reqparse
import json
from services.mongo import MongoDBconnect
from services.randomAuthKey import RandomAuthKey
from services.AESencrypt import Encrypt_Password
from datetime import datetime, date
from bson import json_util, ObjectId
import werkzeug
import os
import jwt
import random
import string
import ast
from functools import wraps
import bcrypt

app = Flask(__name__)
api = Api(app)


AUTH_KEY = RandomAuthKey.random_auth_key()

def token_required(function):
    @wraps(function)
    def tokenValidation(*args, **kwargs):
        parser = reqparse.RequestParser()
        parser.add_argument('Authorization', location='headers')
        req = parser.parse_args()
        token=req['Authorization']
        if token:
            jwt_token_encoded= bytes(token, 'utf-8')
            decodeJson = jwt.decode(jwt_token_encoded, AUTH_KEY , algorithms=["HS256"])
            _id = ObjectId(decodeJson["id"])
            db = MongoDBconnect.mongodbConnect()
            users=db.users.find({'_id': _id})
            User = None
            for user in users:
                User = user
            if(User):
                return function(*args, **kwargs)
            else:
                "El token no fue válidado", 401
        else:
            return "El token no fue pasado",401

    
    return tokenValidation



class Users(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('mail')
        parser.add_argument('password')
        parser.add_argument('Authorization', location='headers')
        req = parser.parse_args()
        if req['Authorization']=="yoryito":
            db = MongoDBconnect.mongodbConnect()
            EncryptPass= Encrypt_Password.encrypt(req["password"].encode())
            db.users.insert({
            "mail": req["mail"],
            "password": EncryptPass
            })
            return "Usuario Agregado Correctamente",200
        else:
            return "No autorizado",401
    

class DeleteUser(Resource):
    def delete(self,_id):
        parser = reqparse.RequestParser()
        parser.add_argument('Authorization', location='headers')
        req = parser.parse_args()
        if req['Authorization']=="yoryito":
            _id = ObjectId(_id)
            db = MongoDBconnect.mongodbConnect()
            db.users.delete_one({'_id': _id})
            return "Usuario Eliminado Correctamente",200
        else:
            return "No autorizado",401
        

    
class Login(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('mail')
        parser.add_argument('password')
        req = parser.parse_args()
        db = MongoDBconnect.mongodbConnect()
        users=db.users.find({'mail': req['mail']})
        headers = {"Access-Control-Allow-Origin":"*"}
        for user in users:
            if user != "":
                front_end_pass = req['password'].encode()
                server_pass =Encrypt_Password.decrypt(user["password"])
                if bcrypt.checkpw(server_pass, front_end_pass):
                    return json.loads(json_util.dumps(user,default=str)),200,headers #logeado exitosamente
                else:
                    return "Contraseña Inválida", 401,headers
        else:
            return "Usuario No Encontrado", 404,headers
    
    def options(self):
        headers = {"Access-Control-Allow-Origin":"*",'Access-Control-Allow-Headers':"*",'Access-Control-Allow-Methods': "*"}
        return "",200, headers


class Token(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('_id')
        parser.add_argument('mail')
        parser.add_argument('password')
        req = parser.parse_args()
        _id=req["_id"]
        _id=ast.literal_eval(_id)
        _id = _id["$oid"]
        encoded_jwt = jwt.encode({"mail": str(req["mail"]),"password":str(req["password"]),"id":_id}, AUTH_KEY, algorithm="HS256") 
        token = {"access_token": encoded_jwt.decode('utf-8') }
        headers = {"Access-Control-Allow-Origin":"*"}
        return token,200,headers
    
    def options(self):
        headers = {"Access-Control-Allow-Origin":"*",'Access-Control-Allow-Headers':"*",'Access-Control-Allow-Methods': "*"}
        return "",200, headers
 
class News(Resource):
    # poner decordado JWT para peticiones con Token
    @token_required
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('Titulo')
        parser.add_argument('Bajada')
        parser.add_argument('Entradilla')
        parser.add_argument('Cuerpo')
        parser.add_argument('Imagen',type=werkzeug.datastructures.FileStorage, location='files')
        req = parser.parse_args()
        imageFile = req["Imagen"]
        dateToday = datetime.now()
        db = MongoDBconnect.mongodbConnect()
        _id = db.news.insert({
        "Fecha": dateToday,
        "Titulo": req["Titulo"],
        "Bajada": req["Bajada"],
        "Entradilla": req["Entradilla"],
        "Cuerpo": req["Cuerpo"],
        "Imagen": imageFile.filename
        })
        _id = str(_id)
        imageFile.save("assets/Imagenes/main/noticias/"+_id+imageFile.filename)
        headers = {"Access-Control-Allow-Origin":"*"}
        return "Guardado en la Base de Datos",200, headers
    
    def get(self):
        db = MongoDBconnect.mongodbConnect()
        News=db.news.find({})
        allNews = []
        for news in News:
            news["Fecha"] = news["Fecha"].strftime("%m/%d/%Y, %H:%M:%S")
            allNews.append(news)
        allNewsJSON = {"Noticias": allNews}
        headers = {"Access-Control-Allow-Origin":"*"}
        return json.loads(json_util.dumps(allNewsJSON,default=str)),200, headers
    
    def options(self):
        headers = {"Access-Control-Allow-Origin":"*",'Access-Control-Allow-Headers':"*",'Access-Control-Allow-Methods': "*"}
        return "",200, headers
    

class GetImageNews(Resource):
    def get(self,_id):
        _Id = json.loads(_id)
        ID = _Id["$oid"]
        id_mongo = ObjectId(ID)
        db = MongoDBconnect.mongodbConnect()
        News = db.news.find({'_id':id_mongo})
        for news in News:
            filename=news["Imagen"]
        headers = {"Access-Control-Allow-Origin":"*"}
        resp = send_from_directory('assets/Imagenes/main/noticias',ID+filename, as_attachment=True)
        resp.headers.add("Access-Control-Allow-Origin", "*")
        return resp
    
    def options(self,_id):
        headers = {"Access-Control-Allow-Origin":"*",'Access-Control-Allow-Headers':"*",'Access-Control-Allow-Methods': "*"}
        return "",200, headers

class UpdateNews(Resource):
    @token_required
    def put(self,_id):
        parse = reqparse.RequestParser()
        parse.add_argument('Titulo')
        parse.add_argument('Bajada')
        parse.add_argument('Entradilla')
        parse.add_argument('Cuerpo')
        parse.add_argument('Imagen',type=werkzeug.datastructures.FileStorage, location='files')
        req = parse.parse_args()
        _Id = json.loads(_id)
        ID = _Id["$oid"]
        db = MongoDBconnect.mongodbConnect()
        id_mongo = ObjectId(ID)
        DataNews = db.news.find({'_id':id_mongo})
        for new in DataNews:
            filenameExist = new["Imagen"]
        noticias = db.news.update_one({'_id': id_mongo},{
        '$set':{'Titulo':req['Titulo']}}, upsert=False)
        noticias = db.news.update_one({'_id': id_mongo},{
        '$set':{'Bajada':req['Bajada']}}, upsert=False)
        noticias = db.news.update_one({'_id': id_mongo},{
        '$set':{'Entradilla':req['Entradilla']}}, upsert=False)
        noticias = db.news.update_one({'_id': id_mongo},{
        '$set':{'Cuerpo':req['Cuerpo']}}, upsert=False)
        if(req['Imagen']!=None):
            imageFile = req['Imagen']
            noticias = db.news.update_one({'_id': id_mongo},{
            '$set':{'Imagen':imageFile.filename}}, upsert=False)
            os.remove("assets/Imagenes/main/noticias/"+ID+filenameExist)
            imageFile.save("assets/Imagenes/main/noticias/"+ID+imageFile.filename)
        headers = {"Access-Control-Allow-Origin":"*"}
        return "noticia actualizada", 200,headers
    
    def options(self,_id):
        headers = {"Access-Control-Allow-Origin":"*",'Access-Control-Allow-Headers':"*",'Access-Control-Allow-Methods': "*"}
        return "",200, headers

class DeleteNews(Resource):
    @token_required
    def delete(self,_id):
        _Id = json.loads(_id)
        ID = _Id["$oid"]
        id_mongo = ObjectId(ID)
        db = MongoDBconnect.mongodbConnect()
        newsData=db.news.find({'_id':id_mongo})
        for news in newsData:
            imageFileName=news["Imagen"]
        db.news.delete_one({'_id': id_mongo})
        os.remove('assets/Imagenes/main/noticias/'+ID+imageFileName)
        headers = {"Access-Control-Allow-Origin":"*"}
        return "noticia eliminada", 200,headers
    
    def options(self,_id):
        headers = {"Access-Control-Allow-Origin":"*",'Access-Control-Allow-Headers':"*",'Access-Control-Allow-Methods': "*"}
        return "",200, headers



class UploadFile(Resource):
    @token_required
    def post(self):
        parse = reqparse.RequestParser()
        parse.add_argument('file', type=werkzeug.datastructures.FileStorage, location='files')
        parse.add_argument('Descripcion')
        args = parse.parse_args()
        _file = args['file']
        description = args['Descripcion']
        filename=_file.filename
        db = MongoDBconnect.mongodbConnect()
        _id=db.files.insert({
            "Nombre": _file.filename,
            "Descripcion": description
        }) 
        _file.save("assets/documentos/"+str(_id)+filename)   
        headers = {"Access-Control-Allow-Origin":"*"}
        return "archivo subido", 200,headers
    
    def options(self):
        headers = {"Access-Control-Allow-Origin":"*",'Access-Control-Allow-Headers':"*",'Access-Control-Allow-Methods': "*"}
        return "",200, headers


class DownloadFile(Resource):
    def get(self, _id):
        _Id = json.loads(_id)
        ID = _Id["$oid"]
        id_mongo = ObjectId(ID)
        db = MongoDBconnect.mongodbConnect()
        Files = db.files.find({'_id':id_mongo})
        for File in Files:
            fileName = File["Nombre"] 
        resp = send_from_directory('assets/documentos', ID+fileName, as_attachment=True)
        resp.headers.add("Access-Control-Allow-Origin", "*")
        return resp

    def options(self,_id):
        headers = {"Access-Control-Allow-Origin":"*",'Access-Control-Allow-Headers':"*",'Access-Control-Allow-Methods': "*"}
        return "",200, headers

class getFiles(Resource):
    def get(self):
        allFiles = []
        db = MongoDBconnect.mongodbConnect()
        files=db.files.find({})
        for document in files:
            allFiles.append(document)
        allFilesJSON = {"Archivos": allFiles}
        headers={"Access-Control-Allow-Origin":"*"}
        return json.loads(json_util.dumps(allFilesJSON,default=str)),200,headers
    
    def options(self):
        headers = {"Access-Control-Allow-Origin":"*",'Access-Control-Allow-Headers':"*",'Access-Control-Allow-Methods': "*"}
        return "",200, headers

class deleteFiles(Resource):
    @token_required
    def delete(self,fileData):
        db = MongoDBconnect.mongodbConnect()
        Data = json.loads(fileData)
        ID = Data['_id']['$oid']
        NameFile = Data['Nombre']
        id_mongo = ObjectId(ID)
        db.files.delete_one({'_id': id_mongo})
        os.remove('assets/documentos/' +ID+NameFile)
        headers={"Access-Control-Allow-Origin":"*"}
        return "Archivo Eliminado", 200,headers
    
    def options(self,fileData):
        headers = {"Access-Control-Allow-Origin":"*",'Access-Control-Allow-Headers':"*",'Access-Control-Allow-Methods': "*"}
        return "",200, headers


class Carrousel(Resource):
    def get(self):
        allCarrouselData = []
        db = MongoDBconnect.mongodbConnect()
        CarrouselData = db.carrousel.find({})
        for data in CarrouselData:
            allCarrouselData.append(data)
        allCarrouselJSON = {"CarrouselData": allCarrouselData}
        headers={"Access-Control-Allow-Origin":"*"}
        return json.loads(json_util.dumps(allCarrouselJSON,default=str)),200,headers
    
    def options(self):
        headers = {"Access-Control-Allow-Origin":"*",'Access-Control-Allow-Headers':"*",'Access-Control-Allow-Methods': "*"}
        return "",200, headers
    
    @token_required
    def post(self):
        parse = reqparse.RequestParser()
        parse.add_argument('NumeroCarrousel')
        parse.add_argument('TituloCarrousel')
        parse.add_argument('CuerpoCarrousel')
        parse.add_argument('ImagenCarrousel')
        parse.add_argument('ImagefileCarrousel', type=werkzeug.datastructures.FileStorage, location='files')
        req = parse.parse_args()
        _Imgfile = req['ImagefileCarrousel']
        db = MongoDBconnect.mongodbConnect()
        filename=_Imgfile.filename
        _id=db.carrousel.insert({
            "NumeroCarrousel": req['NumeroCarrousel'],
            "TituloCarrousel": req['TituloCarrousel'],
            "CuerpoCarrousel": req['CuerpoCarrousel'],
            "ImagenCarrousel": filename
        })
        _Imgfile.save("assets/Imagenes/carrusel/"+str(_id)+filename)
        headers = {"Access-Control-Allow-Origin":"*"}
        return "Carrusel Agregado Correctamente",200,headers
    
    def options(self):
        headers = {"Access-Control-Allow-Origin":"*",'Access-Control-Allow-Headers':"*",'Access-Control-Allow-Methods': "*"}
        return "",200, headers
      
class UpdateCarrousel(Resource):
    @token_required
    def put(self,isUpdateImage):
        parse = reqparse.RequestParser()
        parse.add_argument('_id')
        parse.add_argument('NumeroCarrousel')
        parse.add_argument('TituloCarrousel')
        parse.add_argument('CuerpoCarrousel')
        db = MongoDBconnect.mongodbConnect()
        if(isUpdateImage=='True'):
            parse.add_argument('ImagenCarrousel',type=werkzeug.datastructures.FileStorage, location='files')
            req = parse.parse_args()
            _ImageFileUpdate = req['ImagenCarrousel']
            ID = req["_id"]
            id_mongo = ObjectId(ID)
            filenameUpdate=_ImageFileUpdate.filename
            CarrouselImageExist = db.carrousel.find({'_id': id_mongo})
            for _fileExist in CarrouselImageExist:
                fileNameExist =  _fileExist["ImagenCarrousel"]
            os.remove('assets/Imagenes/carrusel/'+ID+fileNameExist)
            _ImageFileUpdate.save('assets/Imagenes/carrusel/'+ID+filenameUpdate)
        if(isUpdateImage=='False'):
            parse.add_argument('ImagenCarrousel')
            req = parse.parse_args()
            ID = req["_id"]
            id_mongo = ObjectId(ID)
            parse.add_argument('ImagenCarrousel')
            filenameUpdate = req['ImagenCarrousel']
        db.carrousel.update_one({'_id': id_mongo},{
        '$set':{'TituloCarrousel':req['TituloCarrousel']}}, upsert=False)
        db.carrousel.update_one({'_id': id_mongo},{
        '$set':{'CuerpoCarrousel':req['CuerpoCarrousel']}}, upsert=False)
        db.carrousel.update_one({'_id': id_mongo},{
        '$set':{'ImagenCarrousel':filenameUpdate}}, upsert=False)
        headers = {"Access-Control-Allow-Origin":"*"}
        return "Carrusel Actualizado Correctamente",200,headers
    
    def options(self,isUpdateImage):
        headers = {"Access-Control-Allow-Origin":"*",'Access-Control-Allow-Headers':"*",'Access-Control-Allow-Methods': "*"}
        return "",200, headers

class getImageCarrousel(Resource):
    def get(self,_id):
        _Id = json.loads(_id)
        ID = _Id["$oid"]
        id_mongo = ObjectId(ID)
        db = MongoDBconnect.mongodbConnect()
        CarrouselData = db.carrousel.find({'_id':id_mongo})
        for data in CarrouselData:
            filename=data["ImagenCarrousel"]
        resp = send_from_directory('assets/Imagenes/carrusel',ID+filename, as_attachment=True)
        resp.headers.add("Access-Control-Allow-Origin", "*")
        return resp

    def options(self,_id):
        headers = {"Access-Control-Allow-Origin":"*",'Access-Control-Allow-Headers':"*",'Access-Control-Allow-Methods': "*"}
        return "",200, headers

class Ramas(Resource):
    @token_required
    def post(self):
        parse = reqparse.RequestParser()
        parse.add_argument('Unidad')
        req = parse.parse_args()
        db = MongoDBconnect.mongodbConnect()
        _id=db.ramas.insert({
         "Unidad": req['Unidad']
        })
        headers={"Access-Control-Allow-Origin":"*"}
        return "Unidad creada correctamente",200,headers
    
    def get(self,Rama):
        db = MongoDBconnect.mongodbConnect()
        ramas=db.ramas.find({'Unidad': Rama})
        for rama in ramas:
            Rama = rama
        headers={"Access-Control-Allow-Origin":"*"}
        return json.loads(json_util.dumps(Rama,default=str)),200,headers
    

    def options(self,Rama):
        headers = {"Access-Control-Allow-Origin":"*",'Access-Control-Allow-Headers':"*",'Access-Control-Allow-Methods': "*"}
        return "",200, headers


class Rama(Resource):
    @token_required
    def post(self,_id):
        _Id = json.loads(_id)
        ID = _Id["$oid"]
        id_mongo = ObjectId(ID)
        parse = reqparse.RequestParser()
        parse.add_argument('Unidad')
        parse.add_argument('Field')
        parse.add_argument('Titulo')
        parse.add_argument('Texto')
        parse.add_argument('ImageFile',type=werkzeug.datastructures.FileStorage, location='files')
        req = parse.parse_args()
        _ImageFile=req['ImageFile']
        db = MongoDBconnect.mongodbConnect()
        fields=db.rama.find({'Field':req['Field'],'_idRama':id_mongo})
        nameFolder=req['Unidad'].replace(" ","").replace("í","i").replace("á","a").replace("@","o")
        Field = None
        for field in fields:
            Field = field
        if(Field):
            db.rama.update_one({'_id': Field['_id']},{
            '$set':{'Unidad':req['Unidad']}}, upsert=False)
            db.rama.update_one({'_id': Field['_id']},{
            '$set':{'Field':req['Field']}}, upsert=False)
            db.rama.update_one({'_id': Field['_id']},{
            '$set':{'Titulo':req['Titulo']}}, upsert=False)
            db.rama.update_one({'_id': Field['_id']},{
            '$set':{'Texto':req['Texto']}}, upsert=False)
            db.rama.update_one({'_id': Field['_id']},{
            '$set':{'ImageFile':req['ImageFile'].filename}}, upsert=False)
            os.remove('assets/Imagenes/ramas/'+nameFolder+"/"+str(Field["_id"])+Field['ImageFile'])
            _ImageFile.save("assets/Imagenes/ramas/"+nameFolder+"/"+str(Field["_id"])+req['ImageFile'].filename)
        else:
            _newId= db.rama.insert({
                "_idRama": id_mongo,
                "Unidad": req['Unidad'],
                "Field": req['Field'],
                "Titulo": req['Titulo'],
                "Texto": req['Texto'],
                "ImageFile": req['ImageFile'].filename
             })
            _ImageFile.save('assets/Imagenes/ramas/'+nameFolder+"/"+str(_newId)+req['ImageFile'].filename)
        headers={"Access-Control-Allow-Origin":"*"}
        return "Guardado Correctamente",200,headers

    def get(self,_id):
        _Id = json.loads(_id)
        ID = _Id["$oid"]
        id_mongo = ObjectId(ID)
        db = MongoDBconnect.mongodbConnect()
        elements = db.rama.find({'_idRama': id_mongo})
        data = []
        for element in elements:
            data.append(element)
        jsonResponse = {'DataRama':data}
        headers={"Access-Control-Allow-Origin":"*"}
        return json.loads(json_util.dumps(jsonResponse,default=str)),200,headers
    
    def options(self,_id):
        headers = {"Access-Control-Allow-Origin":"*",'Access-Control-Allow-Headers':"*",'Access-Control-Allow-Methods': "*"}
        return "",200, headers
    
class getImageRama(Resource):
    def get(self,_id):
        _Id = json.loads(_id)
        ID = _Id["$oid"]
        id_mongo = ObjectId(ID)
        db = MongoDBconnect.mongodbConnect()
        elements = db.rama.find({"_id":id_mongo})
        ElementUnidad = None
        ElementName = None
        for element in elements:
            ElementName = element['ImageFile']
            ElementUnidad = element['Unidad'].replace(" ","").replace("í","i").replace("á","a").replace("@","o")
        resp = send_from_directory('assets/Imagenes/ramas/'+ElementUnidad,ID+ElementName, as_attachment=True)
        resp.headers.add("Access-Control-Allow-Origin", "*")
        return resp
    
    def options(self,_id):
        headers = {"Access-Control-Allow-Origin":"*",'Access-Control-Allow-Headers':"*",'Access-Control-Allow-Methods': "*"}
        return "",200, headers

class UpdateHistory(Resource):
    @token_required
    def put(self,_id):
        _Id = json.loads(_id)
        ID = _Id["$oid"]
        id_mongo = ObjectId(ID)
        parse = reqparse.RequestParser()
        parse.add_argument('Elemento')
        parse.add_argument('Titulo')
        parse.add_argument('Texto')
        parse.add_argument('Imagen',type=werkzeug.datastructures.FileStorage, location='files')
        req = parse.parse_args()
        db = MongoDBconnect.mongodbConnect()
        if(req['Imagen']):
            _ImageFile=req['Imagen']
            _ImageFileName = req['Imagen'].filename
            data=db.history.find({'_id':id_mongo})
            _FileNameDelete = ""
            for _file in data:
                _FileNameDelete = _file["Imagen"]
            os.remove('assets/Imagenes/historia/'+str(id_mongo)+_FileNameDelete)
            _ImageFile.save("assets/Imagenes/historia/"+str(id_mongo)+_ImageFileName)
        else:
            _ImageFileName = ""
        db.history.update_one({'_id': id_mongo},{
        '$set':{'Elemento':req['Elemento']}}, upsert=False)
        db.history.update_one({'_id': id_mongo},{
        '$set':{'Titulo':req['Titulo']}}, upsert=False)
        db.history.update_one({'_id': id_mongo},{
        '$set':{'Texto':req['Texto']}}, upsert=False)
        db.history.update_one({'_id': id_mongo},{
        '$set':{'Imagen':_ImageFileName }}, upsert=False)
        headers={"Access-Control-Allow-Origin":"*"}
        return "Actualizado con Éxito",200,headers
    
    def options(self,_id):
        headers = {"Access-Control-Allow-Origin":"*",'Access-Control-Allow-Headers':"*",'Access-Control-Allow-Methods': "*"}
        return "",200, headers
            



class History(Resource):
    def get(self):
        db = MongoDBconnect.mongodbConnect()
        Data=db.history.find()
        allData = []
        for data in Data:
            allData.append(data)
        allDataJson = {"Data": allData}
        headers={"Access-Control-Allow-Origin":"*"}
        return json.loads(json_util.dumps(allDataJson,default=str)),200,headers

    @token_required
    def post(self):
        parse = reqparse.RequestParser()
        parse.add_argument('Elemento')
        parse.add_argument('Titulo')
        parse.add_argument('Texto')
        parse.add_argument('Imagen',type=werkzeug.datastructures.FileStorage, location='files')
        req = parse.parse_args()
        if(req['Imagen']):
            _ImageFile = req['Imagen']
            _ImageFileName=req['Imagen'].filename
        else:
            _ImageFileName = ""
        db = MongoDBconnect.mongodbConnect()
        _Id=db.history.insert({
        "Elemento": req['Elemento'],
        "Titulo": req['Titulo'],
        "Texto": req['Texto'],
        "Imagen": _ImageFileName
        })
        if(req['Imagen']):
            _ImageFile.save("assets/Imagenes/historia/"+str(_Id)+req['Imagen'].filename)
        headers={"Access-Control-Allow-Origin":"*"}
        return "Agregado con Éxito",200,headers
    
    def options(self):
        headers = {"Access-Control-Allow-Origin":"*",'Access-Control-Allow-Headers':"*",'Access-Control-Allow-Methods': "*"}
        return "",200, headers
        
class getHistoryImage(Resource):
    def get(self,_id):
        _Id = json.loads(_id)
        ID = _Id["$oid"]
        id_mongo = ObjectId(ID)
        db = MongoDBconnect.mongodbConnect()
        elements = db.history.find({"_id":id_mongo})
        ElementName = None
        for element in elements:
            ElementName = element['Imagen']
        resp= send_from_directory('assets/Imagenes/historia',ID+ElementName, as_attachment=True)
        resp.headers.add("Access-Control-Allow-Origin", "*")
        return resp
    
    def options(self,_id):
        headers = {"Access-Control-Allow-Origin":"*",'Access-Control-Allow-Headers':"*",'Access-Control-Allow-Methods': "*"}
        return "",200, headers

class Camp(Resource):
    @token_required
    def post(self):
        parse = reqparse.RequestParser()
        parse.add_argument('Lugar')
        parse.add_argument('Ano')
        parse.add_argument('Longitud')
        parse.add_argument('Latitud')
        parse.add_argument('Estacion')
        req = parse.parse_args()
        db = MongoDBconnect.mongodbConnect()
        db.camps.insert({
        "Lugar": req['Lugar'],
        "Ano": req['Ano'],
        "Longitud": req['Longitud'],
        "Latitud": req['Latitud'],
        "Estacion": req['Estacion']
        })
        headers={"Access-Control-Allow-Origin":"*"}
        return "Guardado con éxito", 200,headers
    
    def get(self):
        db = MongoDBconnect.mongodbConnect()
        Data=db.camps.find()
        allData = []
        for data in Data:
            allData.append(data)
        allDataJson = {"CampsData": allData}
        headers={"Access-Control-Allow-Origin":"*"}
        return json.loads(json_util.dumps(allDataJson,default=str)),200,headers
    
    def options(self):
        headers = {"Access-Control-Allow-Origin":"*",'Access-Control-Allow-Headers':"*",'Access-Control-Allow-Methods': "*"}
        return "",200, headers

class DeleteCamp(Resource):
    @token_required
    def delete(self,_id):
        _Id = json.loads(_id)
        ID = _Id["$oid"]
        id_mongo = ObjectId(ID)
        db = MongoDBconnect.mongodbConnect()
        db.camps.delete_one({'_id': id_mongo})
        headers={"Access-Control-Allow-Origin":"*"}
        return "Campamento Eliminado", 200,headers
    
    def options(self,_id):
        headers = {"Access-Control-Allow-Origin":"*",'Access-Control-Allow-Headers':"*",'Access-Control-Allow-Methods': "*"}
        return "",200, headers












        


api.add_resource(Login, '/login')
api.add_resource(Token, '/token')
api.add_resource(Users, '/user')
api.add_resource(DeleteUser, '/deleteUser/<string:_id>')
api.add_resource(News, '/news')
api.add_resource(GetImageNews, '/getImageNews/<string:_id>')
api.add_resource(UpdateNews, '/updateNews/<string:_id>')
api.add_resource(DeleteNews, '/deleteNews/<string:_id>')
api.add_resource(UploadFile, '/uploadFile')
api.add_resource(DownloadFile, '/downloadFile/<string:_id>')
api.add_resource(getFiles, '/getFiles')
api.add_resource(deleteFiles, '/deleteFiles/<string:fileData>')
api.add_resource(Carrousel, '/carrousel')
api.add_resource(UpdateCarrousel, '/UpdateCarrousel/<string:isUpdateImage>')
api.add_resource(getImageCarrousel, '/getImageCarrousel/<string:_id>')
api.add_resource(Ramas, '/ramas/<string:Rama>')
api.add_resource(Rama, '/rama/<string:_id>')
api.add_resource(getImageRama, '/getImageRama/<string:_id>')
api.add_resource(UpdateHistory, '/updateHistory/<string:_id>')
api.add_resource(History, '/history')
api.add_resource(getHistoryImage, '/getHistoryImage/<string:_id>')
api.add_resource(Camp, '/Camp')
api.add_resource(DeleteCamp, '/deleteCamp/<string:_id>')


if __name__ == '__main__':
    app.run(host="0.0.0.0")

