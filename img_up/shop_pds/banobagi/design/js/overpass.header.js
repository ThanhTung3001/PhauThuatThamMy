;(function($){
	//[START] 네이스페이스 생성
	if ($.type(window.overpass) != "object") {
		window.overpass = {};
	};
	var FN = (function(){
		if ($.type(window.overpass.fn) == undefined) {
			window.overpass.fn = {};
		};
		return window.overpass.fn;
	})();
	//[END] 네이스페이스 생성 
	
	var myPick = {};//MyPick
	var snsShare = {};//
	
	$.extend(FN, {
		header: {
			//MyPick parameter 설정
			setMyPick: function(p){
				$.extend(myPick, {
					rel_divi_cd : "", //10: 상품, 20: 브랜드, 30: 행사, 40 : 컨텐츠
					items : null,
					msg : "", //등록 메시지 처리
					callback: null,
					sale_shop_divi_cd : "", //상품 마이픽 담을때 값이 있으면 담아주세요
					sale_shop_no : "",//상품 마이픽 담을때 값이 있으면 담아주세요
					sale_area_no : "",//상품 마이픽 담을때 값이 있으면 담아주세요
					conts_dist_no : ""//상품 마이픽 담을때 값이 있으면 담아주세요
				}, p);
			},
			//sns 공유하기 parameter 설정
			setSnsShare: function(p){
				$.extend(snsShare, {
					share_type: "",
					url: "",
					title: "",
					description: "",
					img_path: "",
					msg_input_yn: "N",
					msg_title: "",
					add_text1: "",
					add_text2: "",
					add_img_path1: "",
					msg_input_yn: "N",
					msg_title: ""
				}, p);
			},
			//myPick 담기
			myPick: function(b){
				var button = $(b);
				if($.isEmptyObject(myPick)){
					return false;
				}
				var callback = myPick.callback;//callback
				
				$.extend(myPick, {
					btn: button,
					callback: function(data){
						if($.isFunction(callback)){
							callback($.extend(data, { button: button }));
						};
					}
				});
				overpass.fn.add.addWish(myPick);
			},
			//공유하기
			snsShare: function(){
				if($.isEmptyObject(snsShare)){
					return false;
				}
				overpass.layer.snsShareLayer(snsShare);
			}
		}
	});
})(jQuery);