from transformers import BlenderbotTokenizer, BlenderbotForConditionalGeneration

model_name = "facebook/blenderbot-400M-distill"
tokenizer = BlenderbotTokenizer.from_pretrained(model_name)
model = BlenderbotForConditionalGeneration.from_pretrained(model_name)

def get_bot_reply(user_input):
    inputs = tokenizer(user_input, return_tensors="pt")
    result = model.generate(**inputs)
    reply = tokenizer.decode(result[0], skip_special_tokens=True)
    return reply
