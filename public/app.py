from flask import Flask, render_template, request, session, redirect, url_for
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
socketio = SocketIO(app)

@app.route('/')
def index():
    if 'username' in session:
        return render_template('chat.html')
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        session['username'] = request.form['username']
        return redirect(url_for('index'))
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

@socketio.on('message')
def handle_message(msg):
    print('Message:', msg)
    socketio.emit('message', {'user': session['username'], 'msg': msg}, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
