import React, {Component} from 'react';
import {ReactSelectize, SimpleSelect} from 'react-selectize';
import Select from 'react-select';
import Globals from 'globals';
import Ajax from 'utils/ajax';

// simple select box from remote data source
class RemoteSimpleSelect extends Component {
	componentWillReceiveProps(nextProps) {
		this.setState({
			value: nextProps.value || ''
		})
	}

	// pass change to parent
	onChange(value) {
		this.props.onChange(this.props.name, value.value);
	}

	// map array of JSON results to array of { label: _, value: _ }
	getOptions(items) {
		const textField = this.props.textField;
		const valueField = this.props.valueField || textField;

    return items.map(i => ({ label: i[textField], value: i[valueField] }));
  }

  // get options from data source
	search(input) {
		if (!input || input.length < (this.props.minSearchLength || 2)) { 
			return Promise.resolve({ options: [] }) 
		}

    return Ajax.get(`${this.props.url}${input}`)
      .then(response => {
        return JSON.parse(response.response);
      })
      .then(response => {
        const obj = { options: this.getOptions(response) };
        return obj;
      })
      .catch(err => {
        console.error(err)
      })
	}

	render() {
		return (
			<Select.Async 
        name={this.props.name}
        placeholder={this.props.placeholder}
        loadOptions={this.search.bind(this)}
        onChange={this.onChange.bind(this)}
        isLoading={false}
        value={this.props.value}
      />
		)	
	}
}

export default RemoteSimpleSelect;