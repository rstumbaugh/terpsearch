import nanoajax from 'nanoajax';

class Ajax {
	get(url) {
    return new Promise((resolve, reject) => {
      nanoajax.ajax(
        { url: url }, 
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

  	return new Promise((resolve, reject) => {
  		nanoajax.ajax({
  			url: url,
  			method: 'POST',
  			headers: headers,
  			body: body.body,
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