from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
	return render_template('form.html')

@app.route('/process', methods=['POST'])
def process():
	data = request.get_json()['data']
	y = 0
	for i in range(1, len(data) - 1):
		y = y + int(data[i][0]) 
		print(data[i][0])
	

	return jsonify({'error' : y})

if __name__ == '__main__':
	app.run(debug=True)