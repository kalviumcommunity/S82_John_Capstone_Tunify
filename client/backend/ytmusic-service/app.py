from flask import Flask, request, jsonify
from flask_cors import CORS
from ytmusicapi import YTMusic

app = Flask(__name__)
CORS(app)

ytmusic = YTMusic()

@app.route('/api/music/search', methods=['GET'])
def search():
    query = request.args.get('q')
    if not query:
        return jsonify({'error': 'Query is required'}), 400

    results = ytmusic.search(query, filter='songs', limit=10)
    simplified = [{
        'id': song['videoId'],
        'title': song['title'],
        'artists': [a['name'] for a in song.get('artists', [])],
        'thumbnail': song['thumbnails'][-1]['url'] if song.get('thumbnails') else ''
    } for song in results if 'videoId' in song]

    return jsonify({'items': simplified})

if __name__ == '__main__':
    # Development mode only
    app.run(host='0.0.0.0', port=5001)
