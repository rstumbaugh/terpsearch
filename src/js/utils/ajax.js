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
  	return new Promise((resolve, reject) => {
  		nanoajax.ajax({
  			url: url,
  			method: 'POST',
  			headers: body.headers,
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