from flask import Flask, request
from flask_cors import CORS
import datetime
from youtube_transcript_api import YouTubeTranscriptApi
import json
from transformers import T5ForConditionalGeneration, T5Tokenizer

# define a variable to hold you app 
app = Flask(__name__)

CORS(app)

# define your resource endpoints
@app.route('/')
def index_page():
    return "Hello world"


@app.route('/api/summarize')
def summarize():
    youtube_url = request.args.get('youtube_url')
    video_id = youtube_url.split("=")[1]
    # video_id = 'aOL7wzEIZSc'
    try:
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        transcript =""
        transcript = transcript_list.find_transcript(['en','en_IN'])
    except:
        summary1 = "This video either has Transcripts Disabled or They are not available in english!"
        return summary1
    if(transcript!=""):
        transcript_json = YouTubeTranscriptApi.get_transcript(video_id, languages=['en','en-IN'])
        transcript_text = ""
        count = 0
        for i in transcript_json:
            transcript_text += " " + i['text']

        model = T5ForConditionalGeneration.from_pretrained("t5-base")
        tokenizer = T5Tokenizer.from_pretrained("t5-base")
        inputs = tokenizer.encode("summarize: " + transcript_text, return_tensors="pt", max_length=512, truncation=True)
        outputs = model.generate(
            inputs, 
            max_length=150, 
            min_length=40, 
            length_penalty=2.0, 
            num_beams=4, 
            early_stopping=True)
        summary = tokenizer.decode(outputs[0])
        summary1 = summary.removeprefix("<pad>").removesuffix("</s>")
    #======================================================================================================================
        return summary1
    else:
        summary1 = "This video either has Transcripts Disabled or They are not available in english!"
        return summary1

# server the app when this file is run
if __name__ == '__main__':
    app.run(debug=True)