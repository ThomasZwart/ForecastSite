from flask import Flask, render_template, request, jsonify, g

app = Flask(__name__)

@app.route('/process', methods=['POST'])
def process():
	data = request.get_json()

	return jsonify({'error' : data[0]})

if __name__ == '__main__':
	app.run(debug=True)