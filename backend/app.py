from flask import Flask, request, jsonify
from flask_cors import CORS
from models.chatbot_model import get_bot_reply

app = Flask(__name__)
CORS(app)  # allow all origins

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "")
    if not message:
        return jsonify({"error": "Empty message"}), 400
    reply = get_bot_reply(message)
    if len(reply.strip()) < 5 or "guy" in reply:
        reply = "I'm here for you. Want to talk more about what you're feeling?"
    # Example quick patch
    if reply.lower().startswith("i'm not sure") or "fun" in reply:
        reply = "Sorry, I may have misunderstood. Can you help me understand what you're going through a bit more?"

    return jsonify({"reply": reply})

@app.route("/")
def home():
    return "Mental Health Chatbot API is running."

if __name__ == "__main__":
    app.run(debug=True)
