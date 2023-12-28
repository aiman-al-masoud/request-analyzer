// Generated using py-ts-interfaces.
// See https://github.com/cs-cordero/py-ts-interfaces

interface RequestJson {
    request_id: string;
    url: string;
    method: string;
}

interface ResponseJson {
    request_id: string;
    status_code: number;
    timestamp: number;
    url: string;
    http_version: number;
    response_id: number;
}

interface ApiResponseJson {
    request: RequestJson | null;
    responses: Array<ResponseJson> | null;
    error: string | null;
}
