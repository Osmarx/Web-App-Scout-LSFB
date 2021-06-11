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
import os



app = Flask(__name__)
app.config['SECRET_KEY'] = 'BADEN-POWELL-BROWNSEA'
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
    @jwt_required()
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

class GetImageNews(Resource):
    def get(self,_id):
        _Id = json.loads(_id)
        ID = _Id["$oid"]
        id_mongo = ObjectId(ID)
        db = MongoDBconnect.mongodbConnect()
        News = db.news.find({'_id':id_mongo})
        for news in News:
            filename=news["Imagen"]
            print(filename)
        return send_from_directory('assets/Imagenes/main/noticias',ID+filename, as_attachment=True)


class UpdateNews(Resource):
    @jwt_required()
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
        return "noticia actualizada", 200
    
class DeleteNews(Resource):
    @jwt_required()
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
        return "noticia eliminada", 200



class UploadFile(Resource):
   @jwt_required()
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
     return "archivo subido", 200


class DownloadFile(Resource):
    def get(self, _id):
        _Id = json.loads(_id)
        ID = _Id["$oid"]
        id_mongo = ObjectId(ID)
        db = MongoDBconnect.mongodbConnect()
        Files = db.files.find({'_id':id_mongo})
        for File in Files:
            fileName = File["Nombre"] 
        return send_from_directory('assets/documentos', ID+fileName, as_attachment=True)

class getFiles(Resource):
    def get(self):
        allFiles = []
        db = MongoDBconnect.mongodbConnect()
        files=db.files.find({})
        for document in files:
            allFiles.append(document)
        allFilesJSON = {"Archivos": allFiles}
        return json.loads(json_util.dumps(allFilesJSON,default=str))

class deleteFiles(Resource):
    @jwt_required()
    def delete(self,fileData):
        db = MongoDBconnect.mongodbConnect()
        Data = json.loads(fileData)
        ID = Data['_id']['$oid']
        NameFile = Data['Nombre']
        id_mongo = ObjectId(ID)
        db.files.delete_one({'_id': id_mongo})
        os.remove('assets/documentos/' +ID+NameFile)
        return "Archivo Eliminado", 200

class Carrousel(Resource):
    def get(self):
        allCarrouselData = []
        db = MongoDBconnect.mongodbConnect()
        CarrouselData = db.carrousel.find({})
        for data in CarrouselData:
            allCarrouselData.append(data)
        allCarrouselJSON = {"CarrouselData": allCarrouselData}
        return json.loads(json_util.dumps(allCarrouselJSON,default=str))
    
    @jwt_required()
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
        return "Carrusel Agregado Correctamente",200
      
class UpdateCarrousel(Resource):
    @jwt_required()
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
        return "Carrusel Actualizado Correctamente",200

class getImageCarrousel(Resource):
    def get(self,_id):
        _Id = json.loads(_id)
        ID = _Id["$oid"]
        id_mongo = ObjectId(ID)
        db = MongoDBconnect.mongodbConnect()
        CarrouselData = db.carrousel.find({'_id':id_mongo})
        for data in CarrouselData:
            filename=data["ImagenCarrousel"]
        return send_from_directory('assets/Imagenes/carrusel',ID+filename, as_attachment=True)

        
class Ramas(Resource):
    @jwt_required()
    def post(self):
        parse = reqparse.RequestParser()
        parse.add_argument('Unidad')
        req = parse.parse_args()
        db = MongoDBconnect.mongodbConnect()
        _id=db.ramas.insert({
         "Unidad": req['Unidad']
        })
        return "Unidad creada correctamente",200
    
    def get(self,Rama):
        db = MongoDBconnect.mongodbConnect()
        ramas=db.ramas.find({'Unidad': Rama})
        for rama in ramas:
            Rama = rama
        return json.loads(json_util.dumps(Rama,default=str)),200


class Rama(Resource):
    @jwt_required()
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
        return "Guardado Correctamente",200

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
        return json.loads(json_util.dumps(jsonResponse,default=str)),200
    
class getImageRama(Resource):
    def get(self,_id):
        _Id = json.loads(_id)
        ID = _Id["$oid"]
        print(ID)
        id_mongo = ObjectId(ID)
        db = MongoDBconnect.mongodbConnect()
        elements = db.rama.find({"_id":id_mongo})
        ElementUnidad = None
        ElementName = None
        for element in elements:
            print(element)
            ElementName = element['ImageFile']
            ElementUnidad = element['Unidad'].replace(" ","").replace("í","i").replace("á","a").replace("@","o")
        return send_from_directory('assets/Imagenes/ramas/'+ElementUnidad,ID+ElementName, as_attachment=True)

class UpdateHistory(Resource):
    @jwt_required()
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
        return "Actualizado con Éxito",200
            



class History(Resource):
    def get(self):
        db = MongoDBconnect.mongodbConnect()
        Data=db.history.find()
        allData = []
        for data in Data:
            allData.append(data)
        allDataJson = {"Data": allData}
        return json.loads(json_util.dumps(allDataJson,default=str))
    @jwt_required()
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
        return "Agregado con Éxito",200
        
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
        return send_from_directory('assets/Imagenes/historia',ID+ElementName, as_attachment=True)

class Camp(Resource):
    @jwt_required()
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
        return "Guardado con éxito", 200
    def get(self):
        db = MongoDBconnect.mongodbConnect()
        Data=db.camps.find()
        allData = []
        for data in Data:
            allData.append(data)
        allDataJson = {"CampsData": allData}
        return json.loads(json_util.dumps(allDataJson,default=str))

class DeleteCamp(Resource):
    @jwt_required()
    def delete(self,_id):
        _Id = json.loads(_id)
        ID = _Id["$oid"]
        id_mongo = ObjectId(ID)
        db = MongoDBconnect.mongodbConnect()
        db.camps.delete_one({'_id': id_mongo})
        return "Campamento Eliminado", 200












        


api.add_resource(Login, '/login')
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

