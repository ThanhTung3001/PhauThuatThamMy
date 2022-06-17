;(function($) {
	(function(){
		if (overpass.fn.add == undefined) {
			overpass.fn.add = {};
		}
	})();
	
	//[START] 장바구니 담기/바로구매
	(function() {
		var MB_CART_DIVI_CD_IMMEDIATE_ORDER = "20";	//바로구매
		var OD_ORD_TYPE_CD_GEN = "10";	//주문유형코드 - 일반
		var OD_PAY_MEAN_CD_ALIPAY = "21";	//결제수단 - 알리페이
		var running = false; // (중복방지)do nothing...
		
		var registCart = function(p) {//장바구니 등록
			var cart_seq = 1;
			var list = [];
			$.each(p.items, function(idx, item){
				item.cart_seq = String(cart_seq++);
				var set_items = [];
				if(item.set_items != undefined){
					$.each(item.set_items , function(setIdx, set){
						set.cart_seq = String(cart_seq++);
						set_items.push(set);
					});
					item.set_items = set_items;
				}
				list.push(item);
			});
			
			$.ajax({
				url: overpass.util.getUrl("/cart/registCart"),
				type: "POST",
				dataType: "JSON",
				data: { cart_divi_cd: p.cart_divi_cd, cart_data: JSON.stringify(list), is_bulk_cart : p.is_bulk_cart },
				success: function(data) {
					
					if(data.ret_code == "S"){

						$("header #header_cart_cnt").text(data.cart_cnt); //장바구니 개수 증가
						$("header #header_smart_cart_cnt").text(data.smart_cart_cnt); //스마트픽 장바구니 개수 증가
						
						if(p.cart_divi_cd == MB_CART_DIVI_CD_IMMEDIATE_ORDER) {	//바로구매
							$.each(list, function(idx, item){
								var p = {
										page : "BUY",
										param1 : item.goos_cd
								}
								overpass.commonLog(p);
							});
							var parameter = { order_poss_check: "N", cart_divi_cd: p.cart_divi_cd, ord_type_cd: p.ord_type_cd, cart_no_list: data.cart_no_list, cart_type : p.cart_type };
							if(p.alipay && p.pay_mean_cd != undefined){
								parameter = $.extend(parameter, {
									alipay_yn: p.alipay ? "Y" : "N",
									pay_mean_cd: p.pay_mean_cd
								});
							}
							overpass.fn.add.goOrder(parameter);
						}else {
							
							$.each(list, function(idx, item){
								var p = {
										page : "CART",
										param1 : item.goos_cd
								}
								overpass.commonLog(p);
							});
							
							var recopick = data.recopick;
							var disp_lctg_no_list = [];
							if(recopick.length > 0){
								var items = [];
								$.each(recopick, function(idx, goos){
									items.push({
										id : goos.goos_cd,
										c1 : goos.lcate_nm,
										c2 : goos.mcate_nm,
										c3 : goos.scate_nm,
										count : goos.ord_cnt
									});
									disp_lctg_no_list.push(goos.disp_lctg_no);
									
									//와이즈트래커 로그 쌓기
									if(overpass.global.isApp){
									    /*var tempPageIcfCd = "";
									    var pageIcfCd = $.trim(SSGDFS.pageIcfCd);

									    if(pageIcfCd == '00000001' || pageIcfCd == '01000001') {
									        tempPageIcfCd = "MM";
                                        } else if (pageIcfCd == '00001895' || pageIcfCd == '00001896' || pageIcfCd == '01000235' || pageIcfCd == '01000236' ) {
                                            tempPageIcfCd = "PDV";
                                        }
									    else if (pageIcfCd == '01000237' || pageIcfCd == '00001897') {
                                            tempPageIcfCd = "OCA";
                                        } else {
									        tempPageIcfCd = "OCA";
                                        }*/
										WiseTracker.setGoalProduct(goos.goos_cd);
										if(goos.hadl_bran_nm != undefined && goos.hadl_bran_nm != ""){
											WiseTracker.setGoalContents(goos.hadl_bran_nm.split("||")[0]);
											WiseTracker.setContents(goos.hadl_bran_nm.split("||")[0]);
										}else{
											WiseTracker.setGoalContents("");
											WiseTracker.setContents("");
										}
										
										WiseTracker.setGoal("g9", 1);
										WiseTracker.setGoalBeforePage(SSGDFS.pageIcfCd);
										WiseTracker.setProduct(goos.goos_cd, goos.goos_nm);
										
										if(goos.disp_ctg_no != undefined && goos.disp_ctg_no != ""){
											WiseTracker.setProductCategory(goos.disp_ctg_no, goos.disp_ctg_nm);
											WiseTracker.setGoalProductCategory(goos.disp_ctg_no);
										}else{
											WiseTracker.setProductCategory("", "");
											WiseTracker.setGoalProductCategory("");
										}
										
										WiseTracker.setBeforePage(SSGDFS.pageIcfCd);
										WiseTracker.setPageIdentity("OCA");
										WiseTracker.sendTransaction();
									}
								});
								recopickLog("basket", items);
							}
							if(p.callback != undefined && $.type(p.callback) == "function"){
								p.callback(data);
							}else if(p.is_bulk_cart){
								if(data.all_buy_limit){
									overpass.alert(overpass.message("cart.list.name17"));//선택한 상품은 1회 구매가능수량 초과 또는 재고 부족으로 장바구니에 담을 수 없습니다
								}else if(data.all_soldout){
									overpass.alert(overpass.message("cart.list.name16"));//선택한 상품은 품절이므로 장바구니에 담을 수 없습니다.
								}else{
									//cart.list.name18 : 선택한 상품을 장바구니에 담았습니다. 바로 확인하시겠습니까?
									//cart.list.name19 : 품절 상품을 제외한 {0}개 상품을 장바구니에 담았습니다. 바로 확인 하시겠습니까?
									var msg_code = data.soldout_cnt > 0 ? "cart.list.name19" : "cart.list.name18";
									var msg = {
											data: {
												msg: overpass.message(msg_code, data.success_cnt),
												btn2 : {
													callback : function(){
														overpass.link("CART");
													}
												}
											}
										}
									overpass.confirm(msg);
								}
							}else{
								var item_ids = "";
								
								$.each(p.items, function(idx, data){
									item_ids += data.goos_cd+",";
								});
								
								item_ids = item_ids.substring(0, item_ids.length - 1);
								
								// 장바구니 담기 완료 레이어 샘플
								overpass.layer.createLayer({
									action: overpass.util.getUrl("/goos/initGoosCartFinish"),  //URL
									data: { item_ids : item_ids , disp_lctg_no_list : JSON.stringify(disp_lctg_no_list)},
									method : "post",
									success : function(){
										if($("#basket_end").length == 0){
											overpass.toast(overpass.message("cart.list.name09"));//"장바구니에 담겼습니다."
//											setBodyNoScrolling(false);
											//mo, app 에서 장바구니 담은후 레이어를 닫아준다.
											if(overpass.global.chnl_cd != "10"){
												LayerPopup.close("#basket");
											}
										}
									},
									error : function(){
										//장바구니 담기에 성공했지만 레코픽등 api 가 동작하지 않을때도 장바구니 담았다고 toast를 띄운다.
										overpass.toast(overpass.message("cart.list.name09"));//"장바구니에 담겼습니다."
//										setBodyNoScrolling(false);
									}
								});
							}
						}
					}else{
						if(data.ret_msg != undefined && data.ret_msg != ""){
							overpass.alert(data.ret_msg);
						}else{
							overpass.alert(overpass.message("cart.list.name13"));//"장바구니 담기에 실패하였습니다."
						}
					}
					
				},
				error: function(e) {
					overpass.alert(overpass.message("cart.list.name13"));//"장바구니 담기에 실패하였습니다."
				},
				complete: function() {
					running = false;
				}
			});
		}
		//장바구니 데이터 체크 및 데이터 조합
		var addCartCheck = function(pin) {
			if(running === true){
				return false;
			}
			running = true;
			
			var p = $.extend({
				cart_divi_cd : MB_CART_DIVI_CD_IMMEDIATE_ORDER,
				is_bulk_cart : false,
				ord_type_cd: OD_ORD_TYPE_CD_GEN,//주문유형변경이 필요한 경우 전송 - default:일반
				items : []
			}, pin);
			var goos_cd_list = [];
			
			(function(){
				var list = [];
				if ($.isArray(p.items) !== true || p.items.length == 0) {
					throw "상품 정보가 없습니다.";
				}
				
				$.each(p.items, function(i, item) {
					if ($.isNumeric(item.ord_qty) === false || item.ord_qty <= 0) {
						throw "상품 수량이 올바르지 않습니다.";
					}
					var goos = $.extend({
						goos_cd : "",
						goos_nm : "",
						goos_cmps_divi_cd : "10",
						cart_divi_cd : p.cart_divi_cd, // 10: 장바구니, 20: 바로구매
						cart_grp_cd : "10",
						ord_yn : "N",
						sale_shop_divi_cd : "",
						sale_shop_no : "",
						sale_area_no : "",
						set_goos_cd : "",
						conts_dist_no : "",
						ord_qty : 1
					}, item);
					
					
					goos_cd_list.push(goos.goos_cd);//일반상품
					
					//세트상품 구성품
					if(!$.isEmptyObject(goos.set_items)){
						$.each(goos.set_items, function(s_idx, s_item){
							goos_cd_list.push(s_item.goos_cd);//세트상품 구성상품
						});
					}
					
					list.push(goos);
				});
				
				p.items = list;
			})();
			
			//주문가능 체크
			orderPossCheck({
				order_poss_check: MB_CART_DIVI_CD_IMMEDIATE_ORDER == p.cart_divi_cd ? "Y" : "N",//주문가능 체크 여부
				stock_req_check : p.stock_req_check, 
				goos_cd_list: goos_cd_list
			}, function(){
				
				//캠페인아이디와 통합컨텐츠번호가 존재하면 에이징체크를한다.
				if(p.cmpn_id && p.event_no){
					$.ajax({
						url : overpass.util.getUrl("/cart/getAgingCheck"),
						data : {items : JSON.stringify(p.items), cmpn_id : p.cmpn_id, event_no : p.event_no},
						type : "POST",
						dataType : "json",
						success : function(data){
							if(data.aging_check_yn == "Y"){
								overpass.confirm(data.confirm_msg, function(){
									registCart(p);
								});
							}else if(data.delete_yn == "Y"){
								$.each(p.items, function(idx, item){
									item.cmpn_id = "";
									item.event_no = "";
								});
								registCart(p);
							}else{
								registCart(p);
							}
						},
						error : function(){
							registCart(p);
						}
					});
				}else{
					registCart(p);
				}
			});
		};
		
		//주문가능체크
		var orderPossCheck = function(parameter, callback){
			$.ajax({
				url: overpass.util.getUrl("/cart/getOrderPossCheck"),
				type: "POST",
				data: parameter,
				success:function(data){
					if(data.ret_code == "S"){
						callback();
					}else{
						if(data.ret_msg != ""){
							if(data.ret_page_cd != ""){
								
								var msg = {};
								if(data.ret_page_cd == "adt_auth"){
									msg = {
										msg: data.ret_msg,
										btn2 : {
											callback : function(){
												overpass.link('ADTAUTHPAGE');
											}
										}
									}
								}else if(data.ret_page_cd == "rcase1"){
									msg = {
										msg: data.ret_msg,
										btn2 : {
											callback : function(){
												callback();
											}
										}
									}
								}else if(data.ret_page_cd == "rcase2" || data.ret_page_cd == "rcase3"){
									msg = {
											msg: data.ret_msg,
											btn1 : {
												msg : overpass.message("cart.list.name10"),//"일반구매"
												callback : function(){
													callback();
												}
											},
											btn2 : {
												msg : overpass.message("cart.list.name11"),//"재고신청 이동"
												callback : function(){
													overpass.link("DGSTOCKCOMPLETE",{quest_no : data.quest_no});
												}
											}
										}								
								}else{
									msg = {
											msg: data.ret_msg,
											btn1: {
												callback: function(){
													if(data.ret_code == "c10" || data.ret_code == "c11"){//에러코드가 c10, c11일 경우 주문처리
														callback();
													}
												}
											},
											btn2 : {
												callback : function(){
													if(data.ret_page_cd == "P"){//여권등록/수정
														overpass.link("MYPSPTREGISTMOD");
													}//본인인증
													else if(data.ret_page_cd == "C"){
														var p = {
															auth_cd: data.ret_add_info
														};
														overpass.fn.login.initKMC(p);
													}//기타 - 주문진행
													else{
														callback();
													}
												}
											}
										}	
								}
								
								overpass.confirm(msg);
							}else{
								overpass.alert(data.ret_msg);
							}
						}
					}
				}
			});
		}
		
		$.extend(overpass.fn.add, {
			addCart: function(p){
				try {
					if(!overpass.fn.login.loginCheck()){
						overpass.confirm(overpass.message("member.login.check"), function(){
							if(overpass.global.chnl_cd == "10"){
								overpass.fn.login.lyrLogin();
							}else{
								overpass.fn.login.isLogin();
							}
						});
					}else{
						addCartCheck(p);
					}
				} catch (e) {
					overpass.alert(e);
				}finally{
					running = false;
				}
			},
			//alipay 바로구매
			addAlipayCart: function(p){
				this.addCart($.extend(p, {alipay: true, pay_mean_cd: OD_PAY_MEAN_CD_ALIPAY}));
			},
			//주문하기
			goOrder: function(p) {
				p = $.extend({order_poss_check: "Y"}, p);
				var callback = function(){
					//주문가능 체크
					orderPossCheck({
						order_poss_check: p.order_poss_check,//주문가능 체크 여부
						cart_no_list: p.cart_no_list
					}, function(){
						var form = (function() {
							if ($("#_ORDER_INIT_FORM_").length == 0) {
								$("<form id='_ORDER_INIT_FORM_'></form>").attr({
									action: overpass.util.https("/order/initOrder" + overpass.global.ext),
									method: "post"	//IE11에서 post로 넘기면 refresh 패러미터가 사라짐???
								}).appendTo("body");
							}
							return $("#_ORDER_INIT_FORM_").empty();
						})();
						$.each(p.cart_no_list, function() {
							form.append($("<input type='hidden' name='cart_no_list'></input>").val(this));
						});
						form.append($("<input type='hidden' name='cart_divi_cd'></input>").val(p.cart_divi_cd));
						form.append($("<input type='hidden' name='ord_type_cd'></input>").val(p.ord_type_cd));
						form.append($("<input type='hidden' name='alipay_yn'></input>").val(p.alipay_yn));
						form.append($("<input type='hidden' name='pay_mean_cd'></input>").val(p.pay_mean_cd));
						
						if(!overpass.global.isApp){
							overpass.util.openLoadingbar();//loading..
						}
						form.submit();
					});
				}
				if(!overpass.fn.login.loginCheck()){
					overpass.confirm(overpass.message("member.login.check"), function(){
						if(overpass.global.chnl_cd == "10"){
							overpass.fn.login.lyrLogin();
						}else{
							overpass.fn.login.isLogin();
						}
					});
				}else{
					callback(p);
				}
			},
			//alipay 주문
			goAlipayOrder: function(p){
				this.goOrder($.extend(p, {alipay_yn: "Y", pay_mean_cd: OD_PAY_MEAN_CD_ALIPAY}));
			},
			//주문서로 리턴
			goOrderReturn: function(p) {
				p = $.extend({
					cart_divi_cd: MB_CART_DIVI_CD_IMMEDIATE_ORDER,
					ord_type_cd: OD_ORD_TYPE_CD_GEN,//주문유형변경이 필요한 경우 전송 - default:일반
					cart_no_list: []
				}, (function(){
					var param = {};
					if(!$.isEmptyObject(p.cart_divi_cd)){
						param.cart_divi_cd = p.cart_divi_cd[0];
					}
					if(!$.isEmptyObject(p.ord_type_cd) && p.ord_type_cd != ""){
						param.ord_type_cd = p.ord_type_cd[0];
					}
					if(!$.isEmptyObject(p.cart_no_list)){
						param.cart_no_list = [];
						$.each(p.cart_no_list, function(idx, cart_no){
							param.cart_no_list.push(cart_no);
						});
					}
					if(!$.isEmptyObject(p.pay_mean_cd)){
						param.pay_mean_cd = p.pay_mean_cd[0];
					}
					return param;
				})());
				
				if(p.cart_no_list.length == 0){
					overpass.link("CART", {target: "replace"});
					return false;
				}
				
				this.goOrder(p);
			}
		})
	})();
	//[END] 장바구니 담기/바로구매

	
	//[START] 위시리스트 담기
	(function(){
		var running = false; // (중복방지)do nothing...
		var registWish = function(p) {
			$.ajax({
				url: overpass.util.getUrl("/member/registWish"),
				type: "POST",
				dataType: "JSON",
				data: { wish_data: JSON.stringify(p.items), is_bulk_wish : p.is_bulk_wish },
				success: function(data) {
					
					//모두 등록
					if(!data.isAdtGoosCheck){
						var msg = {
								msg: data.adt_ret_msg,
								btn2 : {
									callback : function(){
										overpass.link('ADTAUTHPAGE');
									}
								}
							}
						overpass.confirm(msg);
					}else if(data.ret_code == "S"){
						
						$.each(p.items, function(idx, item){
							overpass.commonLog({
								page : "MYP",
								param1 : p.rel_divi_cd,
								param2 : item.rel_no1
							});
						});
						
						//버튼객체를 체크해준다.
						if(p.btn != undefined){
							var name = p.btn.attr("name");
							p.btn.prop("checked", true);
							$("[name="+name+"]").prop("checked", true);
						}
						
						if(p.isMsgShow){
							if(p.msg != undefined && p.msg != ""){
								overpass.toast(p.msg, p.callback);
							}else{
								if(p.rel_divi_cd == "10"){
									overpass.toast("", function(){}, {toast_type : 'mypick', img_path : data.img_path});
								}else{
									overpass.toast(overpass.message("mypage.mypick.checked"), p.callback);
								}
							}
						}
					}
					//한개라도 삭제
					else if(data.ret_code == "D"){
						if(p.delMsg != "" && p.delMsg != undefined && p.isMsgShow){
							overpass.toast(p.delMsg);	
						}else if(p.isMsgShow){
							overpass.toast(overpass.message("mypage.mypick.unchecked"));
						}
						if(p.btn != undefined && p.btn != null){
							var name = p.btn.attr("name");
							p.btn.prop("checked", false);
							$("[name="+name+"]").prop("checked", false);
						}
					}
					//중복, 품절 체크
					else if(data.ret_code == "E"){
						if(data.reg_cnt > 0){
							overpass.alert(overpass.message("mypage.mypick.name02"));//선택한 상품을 MY PICK에 담았습니다.
						}else if(data.dup_cnt > 0){
							overpass.alert(overpass.message("mypage.mypick.name03"));//선택한 상품은 MY PICK에 이미 담긴 상품입니다.
						}
					}
					
					if($.type(p.callback) == "function"){
						p.callback(data);
					}
				},
				error : function(e) {
					if(e.error_message == undefined){
						overpass.alert("위시리스트 등록중 오류가 발생하였습니다.");
					}else{
						overpass.alert(e.error_message);
					}
				},
				complete: function(){
					running = false;
				}
			});
		};
		
		var addWishCheck = function(pin) {
			var p, list = [];
			if(running === true){
				return false;
			}
			running = true;
			
			p = $.extend({
				rel_divi_cd : "10",	//10: 상품, 20: 브랜드, 30: 행사, 40 : 컨텐츠
				items : [],
				isMsgShow : true,
				sale_shop_divi_cd : "",
				sale_shop_no : "",
				sale_area_no : "",
				conts_dist_no : "",
				is_bulk_wish : false
			}, pin);
			
			$.each(p.items, function(i, item) {
				if(item.rel_no == null && item.rel_no == "" && item.rel_no == undefined){
					throw "입력된 정보가 잘못되었습니다.";
				}
				list.push({
					rel_no1 : item.rel_no,
					rel_no2 : item.uppr_goos_cd,
					rel_divi_cd : p.rel_divi_cd,
					rel_divi_dtl_cd : p.rel_divi_dtl_cd,
					wish_grp_no : "0",
					sale_shop_divi_cd : p.sale_shop_divi_cd,
					sale_shop_no : p.sale_shop_no,
					sale_area_no : p.sale_area_no,
					conts_dist_no : p.conts_dist_no,
					set_items : item.set_items
				});
			});
			
			if(list.length == 0){
				throw "MyPick parmaeter Empty";
			}
			p.items = list;
			registWish(p);
		};
		$.extend(overpass.fn.add, {
			addWish : function(p){
		
				if(p.btn != undefined && p.btn != null){
					var name = p.btn.attr("name");
					if(p.btn.is(":checked")){
						p.btn.prop("checked", false);
						$("[name="+name+"]").prop("checked", false);
					}else{
						p.btn.prop("checked", true);
						$("[name="+name+"]").prop("checked", true);
					}
				}
				try {
					if(!overpass.fn.login.loginCheck()){
						overpass.confirm(overpass.message("member.login.check"), function(){
							if(overpass.global.chnl_cd == "10"){
								overpass.fn.login.lyrLogin();
							}else{
								overpass.fn.login.isLogin();
							}
						});
					}else{
						addWishCheck(p);
					}
					
				} catch (e) {
					overpass.alert(e);
				} finally {
					running = false;
				}
			}
		});
	})();
	//[END] 위시리스트 담기

})(jQuery);