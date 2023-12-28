from utils import RequestJson, send_request

def test_redirect():
    result=send_request(RequestJson('c1RA', 'https://www.wikipedia.com', 'GET'))
    assert len(result)==2
    assert result[0].status_code==301

def test_ok():
    result=send_request(RequestJson('gtt0', 'https://www.google.com', 'GET'))
    assert len(result)==1
    assert result[0].status_code==200

def test_post_google():
    result=send_request(RequestJson('gtt0', 'https://www.google.com', 'POST'))
    assert len(result)==1
    assert result[0].status_code==405