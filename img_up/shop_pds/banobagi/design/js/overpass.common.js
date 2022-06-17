/**
 * overpass.common.js 파일은 모든 js 파일중 제일 먼저 load 되어야 한다.
 */
;(function($) {
	//[START] 네이스페이스 생성
	if ($.type(window.overpass) != "object") {
		window.overpass = {};
	};
	if ($.type(window.overpass.fn) != "object") {
		window.overpass.fn = {};
	};
	//[END] 네이스페이스 생성
	
	//[START] 기본 console 생성(미지원 브라우저용)
	if (typeof console != "object") {
		window.console = {
			log: function() {},
			dir: function() {}
		};
	} else {
		if (!console.log) {
			console.log = function() {};
		};
		if (!console.dir) {
			console.dir = function() {};
		};
	};
	//[END] 기본 console 생성
	
	//[START] prototype 셋팅
	String.prototype.string = function(len) {
		var s = '', i = 0;
		while (i++ < len) {
			s += this;
		};
		return s;
	};
	String.prototype.zf = function(len) {
		return "0".string(len - this.length) + this;
	};
	String.prototype.replaceAll = function(from, to) {
	    return this.replace(new RegExp(from, "g"), to);
	};
	Number.prototype.zf = function(len) {
		return this.toString().zf(len);
	};
	Date.prototype.format = function(f) {
		if (!this.valueOf()) {
			return " ";
		};
		
		var d = this;
		return f.replace(/(yyyy|yy|MM|dd|e|E|hh|mm|ss|a\/p)/gi, function($1) {
			switch ($1) {
				case "yyyy":
					return d.getFullYear();
				case "yy":
					return (d.getFullYear() % 1000).zf(2);
				case "MM":
					return (d.getMonth() + 1).zf(2);
				case "dd":
					return d.getDate().zf(2);
				case "e":
					var weekName = [
						overpass.message("common.calendar.sun"),//일
						overpass.message("common.calendar.mon"),//월
						overpass.message("common.calendar.tue"),//화
						overpass.message("common.calendar.wed"),//수
						overpass.message("common.calendar.thu"),//목
						overpass.message("common.calendar.fri"),//금
						overpass.message("common.calendar.sat")//토
					];
					return weekName[d.getDay()];
				case "E":
					var weekName = [
						overpass.message("common.calendar.sun"),//일
						overpass.message("common.calendar.mon"),//월
						overpass.message("common.calendar.tue"),//화
						overpass.message("common.calendar.wed"),//수
						overpass.message("common.calendar.thu"),//목
						overpass.message("common.calendar.fri"),//금
						overpass.message("common.calendar.sat")//토
					];
					return weekName[d.getDay()] + overpass.message("common.calendar.day"); //요일
				case "HH":
					return d.getHours().zf(2);
				case "hh":
					return ((h = d.getHours() % 12) ? h : 12).zf(2);
				case "mm":
					return d.getMinutes().zf(2);
				case "ss":
					return d.getSeconds().zf(2);
				case "a/p":
					return d.getHours() < 12 ? overpass.message("common.calendar.am") : overpass.message("common.calendar.pm"); //오전/오후
				default:
					return $1;
			}
		});
	};	
	//[END] prototype 셋팅
	
	//[START] ajax 셋팅
	var loading = false;
	$.ajaxSettings.cache = false;
	$.ajaxSettings.traditional = true;
	$.ajaxSetup({
		headers: { AJAX_YN: "Y" },	//공통 헤더값
		data: { "_": $.now() },	//ajax POST로 호출시 data가 없으면 서버쪽에서 403 오류가 발생할 수도 있음
		beforeSend: function(jqXHR, ajaxSettings) {
			if ($.type(ajaxSettings.error) == "function") {
				ajaxSettings.user_error = ajaxSettings.error;
				delete ajaxSettings.error;
			}
			if($.type(ajaxSettings.loading) == "boolean"){
				loading = ajaxSettings.loading;
				delete ajaxSettings.loading;
				overpass.util.openLoadingbar();
			}
		},
		complete: function(xhr, status){
			if(loading){
				overpass.util.closeLoadingbar();
				loading = false;
			}
		}
	});
	$(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {		//controller 오류시(500) 오류에 대한 메세지 일괄 처리
		var response = { error_message: "요청을 처리할 수 없습니다" };
		try {
			response = $.parseJSON(jqXHR.responseText);	
		} catch (e) {};
		if ($.type(ajaxSettings.user_error) == "function") {
			ajaxSettings.user_error(response);
		} else {
//			alert(response.error_message);
		};
	});
	//[END] ajax 셋팅
	// [START] form	
	var formCheck = function(f) {
		//유효성 검사(input 태그내 validate와 message 셋팅시...)
		$(":input", f).each(function() {
			if (this.type != "submit" && this.type != "button") {
				var input = this;
				if ($.type($(this).attr("validate")) == "string") {
					var message = $.type($(this).attr("message")) == "string" ? $(this).attr("message") : null ;
					var validate = $(this).attr("validate");
					if ($.trim(validate) != "") {
						switch (validate.toLowerCase()) {
							case "number":
								if (message == null || $.trim(message) == "") {
									message = "숫자형으로 입력하세요";
								};
								if (!$.isNumeric(input.value)) {
									input.focus();
									throw message;
								};
								break;
							case "empty":
								if (message == null || $.trim(message) == "") {
									message = "값을 입력하세요";
								};
								if ($.trim(input.value) == "") {
									input.focus();
									throw message;
								};
								break;
							default:
								break;
						};
					};
				};
			};
		});
	};
	window._submitted = null;
	$.fn.createForm = function() {
		var form = this[0];
		form.isRunning = false;
		return {
			submit: function(p) {
				p = $.extend({ target:"_self", iframe: false, valid: null, confirm: null }, p || {});
				if (form.isRunning === true) {
					return false;
				} else {
					form.isRunning = true;
				};
				try {
					var action = p.action || form.action;
					var target = p.target || form.target ;
					if (!action) {
						throw "action이 지정되어 있지 않습니다.";
					};
					
					//action의 depth 체크
					var regExp = /^\/[a-zA-z]+\/[a-zA-z]+\/(forward\.)?[A-Za-z0-9]+\.[a-z]*/g;
					var sub_url = action.replace(overpass.global.scheme + ":" + overpass.global.base_domain_url, "");
					if(!regExp.test(sub_url)){
						action = sub_url;
					};
					
					form.action = action;
					form.target = target;
					formCheck(form);
					if ($.type(p.valid) == "function") {		//사용자 정의한 유효성 검사
						if (!p.valid()) {
							throw null;
						};
					};
					if ($.type(p.confirm) == "function") {		//사용자가 정의한 confirm 실행 
						if (!p.confirm()) {
							throw null;
						};
					};
					if (p.iframe) {
						var iframe = null;
						if ($("#_FORM_SUBMIT_TARGET").length == 0) {
							iframe = $("<iframe name=\"_FORM_SUBMIT_TARGET\" id=\"_FORM_SUBMIT_TARGET\" />");
							iframe.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
							iframe.appendTo('body');
						} else {
							iframe = $("#_FORM_SUBMIT_TARGET")[0];
						};
						form.target = "_FORM_SUBMIT_TARGET";
						if ($("#_IFRAME", form).length == 0) {
							var hidden = $("<input />").attr("type", "hidden").attr("name", "_IFRAME").attr("id", "_IFRAME").val("Y");
							hidden.appendTo(form);
						};
					} else {
						$("#_IFRAME", form).remove();
					};
					
					if ($.type(p.success) == "function") {	//success 콜백
						form.success = function(result) {
							p.success(result);
						};
					} else {
						form.success = null;
					};

					if ($.type(p.error) == "function") {	//error 콜백
						form.error = function(result) {
							form.isRunning = false;
							p.error(result);
						};
					} else {
						form.error = null;
					};
					window._submitted = form;
					form.submit();
				} catch (e) {
					if ($.type(e) == "string") {
						alert(e);
					} else if (e == null) {
						//do nothing...
					} else {
						alert(e + "[0]");
					};
					form.isRunning = false;
				};				
			},
			reset: function() {
				form.reset();
				$("input[type=hidden]", form).each(function(idx, hidden) {
					var def = $(hidden).attr("default");	//최초값이 존재한다면...
					hidden.value = $.type(def) == "string" ?  def : "" ;
				});
			},
			check: function() {
				try {
					formCheck(form);
					return true;
				} catch (e) {
					if ($.type(e) == "string") {
						alert(e);
					} else if (e == null) {
						//do nothing...
					} else {
						alert(e + "[0]");
					};
					return false;
				}
			},
			run: function(b) {
				form.isRunning = b;
			},
			serializeObject: function() {
				var o = null;
				try {
					var arr = $(form).serializeArray();
					if (arr) {
						o = {};
						$.each(arr, function() {
							o[this.name] = this.value;
						});
					}
				} catch (e) {
					alert(e.message);
				} finally {}
				return o;
			}
		};
	};
	$.fn.serializeObject = function() {
		var o = null;
		try {
			if (this[0].tagName && this[0].tagName.toUpperCase() == "FORM") {
				var arr = this.serializeArray();
				if (arr) {
					o = {};
					$.each(arr, function() {
						o[this.name] = this.value;
					});
				}
			}
		} catch (e) {
			alert(e.message);
		} finally {}
		return o;
	};
	// [END] form
	
	// [START] paging
	$.fn.createAnchor = function(pin) {
		var $div = this;
		var ahref = null;

		pin = $.extend(false, {
			name: "page_idx",
			fn: function(page, parameters, ahref) {
				var url = pin.url + "?" + pin.name + "=" + $(ahref).data("value");
				if (parameters != "") {
					url += "&" + parameters;
				}
				window.location.href = url;
			}
		}, pin||{});
		
		$("a[data-current=false]", $div).addClass("num");
		$("a[data-current=true]", $div).addClass("num on");
		
		$("a", $div).click(function(e) {
			ahref = this;
			if($(ahref).data("current") == "false" || $(ahref).data("current") == "") {
				
				$("a", $div).removeAttr("aria-current");
				$("a", $div).data("current", "false")
				
				var parameters = $(ahref).data("parameters");
				pin.fn($(ahref).data("value"), parameters, ahref);
			};
		});
	};
	// [END] paging
	
})(jQuery);