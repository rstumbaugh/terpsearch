import React from 'react';

export default props => 
	<div className='home-content-wrap row'>
		<div className='home-content-heading'>
			Changelog
		</div>
		<div className='col-md-10 col-md-offset-1'>
			<div className='card'>
				{ props.children }
			</div>
		</div>
	</div>
