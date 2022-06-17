// fo  

// 통합검색 상단 초기화 
function searchHeadInit(){
	setTimeout(function() {
		$("#totalSearch").focus();
	}, 100); // 0.1초
	
}

function autoKeywordSaveCheck(siteNo){
	// X버튼 처리 - click
	$(".headSearch > .headsearchWrap > .inner > .searchArea > .btIco.icDel").click(function(){
		$("form[name='search1']").children("#totalSearch").val('');
		$("#totalSearch").focus();
		$(".headSearch > .headsearchWrap > .inner > .searchArea > .btIco.icDel").hide();
	});
	
	var c_name = "autoKeywordSave";
	var exdays = 365;
	var value = 'on';
	var autoKeywordSave = getCookie("autoKeywordSave");
	if( autoKeywordSave== null) {
		setCookie(c_name, value, exdays);
	}
	
	if(autoKeywordSave == "on"){
		 $('#autoOff').show();
		 $('#autoOn').hide();
	}else if(autoKeywordSave == "off"){
		$('#autoOff').hide();
		 $('#autoOn').show();
	}else{
		 $('#autoOff').show();
		 $('#autoOn').hide();
	}
	
	// 헤더 이외 영역 클릭 제어 처리
	// 검색 헤더 외 영역 클릭
	$(document).click(function(e) {
		var trg = $(e.target);
		btn = $(".headSearch .btSearch"),
		wrap = $(".headsearchWrap"),
		css = {
			height : 0,
			opacity : 1
		},
		prop = {
			duration : 300,
			easing : EASING_FUNC,
			complete : function(){
				aria = btn.attr("aria-expanded");
				if(!(aria === true || aria == "true")){
					wrap.css("display", "none");
				}
			}
		}
		
		// 헤더 내의 클릭 시 레이어 닫히지 않도록 처리 로직.
		var banClassValue = ['btnSSG btnL','inner','btsaveOff','btsaveOn','del','btAllDel','btSearch', 'btIco icDel', 'btnSSG btnM btnLB', 'btnSSG btnM btnLB action', 'btIco icAdd' ,'autoSearchWrap', 'titEvent']; 
		var banIdValue = ['totalSearch'];
		var banNameValue =  ['popword','mykeyword','headerProd','autokeyword'];
		if(banIdValue.indexOf($(trg).attr('id')) < 0 && banClassValue.indexOf($(trg).attr('class')) < 0 && banNameValue.indexOf($(trg).attr('name')) < 0 && $(btn).attr("aria-expanded") == "true") {
			wrap.stop();
			btn.attr("aria-expanded", false);
			css.height = 0;
			css.opacity = 0.7;
			setBodyNoScrolling(false);
			wrap.animate(css, prop);
	    }
    });
	
	
}

//자동저장
function autoKeywordSaveOff(){
	var c_name = "autoKeywordSave";
	var exdays = 365;
	var value = 'off';
	setCookie(c_name, value, exdays);
	$('#autoOff').hide();
	$('#autoOn').show();
}

function autoKeywordSaveOn(){
	var c_name = "autoKeywordSave";
	var exdays = 365;
	var value = 'on';
	setCookie(c_name,value,exdays);
	$('#autoOff').show();
	$('#autoOn').hide();
}

// 검색 인풋박스에 검색어 셋팅
function setKeyword(query) {
	var searchForm = document.search1; 
	searchForm.totalSearch.value = query;
	$("#totalSearch").focus();
}

// 인기검색어, 내가찾은 검색어
function doKeyword(query,clickCdParam) {
	var searchForm = document.search1; 
	searchForm.totalSearch.value = query;
	if (typeof clickCdParam == "undefined") { clickCdParam = "01";}
	searchForm.srchFr.value = clickCdParam;
	doHeadSearch();
}

