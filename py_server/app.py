from flask import Flask, request, jsonify
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
@app.route('/predict', methods=['POST'])
def predict_revenue():
    try:
        data = request.get_json(force=True)

        # Grab the array from the full dashboard payload
        income_data = data.get('totalIncomeLast7Days', [])
        if not income_data:
            return jsonify({"error": "No 'totalIncomeLast7Days' found"}), 400

        # Proceed as before
        dates = [datetime.strptime(entry['_id'], '%Y-%m-%d') for entry in income_data]
        revenues = [entry['revenue'] for entry in income_data]

        X = np.array([d.toordinal() for d in dates]).reshape(-1, 1)
        y = np.array(revenues)

        model = LinearRegression()
        model.fit(X, y)

        future_dates = [dates[-1] + timedelta(days=i) for i in range(1, 4)]
        future_X = np.array([d.toordinal() for d in future_dates]).reshape(-1, 1)
        predictions = model.predict(future_X)

        response = [{
            "_id": date.strftime('%Y-%m-%d'),
            "revenue": round(float(pred), 2)
        } for date, pred in zip(future_dates, predictions)]

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
