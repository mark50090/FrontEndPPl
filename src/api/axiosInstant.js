import axios from "axios";
class Api {
  /**
   * @param {import('axios').AxiosStatic} axios 
   */
  constructor(axios){
    this._axios = axios
    this._access_token = sessionStorage.access_token
    this._configAxios();
  }
  
  /**
   * 
   * @param {string} token - Bearer {token}
   */
  setToken(token) {
    this._access_token = token
    sessionStorage.access_token = token
  }
  setRefreshToken(url) {
    sessionStorage.refresh_token = url
  }

  async refreshAccessToken(){
    if (!this._requesting_new_token) {
      if (!sessionStorage.refresh_token) {
        this._requesting_new_token = new Promise(()=>{});
      }
      else
      this._requesting_new_token = axios.post(
        "url", // refresh token destination
          {
            refresh_token: sessionStorage.refresh_token
          }
        )
    }

    var { data } = await this._requesting_new_token;
    this.setToken(data.access_token)
    this.setRefreshToken(data.refresh_token)

    if (this._requesting_new_token) {
      setTimeout(()=>{
        this._requesting_new_token = undefined;
      },5000)
      
    }
  }


  _configAxios() {
    this._axios.interceptors.request.use(
      async config => {
        if (this._access_token) {
          config.headers = { 
            'Authorization': `Bearer ${this._access_token}`
          }
        }
        return config;
      },
      error => {
        Promise.reject(error)
    });
    
    // Response interceptor for API calls
    this._axios.interceptors.response.use((response) => {
      return response
    }, async (error) => {
      const originalRequest = error.config;
      if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
        originalRequest._retry = true;
        await this.refreshAccessToken();
        delete originalRequest.headers.Authorization
        return this._axios(originalRequest);
      }
      return Promise.reject(error);
    });
  }
}

export { Api }