// 쿠키값 조회
function getCookie(c_name) {
	var i,x,y,cookies=document.cookie.split(";");
	for (i=0;i<cookies.length;i++) {
		x=cookies[i].substr(0,cookies[i].indexOf("="));
		y=cookies[i].substr(cookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name) {
			return unescape(y);
		}
	}
}

// 쿠키값 설정
function setCookie(c_name,value,exdays) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString() + "; path=/");
	document.cookie=c_name + "=" + c_value;
}

// 내가 찾은 검색어 조회
function getMyKeyword(keyword) {
	var MYKEYWORD_COUNT = 10; //내가 찾은 검색어 갯수 + 1
	var myKeyword = getCookie("searchKeyword");
	if( myKeyword== null) {
		myKeyword = "";
	}

	var myKeywords = myKeyword.split("^%");
	var existsKeyword = false;
	for (var i = 0; i < myKeywords.length; i++) {
		if (myKeywords[i] == keyword) {
			existsKeyword = true;
			break;
		}
	}

	var autoKeywordSave = getCookie("autoKeywordSave");
	if (!existsKeyword && autoKeywordSave == "on") {
		if (typeof keyword != "undefined") {
			myKeywords.push(keyword);
		}

		if (myKeywords.length == MYKEYWORD_COUNT) {
			myKeywords = myKeywords.slice(1, MYKEYWORD_COUNT);
		}
	}
	
	if (keyword != "" && typeof keyword != "undefined") {
		setCookie("searchKeyword", myKeywords.join("^%"), 365);
	}
		
	showMyKeyword(myKeywords.reverse());
}


// 내가 찾은 검색어 삭제
function removeMyKeyword(keyword) {
	var myKeyword = getCookie("searchKeyword");
	if( myKeyword == null) {
		myKeyword = "";
	}

	var myKeywords = myKeyword.split("^%");
	var i = 0;
	while (i < myKeywords.length) {
		if (myKeywords[i] == escapeOutput(keyword)) {
			myKeywords.splice(i, 1);
			break;
		} else { 
			i++; 
		}
	}

	setCookie("searchKeyword", myKeywords.join("^%"), 365);

	showMyKeyword(myKeywords.reverse());
}

// 내가 찾은 검색어 전체 삭제
function removeAllMyKeyword() {
	var myKeyword = getCookie("searchKeyword");
	if( myKeyword == null) {
		myKeyword = "";
	}

	var myKeywords = myKeyword.split("^%");
	myKeywords.splice(0, myKeywords.length);

	setCookie("searchKeyword", myKeywords.join("^%"), 365);
	showMyKeyword(myKeywords);
	checkMyKeyword();// 내가 찾은 검색어 - 노출 체크
}

var _size_myKeyword = 0;
//내가 찾은 검색어 갯수 얻기 
function getMyKeywordSize(){
	return _size_myKeyword;
}

//내가 찾은 검색어 갯수 지정 
function setMyKeywordSize(size){
	_size_myKeyword = size;
}

// 내가 찾은 검색어 
function showMyKeyword(myKeywords) {
	var str = "";
	var cnt=0;
	var msg = overpass.message('word.comm.del');
	var temp_i = 1;
	for( var i = 0; i < myKeywords.length; i++) {
		if( myKeywords[i] == "" || typeof myKeywords[i] == "undefined") continue;
		var param_i = temp_i < 10 ? "0"+temp_i : temp_i;
		str += "<li>";
		str += "	<a href=\"#\" role=\"button\" name='mykeyword' data-clicklog data-page='SC' data-param1='SC050' data-param2='02SC050' data-param3='SCW0"+param_i+"' data-param4='"+myKeywords[i]+"' onclick='javascript:doKeyword(\""+myKeywords[i]+"\");'>"+myKeywords[i]+"</a>";
		str += "	<button type=\"button\" class=\"del\" onclick=\"javascript:removeMyKeyword('"+myKeywords[i]+"');\">" + msg + "</button>";
		str += "</li>";
		cnt++;
		temp_i++;
	}
	setMyKeywordSize( cnt );
	$("#mykeyword").html(str);
}

