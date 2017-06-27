import React, {Component} from 'react';
import Globals from 'globals';

class CourseInfo extends Component {
	getRelations() {
		var relations = [
			{ name: 'Prerequisites', value: 'prereqs' }, 
			{ name: 'Corequisites', value: 'coreqs' },
			{ name: 'Restrictions', value: 'restrictions' },
			{ name: 'Credit granted for', value: 'credit_granted_for' },
			{ name: 'Also offered as', value: 'also_offered_as' },
			{ name: 'Formerly', value: 'formerly' },
			{ name: 'Additional info', value: 'additional_info' }
		];
		var components = [];

		for (var i = 0; i < relations.length; i++) {
			var value = this.props.course.relationships[relations[i].value];
			if (value) {
				components.push(
					<p key={i}>
						<strong>{relations[i].name + ': '}</strong>
						<span>{value}</span>
					</p>
				)
			}
			
		}

		return components;
	}

	render() {
		if (!this.props.course.course_id) {
			return <div>Loading...</div>
		}

		var courseId = this.props.course.course_id;
		var semester = this.props.course.semester;
		var dept = this.props.course.dept_id;
		var genEd = this.props.course.gen_ed;
		var core = this.props.course.core;

		var profs = [];

		for (var i = 0; i < this.props.course.professors.length; i++) {
			profs.push(<span className='red' key={i}>{this.props.course.professors[i]}</span>)
			//profs.push(<a key={i} href=''>{this.props.course.professors[i]}</a>)
			profs.push(', ');
		}
		profs.pop(); // remove trailing comma


		var noReviewsPanel;
		if (!this.props.course.num_responses) {
			noReviewsPanel = 
				<div className="col-md-8 col-md-offset-2">
                    <div className="panel panel-warning">
                        <div className="panel-heading">No reviews were found. <a>Be the first </a>
                            to contribute for this course!</div>
                    </div>
                </div>
		}
		var padding = {paddingRight: '10px'};
		return (
			<div className='info-main'>
				<h1>{this.props.course.course_id}</h1>
				<h2>{this.props.course.name}</h2>
				<p>
					<a href={'https://ntst.umd.edu/soc/'+semester+'/' + dept + '/' + courseId}>
						View course on Testudo
					</a>
				</p>
				<p>
					<i>{this.props.course.credits + ' credits'}</i>
				</p>
				<p>
					<strong>Most recently offered: </strong>
					<span className='red'>{Globals.getSemesterFromCode(semester)}</span>
				</p>
				<p>
					<strong>Taught by: </strong>{profs}
				</p>
				<p>
					<strong>Gen Ed: </strong>
						<span className='red' style={padding}>{genEd ? genEd.join(', ') || 'None' : ''}</span>
					<strong>Core: </strong>
						<span className='red' style={padding}>{core ? core.join(', ') || 'None' : ''}</span>
				</p>
				{this.getRelations()}
				<p>
					{this.props.course.description}
				</p>
				<br/>

				{ noReviewsPanel }
				
			</div>
		)
	}
}

export default CourseInfo;