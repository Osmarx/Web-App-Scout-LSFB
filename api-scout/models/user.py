class User(object):
    def __init__(self, id, mail, password):
        self.id = id
        self.mail = mail
        self.password = password
    
    def __str__(self):
      return f"User id: {self.id}"