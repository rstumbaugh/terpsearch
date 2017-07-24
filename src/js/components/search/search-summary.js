import React, {Component} from 'react';
import Sensor from 'react-visibility-sensor';
import Select from 'react-select';

class SearchSummary extends Component {
	constructor() {
		super();

		this.state = {
			perPage: 0,
			numResults: 0,
			totalResults: 0,
			numPages: 0,
			currentPage: 1,
			showSummary: false
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			perPage: nextProps.perPage,
			numResults: nextProps.numResults,
			totalResults: nextProps.totalResults,
			numPages: Math.ceil(nextProps.totalResults / nextProps.perPage),
			showSummary: nextProps.showSummary
		});
	}

	handleVisibilityChange(visible) {
	
		this.setState({
			visible: visible
		})
	}

	handlePageChange(page) {
		this.setState({
			currentPage: page
		})
	}

	handleArrowClick(direction) {
		if (direction == 'left' && this.state.currentPage > 1) {
			this.handlePageChange(this.state.currentPage - 1)
		} else if (direction == 'right' && this.state.currentPage < this.state.numPages) {
			this.handlePageChange(this.state.currentPage + 1)
		}
	}

	getPages() {
		var pages = [];
		for (var i = 1; i <= this.state.numPages; i++) {
			pages.push(i);
		}

		return pages.map(x => ({label: x, value: x}));
	}

	render() {
		var pagePicker = 
			<Select
				simpleValue
				options={this.getPages()}
				value={this.state.currentPage}
				onChange={this.handlePageChange.bind(this)}
				className='search-summary-input'
				clearable={false}
			/>
		
		// when falls out of focus, insert placeholder div to maintain document height
		// and move summary to top of screen in fixed position
		var placeholderHeight;
		var summaryWrap = document.getElementById('summaryWrap');
		if (summaryWrap) { // get height of wrap to make placeholder
			placeholderHeight = summaryWrap.clientHeight;

		}

		// only fix summary if summary position is above scroll position
		var summaryIsAbove = false;
		var doc = document.documentElement;
		var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
		var anchor = document.getElementById('summaryAnchor');
		
		if (anchor) {
			summaryIsAbove = top > anchor.offsetTop;
		}

		// show summary if invisible and below top
		var placeholderStyle = !this.state.visible && summaryIsAbove ? {} : {display: 'none'};
		placeholderStyle.height = placeholderHeight;

		var style = this.state.numResults == 0 ? {display: 'none'} : {};
		var className = this.state.showSummary ? (!this.state.visible && summaryIsAbove ? 'fix' : '') : 'hidden';
		
		return (
			<div style={style}>
				<div id='summaryAnchor' className='before'></div>
				<Sensor
					scrollCheck={true}
					scrollDelay={50}
					intervalDelay={500}
					partialVisibility={false}
					onChange={this.handleVisibilityChange.bind(this)}>
					<div className='sensor-anchor'></div>
				</Sensor>
				<div className='after'></div>
				<div id='summaryWrap' className={`card search-summary-wrap row ${className}`}>
					<div className='search-summary col-sm-4'>
						{`Found ${this.state.totalResults}, showing ${this.state.numResults}`}
					</div>
					<div className='pages col-sm-8'>
						<a onClick={this.handleArrowClick.bind(this, 'left')}>
							<span className='glyphicon glyphicon-triangle-left' />
						</a>
							Page {pagePicker} of {this.state.numPages}
						<a onClick={this.handleArrowClick.bind(this, 'right')}>
							<span className='glyphicon glyphicon-triangle-right' />
						</a>
					</div>
				</div>
				<div style={placeholderStyle}></div>
			</div>
		)
	}
}


export default SearchSummary;