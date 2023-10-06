import { AxiosError } from "axios";

export function logError(error: AxiosError) {

    //@ts-ignore
    const { headers, _headers, ...restConfig } = error.config
    const out = {
        response: restConfig,
        message: '[Axios Error] - Logging Config'
    }
    if (error?.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        const { headers, config, request, ...rest } = error.response
        const out = {
            response: rest,
            message: '[Axios Error] - From Server'
        }

        console.error(JSON.stringify(out))
        throw ({ ...rest, ...restConfig })
    } else if (error?.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        const { headers, _headers, ...rest } = error.request
        const out = {
            response: rest,
            message: '[Axios Error] - From Request'
        }
        console.error(JSON.stringify(out))
        throw ({ ...rest, ...restConfig })
    } else {
        const out = {
            response: error?.message,
            message: '[Axios Error] - Logging message'
        }
        console.error(JSON.stringify(out))
        throw ({ message: error?.message, ...restConfig })
        // Something happened in setting up the request that triggered an Error

    }


}