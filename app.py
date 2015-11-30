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
        session['player_name'] = player.name
        session['player_score'] = player.score
        return redirect(url_for('hangman'))
    return redirect(url_for('index',error=errormsg))

@app.route('/won')
def won():
    score = session['player_score']
    score = score + 1
    session['player_score'] = score
    return redirect(url_for('hangman'))

@app.route('/lost')
def lost():
    return redirect(url_for('hangman'))

@app.route('/hangman')
def hangman():
    score = session['player_score'];
    game = Game();
    theme = game.getRandomTheme();
    hint = game.getHint(theme);
    word = game.getWord(theme);
    return render_template("hangman.html",hint=hint, word=word, score=score)

@app.route('/logout')
def logout():
    session.pop('player_name', None)
    session.pop('player_score', None)
    session.pop('word', None)
    return redirect(url_for('index'))

@app.route('/won')
def gameWon():
    print "==============Game won=================="
    # a = request.args.get('word', 'none', type=str)
    score = session['player_score'] + 1;
    session['player_score'] = score
    return jsonify(status=1)

# @app.route('/lost')
# def gameLost():


if __name__ == '__main__':	#Start the Development server
    app.run(debug=True)