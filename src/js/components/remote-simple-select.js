import React, {Component} from 'react';
import Select from 'react-select';
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
		this.props.onChange(this.props.name, value ? value.value : undefined);
	}

	getOptionText(item) {
		if (typeof(this.props.textField) === 'string') return item[this.props.textField]
		else return this.props.textField(item)
	}

	getOptionValue(item) {
		if (this.props.valueField) return item[this.props.valueField]
		else return this.getOptionText(item);
	}

	// map array of JSON results to array of { label: _, value: _ }
	getOptions(items) {
    return items.map(i => ({ label: this.getOptionText(i), value: this.getOptionValue(i) }));
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
				className={this.props.className}
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