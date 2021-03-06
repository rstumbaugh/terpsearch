import React, {Component} from 'react';
import SearchItem from './search-item.js';
import Globals from 'globals';

class SearchResults extends Component {
	constructor() {
		super();

		this.state = {
			status: 'waiting',
			results: []
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			results: nextProps.results,
			status: nextProps.status
		});
	}

	getSearchItems() {
		if (this.state.results.length == 0) {
			return <div className='empty'><i>No results to display.</i></div>;
		}

		var items = [];

		for (var i = 0; i < this.state.results.length; i++) {
			var course = this.state.results[i];
			var sortedSemesters = course.semesters.sort()
			var lastOffered = sortedSemesters[sortedSemesters.length - 1]
			items.push(
				<SearchItem 
					key={i}
					course_id={course.course_id}
					title={course.name}
					description={course.description}
					gen_ed={(course.gen_ed ? course.gen_ed.join(', ') : '') || 'None'}
					credits={course.credits}
					lastOffered={Globals.getSemesterFromCode(lastOffered)}
					diffRating={course.avg_diff ? course.avg_diff.toFixed(1) : 'N/A'}
					intRating={course.avg_int ? course.avg_int.toFixed(1) : 'N/A'}
					hasReviews={course.num_responses > 0}
				/>
			)
		}

		return items;
	}

	render() {
		var results;

		if (this.state.status == 'done' || this.state.status == 'waiting') {
			results = this.getSearchItems();
		} else if (this.state.status == 'loading') {
			results = <div className='empty'><i>Loading...</i></div>;
		}
		
		return (
			<div className='search-results-wrap row'>
				{results}
			</div>
		)
	}
}

export default SearchResults;