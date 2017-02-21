var React = require('react');
var Globals = require('./globals.js');

var CourseInfo = React.createClass({
	render: function() {
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
			profs.push(<a key={i} href=''>{this.props.course.professors[i]}</a>)
			profs.push(', ');
		}
		profs.pop(); // remove trailing comma

		return (
			<div className='course-info'>
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
						<span className='red'>{genEd ? genEd.join(', ') || 'None' : ''}</span>
					<strong>Core: </strong>
						<span className='red'>{core ? core.join(', ') || 'None' : ''}</span>
				</p>
				{this.getRelations()}
				<p>
					{this.props.course.description}
				</p>
			</div>
		)
	},

	getRelations: function() {
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
})


module.exports = CourseInfo;