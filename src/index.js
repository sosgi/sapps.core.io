import {IHttpConnection} from 'sapps.core.api';


function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

class Connection{
    get(url, params) {
        url = 'api/v1'+url+'.json'; 
        return fetch(url).then(checkStatus).then(function(response) {
            return response.json()
        });
    }
    post(url, params){

    }
    head(url, params){

    }
    delete(url, params){

    }
    put(url, params){

    }
}

export function start(ctx){
    ctx.services.register(IHttpConnection, new Connection());
}

export function stop(ctx){
}
