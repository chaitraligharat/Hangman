from wtforms import Form, SubmitField, TextField, PasswordField, validators

class LoginForm(Form):

    username = TextField('Username', [validators.Length(min=4, max=25), validators.Required()])
    submit = SubmitField("Start Playing")
