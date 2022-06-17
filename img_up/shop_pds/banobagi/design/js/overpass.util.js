;(function($) {

	//[START] 네이스페이스 생성
	if ($.type(window.overpass) != "object") {
		window.overpass = {};
	};
	//[END] 네이스페이스 생성
	// [START] UTIL
	overpass.util = {
		_isTimer : true, // 타이머 사용여부
		_timer : null,
		_time : 0, //잔여 시간
		_defaultTimerValue : 1000,
		_retFunc : "overpass.util.fnTimerCalc", //타이머 콜백 함수
		_timerTarget : '#cert_time',		//타이머 시간표시
		_timerTargetMsg : '#cert_time_msg', //타이머 초과시 메시지표시
		_saveTime : '#cert_time_save', // 남은 시간 저장
		_retTimeFunc : null,				//타이머 종료이후 콜백 함수
		_textType : null,
		_strtTime : null, //시작 시간
		_endTime : null, //종료 시간

		loopPromise: function(target, handler) {
			var idx = 0;
			var list = $.isArray(list) === true ? target : (function() {
				var array = [];
				$.each(target, function() {
					array.push(this);
				});
				return array;
			})();
			var deferred = $.Deferred().resolve();

			return deferred.then(function next() {
				var o1 = list[idx++];
				var o2 = list[idx];

				var d = $.Deferred();
				var promise = d.promise();
				if (o1 != undefined) {	//list.length == 0이 아닐 경우
					handler(o1, d);
				} else {
					d.resolve();
				}
				return o1 == undefined || o2 == undefined  ? promise : promise.then(next);
			});
		},
		isDispObject: function(id) {	//오브잭트가 화면상에 있는지 확인
			if($("#"+id).length > 0 && $("#"+id).css("display") != "none"){
				return true;
			}else{
				return false;
			}
		},
		hash : function(str) {
			var hash = 0;
			if (Array.prototype.reduce) { // IE9 이하에서는 지원안함
				return str.split("").reduce(function(a, b) {
					a = ((a << 5) - a) + b.charCodeAt(0);
					return a & a
				}, 0);
			}
			if (str.length === 0)
				return hash;
			for (var i = 0; i < str.length; i++) {
				var character = str.charCodeAt(i);
				hash = ((hash << 5) - hash) + character;
				hash = hash & hash; // Convert to 32bit integer
			}
			return hash;
		},
		toCurrency : function(amount) { // 노출되는 금액에 대해 공통사용
			amount = String(amount);
			var data = amount.split('.');
			var sign = "";
			var firstChar = data[0].substr(0, 1);
			if (firstChar == "-") {
				sign = firstChar;
				data[0] = data[0].substring(1, data[0].length);
			}
			data[0] = data[0].replace(/\D/g, "");
			if (data.length > 1) {
				data[1] = data[1].replace(/\D/g, "");
			}
			firstChar = data[0].substr(0, 1);
			// 0으로 시작하는 숫자들 처리
			if (firstChar == "0") {
				if (data.length == 1) {
					return sign + parseFloat(data[0]);
				}
			}
			var comma = new RegExp('([0-9])([0-9][0-9][0-9][,.])');
			data[0] += '.';
			do {
				data[0] = data[0].replace(comma, '$1,$2');
			} while (comma.test(data[0]));

			if (data.length > 1) {
				return sign + data.join('');
			} else {
				return sign + data[0].split('.')[0];
			}

		},
		toCurrencyUnit : function(amount){
			amount = String(amount);
			var lang_divi_cd = overpass.global.lang_divi_cd.replace("/", "");
			var data = amount.split('.');
			var sign = "";
			var firstChar = data[0].substr(0, 1);
			if (firstChar == "-") {
				sign = firstChar;
				data[0] = data[0].substring(1, data[0].length);
			}
			data[0] = data[0].replace(/\D/g, "");
			if (data.length > 1) {
				data[1] = data[1].replace(/\D/g, "");
			}
			firstChar = data[0].substr(0, 1);
			// 0으로 시작하는 숫자들 처리
			if (firstChar == "0") {
				if (data.length == 1) {
					if(lang_divi_cd == "kr"){
						return sign + parseFloat(data[0]) + "원";
					}else{
						return "约￥" + sign + parseFloat(data[0]);
					}
				}
			}
			var comma = new RegExp('([0-9])([0-9][0-9][0-9][,.])');
			data[0] += '.';
			do {
				data[0] = data[0].replace(comma, '$1,$2');
			} while (comma.test(data[0]));

			if (data.length > 1) {
				if(lang_divi_cd == "kr"){
					return sign + data.join('') + "원";
				}else{
					return "约￥" + sign + data.join('');
				}
			} else {
				if(lang_divi_cd == "kr"){
					return sign + data[0].split('.')[0] + "원";
				}else{
					return "约￥" + sign + data[0].split('.')[0];
				}
			}
		}
		,getCookie : function(name) {
			var nameOfCookie = name + "=";
			var x = 0;
			while (x <= document.cookie.length) {
				var y = (x + nameOfCookie.length);
				if (document.cookie.substring(x, y) == nameOfCookie) {
					if ((endOfCookie = document.cookie.indexOf(";", y)) == -1)
						endOfCookie = document.cookie.length;
					return unescape(document.cookie.substring(y, endOfCookie));
				}
				x = document.cookie.indexOf(" ", x) + 1;
				if (x == 0)
					break;
			}
			return "";
		},
		setCookie : function(p) {
			p = $.extend({
				age : null,
				path : "/",
				domain : null,
				secure : false
			}, p);

			var date = new Date();
			if(this.nvl(p.ageType) == "toDay"){	//오늘하루 안보기 인경우 시작일을 00시로 변경후 설정
				date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
			}else{
				if(this.nvl(p.age) != ""){
					date.setDate(date.getDate() + p.age);
				}
			}
			document.cookie = p.name
					+ "="
					+ escape(p.value)
					+ ((p.age == null) ? "" : ("; expires=" + date.toGMTString()))
					+ ((p.path == null) ? "" : ("; path=" + p.path))
					+ ((p.domain == null) ? "" : ("; domain=" + p.domain))
					+ ((p.secure == true) ? "; secure" : "");
		},
		getUrl: function(uri, params){ //URL 만들어 주기
			return (function(){
				var url = overpass.global.lang_divi_cd + uri + overpass.global.ext;
				if(params != null && params != undefined){
					url += "?" + $.param(params);
				}
				return url;
			})();
		},
		https : function(uri) { // 보안 페이지로 이동

			if(document.URL.indexOf("app.ssgdfs.com")> 0 ){
				overpass.global.base_domain_url = overpass.global.base_domain_url.replace( "www", "app");
			}

			return "https:" + overpass.global.base_domain_url + overpass.global.lang_divi_cd + uri;
		},
		go : function(url, pin) {
			if(url != undefined && url != "") {
				var pattern = /^http[s]?\:\/\//i;

				if(!pattern.test(url)){
					url = overpass.util.https(url);
				}

				var initUrl = function(url, pin){
					if(pin != undefined && $.type(pin) == "object" && Object.keys(pin).length != 0){
						delete pin.target;
						if($.param(pin) != ""){
							url = url + "?" + $.param(pin);
						}
					}
					return url;
				}

				if(pin != undefined && pin.target != undefined && pin.target != ""){
					if(pin.target == '_blank') {
						window.open(initUrl(url, pin), "_blank");
					}else if(pin.target == 'replace') {
						window.location.replace(initUrl(url, pin));
					}
				}else{
					location.href = initUrl(url, pin);
				}
			}
		},
		parseDate: function(p) {
			var patterns = [];
			var map = {};
			var d = { yyyy: "", MM: "", dd:"", HH: "", mm: "", ss: "" };
			var exp = "";
			$.each(p.format.match(/(yyyy|MM|dd|HH|mm|ss|.)/g), function(i, m) {
				if (d[m] != undefined) {
					exp += ("(\\d{" + m.length + "})");
					patterns.push(m);
				} else {
					exp += m;
				};
			});
			exp = new RegExp(exp);
			$.each(p.value.match(exp), function(i, v) {
				var p = patterns[i - 1];
				if (p != undefined) {
					map[p] =  p == "MM" ? +v - 1 : +v;
				};
			});
			return new Date(map.yyyy, map.MM, map.dd, map.HH || 0, map.mm || 0, map.ss || 0);
		},
		fnTimer : function(){ //타이머
			clearTimeout(overpass.util._timer);
			eval(overpass.util._retFunc + "(" + overpass.util._time+ ")");

			if(overpass.util._endTime==null && overpass.util._strtTime != null){
				overpass.util._endTime = new Date(overpass.util._strtTime);
				overpass.util._endTime.setSeconds( overpass.util._endTime.getSeconds() + overpass.util._time );
			}

			if (overpass.util._time > 0 || overpass.util._endTime - (new Date()) > 0) {
				overpass.util._time--;
				$(overpass.util._timerTarget).show();
				$(overpass.util._saveTime).val(overpass.util._time);
				overpass.util._timer = setTimeout("overpass.util.fnTimer()", overpass.util._defaultTimerValue);
			} else {
				overpass.util._timer = null;
				overpass.util._strtTime = null;
				overpass.util._endTime = null;
				if($.type(overpass.util._retTimeFunc) == "function") eval(overpass.util._retTimeFunc());
			}
		},
		fnTimerCalc : function(time){
			if (time == 0) {
				$(overpass.util._timerTarget).html("00:00");
				//$(overpass.util._timerTarget).hide();
				overpass.util._timer = null;
				overpass.util._strtTime = null;
				overpass.util._endTime = null;

				if($.type(overpass.util._retTimeFunc) == "function") eval(overpass.util._retTimeFunc());
			} else {
				var hhmmdd = [
					Math.floor(time / 3600)
					, Math.floor(time / 60) % 60
					, time % 60
				];
				var t = !(hhmmdd[0]>0) ? "" : hhmmdd[0] < 10 ? "0".concat(hhmmdd[0]).concat(":") : hhmmdd[0].concat(":");
				t += hhmmdd[1]<10 ? "0".concat((hhmmdd[1]+"")).concat(":") : (hhmmdd[1]+"").concat(":");
				t += hhmmdd[2]<10 ? "0".concat((hhmmdd[2]+"")) : (hhmmdd[2]);

				if(overpass.util._strtTime != null){
					var addZero = function(v){
						var v = v + "";
						if(v.length == 1){
							v = "0"+v;
						}
						return v;
					}

					var _second = 1000;
					var _minute = _second * 60;
					var _hour = _minute * 60;
					var _day = _hour * 24;
					var _dif = overpass.util._endTime - (new Date());

					if(_dif>0){
						var _days = Math.floor(_dif / _day);
						var _hours = Math.floor((_dif % _day) / _hour);
						var _minutes = Math.floor((_dif % _hour) / _minute);
						var _seconds = Math.floor((_dif % _minute) / _second);

						t = _hours > 0 ? addZero(_hours).concat(":") : "";
						t+= _minutes > 0 ? addZero(_minutes).concat(":") : "00".concat(":");
						t+= _seconds > 0 ? addZero(_seconds) : "00";
					}
				}

				if(overpass.util._textType != null) {
					$(overpass.util._timerTarget).html(t);
				} else {
					$(overpass.util._timerTarget).text(t);
				}
			}
		},
		//문자열의 byte를 반환
		getByte: function(str){
			var bytes = 0;
			var total_bytes = 0;
			for(var i = 0 ; i < str.length ; i ++) {
				var c = escape(str.charAt(i));
				if ( c.length == 1 ) {
					bytes ++;
				} else if ( c.indexOf("%u") != -1 ) {
					bytes += 2;
				} else if ( c.indexOf("%") != -1 ) {
					bytes += c.length/3;
				};
				if ( c.length == 1 ) {
					total_bytes ++;
				} else if ( c.indexOf("%u") != -1 ) {
					total_bytes += 2;
				} else if ( c.indexOf("%") != -1 ) {
					total_bytes += c.length/3;
				};
			};
			return total_bytes;
		},
		//현재 사이트에 맞는 화폐 가격으로 변환
		//달러 -> 원/위안
		getCurrency : function(calcPprice, calcExchangeRate){
			var lang_divi_cd = overpass.global.lang_divi_cd.replace("/", "");
			var calcExchangeRate = calcExchangeRate != undefined ? Number(calcExchangeRate) : overpass.global.exchange_rate;

			try{
				if(lang_divi_cd == "kr"){
					return Math.floor(Math.floor(calcPprice * calcExchangeRate * 100) / 100);
				}else{
					return Math.round(calcPprice * calcExchangeRate * 100) / 100;
				}
			}catch(e){
				return 0;
			}
		},
		//현재 사이트에 맞는 화폐 가격으로 변환 및 단위
		//달러 -> 원/위안
		getCurrencyGb : function(calcPprice, calcExchangeRate){
			var lang_divi_cd = overpass.global.lang_divi_cd.replace("/", "");
			var amt = this.getCurrency(calcPprice, calcExchangeRate);

			try{
				if(lang_divi_cd == "kr"){
					return overpass.util.toCurrency(amt) + "원";
				}else{
					return "约￥" + overpass.util.toCurrency(amt);
				}
			}catch(e){
				return 0;
			}
		},
		//원화 > 달러변환
		getExchangeToDalr : function(price, calcExchangeRate){
			var amt = String(price).replace(/[^0-9|.]/g,'');	//숫자로 변환
			var calcExchangeRate = calcExchangeRate != undefined ? Number(calcExchangeRate) : overpass.global.exchange_rate_dal;

			try{
				return Number((amt/calcExchangeRate).toFixed(2));
			}catch(e){
				return 0;
			}
		},
		nvl : function(str){
			if(str == null || str == "null" || str == "undefined" || str == "" ){
				return "";
			}else{
				return str;
			}
		},
		nvl2 : function(str, reStr){
			if(str == null || str == "null" || str == "undefined" || str == "" ){
				if(reStr != null && reStr != "null" && reStr != "undefined" && reStr != "" ){
					return reStr;
				}else{
					return "";
				}
			}else{
				return str;
			}
		},
		//niput 생성하여 form submit 처리
		setFormSubmit : function(url, arrData, pin) {

			var objs;
			var form = document.createElement('form');
			var method = pin == undefined || pin.method == undefined ? "post" : pin.method;

			$.each(arrData, function(key, value) {
					objs = document.createElement('input');
					objs.setAttribute('type', 'hidden');
					objs.setAttribute('name', key);
					objs.setAttribute('value', value);
					form.appendChild(objs);
			});

			form.setAttribute('method', method);
			form.setAttribute('action', encodeURI(url));

			document.body.appendChild(form)
			form.submit();
		},
		rpad: function(originalString, totalLength, padString) {
			var len = originalString.length;
			var returnString = originalString;
			while(len < totalLength) {
				returnString += padString;
				len++;
			};
			return returnString;
		},
        lpad: function(originalString, totalLength, padString) {
			var len = originalString.length;
			var returnString = originalString;
			while(len < totalLength) {
			    returnString = padString+returnString;
				len++;
			};
			return returnString;
		},
		// 휴대폰 번호 마스킹 처리  ex) 01012341234 -> 010****1234 (index=2)
		getConvertToHpEncry: function(str, index) {
			if (str == null || str == "") {
				 return "";
			}

			var phone1 = '';
			var phone2 = '';
			var phone3 = '';

			if(str.length == 10 || str.length == 11) {
				phone1 = str.substring(0, 3);
				phone2 = str.substring(3, str.length-4);
				phone3 = str.substring(str.length-4, str.length);

				if(index == 0) {
					phone1 = "***";
				}else if(index == 1) {
					phone2 = "****";
				}else if(index == 2) {
					phone3 = "****";
				}
			} else {
				return str;
			}

			return phone1 + phone2 + phone3;
		},
		// 이메일 마스킹 처리 ex) test@naver.com -> te**@na*******
		getConvertToEmailEncry: function(str) {
			if (str == null || str == "") {
				 return "";
			}

			var target = '';
			var mail = '';

			if(str.indexOf("@") > 0) {
        		target = str.split("@")[0];
        		mail = str.split("@")[1];
        		return overpass.util.rpad(target.substring(0,2), target.length, "*").concat("@").concat(overpass.util.rpad(mail.substring(0,2), mail.length, "*")) ;
        	}else {
        		target = str;
        		return overpass.util.rpad(target.substring(1), str.length, "*");
        	}

		},

		countDownTimer : function(date){

			var _vDate = new Date(date.replace(/[.-]/gi, "/"));
			var _second = 1000;
			var _minute = _second * 60;
			var _hour = _minute * 60;
			var _day = _hour * 24;
			var timer;

			function showRemaining() {
				var now = new Date();
				var distDt = _vDate - now;

				if (distDt < 0) {
					clearInterval(timer);
					return;
				}

				var day = Math.floor(distDt / _day);
				var hour = Math.floor((distDt % _day) / _hour);
				var minute = Math.floor((distDt % _hour) / _minute);
				var second = Math.floor((distDt % _minute) / _second);

				$("[name=day]").text(day);
				$("[name=hour]").text(hour);
				$("[name=minute]").text(minute);
				$("[name=second]").text(second);

			}

			timer = setInterval(showRemaining, 1000);
		},
		//loading bar open
		openLoadingbar: function(){
			$("#lottie").filter(":not(:visible)").show();//loading bar
		},
		//loading bar close
		closeLoadingbar: function(){
			setTimeout(function(){
				$("#lottie").filter(":visible").hide();//loading bar
			}, 200);
		},

		//emoji 제거
		fnRemoveEmojis : function(cont) {
			var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
			return cont.replace(regex, '');
		}
	};
	// [END] UTIL
})(jQuery);