from flask import Flask, render_template, request, jsonify
import re

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def check_accessibility():
    data = request.get_json()
    url = data.get('message').replace('check accessibility ', '').strip()

    if not url or not is_valid_url(url):
        return jsonify({"response": "error: Invalid URL provided"}), 400

    # Simulate accessibility check (replace with actual logic)
    result = analyze_url_accessibility(url)

    return jsonify({"response": result})

def is_valid_url(url):
    # Simple regex to validate URLs
    regex = re.compile(
        r'^(?:http|ftp)s?://'  # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|'  # domain...
        r'localhost|'  # localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|'  # IPv4
        r'\[?[A-F0-9]*:[A-F0-9:]+\]?)'  # IPv6
        r'(?::\d+)?'  # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)  # optional path
    return re.match(regex, url) is not None

def analyze_url_accessibility(url):
    # Placeholder for actual accessibility analysis logic
    # For now, we'll simulate a response
    if 'example.com' in url:
        return "Accessibility check successful: No issues found."
    else:
        return "Accessibility check failed: missing alt tags in some images."

if __name__ == '__main__':
    app.run(debug=True)