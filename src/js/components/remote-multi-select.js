import React, {Component} from 'react';
import {MultiSelect} from 'react-selectize';
import Globals from 'globals';
import * as isofetch from 'isomorphic-fetch';

class RemoteMultiSelect extends Component {
	constructor(props) {
		super(props);

		this.state = {
			search: '',
			results: [],
			allOptions: [],
			values: [],
			minSearchLength: props.minSearchLength || 2
		}
	}

	componentDidMount() {
		var self = this;
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
	}

	render() {
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

	}
}

export default RemoteMultiSelect;