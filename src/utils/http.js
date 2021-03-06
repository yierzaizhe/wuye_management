/**
 * http.js
 * 封装axios，
 * 调用方法:
 * http.get('/api/enquiry/web/query',{id:1}).then((res)=>{你的操作})
 * http.post('/api/enquiry/web/update',{id:1}).then((res)=>{你的操作})
 * http.postFormData('/api/enquiry/web/update',{id:1,file:file}).then((res)=>{你的操作})
 */
import axios from 'axios'
import qs from "qs";
import he from "element-ui/src/locale/lang/he";
axios.defaults.baseURL = 'http://127.0.0.1:8088/wuye';
export default {
  /**
   * 登陆请求
   * @param url
   * @param params
   * @returns {Promise<unknown>}
   */
  loginPost(url, params){
    let headers = localStorage.getItem("Authorization")
    console.log(headers)
    let auth =""
    if(headers != null || headers != undefined){

      console.log("已登陆过")
      auth = 'Bearer'+headers
      return new Promise((resolve, reject) => {
        axios.post(url,
          qs.stringify(params),{
            headers: {
              authorization: auth,
            },
          }).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    }else{
      console.log("未登陆过")
      return new Promise((resolve, reject) => {
        axios.post(url,
          qs.stringify(params)).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    }

  },
    /**
     * get方法，对应get请求
     * @param {String} url [请求的url地址]
     * @param {Object} params [请求时携带的参数]
     */
    get(url, params) {
        return new Promise((resolve, reject) => {
            axios.get(url, {
                params: params
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    /**
     * post方法，对应post请求
     * @param {String} url [请求的url地址]
     * @param {Object} params [请求时携带的参数]
     */
    post(url, params) {
        return new Promise((resolve, reject) => {
            axios.post(url, params,{
              headers: {
                authorization: 'Bearer'+localStorage.getItem("Authorization"),
              },
            })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    /**
     * postFormData方法，对应post请求，用来提交文件+数据
     * @param {String} url [请求的url地址]
     * @param {Object} params [请求时携带的参数]
     */
    postFormData(url, params) {
        return new Promise((resolve, reject) => {
            axios({
                headers: {
                    'Content-Type': 'multipart/form-data',// ;boundary=----WebKitFormBoundaryQ6d2Qh69dv9wad2u
                     authorization: localStorage.getItem("Authorization"),
                },
                transformRequest: [function (data) { // 在请求之前对data传参进行格式转换
                    const formData = new FormData()
                    Object.keys(data).forEach(key => {
                        formData.append(key, data[key])
                    })
                    return formData
                }],
                url,
                method: 'post',
                data: params
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
              if(err.errorCode == '2001'){
                this.$router.push("No")
              }
                reject(err)
            })
        })
    }
}
