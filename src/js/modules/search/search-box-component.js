var React = require('react');

var SearchComponent = React.createClass({
	render: function() {
		return (
			<div className='form-group'>
				<label>{this.props.labelText}</label>
				{this.props.component}
				{this.props.subcomponent}
			</div>
		)
	}
})

module.exports = SearchComponent;