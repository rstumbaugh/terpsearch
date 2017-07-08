import React, {Component} from 'react';
import Disclaimer from 'components/disclaimer';

class Content extends Component {
	render() {
		var disclaimer;
		if (!this.props.noDisclaimer) {
			disclaimer = <Disclaimer />
		}
		return (
			<div className='content-wrap'>
				<div className='container-fluid'>
					{disclaimer}
					<div className='row'>
						<div className={this.props.offset ? 'col-md-10 col-md-offset-1' : 'col-sm-12'}>
							{this.props.children}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Content;