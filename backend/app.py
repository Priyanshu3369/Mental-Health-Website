from flask import Flask, request, jsonify, send_file
from gtts import gTTS
from transformers import BlenderbotTokenizer, BlenderbotForConditionalGeneration
import uuid
from flask_cors import CORS
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)
model_name = "facebook/blenderbot-400M-distill"
tokenizer = BlenderbotTokenizer.from_pretrained(model_name)
model = BlenderbotForConditionalGeneration.from_pretrained(model_name)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message")

    inputs = tokenizer([user_message], return_tensors="pt")
    reply_ids = model.generate(**inputs)
    reply = tokenizer.batch_decode(reply_ids, skip_special_tokens=True)[0]

    # Generate speech
    tts = gTTS(reply)
    audio_id = str(uuid.uuid4())
    audio_path = f"audio/{audio_id}.mp3"
    os.makedirs("audio", exist_ok=True)
    tts.save(audio_path)

    return jsonify({
        "reply": reply,
        "audio": f"/audio/{audio_id}.mp3"
    })

@app.route("/audio/<filename>")
def serve_audio(filename):
    return send_file(f"audio/{filename}", mimetype="audio/mpeg")


@app.route('/mood', methods=['POST'])
def log_mood():
    data = request.json
    mood = data.get("mood")
    timestamp = data.get("timestamp", datetime.now().isoformat())

    log_entry = {"mood": mood, "timestamp": timestamp}

    if not os.path.exists("data/moods.json"):
        os.makedirs("data", exist_ok=True)
        with open("data/moods.json", "w") as f:
            json.dump([], f)

    with open("data/moods.json", "r") as f:
        mood_data = json.load(f)

    mood_data.append(log_entry)

    with open("data/moods.json", "w") as f:
        json.dump(mood_data, f, indent=2)

    return jsonify({"message": "Mood saved"}), 200


@app.route('/mood/history', methods=['GET'])
def get_mood_history():
    try:
        with open("data/moods.json", "r") as f:
            mood_data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        mood_data = []

    return jsonify(mood_data), 200

if __name__ == "__main__":
    app.run(debug=True)
