#This is for authentication and identity

from werkzeug.security import safe_str_cmp
from models.user import User
from services.mongo import MongoDBconnect

dbUsers = MongoDBconnect.mongodbConnect().users.find()


users = [User(str(user["_id"]),str(user["mail"]),user["password"]) for user in dbUsers]



#users = [
#    User(1, 'Saravanan', '@123'),
#    User(2, 'Viajyamuthu', '@321'),
#]

#check JWT documentation for python

mail_table = {u.mail: u for u in users}
userid_table = {u.id: u for u in users}



def authenticate(mail, password):
    #check for user and return 
    user = mail_table.get(mail, None)
    if user and safe_str_cmp(user.password, password):
        return user 

#payload is the contents of the jwt token
def identity(payload):
    userid = payload['identity']
    return userid_table.get(userid, None)