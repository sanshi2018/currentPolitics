import request from './network.js'

export function getNews(key, type) {
    return request({
        url: '',
        data: {
            key,
            type
        }
    })
}