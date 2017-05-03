var times = 0;

$(document).ready(function() {
	// var lastTime = localStorage.lastTime
	// if (lastTime == undefined) {
	// 	lastTime = new Date().toISOString().slice(0, 10) + " 08:00";
	// }
	// var interval = localStorage.interval
	// if (interval == undefined) {
	// 	interval = 30;
	// } else {
	// 	interval = parseInt(localStorage.interval) / 1000 / 60
	// }
	// var keywords = localStorage.keywords
	// if (keywords == undefined) {
	// 	keywords = "";
	// } else {
	// 	keywords = keywords.split(",").join("\n")
	// }
	$('#startDate').val(getLastTime());
	$('#interval').val(getInterval());
	$('#keywords').val(getKeywords());

	$('#submit').on('click', function() {
		times += 1;
		// var interval = 30;
		// var keywords = ['*'];

		var interval = parseInt($('#interval').val());
		var lastTime = $('#startDate').val()
		var keywords = $('#keywords').val().split('\n')
		flushConfig(interval, keywords, lastTime)
		$('#ok').html("<font style='color:red'>updated! " + times + "</font>");
	});
});