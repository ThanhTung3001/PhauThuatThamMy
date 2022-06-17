var isArk = true; // 자동완성 기능 사용 여부
var arkId = "#ark"; // 자동완성 전체 <div> 의 id을 설정한다
var wrapId = "ark_content_list"; // 자동완성 결과 <div> 의 id을 설정한다
var queryId = "#totalSearch"; // 검색어 <input> 의 id을 설정한다
var contentListId = "arkDiv"; // 자동완성 Content List <li> 의 id을 설정한다
var datatype = "json"; // 반환받을 Data의 타입을 설정. XML 과 JSON이 가능 (xml | json)
var totalFwCount = 0; // 전방 검색 전체 개수
var totalRwCount = 0; // 후방 검색 전체 개수

function doARK(siteNo, clientNo){
	var query = $(queryId).val();
	if(query.length > 0){
		$(".headSearch > .headsearchWrap > .inner > .searchArea > .btIco.icDel").show();
	}else{
		$(".headSearch > .headsearchWrap > .inner > .searchArea > .btIco.icDel").hide();
	}
	if($(queryId).is(":focus") && query.trim().length > 0){	
		setTimeout(function(){
			requestArkJson(query, siteNo, clientNo);
		}, 300);
	}
}

/*******************************************************************************
 * 자동완성 목록을 화면에 보여줌
 * 
 * @name showArk
 ******************************************************************************/
function showArk() {
	if ($(queryId).val() != "") {
		$("#" + wrapId).show();
	}
}

/*******************************************************************************
 * 자동완성 목록을 화면에서 감춤
 * 
 * @name hideArk
 ******************************************************************************/
function hideArk() {
	$("#" + wrapId).hide();
}

