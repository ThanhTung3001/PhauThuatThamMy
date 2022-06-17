"use strict";

/**
 * 날짜 범위 선택하기 클래스 생성자
 * @param {object}	target	- 초기화할 대상
 */
var DatePicker = function(target){
	if(!(target instanceof jQuery)){
		target = $(target);
	}
	var me = this,
		/*aniProp = {
			duration : 400,
			easing : "easeInSine",
			complete : aniComplete
		},*/
		today, curDate, month, range, tbody, title, input, button;
		// $win = $(window), touchTarget, touchStartY, overflow;
	
	var cn = $("html").attr("lang") == "zh",
		t_hd = (cn ? "请选择日期。" : "날짜선택"),
		t_ok = (cn ? "确认" : "확인"),
		t_d0 = (cn ? "日" : "일"),
		t_d1 = (cn ? "一" : "월"),
		t_d2 = (cn ? "二" : "화"),
		t_d3 = (cn ? "三" : "수"),
		t_d4 = (cn ? "四" : "목"),
		t_d5 = (cn ? "五" : "금"),
		t_d6 = (cn ? "六" : "토"),
		t_td = (cn ? "今日" : "오늘");
	
	var template = '<div id="ui-datepicker" class="ui-datepicker" tabindex="0">';
		//template += '<h3 class="titCal">'+t_hd+'</h3>';	
		template += '<div class="datepicker_gui">';
			template += '<div class="ui-datepicker-header">';
				template += '<button class="ui-datepicker-prev-year" title="Prev Year"><span class="ui-icon ui-icon-circle-triangle-e">이전 년도</span></button>';
				template += '<button class="ui-datepicker-prev" title="Prev"><span class="ui-icon ui-icon-circle-triangle-w">이전 달</span></button>';
				template += '<div class="ui-datepicker-title"></div>';
				template += '<button class="ui-datepicker-next" title="Next"><span class="ui-icon ui-icon-circle-triangle-e">다음 달</span></button>';
				template += '<button class="ui-datepicker-next-year" title="Next Year"><span class="ui-icon ui-icon-circle-triangle-e">다음 년도</span></button>';
			template += '</div>';
			template += '<table class="ui-datepicker-calendar">';
				template += '<thead>';
					template += '<tr>';
						template += '<th scope="col" class="ui-datepicker-week-end"><span title="Sunday">'+t_d0+'</span></th>';
						template += '<th scope="col"><span title="Monday">'+t_d1+'</span></th>';
						template += '<th scope="col"><span title="Tuesday">'+t_d2+'</span></th>';
						template += '<th scope="col"><span title="Wednesday">'+t_d3+'</span></th>';
						template += '<th scope="col"><span title="Thursday">'+t_d4+'</span></th>';
						template += '<th scope="col"><span title="Friday">'+t_d5+'</span></th>';
						template += '<th scope="col" class="ui-datepicker-week-end"><span title="Saturday">'+t_d6+'</span></th>';
					template += '</tr>';
				template += '</thead>';
				template += '<tbody></tbody>';
			template += '</table>';
		template += '</div>';
		template += '<div class="btnBtm">';
			template += '<div class="btnArea ui-datepicker-buttonpane ui-widget-content">';
				template += '<button type="button" class="btnToday ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" data-handler="today" data-event="click">'+t_td+'</button>';
				template += '<button type="button" class="btnSSG btnM action">'+t_ok+'</button>';
			template += '</div>';
		template += '</div>';
		//template += '<button type="button" class="close dragDownClose">달력 닫기</button>';
	template += '</div>';
	
	/**
	 * 팝업 열기
	 */
	me.open = function(){
		curDate = getDate(input.val());
		month = curDate ? new Date(curDate.getTime()) : new Date(today.getTime());
		month.setDate(1);
		
		drawPopup();
		drawMonth();
		
		if( ! me.popup.hasClass("on")){
			//overflow = $("body").css("overflow");
			//$("body").css("overflow", "hidden").addClass("hidePopupDimm");
			//$("body").addClass("hidePopupDimm");
			me.popup.addClass("on");
			me.popup.css("display", "block");
			//me.popup.stop(true).css("display", "block").animate({"bottom":"0"}, aniProp);
			//me.popup.focus();
			setTimeout(function(){
				$(document).unbind("click.datepicker").bind("click.datepicker", docClickListener);
			}, 10);
		}

		// 검색 기간 선택 레이어
		var tc = me.popup.closest(".termCont");
		if(tc.length > 0){
			tc.addClass("termCalendar");
		}
		// 검색 기간 선택 레이어
	};
	
	/**
	 * 팝업 닫기
	 */
	me.close = function(flag){
		//me.popup.stop(true).animate({"bottom":"-100%"}, aniProp);
		$(document).unbind("click.datepicker");
		me.popup.removeClass("on");
		me.popup.css("display", "none");
		//$("body").removeClass("hidePopupDimm");
		/*if(typeof(overflow) != "undefined"){
			$("body").css("overflow", overflow);
			overflow = undefined;
		}*/
		if(flag !== "nofocus"){
			input.focus();
		}

		// 검색 기간 선택 레이어
		var tc = me.popup.closest(".termCont");
		if(tc.length > 0){
			if(flag == "termSelect"){
				tc.find(".termDirect > button").attr("disabled", false);
				if(tc.find(".termList input[type=radio]:checked").length > 0){
					tc.find(".termList input[type=radio]:checked").get(0).checked = false;
				}
			}
			if(me.wrapper.siblings(".calenInp").find(".ui-datepicker.on").length == 0){
				tc.removeClass("termCalendar");
			}
		}
		// 검색 기간 선택 레이어
	};
	
	/**
	 * 다른 영역 클릭 시 닫기
	 */
	function docClickListener(e){
		var t = e.target,
			p = me.popup.get(0);
		if( ! (p == t || p.contains(t)) ){
			me.close("nofocus");
		}
	};
	
	/**
	 * 달력 영역만 가져가기
	 */
	me.getGUI = function(){
		curDate = getDate(input.val());
		month = curDate ? new Date(curDate.getTime()) : new Date(today.getTime());
		month.setDate(1);
		
		drawPopup();
		drawMonth();
		
		me.getDate = function(){
			var str = getString(curDate);
			if(str == "1970.01.01"){
				str = "";
			}
			return str;
		};
		
		return me.popup.find(".datepicker_gui");
	};
	
	/**
	 * 애니메이션 종료 이벤트
	 */
	/*function aniComplete(){
		if(!me.popup.hasClass("on")){
			me.popup.css("display", "none");
		}
	};*/
	
	
	
	
	/**
	 * 범위 선택 초기화하기
	 */
	function init(){
		$.each(target, function(idx, itm){
			if(idx > 0){ return false; }// 한 개만 초기화
			
			var wrap = $(itm);
			if(wrap.data("initialized") == "Y"){ return; }
			wrap.data("initialized", "Y");
			
			input = wrap.find("input[data-id]");
			button = wrap.find(".ui-datepicker-trigger");
			
			if(input.length * button.length == 0){
				console.warn("Error: DatePicker, 인풋 또는 버튼 객체가 없습니다.");
				return false;
			}
			
			getRange(input.data("range"));
			
			today = new Date();
			today.setHours(0, 0, 0, 0);
			
			me.wrapper = wrap;
			
			button.bind("click.datepicker", me.open);
			input.bind("click.datepicker", me.open);
		});
	};
	
	/**
	 * 선택가능 범위 설정
	 */
	function getRange(str){
		if(typeof(str) == "undefined"){ return; }
		
		try{
			var arr = str.split("-"),
				d1 = getDate(arr[0]),
				d2 = getDate(arr[1]),
				t1, t2;

			if(d1 == null && d2 == null){
				// no range
			}else if(d1 == null){
				d1 = new Date(2000, 0, 1);
			}else if(d2 == null){
				d2 = new Date(2100, 0, 1);
			}
			
			if(d1 && d2){
				t1 = d1.getTime();
				t2 = d2.getTime();
				
				if(d1 < d2){
					range = {
						start : d1,
						end : d2
					}
				}else{
					range = {
						start : d2,
						end : d1
					}
				}
			}
			
		}catch(e){
			console.log("잘못된 범위 설정: " + str);
		}
	};
	
	/**
	 * 스트링으로 날짜 구하기
	 */
	function getDate(str){
		var day;
		try{
			if(str.indexOf("-") >= 0 || str.indexOf("/") >= 0){
				str = str.replace(/-|\//g, ".");
			}
			var arr = str.split(".");
			day = new Date(parseInt(arr[0], 10), parseInt(arr[1], 10) - 1, parseInt(arr[2]));
			if(day == "Invalid Date"){
				throw(new Error("Invalid Date"));
			}
		}catch(e){
			return null;
			/*if(flag == ""){
				return null;
			}
			day = new Date();
			if(flag == "s"){
				day.setDate(1);
			}else{
				day.setMonth(day.getMonth() + 1, 0);
			}*/
		}
		return day;
	};
	
	/**
	 * 날짜에서 YYYY.MM.DD 문자열 구하기
	 */
	function getString(date){
		var t = new Date(date),
			y = t.getFullYear(),
			m = t.getMonth() + 1,
			d = t.getDate();
		
		return y + "." + (m < 10 ? "0" + m : m) + "." + (d < 10 ? "0" + d : d);
	};
	
	/**
	 * 최초 오픈 시에 팝업 생성
	 */
	function drawPopup(){
		if(typeof(me.popup) != "undefined"){ return; }
		
		me.popup = $(template);
		var wrap = me.wrapper,
			pop = me.popup;
		
		pop.find(".datepicker-inner").css("max-height", ($(window).height() - 115));// 기기높이값 - 115px
		wrap.append(pop);
		if(wrap.find(">.dimmed").length == 0){
			wrap.append('<div class="dimmed"></div>');
		}
		wrap.find(">.dimmed").bind("click.datepicker", me.close);
		//pop.find("button.close").bind("click.datepicker", me.close);
		pop.find(".ui-datepicker-header button").bind("click.datepicker", changeMonth);
		pop.find(".btnBtm .btnArea button").bind("click.datepicker", ok);
		tbody = pop.find("tbody");
		title = pop.find(".ui-datepicker-title");
		
		var txt = wrap.data("header");
		if(typeof(txt) != "undefined"){
			pop.find(".titCal").text(txt);
		}
		
		//initDragDownArea();
	};
	
	/**
	 * 확인버튼 클릭 이벤트
	 */
	function ok(e){
		var btn = $(e.currentTarget);
		if(btn.hasClass("btnToday")){
			// 오늘
			var td = me.wrapper.find("td[data-date=" + today.getTime() + "]");
			if(td.length > 0){
				// this month
				td.find("a").trigger("click.datepicker");
			}else{
				// other month
				month.setFullYear(today.getFullYear(), today.getMonth());
				drawMonth();
				
				td = me.wrapper.find("td[data-date=" + today.getTime() + "]");
				td.find("a").trigger("click.datepicker");
			}
		}else{
			// 확인
			if(curDate){
				input.val(getString(curDate));
				me.close();
				
				input.trigger("change");
			}else{
				alert("날짜를 선택해 주세요.");
			}
		}
	};
	
	/**
	 * 월 번경
	 */
	function changeMonth(e){
		var btn = $(e.currentTarget);
		switch(btn.attr("title")){
		case "Prev Year":
			month.setFullYear(month.getFullYear() - 1);
			break;
		case "Prev":
			month.setMonth(month.getMonth() - 1);
			break;
		case "Next":
			month.setMonth(month.getMonth() + 1);
			break;
		case "Next Year":
			month.setFullYear(month.getFullYear() + 1);
			break;
		// no default
		}
		drawMonth();
	};
	
	/**
	 * 달력 그리기
	 */
	function drawMonth(){
		var s = new Date(month.getTime()),
			e = new Date(month.getTime()),
			arr = [],
			str = '',
			ttime = today.getTime(),
			ctime = 0,
			stime = 0,
			etime = 4102412400000,
			bf, af, dt, dtime, d, r, i, len, cls, txt, num;
		
		if(range){
			stime = range.start;
			etime = range.end;
		}
		
		if(curDate){
			ctime = curDate.getTime();
		}
		
		s.setDate(1);
		e.setMonth(e.getMonth() + 1, 0);
		bf = s.getDay();
		af = 6 - e.getDay();
		
		// prepare array
		for(i=0; i<bf; i++){
			arr.push(0);
		}
		len = e.getDate();
		for(i=1; i<=len; i++){
			arr.push(i);
		}
		for(i=0; i<af; i++){
			arr.push(0);
		}
		
		// make table
		ttime = today.getTime();
		dt = new Date(s.getTime());
		len = arr.length;
		for(i=0; i<len; i++){
			d = arr[i];
			r = i % 7;
			
			if(r == 0){ str += '<tr>'; }
			
			cls = '';
			if(r == 0 || r == 6){
				// 주말
				cls += 'ui-datepicker-week-end ';
			}
			if(d == 0){
				// 전월/익월 공백
				cls += 'ui-datepicker-other-month ui-datepicker-unselectable ui-state-disabled ';
				txt = '&nbsp;';
				num = "";
			}else{
				// 이번달
				dtime = dt.getTime();
				
				if(dtime >= stime && dtime <= etime){
					// 선택 가능
					txt = '<a href="#" class="ui-state-default" tabindex="0">' + d + '</a>';
				}else{
					// 선택 불가
					//txt = d;
					txt = '<a class="ui-state-default" tabindex="-1">' + d + '</a>';
					cls += 'ui-datepicker-unselectable ui-state-disabled ';
				}
				// 오늘
				if(dtime == ttime){
					cls += 'ui-datepicker-today ';
				}
				if(dtime == ctime){
					cls += 'ui-datepicker-current-day ';
				}
				
				num = dt.getTime();
				dt.setDate(dt.getDate() + 1);
			}
			str += '<td class="' + cls + '" data-date="' + num + '">' + txt + '</td>';
			
			if(r == 6){ str += '</tr>'; }
		}
		tbody.empty();
		tbody.append(str);
		tbody.find("a").bind("click.datepicker keyup.datepicker", selectDate);
		
		d = s.getMonth() + 1;
		title.html('<span class="ui-datepicker-year">'+ s.getFullYear() +'</span>.<span class="ui-datepicker-month">'+ (d < 10 ? '0'+d : d) +'</span>');
	};
	
	/**
	 * 날짜 선택
	 */
	function selectDate(e){
		if(e.type == "keyup" && e.keyCode != 13){ return; }
		
		var a = $(e.currentTarget),
			td = a.parent(),
			date = td.data("date"),
			ctime = 0;
	
		if(td.hasClass("ui-state-disabled")){ return; }
		
		if(curDate){
			ctime = curDate.getTime();
		}
		if(ctime == date){
			var tc = me.popup.closest(".termCont");
			if(tc.length > 0){
				me.close("termSelect");
				return false;
			}
			return;
		}

		var fn = input.data("validate");
		if(typeof(fn) == "string"){
			fn = window[fn];
		}
		if(typeof(fn) == "function"){
			var rtn = fn(date);
			if(rtn === false){
				return false;
			}
		}
		
		if(curDate){
			curDate.setTime(date);
		}else{
			curDate = new Date(date);
		}
		tbody.find("td.ui-datepicker-current-day").removeClass("ui-datepicker-current-day");
		td.addClass("ui-datepicker-current-day");
		
		// 날짜 선택 이벤트 발생 - 개발 요청
		//me.popup.get(0).dispatchEvent( (new CustomEvent("changedate", { detail : {date : curDate} })) );
		//me.popup.find(".datepicker_gui").get(0).dispatchEvent( (new CustomEvent("changedate", { detail : {date : curDate}, bubbles: true })) );
		//$(e.currentTarget).closest(".datepicker_gui").get(0).dispatchEvent( (new CustomEvent("changedate", { detail : {date : curDate}, bubbles: true })) );
		
		// 검색 기간 선택 레이어
		var tc = me.popup.closest(".termCont");
		if(tc.length > 0){
			input.val(getString(curDate));
			me.close("termSelect");
		}
		// 검색 기간 선택 레이어
		
		return false;
	};
	
	
	init();
	
	return me;
};

$(function(){
	$(".calenInp:not(.timeInp)").each(function(idx, itm){
		new DatePicker(itm);
	});
});