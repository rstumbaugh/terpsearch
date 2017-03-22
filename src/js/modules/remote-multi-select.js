var React = require('react');
var MultiSelect = require('react-selectize').MultiSelect;
var Globals = require('./globals.js');
require('es6-promise').polyfill();
require('isomorphic-fetch');

var RemoteMultiSelect = React.createClass({
	render: function() {
		var self = this;
		return (
			<MultiSelect
				placeholder={this.props.placeholder}
				ref='select'
				theme='bootstrap3'
				options={self.state.results}
				value={self.state.values}
				search={self.state.search}

				onSearchChange={function(search) {
					self.setState({
						search: search
					})
					if (self.props.loadOnSearchChange && search.length > self.state.minSearchLength) {
						fetch(self.props.url + search)
							.then(Globals.handleFetchResponse)
							.then(function(response) {
								self.setState({
									results: response
								})
							})
					} else {
						var regex = '.*' + search + '.*';

						var filtered = self.state.allOptions.filter(function(item) {
		                	return !!item[self.props.textField].match(new RegExp(regex, 'i'));
		                });
						self.setState({
							results: filtered
						})
					}
				}}

				onValuesChange={function(items) {
					self.setState({
						values: items,
						search: '',
						results: []
					})
					var names = items.map(function(item) {return item[self.props.textField]});
					self.props.onValuesChange(self.props.name, names);
				}}

				filterOptions={function(options, search) {
					return options;
				}}

				uid={function(item) {
					return item[self.props.textField]
				}}

				renderOption={function(item) {
					return <div className='selectize-option'>{item[self.props.textField]}</div>
				}}

				renderValue={function(item) {
					return <div className='selectize-item'>{item[self.props.textField]}</div>
				}}

				renderNoResultsFound={function(value, search) {
					return  <div className='selectize-option-empty'>
								<i>{self.state.search.length > self.state.minSearchLength 
										? 'No results found' : 'Start typing to search'}</i>
							</div>
				}}

			/>
		)

	},

	componentDidMount: function() {
		var self = this;
		console.log('mounted');
		if (!this.props.loadOnSearchChange) {
			fetch(this.props.url)
				.then(Globals.handleFetchResponse)
				.then(function(response) {
					self.setState({
						allOptions: response,
						results: response
					})
				})
		}
	},

	getInitialState: function() {
		return {
			search: '',
			results: [],
			allOptions: [],
			values: [],
			minSearchLength: this.props.minSearchLength || 2
		}
	}
})


module.exports = RemoteMultiSelect;