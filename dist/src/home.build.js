(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/ryanstumbaugh/Development/repos/terpsearch/src/js/home.js":[function(require,module,exports){
var EmailBox = React.createClass({displayName: "EmailBox",
	getInitialState: function() {
		return {
			email: ''
		}
	},
	handleChange: function(e) {
		this.setState({
			email: e.target.value
		})
	},
	handleSubmit: function() {
		console.log(this.state.email);
		this.setState({
			email: ''
		})
	},
	render: function() {
		return (
			React.createElement("div", null, 
				React.createElement("input", {type: "text", 
					   cssClass: "form-control", 
					   placeholder: "me@example.com", 
					   value: this.state.email, 
					   onChange: this.handleChange}
				), 
	            React.createElement("span", {cssClass: "input-group-btn"}, 
	                React.createElement("button", {cssClass: "btn btn-default", id: "btnEmail", onClick: this.handleSubmit}, "Go!")
	            )
	        )
		)
	}
});

React.render(React.createElement(EmailBox, null), document.getElementById('email'));

},{}]},{},["/Users/ryanstumbaugh/Development/repos/terpsearch/src/js/home.js"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcnlhbnN0dW1iYXVnaC9EZXZlbG9wbWVudC9yZXBvcy90ZXJwc2VhcmNoL3NyYy9qcy9ob21lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBSSw4QkFBOEIsd0JBQUE7Q0FDakMsZUFBZSxFQUFFLFdBQVc7RUFDM0IsT0FBTztHQUNOLEtBQUssRUFBRSxFQUFFO0dBQ1Q7RUFDRDtDQUNELFlBQVksRUFBRSxTQUFTLENBQUMsRUFBRTtFQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDO0dBQ2IsS0FBSyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSztHQUNyQixDQUFDO0VBQ0Y7Q0FDRCxZQUFZLEVBQUUsV0FBVztFQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDOUIsSUFBSSxDQUFDLFFBQVEsQ0FBQztHQUNiLEtBQUssRUFBRSxFQUFFO0dBQ1QsQ0FBQztFQUNGO0NBQ0QsTUFBTSxFQUFFLFdBQVc7RUFDbEI7R0FDQyxvQkFBQSxLQUFJLEVBQUEsSUFBQyxFQUFBO0lBQ0osb0JBQUEsT0FBTSxFQUFBLENBQUEsQ0FBQyxJQUFBLEVBQUksQ0FBQyxNQUFBLEVBQU07UUFDZCxRQUFBLEVBQVEsQ0FBQyxjQUFBLEVBQWM7UUFDdkIsV0FBQSxFQUFXLENBQUMsZ0JBQUEsRUFBZ0I7UUFDNUIsS0FBQSxFQUFLLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUM7UUFDeEIsUUFBQSxFQUFRLENBQUUsSUFBSSxDQUFDLFlBQWMsQ0FBQTtJQUN6QixDQUFBLEVBQUE7YUFDQyxvQkFBQSxNQUFLLEVBQUEsQ0FBQSxDQUFDLFFBQUEsRUFBUSxDQUFDLGlCQUFrQixDQUFBLEVBQUE7aUJBQzdCLG9CQUFBLFFBQU8sRUFBQSxDQUFBLENBQUMsUUFBQSxFQUFRLENBQUMsaUJBQUEsRUFBaUIsQ0FBQyxFQUFBLEVBQUUsQ0FBQyxVQUFBLEVBQVUsQ0FBQyxPQUFBLEVBQU8sQ0FBRSxJQUFJLENBQUMsWUFBYyxDQUFBLEVBQUEsS0FBWSxDQUFBO2FBQ3RGLENBQUE7U0FDTCxDQUFBO0dBQ1o7RUFDRDtBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILEtBQUssQ0FBQyxNQUFNLENBQUMsb0JBQUMsUUFBUSxFQUFBLElBQUEsQ0FBRyxDQUFBLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgRW1haWxCb3ggPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGVtYWlsOiAnJ1xuXHRcdH1cblx0fSxcblx0aGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihlKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRlbWFpbDogZS50YXJnZXQudmFsdWVcblx0XHR9KVxuXHR9LFxuXHRoYW5kbGVTdWJtaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuZW1haWwpO1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0ZW1haWw6ICcnXG5cdFx0fSlcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdj5cblx0XHRcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgXG5cdFx0XHRcdFx0ICAgY3NzQ2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBcblx0XHRcdFx0XHQgICBwbGFjZWhvbGRlcj1cIm1lQGV4YW1wbGUuY29tXCIgXG5cdFx0XHRcdFx0ICAgdmFsdWU9e3RoaXMuc3RhdGUuZW1haWx9XG5cdFx0XHRcdFx0ICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfT5cblx0XHRcdFx0PC9pbnB1dD5cblx0ICAgICAgICAgICAgPHNwYW4gY3NzQ2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj5cblx0ICAgICAgICAgICAgICAgIDxidXR0b24gY3NzQ2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBpZD1cImJ0bkVtYWlsXCIgb25DbGljaz17dGhpcy5oYW5kbGVTdWJtaXR9PkdvITwvYnV0dG9uPlxuXHQgICAgICAgICAgICA8L3NwYW4+XG5cdCAgICAgICAgPC9kaXY+XG5cdFx0KVxuXHR9XG59KTtcblxuUmVhY3QucmVuZGVyKDxFbWFpbEJveCAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VtYWlsJykpOyJdfQ==
