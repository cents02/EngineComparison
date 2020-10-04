from flask import Flask, render_template,request
import sqlite3
app = Flask(__name__)

def getengines():
    conn = sqlite3.connect('db/generic_propulsion.db')
    names = []
    for row in conn.execute('SELECT * FROM engines'):
        names.append(row[0])
    conn.close()
    return names
def getengine(engine):
    conn = sqlite3.connect('db/generic_propulsion.db')
    enginedetails = conn.execute('SELECT * FROM engines WHERE name = ?',(engine,)).fetchone()
    return enginedetails


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/home',methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        enginedet = getengine(request.form['engine'])
        app.logger.info('HELLO ' + str(enginedet))
        return render_template('home.html', details=True,enginedet=enginedet)
    else:
        getengs = getengines()
        
        return render_template('home.html',details=False, names=getengs)

if __name__ == '__main__':
    app.run(debug=True)


