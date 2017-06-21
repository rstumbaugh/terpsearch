import React, {Component} from 'react';
import {ReactSelectize, SimpleSelect} from 'react-selectize';
import Globals from 'globals';
import * as isofetch from 'isomorphic-fetch';

class RemoteSimpleSelect extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			search: '',
			results: [],
			value: undefined,
			minSearchLength: props.minSearchLength || 2
		}
	}

	reset() {
		this.setState({
			search: '',
			results: [],
			value: undefined,
			minSearchLength: this.props.minSearchLength || 2
		})
	}

	render() {
		var self = this;

		return (
			<SimpleSelect
				placeholder={this.props.placeholder}
				ref='select'
				theme='bootstrap3'
				options={this.state.results}
				search={this.state.search}
				value={this.state.value}

				onSearchChange={function(search) {
					self.setState({
						search: search
					})

					if (search.length > self.state.minSearchLength) {
						fetch(self.props.url + search)
							.then(Globals.handleFetchResponse)
							.then(function(response) {
								self.setState({
									results: response
								})
							})
					}
				}}

				onValueChange={function(item) {
					self.setState({
						value: item
					})
					self.props.onValueChange(self.props.name, item[self.props.textField])
				}}

				filterOptions = {function(options, search){
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

export default RemoteSimpleSelect;