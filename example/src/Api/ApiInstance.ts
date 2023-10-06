import axios, { AxiosInstance } from 'axios'
import uuid from 'react-native-uuid'

import { ApiConfig, graphConfig } from '../Config'
import { logError } from '../Common/AxiosError'

const getOptions = (token: string) => {
    return {
        headers: {
            'Content-Type':
                'application/json;charset=UTF-8',
            CorrelationID: uuid.v4() as string,
            Authorization: `Bearer ${token}`,
        },
    }
}

class ApiCore {
    private apiInstance: AxiosInstance
    private baseURL: string
    constructor(baseURL: string) {
        console.info(
            `[ApiInstance] - API base url - ${baseURL}`,
        )
        this.apiInstance = axios.create({
            baseURL,
        })
        this.baseURL = baseURL
    }
    public async get(path: string, token: string) {
        return this.apiInstance
            .get(path, getOptions(token))
            .then((result) => result.data)
            .catch(logError)
    }
    public async post(
        path: string,
        data: string,
        token: string,
    ) {
        return this.apiInstance
            .post(path, data, getOptions(token))
            .then((result) => result.data)
            .catch(logError)
    }
    public async put(
        path: string,
        data: string,
        token: string,
    ) {
        return this.apiInstance
            .put(path, data, getOptions(token))
            .then((result) => result.data)
            .catch(logError)
    }
}
const ApiInstance = new ApiCore(ApiConfig.baseUrl)
const GraphInstance = new ApiCore(
    graphConfig.graphMeEndpoint,
)
export { ApiInstance, GraphInstance }
