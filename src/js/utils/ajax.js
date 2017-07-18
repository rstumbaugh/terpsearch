import nanoajax from 'nanoajax';

class Ajax {
	get(url, headers = {}) {
    return new Promise((resolve, reject) => {
			var params = { url: url };

			params.headers = Object.keys(headers).length ? headers : {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			};
			if (!params.headers['Content-Type'] || !params.headers.Accept) {
				params.headers['Content-Type'] = 'application/json';
				params.headers.Accept = 'application/json';
			}
			
      nanoajax.ajax(params, 
        (code, response) => {
          var func;
          if (code == 200)
            func = resolve
          else
            func = reject
          func({code: code, response: response})
        }
      )
    })
	}
	
	post(url, body) {
		var headers = body.headers ? body.headers : {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		};
		if (!headers['Content-Type'] || !headers.Accept) {
			headers['Content-Type'] = 'application/json';
			headers.Accept = 'application/json';
		}
		
  	return new Promise((resolve, reject) => {
  		nanoajax.ajax({
  			url: url,
  			method: 'POST',
  			headers: headers,
  			body: typeof(body.body) === 'string' ? body.body : JSON.stringify(body.body),
  			cors: true
  		}, (code, response) => {
  			var func;
  			if (code == 200)
  				func = resolve
  			else
  				func = reject

  			func({code: code, response: response});
  		})
  	})
	}
}

export default new Ajax();