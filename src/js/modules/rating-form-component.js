var React = require('react');

var FormComponent = React.createClass({
	getInitialState: function() {
		return {
			errorClass: '',
			errorMsgClass: 'slide closed'
		}
	},
	componentWillReceiveProps: function(nextProps) {
		this.setState({
			errorClass: nextProps.error ? 'has-error' : '',
			errorMsgClass: nextProps.error ? 'slide open' : 'slide closed'
		})
	},
	render: function() {
		var message, errorMessage;
		if (this.props.message) {
			message = <p className='help-block'>{this.props.message}</p>;
		}
		if (this.props.errorMessage) {
			errorMessage = <p className={'help-block '+this.state.errorMsgClass}>{this.props.errorMessage}</p>;
		}
		return (
			<div className={'form-component col-sm-12 '+this.state.errorClass}>
				<label className='control-label col-sm-3'>{this.props.labelText}</label>
				<div className='col-sm-8'>
					{this.props.component}
					{message}
					{errorMessage}
				</div>
			</div>
		)
	}
})


module.exports = FormComponent;