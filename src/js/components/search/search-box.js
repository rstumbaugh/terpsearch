import React, {Component} from 'react';
import Select from 'react-select';
import RemoteMultiSelect from 'components/remote-multi-select.js';
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
			sort: 'course_id',
			per_page: '25'
		}
	}

	// populate form data from parent App if user already performed search
	componentWillReceiveProps(nextProps) {
		if (nextProps && nextProps.formData && Object.keys(nextProps.formData).length > 0) {
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
		s[field] = value;
		this.setState(s, () => console.log(this.state));
	}

	submitForm() {
		this.props.updateQuery(this.state);
	}

	render() {
		var self = this;
		// geneds for dropdown
		var geneds = [
			{value: 'Any',  label: 'Any'},
			{value: 'DSHS', label: 'DSHS - History and Social Sciences'},
			{value: 'DSHU', label: 'DSHU - Humanities'},
			{value: 'DSSP', label: 'DSSP - Scholarship and Practice'},
			{value: 'DSNS', label: 'DSNS - Natural Sciences'},
			{value: 'DSNL', label: 'DSNL - Natural Sciences Lab'},
			{value: 'DVUP', label: 'DVUP - Understanding Plural Societies'},
			{value: 'DVCC', label: 'DVCC - Cultural Competency'},
			{value: 'FSAR', label: 'FSAR - Analytic Reasoning'},
			{value: 'FSMA', label: 'FSMA - Math'},
			{value: 'FSOC', label: 'FSOC - Oral Communications'},
			{value: 'FSAW', label: 'FSAW - Academic Writing'},
			{value: 'FSPW', label: 'FSPW - Professional Writing'},
			{value: 'SCIS', label: 'SCIS - I-Series'}
		];

		var sorts = [
			{value: 'course_id',  label: 'Course ID (A - Z)'},
			{value: '-course_id', label: 'Course ID (Z - A)'},
			{value: 'avg_diff',   label: 'Difficulty (Low - High)'},
			{value: '-avg_diff',  label: 'Difficulty (High - Low)'},
			{value: 'avg_int',    label: 'Interest (Low - High)'},
			{value: '-avg_int',   label: 'Interest (High - Low)'}
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
		var keyword = 
			<input 
				type='text' className='form-control' placeholder='Enter search terms' 
				value={this.state.keyword} onChange={this.handleChange.bind(this, 'keyword')}>
			</input>;

		// remote multi select
		var professors = 
			<RemoteMultiSelect
				placeholder="Enter professor's name"
				url={Globals.API_LIST_PROFS + '?search='}
				textField='name'
				name='prof'
				onChange={this.handleChange.bind(this)}
				value={this.state.prof}
	 		/>

	 	// remote multi select, but load options first
		var departments = (
			<RemoteMultiSelect
				name='dept'
				loadOptionsOnMount
				textField='dept_id'
				minSearchLength={0}
				value={this.state.dept}
				url={Globals.API_LIST_DEPARTMENTS}
				onChange={this.handleChange.bind(this)}
				placeholder='Enter departments (e.g. AASP)'
			/>
		)

		// static multi select
		var genedComponent =
			<Select
				multi
				name='gened'
				placeholder='Gen Ed (i.e. DSHU)'
				onChange={items => this.handleChange('gened', items)}
				options={geneds}
				value={this.state.gened}
				valueRenderer={item => item.value}
			/>

		// static simple select
		var sortComponent = 
			<Select
				name='sort'
				onChange={item => this.handleChange('sort', item)}
				options={sorts}
				value={this.state.sort}
			/>

		// static simple select
		var pageComponent = 
			<Select
				name='per_page'
				simpleValue
				onChange={item => this.handleChange('per_page', item)}
				options={perPage.map(x => ({label: x, value: x}))}
				value={this.state.per_page}
			/>

		return (
			<div className='search-box-wrap card row'>
				<div className='search-box col-sm-12'>
					<h1>Filter Courses</h1>
					<form>
						<div className='col-lg-10'>
							<SearchComponent
								labelText='Search by keyword or course ID'
								component={keyword} 
							/>
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