// 내가 찾은 검색어 - 노출 체크 
function checkMyKeyword(){
	// 내가 찾은 검색어 목록이 없는 경우 탭 비 노출
	if( getMyKeywordSize()  == 0){
		$('#wordRecent').hide();		
	}
}

// 정렬
function doSorting(sort, headName, searchForm) {
	var targetForm = $("form[name='" + searchForm +"']");
	targetForm.children("input[name='sort']").val(sort);
	targetForm.children("input[name='sortNm']").val(headName);
	targetForm.submit();
}

// 공통산단에거 검색 진입 
function doHeadSearch(msg){
	var f = document.search1;
	doSearchHeader(f, msg);
}

// 검색
function doSearchHeader(searchForm, msg) {
	var query = document.getElementById("totalSearch").value;
	var autoKeywordSave =  getCookie("autoKeywordSave");
	if (query.trim().length == 0) {
		// 가이트 텍스트 처리 - 가이트 텍스트가 on 상태이면서(==검색어가 없는상태), 가이드 텍스트가 빈값이 아닌경우 링크 처리
		var guideUrl = $("form[name='search1']").children("#guide_url").text();
		if(guideUrl.trim().length > 0 ){
			location.href = overpass.util.getUrl(guideUrl);
			event.preventDefault(); // 이벤트 제어
			return false;
		}else{
			overpass.alert(msg);
			searchForm.query.focus();
			return false;
		}
	}
	
	// xss 체크
	query = escapeOutput(query);
	document.getElementById("totalSearch").value = query;
	
	// 클릭로그
	$("#headerSearchBtn").data("param3", query);
	
	//자동저장  체크
	if(autoKeywordSave != 'off'){
		getMyKeyword(query);
	}
	searchForm.submit();
}
/*
function escapeOutput(toOutput){
    return toOutput.replace(/\&/g, '&amp;')
        .replace(/\</g, '&lt;')
        .replace(/\>/g, '&gt;')
        .replace(/\"/g, '&quot;')
}
*/

//xss체크
function escapeOutput(toOutput){
	toOutput = replaceAll(toOutput, "<", "&lt;");
	toOutput = replaceAll(toOutput, ">", "&gt;");
	toOutput = replaceAll(toOutput, "'", "&#39;");
	toOutput = replaceAll(toOutput,'"', '&quot;');
	toOutput = replaceAll(toOutput,'%', '');
    return toOutput
}

// Replace All
function replaceAll(str, orgStr, repStr) {
	return str.split(orgStr).join(repStr);
}




// 오타 검색
function otaSearch(otaQuery){
	var searchForm = document.search2;
	searchForm.otaSearch.value = "1";
	searchForm.query.value = otaQuery;
	searchForm.collection.value = "goods";
	searchForm.startCount.value = 0;
	searchForm.sort.value = "RANK/DESC";
	searchForm.submit();
}

// 컬렉션별 검색
function doCollection(coll, target) {
	// 클릭 로그 처리
	overpass.tracking.loggingClick($(target).data());
	var searchForm = document.search2; 
	searchForm.collection.value = coll;
	searchForm.sort.value="";
	searchForm.sortNm.value="";
	searchForm.submit();
}
	
// 엔터 체크	
function pressCheck(event, msg) {   
	if (event.keyCode == 13) {
		return doHeadSearch(msg);
	}else{
		return false;
	}
}

var temp_query = "";

// 페이징
function doPaging(count,collection, searchForm) {
	var targetForm = $("form[name='" + searchForm +"']");
	targetForm.children("input[name='collection']").val(collection);
	targetForm.children("input[name='startCount']").val(count);
	targetForm.submit();
}

// 문자열 숫자 비교
function compareStringNum(str1, str2, repStr) {
	var num1 =  parseInt(replaceAll(str1, repStr, ""));
	var num2 = parseInt(replaceAll(str2, repStr, ""));

	if (num1 > num2) {
		return false;
	} else {
		return true;
	}
}

