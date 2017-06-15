import React, {Component} from 'react';

class Footer extends Component {
    render() {
      return (
        <div className="row footer">
          <div className="col-sm-12 col-md-10 col-md-offset-1">
            <div className="col-sm-12">
              <p>Made at the University of Maryland, College Park</p>
            </div>
            <div className="col-sm-12">
              <div className="footer-links col-sm-6 col-sm-offset-3">
                <div className="col-xs-4">
                  <a href="admin.html">Admin Login</a>
                </div>
                <div className="col-xs-4">
                  <a href='feedback.html'>Contact</a>
                </div>
                <div className="col-xs-4">
                  <a href="https://github.com/rstumbaugh/terpsearch" target="_blank">GitHub</a>
                </div>
              </div>
            <br/><br/>
            </div>
            <div className="col-sm-12">
              Icons made by <a href="http://www.freepik.com" target="_blank" title="Freepik">Freepik</a> and 
              <a href="http://www.flaticon.com/authors/madebyoliver" target="_blank" title="Madebyoliver"> Madebyoliver </a> 
              from <a href="http://www.flaticon.com" target="_blank" title="Flaticon">
              www.flaticon.com</a> is licensed by 
              <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 
              BY</a>
            </div>
          </div>
        </div>
      )
    }
}

export default Footer;