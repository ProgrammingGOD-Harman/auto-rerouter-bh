from flask import Flask, request, jsonify
from flask_cors import CORS
import segno
import os

app = Flask(__name__)
CORS(app)

@app.route('/generate_qr', methods=['POST'])
def generate_qr():
    # Get data from the request, e.g., route parameters
    reroute_url = request.json.get('reroute_url')
    print(reroute_url)

    if reroute_url:
        # Generate QR code
        qr = segno.make(reroute_url)
        qr_filename = 'reroute_qr.png'
        qr.to_artistic(
            background="images/bt_logo.png",
            target=qr_filename,
            scale=5,
        )

        return jsonify({"message": "QR code generated", "file": qr_filename}), 200
    else:
        return jsonify({"error": "No reroute URL provided"}), 400

if __name__ == '__main__':
    app.run(debug=True)
