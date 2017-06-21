import React, {Component} from 'react';

class Content extends Component {
	render() {
		return (
			<div className='container-fluid'>
				<div className='row'>
					<div className={this.props.offset ? 'col-md-10 col-md-offset-1' : 'col-sm-12'}>
						{this.props.children}
					</div>
				</div>
			</div>
		)
	}
}

export default Content;