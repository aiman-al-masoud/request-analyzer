from dataclasses import dataclass, fields
from typing import Any, Dict, List, Optional
from flask import json
from requests import Request, Session, Response
from py_ts_interfaces import Interface
from time import time

@dataclass
class Serializable:
    def to_json(self): 
        return self.__dict__

    def to_json_str(self): 
        return json.dumps(self.to_json())

    @classmethod
    @property
    def fields(cls):
        return [x.name for x in fields(cls)]

    @classmethod
    def load(cls, dict:Dict[str, Any]):
        return cls(**{k:v for k,v in dict.items() if k in cls.fields})

@dataclass
class RequestJson(Serializable, Interface):
    request_id:str
    url:str
    method:str

@dataclass
class ResponseJson(Serializable, Interface):
    request_id:str
    status_code:int
    timestamp:int
    url:str
    http_version:int
    response_id:int

@dataclass
class ApiResponseJson(Serializable, Interface):
    request:Optional[RequestJson]
    responses:Optional[List[ResponseJson]]
    error:Optional[str]

def send_request(request:RequestJson)->List[ResponseJson]:
    session=Session()
    req=Request(
        method=request.method,
        url=add_schema(request.url),
    )
    try:resp=session.send(req.prepare())
    except:return []
    resps=[*resp.history, resp]
    return [make_response(r, request.request_id, i) for i, r in enumerate(resps)]

def make_response(
    resp:Response, 
    request_id:str, 
    response_id:int
)->ResponseJson:
    
    return ResponseJson(
        request_id=request_id,
        status_code=resp.status_code,
        timestamp=int(1000*time()),
        url=resp.url,
        http_version=resp.raw.version,
        response_id=response_id,
    )

def add_schema(url:str):
    if 'http' not in url:
        return f'https://{url}'
    else:
        return url