// 자동완성 호출
function requestArkJson(query, siteNo, clientNo) {
	// K몰 & C몰
	var landCd = "KR";
	if(siteNo == 'S00001')  landCd = 'KR';
	else if(siteNo == 'S00002') landCd = 'CN';
	var urlLang =  landCd.toLowerCase();
	$.ajax({
		type : "GET",
		url : "/"+urlLang+"/search/ark",
		dataType : "json",
		async : false,
		data : {
			"query" : query,
			"langCd" : landCd,
			"clientNo" : clientNo,
			"target" : "common",
			"goodsSearchField" : "GOOS_NM,SUB_GOOS_NM,HADL_BRAN_NM,PROFILE_INFO,SEARCH_KWD,BRAN_GOOS_GRP_NM,HASH_TAG_KEYWORD,CTG_NM_LIST,GOOS_CD_LIKE,REF_NO_LIKE,FILTER_INFO_NM,GOOS_NM_LIKE,HADL_BRAN_NM_LIKE",
			"goodsResultField" : "DOCID,DATE,GOOS_CD,GOOS_NM,SUB_GOOS_NM,HADL_BRAN_NM,BRAN_GOOS_GRP_NM,PROFILE_INFO,SALE_PRICE,DSCNT_RATE,GOOS_EVAL_CNT,WISH_CNT,PRICE,SEL_CNT,KR_HADL_BRAN_NM,EN_HADL_BRAN_NM,SALE_CNT,CN_HADL_BRAN_NM",
			"goodsSortField" : "WEIGHT/DESC,RANK/DESC,DATE/DESC",
			"benefitSearchField" : "EVENT_NM,EVENT_SUB_NM,DISP_CTG_NM,BRAN_NM,FLAG,KEYWORD,DEPTH_NM,HASHTAG,EVENT_NO",
			"benefitResultField" : "DOCID,DATE,EVENT_NO,EVENT_NM,EVENT_SUB_NM,EVENT_START_DTIME,EVENT_END_DTIME,IMG_PATH,SEL_CNT,TEXT_COLOR_CD",
			"benefitSortField" : "RANK/DESC,SEL_CNT/DESC"
		},
		success : function(resdata) {
			var arkData = resdata.ark;
			var goodsData = resdata.goodsListFull;
			var benefitData = resdata.benefitList;
			var arkCategoryList = resdata.ark_categoryList;
			var arkBrandList = resdata.ark_brandList;
			
			var arkResultHtml = "";
			
			// 카테고리 자동완성 처리
			var dupMap = [];
			// 카테고리 자동완성 최대 3개
			var maxCnt = 0;
			for (var i = 0; i < arkCategoryList.length; i++) {
				var ARK_CATEGORY = arkCategoryList[i].ARK_CATEGORY;	
				var DISP_SCTG_NO = arkCategoryList[i].DISP_SCTG_NO;
				ARK_CATEGORY = ARK_CATEGORY.replace("<!HS>", "<strong>").replace("<!HE>", "</strong>");
				var DISP_CATEGORY = ARK_CATEGORY.replace("<strong>", "").replace("</strong>", "");
				var cateDataParam = "["+DISP_SCTG_NO +"]"+ DISP_CATEGORY;
				// 카테고리 중복 처리
				if(dupMap.indexOf(ARK_CATEGORY) > -1) continue;
				dupMap.push(ARK_CATEGORY);
				
				arkResultHtml += "<li>";
				// 카테고리 자동완성 클릭 시 검색으로 변경
				//arkResultHtml +="	<a name='autokeyword' data-clicklog data-page='SC' data-param1='SC020' data-param2='AUC' data-param3='AUC5' data-param4='" + cateDataParam+ "' href=\"javascript:overpass.fn.disp.goDispCtg({disp_ctg_no : '" + DISP_SCTG_NO +"'});\" >";
				arkResultHtml +="	<a name='autokeyword' data-clicklog data-page='SC' data-param1='SC020' data-param2='AUC' data-param3='AUC5' data-param4='" + cateDataParam + "' href=\"javascript:doKeyword('" + DISP_CATEGORY + "')\";>"
				arkResultHtml +="	<span name='autokeyword' class=\"txt\">" + ARK_CATEGORY + "</span><span class=\"flag ssgCate\">" + resdata.categoryMsg  + "</span></a>";
				arkResultHtml += "	<button type=\"button\" class=\"btIco icAdd\" onclick =\"javascript:setKeyword('" + DISP_CATEGORY + "');\">검색어로 선택</button>";
				arkResultHtml += "</li>";
				
				maxCnt++;
				if(maxCnt > 2) break;
			}
			
			// 브랜드 자동완성 처리
			for (var i = 0; i < arkBrandList.length; i++) {
				var ARK_BRAND = arkBrandList[i].ARK_BRAND;
				var HADL_BRAN_CD = arkBrandList[i].HADL_BRAN_CD;
				var OFFLINE_BRAN_YN = arkBrandList[i].OFFLINE_BRAN_YN;
				var OFFLINE_BRAN_NM = arkBrandList[i].OFFLINE_BRAN_NM;
				var FRONT_DISP_DIVI_CD = arkBrandList[i].FRONT_DISP_DIVI_CD;
				var EN_HADL_BRAN_NM = arkBrandList[i].EN_HADL_BRAN_NM.replaceAll("'", "\\'");
				
				ARK_BRAND = ARK_BRAND.replace("<!HS>", "<strong>") .replace("<!HE>", "</strong>");
				var showArkBrand = ARK_BRAND.replace("<strong>", "") .replace("</strong>", "");
				
				//클릭로그 
				var dataParam4 =  "["+HADL_BRAN_CD+"]" + showArkBrand;
				 
				// 공식스토어
				if (FRONT_DISP_DIVI_CD == "20") {
					arkResultHtml += "<li>";
					arkResultHtml += "	<a name='autokeyword' data-clicklog data-page='SC' data-param1='SC020' data-param2='AUC' data-param3='AUC2' data-param4=\"" +dataParam4+ "\" href=\"javascript:overpass.fn.disp.fnCategoryPathInfo({hadl_bran_cd:'" + HADL_BRAN_CD + "', bran_nm:'" + EN_HADL_BRAN_NM + "'});\">";
					arkResultHtml += "		<span name='autokeyword' class=\"txt\">" + ARK_BRAND + "</span><span class=\"flag ssgStore\">" + resdata.officalStoreMsg  + "</span>";
					arkResultHtml += "	</a>";
					arkResultHtml += "	<button type=\"button\" class=\"btIco icAdd\" onclick =\"javascript:setKeyword('" + showArkBrand + "');\">" + resdata.officalStoreMsg  + "</button>";
					arkResultHtml += "</li>";
				// 오프라인 매장
				} else if (OFFLINE_BRAN_YN == "Y") {
					arkResultHtml += "<li>";
					arkResultHtml += "	<a name='autokeyword' data-clicklog data-page='SC' data-param1='SC020' data-param2='AUC' data-param3='AUC3' data-param4=\"" +dataParam4 + "\" href=\"javascript:doOffShopSearch('" + OFFLINE_BRAN_NM + "');\">";
					arkResultHtml += " 		<span name='autokeyword' class=\"txt\">" + ARK_BRAND + "</span><span class=\"flag ssgOffline\">" + resdata.offlineMsg  + "</span>";
					arkResultHtml += "	</a>";
					arkResultHtml += "	<button type=\"button\" class=\"btIco icAdd\" onclick =\"javascript:setKeyword('" + showArkBrand + "');\">" + resdata.offlineSsgMsg  + "</button>";
					arkResultHtml += "</li>";
				// 브랜드	
				} else {
					arkResultHtml += "<li>";
					arkResultHtml += " 	<a name='autokeyword' data-clicklog data-page='SC' data-param1='SC020' data-param2='AUC' data-param3='AUC4' data-param4=\"" + dataParam4 + "\" href=\"javascript:overpass.fn.disp.fnCategoryPathInfo({hadl_bran_cd:'" + HADL_BRAN_CD + "', bran_nm:'" + EN_HADL_BRAN_NM + "'});\">";
					arkResultHtml += "		<span name='autokeyword' class=\"txt\">" + ARK_BRAND + "</span><span class=\"flag ssgBrand\">" + resdata.brandMsg  + "</span>";
					arkResultHtml += "	</a>";
					arkResultHtml += "	<button type=\"button\" class=\"btIco icAdd\" onclick =\"javascript:setKeyword('" + showArkBrand + "');\">" + resdata.brandMsg  + "</button>";
					arkResultHtml += "</li>";
				}
			}
			
			// 일반 자동완성 처리
			if(arkData.length > 0){
				arkData = JSON.parse(arkData);
				$.each(arkData.result, function(i, result) {
					var totalCount = parseInt(result.totalcount);
					if (totalCount > 0) {
						$.each(result.items, function(num, item){
							var hkeyword = item.hkeyword;
							
							hkeyword = hkeyword.replace("<font style='font-size:13px'><font style='color:#CC6633'>", "<strong>");
							hkeyword = hkeyword.replace("<font style='font-size:13px'>", "<strong>");
							hkeyword = hkeyword.replace("</font>", "</strong>");
							hkeyword = hkeyword.replace("</font>", "");
							
							arkResultHtml += "<li>";
							arkResultHtml +="		<a name='autokeyword' data-clicklog data-page='SC' data-param1='SC020' data-param2='AUC' data-param3='AUC1' data-param4='" + item.keyword + "' href=\"#\" onclick=\"javascript:doKeyword('" + item.keyword + "')\";>"
							arkResultHtml += "		<span name='autokeyword' class=\"txt\">" + hkeyword + "</span></a>";
							arkResultHtml += "		<button type=\"button\" class=\"btIco icAdd\" onclick =\"javascript:setKeyword('" + item.keyword + "');\">검색어로 선택</button>"
							arkResultHtml += "</li>";
							
							if(num > 8) return false;
						});
					}
				});
			}
			
			// 추천 상품 자동완성 처리
			var goodsResultHtml = "";
			for (var j = 0; j < goodsData.length; j++) {
				var KR_HADL_BRAN_NM = goodsData[j].KR_HADL_BRAN_NM;				
				var EN_HADL_BRAN_NM = goodsData[j].EN_HADL_BRAN_NM;		
				var CN_HADL_BRAN_NM = goodsData[j].CN_HADL_BRAN_NM;
				var GOOS_NM = goodsData[j].GOOS_NM;
				var GOOS_CD = goodsData[j].GOOS_CD;
				var SALE_CNT = goodsData[j].SALE_CNT;
				var SALE_DOLLOR = goodsData[j].SALE_PRICE;
				var IMG_PATH = goodsData[j].IMG_PATH;
				
				var LANG = goodsData[j].LANG;
				var CURRENCY_CD_CNY = goodsData[j].CURRENCY_CD_CNY;
				var DOLLAR = goodsData[j].DOLLAR;
				var WON = goodsData[j].WON;
				var SALE_RATE = goodsData[j].SALE_RATE;

				//클릭로그 
				var dataParam5 =  "["+GOOS_CD+"]" + GOOS_NM;

				goodsResultHtml +="	<li class=\"prodCont\">";
				goodsResultHtml +="		<figure><img src='" + IMG_PATH + "' alt=\"\"></figure>";
				goodsResultHtml +="		<a role=\"button\" class=\"prodInfo\" name='headerProd' href=\"javascript:overpass.link('GOOSDETAIL', {goos_cd: '" + GOOS_CD + "'});\"   data-clicklog data-page='SC' data-param1='SC020' data-param2='AUC' data-param3='AUC6' data-param4='PR0"+(j+1)+"' data-param5='"+dataParam5+"'>";
				
				if(landCd == 'KR'){
					goodsResultHtml +="			<span name='headerProd'  class=\"brandName\">"+ KR_HADL_BRAN_NM +"<span class=\"eng\">"+ EN_HADL_BRAN_NM +"</span></span>";
				}else if(landCd == 'CN'){
					goodsResultHtml +="			<span name='headerProd'  class=\"brandName\">"+ CN_HADL_BRAN_NM +"<span class=\"eng\">"+ EN_HADL_BRAN_NM +"</span></span>";
				}
				
				goodsResultHtml +="			<em class=\"prodName\">"+ GOOS_NM +"</em>";
				if(SALE_RATE != ''){
					goodsResultHtml +="			<span class=\"priceArea\"><strong class=\"saleNum\">"+ SALE_RATE +"</strong>";
				}
				goodsResultHtml +="			<strong class=\"saleDollar\" aria-label=\"할인가 미화\">"+ DOLLAR +"</strong>";
				goodsResultHtml +="			<em class=\"saleWon\" aria-label=\"할인가 원화\" data-currency='"  + CURRENCY_CD_CNY + "' data-lang='" + LANG + "'>"+ WON  + "</span></em>";
				goodsResultHtml +="			</span>";
				goodsResultHtml +="		</a>";
				goodsResultHtml +="	</li>";
									
			}
			
			// 추천 혜택 자동완성 처리
			var benefitResultHtml = "";
			for (var j = 0; j < benefitData.length; j++) {
				var EVENT_NM = benefitData[j].EVENT_NM.replace("<!HS>", "").replace("<!HE>", "");		
				var EVENT_SUB_NM = benefitData[j].EVENT_SUB_NM.replace("<!HS>", "").replace("<!HE>", "");
				var EVENT_NO = benefitData[j].EVENT_NO;	
				var IMG_PATH = benefitData[j].IMG_PATH;
				var TEXT_COLOR_CD = benefitData[j].TEXT_COLOR_CD;	
				var textColorClsNm = "typeBlack";
				
				//TEXT_COLOR_CD( 10:black 11 white)
				if(TEXT_COLOR_CD == '10'){
					textColorClsNm = "typeBlack";
				}else if(TEXT_COLOR_CD == '11'){
					textColorClsNm = "typeWhite";
				}	
				
				//클릭로그 
				var dataParam5 =  "["+EVENT_NO+"]" + EVENT_NM;
				
				benefitResultHtml +="<div class=\"bannerType typeBannerA\" name=\"typeBannerA\">";
				benefitResultHtml +="	<a name='headerProp' class='"+textColorClsNm+"' href=\"javascript:overpass.link('EVENTDETAIL', {event_no: '" + EVENT_NO + "'});\"   data-clicklog data-page='SC' data-param1='SC020' data-param2='AUC' data-param3='AUC7' data-param4='BN0"+(j+1)+"' data-param5='"+dataParam5+"'>";
				benefitResultHtml +="		<figure><img src='" + IMG_PATH + "' alt=\"\"></figure>";
				benefitResultHtml +="		<div class=\"bannerTxt\">";
				benefitResultHtml +="			<div class=\"inner\">";
				benefitResultHtml +="				<p class=\"titEvent\">"+ EVENT_NM +"</p><span class=\"subTit\">"+ EVENT_SUB_NM +"</span>";
				benefitResultHtml +="			</div>";
				benefitResultHtml +="		</div>";
				benefitResultHtml +="	</a>";
				benefitResultHtml +="</div>";
			}
			
			// 화면 append
			$(".autoCompList").html(arkResultHtml);
			$("#recomPopDiv > ul").html(goodsResultHtml);
			
			// 혜택 기존 존재 여부 확인 후 처리
			if($("#recomPopDiv").children("div[name='typeBannerA']").length > 0) $("#recomPopDiv").children("div[name='typeBannerA']").remove();
			$("#recomPopDiv").append(benefitResultHtml);
			
			if($("#recomPopDiv > ul").children().length > 0){
				$("#recomPopDiv > .titDep5").show();
			}else{
				$("#recomPopDiv > .titDep5").hide();
			}
		}
	});

}