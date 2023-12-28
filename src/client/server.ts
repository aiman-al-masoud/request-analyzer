export async function sendRequest(
    requestJson: RequestJson,
): Promise<ApiResponseJson> {
    const response = await fetch(
        '/api/send-request',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestJson),
        },
    )
    const json = await response.json()
    return json
}

export async function getRequest(
    requestId: string,
): Promise<ApiResponseJson> {
    const response = await fetch(
        '/api/get-request',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ request_id: requestId })
        },
    )
    const json = await response.json()
    return json
}

export function generateRequestId(){
    let requestId=''
    for (let i=0; i<12; i++){
        if (Math.random()>0.5){
            requestId+=parseInt((Math.random()*10)+'')
        }else{
            requestId+=String.fromCharCode(parseInt((Math.random()*(123 - 97) + 97)+''))
        }
    }
    return requestId
}
