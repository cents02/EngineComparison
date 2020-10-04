from flask import Flask, render_template,request
import sqlite3
app = Flask(__name__)

def getengines():
    conn = sqlite3.connect('db/generic_propulsion.db')
    names = []
    for row in conn.execute('SELECT * FROM engines'):
        names.append(row[0])
    return names

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/home',methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        return 'hello world'
    else:
        getengs = getengines()
        return render_template('home.html', names=getengs)

if __name__ == '__main__':
    app.run()


