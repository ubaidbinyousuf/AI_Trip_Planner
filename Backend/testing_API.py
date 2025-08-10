import os
import google.generativeai as genai

# --- Configuration ---
# Put your actual API key here for this test.
# In your main app.py, you should still read it from an environment variable.
GEMINI_API_KEY = "AIzaSyDM33K_rWN854grB7o3CmD1VPUnFUjIZ7U" # <--- Paste your 'AIza...' key here for testing
genai.configure(api_key=GEMINI_API_KEY)

# --- Test 1: List Models ---
print("--- Testing API Key: Listing Models ---")
try:
    models = genai.list_models()
    model_names = [m.name for m in models]
    print("Success! The following models are available:")
    for name in model_names:
        print(f"- {name}")
except Exception as e:
    print(f"FAILED to list models. Error: {e}")
    print("Possible causes: The API key is invalid or has expired, or there's a connectivity issue.")

# --- Test 2: Generate Content ---
print("\n--- Testing API Key: Generating Content ---")
try:
    # We need to use the correct model name.
    # Based on previous debug, we'll try 'gemini-pro' but you should
    # use the correct name from the list in Test 1.
    model = genai.GenerativeModel('gemini-pro') 
    prompt = "Provide a single, short fun fact about Paris."
    response = model.generate_content(prompt)
    print("Success! Generated content:")
    print(response.text)
except Exception as e:
    print(f"FAILED to generate content. Error: {e}")
    print("Possible causes: The model name is incorrect, or the API key is not valid for this model/method.")