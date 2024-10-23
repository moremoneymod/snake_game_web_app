import asyncio
import json

from flask import Flask, render_template, request, jsonify
from db.db import save_progress_to_db, load_progress_from_db

app = Flask(__name__)


@app.route('/')
def index():
    return render_template("index.html")


@app.route("/save_progress", methods=["POST"])
def save_progress():
    data = request.get_json()
    user_id = data["user_id"]
    snake_position = json.dumps(data["snake_position"])
    food_position = json.dumps(data["food_position"])
    direction = json.dumps(data["direction"])
    score = data["score"]
    save_progress_to_db(user_id, snake_position, food_position, direction, score)
    return jsonify({"status": "progress saved"})


@app.route("/load_progress", methods=["GET"])
def load_progress():
    user_id = request.args.get("user_id")
    data = load_progress_from_db(user_id)
    if data:
        return jsonify(data)
    else:
        return jsonify({"response": "Нет записи в базе данных"})


if __name__ == "__main__":
    app.run(debug=True, port=443, ssl_context=("server.crt", "server.key"))
