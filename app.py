from flask import Flask, render_template, session, redirect, url_for, escape, request
from core import Player, Game
from forms import LoginForm
app = Flask(__name__)		#Initialize application

app.secret_key = 'WebDesign'

@app.route('/')				#Define route
@app.route('/index')
def index():
    if 'player_name' in session:
        return redirect(url_for('hangman'))
    return redirect((url_for('checkin')))

@app.route('/checkin')
def checkin():
    form = LoginForm(request.form);
    return render_template('index.html', form=form)

@app.route('/submitCheckin', methods=['GET', 'POST'])
def submitCheckin():
    if request.method == 'POST':
        player = Player(request.form['username'])
        game = Game();
        session['player_name'] = player.name
        session['player_score'] = player.score
        session['word'] = game.getWord()
        return redirect(url_for('hangman'))
    error = 'Could not check in'
    return redirect(url_for('index',error=errormsg))

@app.route('/hangman')
def hangman():
    return render_template("hangman.html")

if __name__ == '__main__':	#Start the Development server
    app.run(debug=True)
