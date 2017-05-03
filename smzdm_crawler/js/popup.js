window.onload = function() {
	datas = localStorage.result
	if (datas == undefined) {
		crawl()
		$('#mybody').append("trying to update")
	} else {		
		crawl()
		result = JSON.parse(datas);
		for (var i = 0; i < result.length; i++) {
			$('#mybody').append(result[i])
		}
	}
}