from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# --- Configure Gemini API ---
GEMINI_API_KEY = "AIzaSyAu91Oq1tTeUAuuxKrA9crZTshWu8-o6z0" #  YOUR API KEY HERE
genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel('gemini-2.5-pro') # Will be changed after we find correct model

# --- Main Routes ---
@app.route('/')
def home():
    return 'GoByBot backend is working!well'

@app.route('/api/plan', methods=['POST'])
def plan_trip():
    data = request.get_json()
    destination = data.get('destination')
    start_date = data.get('startDate')
    end_date = data.get('endDate')

    prompt = (
        f"Plan a detailed tourist itinerary for a trip to {destination} "
        f"from {start_date} to {end_date}. Include daily activities, key places to visit, "
        f"and local experiences."
    )

    try:
        response = model.generate_content(prompt)
        return jsonify({
            "message": response.text
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# --- TEMPORARY DEBUGGING ROUTE - MAKE SURE IT'S HERE AND AT THE SAME LEVEL ---
@app.route('/api/list_models', methods=['GET'])
def list_gemini_models():
    try:
        models = genai.list_models()
        available_models = []
        for m in models:
            if 'generateContent' in m.supported_methods:
                available_models.append({
                    "name": m.name,
                    "supported_methods": list(m.supported_methods),
                    "description": m.description
                })
        return jsonify({"available_models": available_models})
    except Exception as e:
        return jsonify({"error": f"Failed to list models: {str(e)}. Make sure your API key is correct and active."}), 500

if __name__ == '__main__':
    app.run(debug=True)