from ConfigParser import SafeConfigParser
from random import randint

class Player :
   def __init__( self, username ) :
      self.name = username
      self.score = 0

class Game :
    config = None;

    def __init__( self) :
        if Game.config==None :
            Game.config = SafeConfigParser()
            Game.config.read('config.ini')

    def getRandomTheme(self) :
        theme=randint(1,6)
        return theme

    def getHint(self, theme) :
        themeKey = self.getThemeKey(theme)
        themeVal = Game.config.get('Words', themeKey)
        return themeVal

    def getThemeKey(self,theme) :
        return "theme."+str(theme)

    def getWord(self,theme) :
        themeKey = self.getThemeKey(theme)
        wordKey = themeKey+".word."+str(1)
        word = Game.config.get('Words', wordKey)
        return word.upper()
