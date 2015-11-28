class Player :
   def __init__( self, username ) :
      self.name = username
      self.score = 0

class Game (object) :
    def __init__( self) :
        print "init"

    def getWord() :
        return "APPLE"
