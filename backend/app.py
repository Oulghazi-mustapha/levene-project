from flask import Flask, request, jsonify
from flask_cors import CORS
from scipy import stats
import numpy as np
import yfinance as yf
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'message': 'API Levene fonctionne',
        'timestamp': datetime.now().isoformat()
    })


@app.route('/api/levene', methods=['POST'])
def levene_test():
    try:
        data = request.get_json()
        groups = data.get('groups', [])
        center = data.get('center', 'median')
        alpha = data.get('alpha', 0.05)
        
        if len(groups) < 2:
            return jsonify({
                'error': 'Il faut au moins 2 groupes',
                'success': False
            }), 400
        
        for i, g in enumerate(groups):
            if len(g) < 2:
                return jsonify({
                    'error': f'Le groupe {i+1} doit contenir au moins 2 valeurs',
                    'success': False
                }), 400
        
        arrays = [np.array(g, dtype=float) for g in groups]
        W, p_value = stats.levene(*arrays, center=center)
        reject_h0 = p_value < alpha
        
        variances = [float(np.var(arr, ddof=1)) for arr in arrays]
        std_devs = [float(np.std(arr, ddof=1)) for arr in arrays]
        means = [float(np.mean(arr)) for arr in arrays]
        
        return jsonify({
            'success': True,
            'statistic_W': float(W),
            'p_value': float(p_value),
            'alpha': alpha,
            'reject_h0': bool(reject_h0),
            'conclusion': (
                'Les variances sont significativement différentes (H0 rejetée)'
                if reject_h0
                else 'Aucune différence significative entre les variances (H0 acceptée)'
            ),
            'n_groups': len(groups),
            'sample_sizes': [len(g) for g in groups],
            'group_stats': {
                'means': means,
                'variances': variances,
                'std_devs': std_devs
            },
            'center_method': center
        })
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500


@app.route('/api/descriptive', methods=['POST'])
def descriptive_stats():
    try:
        data = request.get_json()
        values = np.array(data.get('values', []), dtype=float)
        
        if len(values) == 0:
            return jsonify({'error': 'Aucune donnée'}), 400
        
        return jsonify({
            'success': True,
            'count': len(values),
            'mean': float(np.mean(values)),
            'median': float(np.median(values)),
            'std': float(np.std(values, ddof=1)),
            'variance': float(np.var(values, ddof=1)),
            'min': float(np.min(values)),
            'max': float(np.max(values)),
            'q1': float(np.percentile(values, 25)),
            'q3': float(np.percentile(values, 75)),
            'skewness': float(stats.skew(values)),
            'kurtosis': float(stats.kurtosis(values))
        })
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500


@app.route('/api/stock/<ticker>', methods=['GET'])
def get_stock(ticker):
    try:
        period = request.args.get('period', '6mo')
        
        stock = yf.Ticker(ticker)
        hist = stock.history(period=period)
        
        if hist.empty:
            return jsonify({
                'error': f'Aucune donnée pour {ticker}',
                'success': False
            }), 404
        
        prices = hist['Close'].tolist()
        dates = hist.index.strftime('%Y-%m-%d').tolist()
        
        log_returns = np.diff(np.log(prices)).tolist()
        
        return jsonify({
            'success': True,
            'ticker': ticker.upper(),
            'period': period,
            'dates': dates,
            'prices': prices,
            'log_returns': log_returns,
            'count': len(prices)
        })
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)