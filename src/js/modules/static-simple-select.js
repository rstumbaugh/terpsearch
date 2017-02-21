var React = require('react');
var SimpleSelect = require('react-selectize').SimpleSelect;

var StaticSimpleSelect = React.createClass({
	getInitialState: function() {
		return {
			value: this.props.default
		}
	},

	componentWillReceiveProps: function(props) {
		this.setState({
			value: this.props.value
		})
	},

	handleChange: function(item) {
		var self = this;
		this.setState({
			value: item || this.props.default
		}, function() {
			self.props.onValueChange(self.state.value)
		})
	},

	render: function() {
		var self = this;
		return (
			<SimpleSelect
				hideResetButton={true}
				theme='bootstrap3'
				options={this.props.options}
				value={this.state.value}
				onValueChange={this.handleChange}
				uid={function(item) {
					return item
				}}
				renderOption={function(option) {
					return <div className='selectize-option'>{option}</div>
				}}
				renderValue={function(item) {
					return <div>{item}</div>
				}}
				filterOptions={function(options, search) {
					return options
				}}
				style={this.props.style}
			/>
		)
	}
})

module.exports = StaticSimpleSelect;