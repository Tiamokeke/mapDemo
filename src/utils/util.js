import { Message } from "element-ui"

export default async function request(method, url, params, config) {
    if (url.startWith("/")) {
        url = serverAPIPrefix + url
    }
    const options = {
        method,
        credential: "include",
        headers: {
            token: localStorage.getItem("token") ?
                localStorage.getItem("token").replaceAll('""', '') : ''
        }
    }
    if (method === "GET") {
        url = addQuerys(url, params)
    } else {
        options.body = JSON.stringify(params || {})
        options.headers = {
            'Content-Type': 'application/json',
            token: localStorage.getItem('token') ? localStorage.getItem("token").replaceAll('""', '')
                : ""
        }
    }
    const res = await fetch(url, {
        ...options,
        ...config
    })
    if (res.status == 401 || res.status == 403) {
        gotoLogin();
        localStorage.clear();//清除token
        Message.error('登录失效，请重新登录')
        return neverPromise;
        // export const neverPromise=new Promise(()=>{

        //  })

    }
    if (res.status == 500 || res.status >= 500) {
        Message.error('服务端异常，请与管理员联系');
        return neverPromise;
    }
    try {
        var result = await res.json()
    } catch (error) {

    }

    if (res.status >= 200 && res.status < 300) {
        if (result.code && result.code !== 0) {
            throw new AppError(result?.msg)
            // export class AppError extends Error {
            //name = 'AppError'
            //}
        } return result
    }
}