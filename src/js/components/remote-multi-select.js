import React, {Component} from 'react';
import Globals from 'globals';
import * as isofetch from 'isomorphic-fetch';
import Ajax from 'utils/ajax';
import Select from 'react-select';

class RemoteMultiSelect extends Component {
	constructor(props) {
		super(props);

		this.state = {
			options: []
		}
	}

	// can load options either on type or on mount
	componentDidMount() {
		if (this.props.loadOptionsOnMount) {
			this.loadOptions();
		}
	}

	// load options from remote source with optional search query
	loadOptions(input = '') {
		return Ajax.get(this.props.url + input)
			.then(res => JSON.parse(res.response))
			.then(response => {
				const options = { options: this.getOptions(response) };
				this.setState(options)
				return options;
			})
			.catch(err => {
				console.error(err)
			})
	}

	// pass change up to parent
	onChange(value) {
		this.props.onChange(this.props.name, value);
	}

	// map array of JSON results to array of { label: _, value: _ }
	getOptions(items) {
		const textField = this.props.textField;
		const valueField = this.props.valueField || textField;

    return items.map(i => ({ label: i[textField], value: i[valueField] }));
  }

  // if load results on search, perform search
  search(input) {
		if (!input || input.length < (this.props.minSearchLength || 2)) { 
			return Promise.resolve({ options: [] }) 
		}

    return this.loadOptions(input);
	}

	render() {
		var self = this;
		var component;

		if (this.props.loadOptionsOnMount) {
			component = (
				<Select
					multi
					name={this.props.name}
					placeholder={this.props.placeholder}
					options={this.state.options}
					onChange={this.onChange.bind(this)}
					value={this.props.value}
				/>
			)
		} else {
			component = (
				<Select.Async
					multi
					name={this.props.name}
					placeholder={this.props.placeholder}
					loadOptions={this.search.bind(this)}
					onChange={this.onChange.bind(this)}
					value={this.props.value}
				/>
			)
		}

		return component;
	}
}

export default RemoteMultiSelect;