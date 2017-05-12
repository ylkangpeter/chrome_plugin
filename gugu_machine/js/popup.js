var base64Bytes = ''

window.onload = function() {
	// set config
	setConfig()

	// callback
	$('#print').on('click', function() {
		var ak = $('#ak').val();
		var birdId = $('#birdId').val()
		var src = $('#src').val()
		var type = $('input[name=srcType]:checked').val()
		localStorage.ak = ak
		localStorage.birdId = birdId

		getBase64FromSrc(src, type).then(function(bytes) {
			getIdentity(ak, birdId, bytes, type)
		})
	});

	// callback
	$('#preview').on('click', function() {
		var image = $('#src').val()
		$('#imgTag').attr("src", image)
	});
}

function setConfig() {
	var ak = localStorage.ak;
	if (ak != undefined) {
		$('#ak').val(ak)
	}
	var birdId = localStorage.birdId;
	if (birdId != undefined) {
		$('#birdId').val(birdId)
	}
}

function getBase64FromSrc(url, type) {
	if (type == 'P') {
		return new Promise(function(resolve, reject) {
			var img = new Image();
			img.setAttribute('crossOrigin', 'anonymous');
			img.onload = function() {
				var canvas = document.createElement("canvas");
				canvas.width = this.width;
				canvas.height = this.height;

				var ctx = canvas.getContext("2d");
				ctx.drawImage(this, 0, 0);

				var dataURL = canvas.toDataURL("image/bmp");
				resolve(dataURL.replace(/^data:image\/(bmp|jpg);base64,/, ""));
			}
			img.onerror = function() {
				reject(url)
			}
			img.src = url
		})
	} else {
		return new Promise(function(resolve, reject) {
			resolve(Base64.encode(url))
		})
	}
}

function getIdentity(ak, birdId, bytes, type) {
	var url = "http://open.memobird.cn/home/setuserbind?&timestamp=2014-11-14%2014:22:39&useridentifying=12121233"
	url = url + "&ak=" + ak
	url = url + "&memobirdID=" + birdId
	var req = new XMLHttpRequest();
	req.open(
		"GET",
		url,
		false);

	req.setRequestHeader('Access-Control-Allow-Headers', '*');
	req.setRequestHeader('Content-type', 'application/ecmascript');
	req.setRequestHeader('Access-Control-Allow-Origin', '*');
	req.onload = function() {
		//{"showapi_res_code":1,"showapi_res_error":"ok","showapi_userid":8}
		var showapi_userid = JSON.parse(req.responseText).showapi_userid
		sendToGuguMachine(ak, birdId, showapi_userid, bytes, type)
	}
	req.send(null)
}

function sendToGuguMachine(ak, birdId, userId, bytes, type) {
	var url = "http://open.memobird.cn/home/printpaper"

	var params = "ak=" + ak
	params = params + "&memobirdID=" + birdId
	params = params + "&userID=" + userId
	params = params + "&printcontent=" + type + ":" + bytes
	var req = new XMLHttpRequest();
	req.open(
		"POST",
		url,
		false);

	req.setRequestHeader('Access-Control-Allow-Headers', '*');
	req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	req.setRequestHeader('Access-Control-Allow-Origin', '*');

	console.log(url)
	console.log(params)

	req.onload = function() {
		//{"showapi_res_code":1,"showapi_res_error":"ok","showapi_userid":8}
		var result = JSON.parse(req.responseText)
		var message = result.showapi_res_error

		setMessage(message)
			// if(code==)
			// sendToGuguMachine(ak, birdId, showapi_userid, bytes)
	}
	req.send(params)
}

function setMessage(message) {
	$("#message").html("<font style='color:red'>" + message + "</font>");
}