import React, {Component} from 'react';
import {ReactSelectize, SimpleSelect, MultiSelect} from 'react-selectize';
import RemoteMultiSelect from 'components/remote-multi-select.js';
import StaticSimpleSelect from 'components/static-simple-select.js';
import SearchComponent from './search-box-component.js';
import Globals from 'globals';

class SearchBox extends Component {
	constructor() {
		super();
		
		this.state = {
			keyword: '',
			prof: [],
			dept: [],
			gened: [],
			gened_type: 'or',
			sort: {label: 'Course ID (A - Z)', value: 'course_id'},
			per_page: '25'
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps && Object.keys(nextProps.formData).length > 0) {
			this.setState(nextProps.formData);
		}
	}

	componentDidMount() {
		var self = this;
		
		document.onkeydown = function() {
			// submit form on enter press
			if (window.event.keyCode == '13') {
				self.submitForm();
			}
		}
	}

	handleChange(field, value) {
		var s = {};

		// watch out for ugly values
		if (!(value instanceof Array) && value instanceof Object) {
			value = value.target.value;
		}
		s[field] = value;
		this.setState(s);
	}

	submitForm() {
		this.props.updateQuery(this.state);
	}

	render() {
		var self = this;
		// option groups for Gen Ed dropdown
		var genedGroups = [{
			groupId: 'any',
			title: 'Any'
		},{
			groupId: 'ds',
			title: 'Distributive Studies'
		},{
			groupId: 'dv',
			title: 'Diversity'
		},{
			groupId: 'fs',
			title: 'Fundamental Studies'
		},{
			groupId: 'sc',
			title: 'Signature Series'
		}];
		// geneds for dropdown
		var geneds = [
			['any', 'Any',  'Any'],

			['ds', 'DSHS', 'DSHS - History and Social Sciences'],
			['ds', 'DSHU', 'DSHU - Humanities'],
			['ds', 'DSSP', 'DSSP - Scholarship and Practice'],
			['ds', 'DSNS', 'DSNS - Natural Sciences'],
			['ds', 'DSNL', 'DSNL - Natural Sciences Lab'],

			['dv', 'DVUP', 'DVUP - Understanding Plural Societies'],
			['dv', 'DVCC', 'DVCC - Cultural Competency'],

			['fs', 'FSAR', 'FSAR - Analytic Reasoning'],
			['fs', 'FSMA', 'FSMA - Math'],
			['fs', 'FSOC', 'FSOC - Oral Communications'],
			['fs', 'FSAW', 'FSAW - Academic Writing'],
			['fs', 'FSPW', 'FSPW - Professional Writing'],

			['sc', 'SCIS', 'SCIS - I-Series']
		];

		var sorts = [
			['course_id', 'Course ID (A - Z)'],
			['-course_id', 'Course ID (Z - A)'],
			['avg_diff', 'Difficulty (Low - High)'],
			['-avg_diff', 'Difficulty (High - Low)'],
			['avg_int', 'Interest (Low - High)'],
			['-avg_int', 'Interest (High - Low)']
		];

		var perPage = ['25', '50', '100'];
		
		// radio buttons underneath gen ed dropdown
		var genedRadios = 
			<div className='radio-inline'>
				<div className='radio'>
					<label>
						<input type='radio' name='gened_type' value='or' checked={this.state.gened_type == 'or'}
							   onChange={this.handleChange.bind(this, 'gened_type', 'or')} />
						At least 1 selected Gen Ed
					</label>
				</div>
				<div className='radio'>
					<label>
						<input type='radio' name='gened_type' value='all' checked={this.state.gened_type == 'and'}
							   onChange={this.handleChange.bind(this, 'gened_type', 'and')} />
						All selected Gen Eds
					</label>
				</div>
			</div>

		// all search components
		var keyword = <input type='text' className='form-control' placeholder='Enter search terms'
							 value={this.state.keyword} onChange={this.handleChange.bind(this, 'keyword')}></input>;
		var professors = <RemoteMultiSelect
								placeholder="Enter professor's name"
								url={Globals.API_LIST_PROFS + '?search='}
								textField='name'
								name='prof'
								loadOnSearchChange={true}
								onValuesChange={this.handleChange.bind(this)}
						 />
		var departments = <RemoteMultiSelect
								placeholder='Enter departments (e.g. AASP)'
								url={Globals.API_LIST_DEPARTMENTS}
								textField='dept_id'
								name='dept'
								minSearchLength={0}
								loadOnSearchChange={false}
								onValuesChange={this.handleChange.bind(this)}
						 />
		var genedComponent = <MultiSelect
								placeholder='Enter Gen Eds (e.g. DSHU)'
								groups={genedGroups}
								theme='bootstrap3'
								options={geneds.map(function(item) {
									return {
										groupId: item[0],
										value: item[1],
										label: item[2],
									}
								})}

								onValuesChange={function(items) {
									self.setState({
										gened: items.map(function(item) {return item.value})
									})
								}}

								renderValue={function(item) {
									return <div className='selectize-item'>
												{item.value}
										   </div>
								}}
							/>

		var sortComponent = <SimpleSelect
								hideResetButton={true}
								value={this.state.sort}
								theme='bootstrap3'
								options={sorts.map(function(item) {
									return {
										label: item[1],
										value: item[0]
									}
								})}

								onValueChange={function(item) {
									self.setState({
										sort: item || {label: 'Course ID (A - Z)', value: 'course_id'}
									})
								}}
							/>

		var pageComponent = <SimpleSelect
								hideResetButton={true}
								theme='bootstrap3'
								options={perPage}
								value={this.state.per_page}
								onValueChange={function(value) {
									self.setState({
										per_page: value
									})
								}}
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
							/>

		return (
			<div className='search-box-wrap card row'>
				<div className='search-box col-sm-12'>
					<h1>Filter Courses</h1>
					<form>
						<div className='col-lg-10'>
							<SearchComponent
								labelText='Search by keyword or course ID'
								component={keyword} />
						</div>
						<div className='clearfix visible-md visible-lg'></div>
						<div className='col-sm-6 col-lg-5'>
							<SearchComponent
								labelText='Filter professors'
								component={professors}
								subcomponent={<p className='help-block'>Shows courses taught by at least 
											one of the selected professors</p>} 
							/>
						</div>
						<div className='col-sm-6 col-lg-4'>
							<SearchComponent
								labelText='Filter departments'
								component={departments}
							/>
						</div>
						<div className='clearfix visible-sm visible-md visible-lg'></div>
						<div className='col-sm-6 col-lg-3'>
							<SearchComponent
								labelText='Filter Gen Eds'
								component={genedComponent}
								subcomponent={genedRadios}
							/>
						</div>
						<div className='clearfix visible-sm'></div>
						<div className='col-lg-3 col-sm-5'>
							<SearchComponent
								labelText='Sort by:'
								component={sortComponent}
							/>
						</div>
						<div className='col-sm-2 col-xs-4'>
							<SearchComponent
								labelText='Per Page:'
								component={pageComponent}
							/>
						</div>
						<div className='clearfix visible-xs visible-sm visible-md visible-lg'></div>
						<div className='col-sm-3'>
							<div className='btn btn-primary' onClick={this.submitForm.bind(this)}>Search</div>
						</div>
					</form>
				</div>
			</div>
		)
	}
}

export default SearchBox;