import React, { useEffect, useState } from 'react'
import { generateRequestId, getRequest, sendRequest } from './server';

export default function App() {

    const [url, setUrl] = useState('www.wikipedia.com')
    const [httpMethod, setHttpMethod] = useState('GET')
    const [requestId, setRequestId] = useState('')
    const [responses, setResponses] = useState([] as ResponseJson[])
    const [enabled, setEnabled] = useState(true)
    const [statusCode, setStatusCode] = useState(-1)

    useEffect(() => {
        const newRequestId = location.pathname.replace('/', '')
        if (newRequestId === '') return
        getRequest(newRequestId).then(e => {
            if (e.error !== null || e.request === null || e.responses === null) {
                alert(e.error)
                return
            }
            setEnabled(false)
            setRequestId(newRequestId)
            setHttpMethod(e.request.method)
            setUrl(e.request.url)
            setResponses(e.responses)
        })
    })

    return <div>
        <StatusWidget
            enabled={enabled && !!responses.length}
            statusCode={statusCode}
        />
        <InputWidget
            enabled={enabled}
            httpMethod={httpMethod}
            url={url}
            requestId={requestId}
            setHttpMethod={setHttpMethod}
            setUrl={setUrl}
            setRequestId={setRequestId}
            setResponses={setResponses}
            setStatusCode={setStatusCode}
        />
        <ContentDiv url={url} responses={responses} />
        <ShareLink requestId={requestId} />
    </div>
}

function ContentDiv(props: { url: string, responses: ResponseJson[] }) {
    return <div className='content-div'>
        <UrlInfoCard url={props.url} />
        {props.responses.map((x, k) => <ResponseCard key={k} response={x} />)}
    </div>
}

function ResponseCard(props: { response: ResponseJson }) {
    return <div className='card'>
        <div className='card-title'>RESPONSE</div>
        <CardField keyName='Status' value={props.response.status_code.toString()} />
        <CardField keyName='URL' value={props.response.url} />
        <CardField keyName='HTTP version' value={props.response.http_version.toString()} />
        <CardField keyName='Date' value={new Date(props.response.timestamp).toDateString()} />
    </div>
}

function UrlInfoCard(props: { url: string }) {
    return <div className='card'>
        <div className='card-title'>URL TITLE</div>
        <CardField keyName='DOMAIN' value={domainOf(props.url)} />
        <CardField keyName='SCHEME' value='HTTP' />
        <CardField keyName='PATH' value={pathOf(props.url)} />
    </div>
}

function domainOf(url: string) {
    if (!url) return ''
    return new URL('http://' + url).host
}

function pathOf(url: string) {
    if (!url) return ''
    return new URL('http://' + url).pathname
}

function CardField(props: { keyName: string, value: string }) {
    return <div className='card-field'>
        <p>{props.keyName}: {props.value}</p>
    </div>
}

function ShareLink(props: { requestId: string }) {
    if (props.requestId) {
        return <div className='share-link'>
            <p>SHARE</p>
            <a
                href={location.protocol + '//' + location.host + '/' + props.requestId}>
                {location.protocol + '//' + location.host + '/' + props.requestId}
            </a>
        </div>
    } else {
        return <div></div>
    }
}

function StatusWidget(props: { statusCode: number, enabled: boolean }) {
    if (props.enabled) {
        return <div className='status-widget'>
            <h1>{props.statusCode}</h1>
            <p>{shortMessage(props.statusCode)}</p>
        </div>
    } else {
        return <div></div>
    }
}

function shortMessage(statusCode: number) {
    switch (true) {
        case 200 <= statusCode && statusCode < 300: return 'Everything is fine!'
        case 300 <= statusCode && statusCode < 400: return 'Redirected!'
        case 400 <= statusCode && statusCode < 500: return 'Client error!'
        case 500 <= statusCode && statusCode < 600: return 'Server error!'
    }
    return 'Unknown Status Code!'
}

function InputWidget(props: {
    enabled: boolean,
    httpMethod: string,
    url: string,
    requestId: string,
    setHttpMethod: (x: string) => void,
    setUrl: (x: string) => void,
    setRequestId: (x: string) => void,
    setResponses: (x: ResponseJson[]) => void,
    setStatusCode: (x: number) => void,
}) {
    return <div className='input-widget'>
        <select
            onChange={e => props.setHttpMethod(e.target.value)}
            value={props.httpMethod}
            disabled={!props.enabled}
        >
            {['GET', 'POST'].map((x, k) => <option value={x} key={k}>{x}</option>)}
        </select>
        <input
            type="text"
            value={props.url}
            disabled={!props.enabled}
            onChange={e => props.setUrl(e.target.value)}
        />
        <button
            className='send-button'
            disabled={!props.enabled}
            onClick={async () => {
                const requestId = generateRequestId()
                props.setRequestId(requestId)
                const apiResponse = await sendRequest({
                    url: props.url,
                    request_id: requestId,
                    method: props.httpMethod,
                })
                if (
                    apiResponse.error !== null
                    || apiResponse.request === null
                    || apiResponse.responses === null) {
                    alert(apiResponse.error)
                    return
                }
                props.setResponses(apiResponse.responses)
                if (apiResponse.responses.length) {
                    props.setStatusCode(apiResponse.responses.at(-1)!.status_code)
                }
            }}
        >
            SEND
        </button>
    </div>
}
