import pysondb
from flask import Flask, request
from utils import ApiResponseJson, RequestJson, ResponseJson, send_request


app = Flask(__name__)
homepage_path = '../client/dist/index.html'
requests_db = pysondb.db.getDb('requests.db.json')
responses_db = pysondb.db.getDb('responses.db.json')

@app.route('/')
def root(): return open(homepage_path).read()

@app.errorhandler(404)
def not_found(e): return open(homepage_path).read()

@app.route('/api/get-request', methods=['GET', 'POST'])
def get():
    if not request.json:
        return ApiResponseJson(None, None, 'error: no json').to_json_str()
    if 'request_id' not in request.json:
        return ApiResponseJson(
            None,
            None,
            f'error: "request_id" field is missing from json',
        ).to_json_str()
    request_id = request.json['request_id']
    i_requests = requests_db.getByQuery({'request_id': request_id})
    i_responses = responses_db.getByQuery({'request_id': request_id})
    if not i_requests:
        return ApiResponseJson(
            None,
            None,
            f'error: no old request with request_id={request_id}',
        ).to_json_str()
    return ApiResponseJson(
        RequestJson.load(i_requests[0]),
        [ResponseJson.load(x) for x in i_responses],
        None,
    ).to_json_str()

@app.route('/api/send-request', methods=['GET', 'POST'])
def send():
    if not request.json:
        return ApiResponseJson(None, None, 'error: no json').to_json_str()
    for field in RequestJson.fields:
        if field not in request.json:
            return ApiResponseJson(
                None,
                None,
                f'error: "{field}" field is missing from json'
            ).to_json_str()
    i_request = RequestJson.load(request.json)
    requests_db.add(i_request.to_json())
    i_responses = send_request(i_request)
    if not i_responses:
        return ApiResponseJson(i_request, None, 'error: no responses').to_json_str()
    responses_db.addMany([x.to_json() for x in i_responses])
    return ApiResponseJson(i_request, i_responses, None).to_json_str()