// Replace All
function replaceAll(str, orgStr, repStr) {
	return str.split(orgStr).join(repStr);
}

// 공백 제거
function trim(str) {
	return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

//인기검색어
function getPopkeyword(siteNo) {
	var labelId = 'ssg_kr';
	var langCd = 'kr';
	// K몰
	if(siteNo == 'S00001'){
		labelId = 'ssg_kr';
	// C몰
	}else if(siteNo == 'S00002'){
		labelId = 'ssg_cn';
		langCd = 'cn';
	}
	
	var target		= "popword";
	var range		= "w";
	var collection  = labelId;
    var datatype   = "json";
	$.ajax({
	  type: "POST",
	  url: "/"+langCd+"/search/popword",
	  dataType: datatype,
	  data: { "target" : target, "range" : range, "collection" : collection , "datatype" : datatype },
	  success: function(text) {
		  	var obj = text;
			var str = "";
			var cntPop = 1;
			$(obj.Data.Query).each(function(i,v){
				var popStateHtml = "";
				switch(v.updown){
					case "U":
						popStateHtml = "<span class=\"state up\">인기 상승</span>";
						break;
					case "D":
						popStateHtml = "<span class=\"state down\">인기 하락</span>";
						break;
					case "N":
						popStateHtml = "<span class=\"state new\">신규</span>";
						break;
					default :
						popStateHtml ="";
				}
				var temp_i = cntPop < 10 ? "0"+cntPop : cntPop;
				str += "<li>";
				str += "	<a href='#' name='popword' data-clicklog data-page='SC' data-param1='SC050' data-param2='03SC050' data-param3='SCW0" + temp_i + "' data-param4='" + v.content + "' role=\"button\" onclick=\"javascript:doKeyword('"+ v.content + "','05');\">" + v.content + "</a>";
				str += 		popStateHtml;
				str += "</li>";
				cntPop++;
			});
	
			$("#popword").empty();
			$("#popword").append(str);
		
	  },error:function(request,status,error){ 

	  }
	});

}


// 연관검색어
function getRecommend(query, langCd) {
	$.ajax({
		type: "POST",
		url: "/"+langCd+"/search/relatedWord",
		dataType: "json",
		data: {"query" : query, "langCd" : langCd},
		success: function(json) {
			var dupMap = [];
			if(json != null && json.length > 0){
				// 연관검색어 최대 10개
				var maxCnt = 0;
				var relatedWordHtml = "";
				for(var i=0; i<json.length; i++){
					var relatedWord = json[i].SEARCH_KEY;
					var arkData = '';
					
					if(relatedWord.indexOf("[ARK]") > -1){
						arkData = 'ark';
						relatedWord = relatedWord.replace("[ARK]", "");
					}else{
						arkData = 'bos';
					}
					
					if(query == relatedWord || dupMap.indexOf(relatedWord) > -1) continue;
					dupMap.push(relatedWord);

					var temp_i = i+1 < 10 ? "0"+(i+1) : (i+1);
					relatedWordHtml += "<li>";
					relatedWordHtml += "	<a href='#' data-type='" + arkData + "' data-clicklog data-page='SL' data-param1='SC020' data-param2='SCW0" +  temp_i + "' data-param3='" + relatedWord + "' onclick=\"javascript:doKeyword('" + relatedWord + "','06');\">" + relatedWord  + "</a>";
					relatedWordHtml += "</li>";
					maxCnt++;
					if(maxCnt > 9) break;
				}
				$("#recSearch").html(relatedWordHtml);	
				$(".relatedSearch").show();
			}
			
		}, error:function(request,status,error){ 
		    //alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}
	});
}


//오프라인 샵 검색
function doOffShopSearch(offshop) {
	var searchForm = document.search1;
	searchForm.offShop.value = offshop;
	document.getElementById("totalSearch").value = offshop;
	searchForm.submit();
}


