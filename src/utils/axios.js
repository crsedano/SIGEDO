import axios from 'axios'
import utils from './index'
import { Loading } from 'element-ui'

const loadFunction = config => {
    Loading.service({
      fullscreen: true,
      lock: true,
      text: 'Cargando...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    return config
}

const finishFunction = response => {
    Loading.service({ fullscreen: true }).close()
    return response
}

const errorFunction = error => {
    utils.errors(error)
    Loading.service({ fullscreen: true }).close()
    return Promise.reject(error)
}

const axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_SERVER
})

axiosInstance.interceptors.request.use(loadFunction)

axiosInstance.interceptors.response.use(finishFunction, errorFunction)

export default axiosInstance
