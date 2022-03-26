export class LoyamApi {
  private _token: string = ''
  private _address: string = ''
  private _auth: string = ''

  private _addressList: any = {
    default: 'https://api.xxx.tech',
    localhost: 'https://xxx.tech',
    'dev.xxx.tech': 'https://api.dev.xxx.tech'
  }

  constructor(token: string, auth: string) {
    this._token = token
    this._auth = auth

    if ((typeof window !== 'undefined') &&
      (window.location?.host in this._addressList)) {
      this._address = this._addressList[window.location.host]
    } else {
      this._address = this._addressList.default
    }
  }

  private _responseToLog(response: Response): string {
    let s: string = ''

    for (const pair of (<any>response.headers).entries()) {
      s += pair[0] + ': ' + pair[1] + '\n'
    }

    return `
      Response.ok: (${ response.ok })
      Response.headers: ${ s }
      Response.status: ${ response.status }
    `
  }

  async _sendRequest(path: string, method: string = 'get', parameters: any = {}) {
    const fetchParameters: any = {
      method,
      cache: 'no-cache',
      redirect: 'error'
    }

    if (this._token) {
      fetchParameters.headers = new Headers({
        Authorization: this._token,
        Accept: 'application/json'
      })
    }

    if (parameters && Object.keys(parameters).length) {
      const formData = new FormData()
      const keys = Object.keys(parameters)

      keys.forEach(key => {
        formData.append(key,
          typeof parameters[key] === 'string' ? parameters[key] : JSON.stringify(parameters[key])
        )
      })

      fetchParameters.body = formData
    }

    return await fetch(this._address + path, fetchParameters)
      .then(response => {
        if (!response.ok) {
          throw new Error(`
            Error fetch ${ path } (${ response.url })
            ${ this._responseToLog(response) }
          `)
        }
        return response.json()
      })
      .then(data => {
        if (!data) {
          throw new Error(`
            Error fetch ${ path }
            Data error
            Data: ${ JSON.stringify(data) }
          `)
        }
        return data
      })
  }
}
