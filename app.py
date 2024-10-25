from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

sign_facts = [
    "Sign languages are fully developed natural languages.",
    "American Sign Language (ASL) is different from British Sign Language (BSL).",
    "Sign languages use hand shapes, facial expressions, and body movements.",
    "ASL is the third most commonly used language in the U.S.",
    "There are more than 300 different sign languages in use around the world."
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    if username == 'user' and password == 'pass':
        return jsonify({'login': True})
    return jsonify({'login': False}), 401

@app.route('/random_fact')
def random_fact():
    fact = random.choice(sign_facts)
    return jsonify({'fact': fact})

if __name__ == '__main__':
    app.run(debug=True)
