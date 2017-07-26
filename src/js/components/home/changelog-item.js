import React from 'react';

export default props => 
	<div className='home-content-item row'>
		<div className='home-version col-sm-12'>
			<h3 className='home-version-title'>
				{`v${props.version}`}
				<i className='home-version-date'>
					{ `\u2014 ${props.date}` }
				</i>
			</h3>
			<p className='home-version-desc'>
				{props.description}
			</p>
		</div>
	</div>
