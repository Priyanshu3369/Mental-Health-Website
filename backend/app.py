from flask import Flask, request, jsonify, send_file
from gtts import gTTS
from flask_cors import CORS
from transformers import BlenderbotTokenizer, BlenderbotForConditionalGeneration
import uuid
import os

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

if __name__ == "__main__":
    app.run(debug=True)
