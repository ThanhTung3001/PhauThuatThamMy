;(function($){

	//레이어 중복실행 방지용 변수
	var dupCheck = {};

	$.extend(overpass.layer, {
		createLayer: function(p){

			var caller = arguments.callee.caller;
			p = $.extend({
				action: "",
				method: "GET",
				dup: false      //중복레이어 여부(data를 넘기지 않고 url로만 띄울때 다시 호출하지 않음처리)
			}, p);

			if(p.action == "" || p.action == null){
				alert("action이 미지정 되었습니다.");
				return false;
			}

			if(dupCheck[p.action] != undefined) return; //더블클릭등 중복실행되면 반환처리
			dupCheck[p.action] = p.action;

			//layer parameter
			var parameter = (function(){
				if(p.dup){
					delete dupCheck[p.action];//TODO 임시처리 더 나은방법있으면 개선
					return undefined;
				}else{
					return {
						method: p.method,
						data: (function(){
							if(p.data != undefined && $.type(p.data) == "object"){
								return p.data;
							}else{
								return {}
							}
						})(),
						success: (function(){
							return function(pop){
								//레이어 내에 해당 값이 존재하면 password 확인창이라고 판단한다.
								if(pop.filter("[data-role='pwcomfirm']").length > 0){
									delete dupCheck[p.action]; //password check 시에는 제거함

									var layer_id = pop.attr("id");
									require([overpass.global.js_common_path + "/common/js/member/overpass.member.pwcheck.js"], function() {
										PWCHECK.init(pop, function(data){
											if(data.ret_code == "S"){
												setTimeout(function(){
													//callback parameter password check reset 처리
													var callback_parameter = p.callback_parameter;
													if(callback_parameter){
														if(callback_parameter.hasOwnProperty("pw_check")){
															delete callback_parameter.pw_check;
														}else if(callback_parameter.hasOwnProperty("data")){
															if(callback_parameter.data.hasOwnProperty("pw_check")){
																delete callback_parameter.data.pw_check;
															}
														}
													}

													PWCHECK.LayerCallback(callback_parameter);//이전 callback 처리(이슈가 있어서 setTimeout 처리함)
													PWCHECK.LayerCallback = function(){}; //callback 초기화
													setTimeout(function(){
														LayerPopup.close("#" + layer_id);//레이어 닫기 callback  창이 뜬 이후에 닫는다
													}, 300);
												}, 200)
											}else{
												overpass.alert(overpass.message("member.login.pwcheck"));//비밀번호가 맞지 않습니다.
											}
										});	//초기화
										//기존 function을 저장한다. 확인 이후 후 처리
										if($.isFunction(p.success)){
											PWCHECK.LayerCallback = caller;
										}
									});
								}else{

									delete dupCheck[p.action];
									if($.isFunction(p.success)){
										p.success(pop);
									}
								}
							}
						})(),
						error: function(e){
							overpass.util.closeLoadingbar();//loading bar 가 존재한다면 close

							//로그인 에러의 경우
							if(e.error_type && e.error_type.indexOf("AuthorityException") > -1){
								overpass.alert(e.error_message, function(){
									overpass.link("MAIN", {target: "replace"});
								});
							}
						}
					}
				}
			})();

			LayerPopup.load(p.action, parameter);
		},
		createConfirmLayer: function(p){
			var layerPopupContainer = $("#layerPopupContainer");
			var data = p.data;

			var layer = $("<div></div>").attr({
					"id": "alertBox",
					"name": "alertBox"
				}).addClass("alertBox").css({
					"z-index": 2147483647,
					"display": "block"
				});
			var txtAlert = (function(){
				var div = $("<div></div>").addClass("txtAlert");
				var inner = $("<div></div>").addClass("inner");

				if(data.msg != undefined && data.msg != "") {
					inner.append($("<strong></strong>").addClass("tit").html(data.msg));
				}
				if(data.msg_dtl != undefined && data.msg_dtl != "") {
					inner.append(data.msg_dtl);
				}
				div.append(inner);
				return div;
			})();

			var btnArea = (function(){
				var btn1 = data.btn1;
				var btn2 = data.btn2;
				var div = $("<div></div>").addClass("btnArea");

				if(btn1 != undefined){
					var span = $("<span></span>")
					var a = $("<a></a>").attr({"href": "javascript:void(0);"}).addClass("btnSSG btnM btnLB").text(btn1.msg).click(function(){
						if($.type(btn1.callback) === "function"){
							btn1.callback();
						}
						data.close(this);
					});
					span.append(a);
					div.append(span);
				}
				if(btn2 != undefined){
					var span = $("<span></span>")
					var a = $("<a></a>").attr({"href": "javascript:void(0);"}).addClass("btnSSG btnM btnLB action").text(btn2.msg).click(function(){
						if($.type(btn2.callback) === "function"){
							btn2.callback();
						}
						data.close(this);
					});
					span.append(a);
					div.append(span);
				}
				return div;
			})();

			layer.append(txtAlert);
			layer.append(btnArea);

			layerPopupContainer.append(layer);
			layerPopupContainer.append($("<div></div>").attr({"name": "alertBox"}).addClass("dimmed").css({"z-index": 2147483646,"display": "block"}));
			btnArea.find(".action").focus();//버튼 focus처리
		},
		//카드사 리스트
		//return : 카드사번호, 카드사명
		cardListLayer: function(p){
			var data = $.extend({
				card_bene_yn: "N"
			}, p.data || {});

			overpass.layer.createLayer({
				action: overpass.util.getUrl("/common/initCardCdListLayer"),
				data: data,
				success: function(pop){
					var layer_id = pop.attr("id");
					var radio = $("[data-role='card']", pop);
					var event_radio = $("[data-role='event_card']", pop);
					//카드선택
					$("#select_card_btn", pop).click(function(){
						var button = $(this);
						var message = button.attr("data-message");
						var checkbox = radio.filter(":checked");
						var eventCheckbox = event_radio.filter(":checked");
						var isBranCard = checkbox.attr("data-card-bran-cd") == undefined ? false : true;

						if(checkbox.length == 0 || (isBranCard && eventCheckbox.length == 0)){
							overpass.alert(button.attr("data-message"));
							return false;
						}
						if(isBranCard){
							checkbox = eventCheckbox;
						}
						p.callback({
							card_cd: checkbox.val(),
							card_nm: checkbox.attr("data-card-nm") + " " + checkbox.attr("data-card-bran-nm"),
							text_color_cd: checkbox.attr("data-text-color-cd"),
							card_bran_cd: checkbox.attr("data-card-bran-cd"),
							card_bran_nm: checkbox.attr("data-card-bran-nm")
						});
						LayerPopup.close("#" + layer_id);
					});
				}
			});
		},
		//MG 주문변경안내 레이어
		mgOrdInfoChngLayer: function(){
			overpass.layer.createLayer({
				dup: true,
				action: overpass.util.getUrl("/mypage/mg/ordInfoChngAd")
			});
		},
		//MG 취소안내 레이어
		mgOrdCnclLayer: function(){
			overpass.layer.createLayer({
				dup: true,
				action: overpass.util.getUrl("/mypage/mg/ordCnclAd")
			});
		},
		//출국정보 조회하기
		orderDpatLayer: function(p){
			//레이어 생성
			overpass.layer.createLayer({
				action: overpass.util.getUrl("/common/initDpatLayer"),
				success: function(pop){
					var layer_id = pop.attr("id");

					//선택완료
					$("#dpatExptSelectBtn", pop).click(function(){
						var radio = $("[name='airline']", pop);
						var checked = radio.filter(":checked");
						if(checked.length == 0) return false;

						LayerPopup.close("#" + layer_id);
						console.dir(checked.data());

						if($.isFunction(p.callback)){
							p.callback(checked.data());
						}
					});
				}
			});
		},
		//달력
		calendar: function(p){

			overpass.layer.createLayer({
				action: overpass.util.getUrl("/common/initCalendarLayer"),
				data: {},
				success: function(p){

				}
			});
		},
		//마이픽
		snsShareLayer : function(p){
			overpass.layer.createLayer({
				action: overpass.util.getUrl("/common/initSnsShareLayer"),
				data: p == undefined ? {} : p,
				success:function(){
					require([overpass.global.js_common_path+'/common/js/overpass.sns.js']);
					require([overpass.global.js_common_path+'/common/js/overpass.validate.js']);
					console.log("선물~~~~~~~~");
					/*포인트 선물만...*/
					if(p.share_type == "50"){
						if($.type(p.callback) == "function"){

							//확인버튼 클릭 이벤트
							fnCallMailback = function(send_divi_cd) {
								//전달 데이터 생성
						    	var pin = {send_divi_cd : send_divi_cd };
								p.callback(pin);

								$(".closeL").trigger("click");	//레이어닫기
							};
						}
					}
				}
			});
		},

		// SNS
		snsShareLayerPc : function(p){
			$.ajax({
				url: overpass.util.getUrl("/common/initSnsShareLayerPc"),
				type: "GET",
				dataType: "HTML",
				data: p == undefined ? {} : p,
				success: function(data) {
					require([overpass.global.js_common_path+'/common/js/overpass.sns.js']);

					$(".popLayCont").empty();
					$(".popLayCont").append(data);
					 initAllAtOnce();
				},
				error: function(e) {
					console.log(e)
				}
			});


		},
		/*
		  국가코드조회
		 * p : {targetText:표시Obj, targetVal: 코드 Obj}
		 * */
		nationCdLayer: function(p){
			overpass.layer.createLayer({
				action: overpass.util.getUrl("/common/initNationCdLayer"),
				data: {nation_cd : $("#"+p.targetVal).val()},
				success: function(){
					//확인버튼 클릭 이벤트
					$("button[name=btnNationCdOk]").click(function(){
						$("#"+p.targetText).text($("input[name='radCountry']:checked").data("disp"));	//표시용 국가코드
						$("#"+p.targetVal).val($("input[name='radCountry']:checked").val());	//국가코드
				    	$("#btnNationCdClose").trigger("click");	//레이어닫기
					});
				}
			});
		},
		//우편번호
		postLayer: function(p){
			overpass.layer.createLayer({

				action: overpass.util.getUrl("/common/initPostLayer"),
				data: {},
				success: function(){
					require([overpass.global.js_common_path+'/common/js/overpass.post.js']);
					if($.type(p.callback) == "function"){

						//확인버튼 클릭 이벤트
						$("button[name=btnPostOk]").click(function(){

							var chkObj = $("input[name='radPost']:checked");	//선택된 주소

							if($("[id^=addrList]").length > 0 && chkObj.length == 0){	//조회된 주소가 있는데 선택을 하지 않은 경우
								alert("주소를 선택해 주세요.");
								return false;
							}

							var obj = chkObj.closest("li");	//선택된 주소의 최상위
							var objIdx = obj.attr("data-idx");	//선택된주소 idx

							//전달 데이터 생성
					    	var pin = {
					    					addr_divi_cd : chkObj.val(),	//주소구분코드
						      	    	 	post_no : obj.find("#postChk_"+objIdx).text(),	//우편번호
						      	    		base_addr : obj.find("#jibunAddr_"+objIdx).text(),	//지번주소
						      	    		road_base_addr : obj.find("#roadAddr_"+objIdx).text(),	//도로명주소
						     				};
							p.callback(pin);

					    	$("#btnPostClose").trigger("click");	//레이어닫기
						});
					}
				}
			});
		},
		//배송지 선택레이어
		dlvpLayer: function(p){
			//레이어 생성
			overpass.layer.createLayer({
				action: overpass.util.getUrl("/common/initDlvpLayer"),
				success: function(pop){
					var layer_id = pop.attr("id");
					//선택완료
					$("#dlvpSelectBtn", pop).click(function(){
						var radio = $("[name='dlvp_layer_delivery']", pop);
						var checked = radio.filter(":checked");
						if(checked.length == 0) return false;

						console.dir(checked.data());
						if($.isFunction(p.callback)){
							p.callback(checked.data());
						}
						LayerPopup.close("#" + layer_id);
					});
				}
			});
		},
		//출국시 주의사항
		dpatCautInfoLayer: function(){
			overpass.layer.createLayer({
				dup: true,
				action: overpass.util.getUrl("/common/initDpatCautLayer")
			});
		},
		//기내반입제한안내
		dpatCarryInfoLayer: function(){
			overpass.layer.createLayer({
				dup: true,
				action: overpass.util.getUrl("/common/initDpatCarryOnLayer")
			});
		},
		//편명입력안내
		fltCodeInfoLayer: function(){
			overpass.layer.createLayer({
				dup: true,
				action: overpass.util.getUrl("/common/initFlightCodeInfoLayer")
			});
		},
		//편명검색레이어
		fltSearchLayer: function(p){
			LayerPopup.load(overpass.util.getUrl("/common/initFlightSearchLayer"), {
				method : "GET",
				success : function(){
					$("#fltSearchLayer .flightSearch > input").prop('placeholder', overpass.message("mypage.dpat.arliPut"));
					var fnFlightTop = function(){

						$("#fltSearchLayer .flightSearch > input").prop('placeholder', overpass.message("mypage.dpat.airDest"));
						var listRadio = $("input:radio[name=arrival]:first");
						var searchElTxt = "input:radio[name=flight]";

						if(listRadio.data('arli_cd') !=undefined && (listRadio.data('arli_cd')+"").length>0){
							searchElTxt += "[data-flt_id="+listRadio.data('arli_cd')+"]";
						}else{
							searchElTxt += "[data-flt_id=null]";
						}

						var airlineEl = $(searchElTxt);
						if(airlineEl.length > 0){
							var img_path = airlineEl.data('img_path') ? airlineEl.data('img_path') : "";
							var error_path = airlineEl.data('error_path') ? airlineEl.data('error_path') : "";
							var flt_nm = airlineEl.data('flt_nm') ? airlineEl.data('flt_nm') : "";
							var flt_other_nm = airlineEl.data('flt_other_nm') ? airlineEl.data('flt_other_nm') : "";

							var el = $(".flightSearch_result");
							el.show();
							el.find('>span').empty();
							el.find('>span').append($("<img "+error_path+" src=\""+img_path+"\" alt=\""+flt_other_nm+"\">"))
							el.find('>span').append($("<em>"+flt_nm+"</em>"));

							$("#fltSearchLayer .btnArea>button:eq(0)").hide();
							$("#fltSearchLayer .btnArea>button:gt(0)").show();
						}
					}

					var fnDrawFltList = function(){

						var data = {};
						if(data.flt_divi_cd ==undefined) data.flt_divi_cd = "F";
						data.search_txt = $("#fltSearchLayer .flightTop .flightSearch input").val();

						var text = "";
						if(data.flt_divi_cd == "F"){
							text = overpass.message("mypage.dpat.arliPut");
							//text = overpass.message("mypage.dpat.destOpenNm");
							$("#fltSearchLayer .flightSearch > input").prop('placeholder', text);
							$("#fltSearchLayer .flightSearch > input").prop('title', text);
						}else{
							text = overpass.message("mypage.dpat.shopSelect");
							$("#fltSearchLayer .flightSearch > input").prop('placeholder', text);
							$("#fltSearchLayer .flightSearch > input").prop('title', text);
						}

						$.ajax({
							url: overpass.util.getUrl("/common/searchFlightMgmtList2"),
							type: "GET",
							data: data,
							success: function(data) {
								$('#fltSearchLayer .noData').hide();
								$("#fltSearchLayer .flightInfo .flightList").empty();
								$('#fltSearchLayer .flightInfo').children().hide();

								var fnLastReplaceAt = function(str, t, c, cnd){
									var text = str;
									var index = text.lastIndexOf(t);
									var cnd = text.lastIndexOf(cnd);
									if(index>0 && index > cnd){
										return text.substring(0, index) + c + text.substring(index + 1);
									}else{
										return str;
									}
								};

								var etc = data.flt_etc;
								var main = data.flt_main;

								var logoPath = overpass.global.image_url;
								var noimgPath = overpass.global.image_path.concat("/images/airline/airline000.png");//airline/ship.png
								var errorPath = "this.src='"+noimgPath+"'";

								var main_len = main.length;
								if(main_len>0){
									$('#fltSearchLayer .flightInfo').children().eq(0).show().next().show();

									for(var i = 0 ; i < main_len; i++){
										var taget = $("#fltSearchLayer .flightInfo .flightList:eq(0)");
										var row = main[i];
										var img = row.file_path == "" ? noimgPath : (logoPath+row.file_path);

										var html = "";
										html += "<li>";
										html += 	"<div class=\"con\">";
										html += 		"<input type=\"radio\" id=\"flight"+i+"\" name=\"flight\"";
										html += 			"data-exit_code=\""+row.exit_code+"\" data-flt_id=\""+row.flt_id+"\" data-flt_nm=\""+row.flt_nm+"\" data-flt_divi_cd=\""+row.flt_divi_cd+"\" data-foreign_yn=\""+row.foreign_yn+"\" data-flt_other_nm=\""+row.flt_other_nm+"\"";
										html +=             "data-img_path=\""+img+"\" data-error_path=\""+errorPath+"\">"
										html += 		"<label for=\"flight"+i+"\">";
										html += 			"<img src=\""+img+"\" "+errorPath+" alt=\""+row.flt_other_nm+"\">";
										html += 			"<span class=\"name\">"+row.flt_nm+"</span>";
										html += 		"</label>";
										html += 	"</div>";
										html += "</li>";

										html = fnLastReplaceAt(html, ")", ")<em>", "class=\"name\"");
										html = fnLastReplaceAt(html, "(", "<em>(", "class=\"name\"");

										$(taget).append(html);
									};
								}

								var etc_len = etc.length;
								if(etc_len>0){
									$('#fltSearchLayer .flightInfo').children().eq(2).show().next().show();
									for(var i = 0 ; i < etc_len; i++){
										var taget = $("#fltSearchLayer .flightInfo .flightList:eq(1)");
										var row = etc[i];
										var img = row.file_path == "" ? noimgPath : (logoPath+row.file_path);

										var html = "";
										html += "<li>";
										html += 	"<div class=\"con\">";
										html += 		"<input type=\"radio\" id=\"flight_e"+i+"\" name=\"flight\"";
										html += 			"data-exit_code=\""+row.exit_code+"\" data-flt_id=\""+row.flt_id+"\" data-flt_nm=\""+row.flt_nm+"\" data-flt_divi_cd=\""+row.flt_divi_cd+"\" data-foreign_yn=\""+row.foreign_yn+"\" data-flt_other_nm=\""+row.flt_other_nm+"\"";
										html +=             "data-img_path=\""+img+"\" data-error_path=\""+errorPath+"\">"
										html += 		"<label for=\"flight_e"+i+"\">";
										html += 			"<img src=\""+img+"\" "+errorPath+" alt=\""+row.flt_other_nm+"\">";
										html += 			"<span class=\"name\">"+row.flt_nm+"</span>";
										html += 		"</label>";
										html += 	"</div>";
										html += "</li>";

										html = fnLastReplaceAt(html, ")", ")<em>", "class=\"name\"");
										html = fnLastReplaceAt(html, "(", "<em>(", "class=\"name\"");

										$(taget).append(html);
									};
								}

								if(main_len == 0 && etc_len ==0){
									$('#fltSearchLayer .noData').show();
								}
							}
						});
						return false;
					}

					var fnScdlFltList = function(){
						var data = {};
						data.tran_dt = p.data.date;
						data.depa_tm = p.data.time;
						data.depa_tm_end = "Y";
						data.depa_plac_cd = p.data.depaPlacCd;
						data.exit_code = p.data.exitCd;

						var search_txt = $("#fltSearchLayer .flightSearch input:text").val();
						if(search_txt != ""){
							data.flight_search = search_txt;
						} else if(search_txt == "") {
							data.flight_search = $("input:radio[name=flight]:checked").data('flt_id');
						}

						if($("input:radio[name=flight]:checked").length>0){
							data.arli_cd = $("input:radio[name=flight]:checked").data('flt_id');
						}

						//flight_search

						var rslt = false;
						$.ajax({
							type: "POST",
							url: overpass.util.getUrl("/common/searchFlightScheduleInfoList"),
							data : data,
							async: false,
							success: function(html){
								if(html.trim()==""){
									var call_num = overpass.global.site_no == "S00001" ? overpass.global.cst_call_number_ko : overpass.global.cst_call_number_other;
									overpass.alert(overpass.message('mypage.dpat.notfindFlt', call_num));//고객센터
								}else{
									$("#fltSearchLayer .ticketList").empty();
									$("#fltSearchLayer .ticketList").append(html);
									rslt = true;
								}
							}
						});
						return rslt;
					}

					var fnEngUpper = function(t){
						if(t != undefined){
							var v = $(t).val();
							var a = v.split('');
							for(var i in a) {
								var regEng = /[^a-zA-Z]/i;
								var text = a[i];
								if(!regEng.test(text)){
									a[i] = a[i].toUpperCase();
								}
							}
							$(t).val(a.join(''));
						}
					}

					var fnEvent = function(){

						//fnEngUpper
						$("#fltSearchLayer .flightSearch input")
							.keyup(function(){
								fnEngUpper($(this));
							})
							.keypress(function(){
								fnEngUpper($(this));
							})
							.blur(function(){
								fnEngUpper($(this));
							})
							.change(function(){
								fnEngUpper($(this));
							});

						$("#fltSearchLayer #btnRechoice").unbind('click').click(function(){
							$("#fltSearchLayer .flightTop").removeClass('full');
							$("#fltSearchLayer .flightSearch_result").hide();
							$("#fltSearchLayer .flightSearch > input:text").val("");
							$("#fltSearchLayer .flightInfo>:last").hide();
							if($("#fltSearchLayer .flightList:eq(0) > li").length > 0){
								$("#fltSearchLayer .flightList:eq(0)").show().prev().show();
							}
							if($("#fltSearchLayer .flightList:eq(1) > li").length > 0){
								$("#fltSearchLayer .flightList:eq(1)").show().prev().show();
							}
							$("#fltSearchLayer .btnArea>button:eq(0)").show();
							$("#fltSearchLayer .btnArea>button:gt(0)").hide();
							$("#fltSearchLayer .flightSearch > button").hide();
							$("#fltSearchLayer .flightSearch #btnFltSearch").show();
							$("#fltSearchLayer .flightSearch > input").prop('placeholder', overpass.message("mypage.dpat.arliPut"));
							return false;
						});

						$("#fltSearchLayer #btnFltSearch").unbind('click').click(function(){
							fnDrawFltList();
							return false;
						});

						$("#fltSearchLayer #btnScdlSearch").unbind('click').click(function(){
							fnScdlFltList();
							return false;
						});

						$("#fltSearchLayer #btnNext").unbind('click').click(function(){
							if($("input:radio[name=flight]:checked").length>0){
								if(fnScdlFltList()){
									$("#fltSearchLayer .flightTop").addClass('full');
									$("#fltSearchLayer .flightSearch input").val("");
									fnFlightTop();
									$("#fltSearchLayer .flightInfo>:not(:last)").hide();
									$("#fltSearchLayer .flightInfo>:last").show();
									$("#fltSearchLayer .flightSearch > button").hide();
									$("#fltSearchLayer .flightSearch #btnScdlSearch").show();
								}
							}else{
								overpass.alert(overpass.message("mypage.dpat.openInfoSelect"));
							}
							return false;
						});

						$("#fltSearchLayer #btnPrev").unbind('click').click(function(){
							$("#fltSearchLayer .flightTop").removeClass('full');
							$("#fltSearchLayer .flightSearch input").val("");
							$("#fltSearchLayer .flightSearch_result").hide();
							$("#fltSearchLayer .flightInfo>:last").hide();
							if($("#fltSearchLayer .flightList:eq(0) > li").length > 0){
								$("#fltSearchLayer .flightList:eq(0)").show().prev().show();
							}
							if($("#fltSearchLayer .flightList:eq(1) > li").length > 0){
								$("#fltSearchLayer .flightList:eq(1)").show().prev().show();
							}
							$("#fltSearchLayer .btnArea>button:eq(0)").show();
							$("#fltSearchLayer .btnArea>button:gt(0)").hide();
							$("#fltSearchLayer .flightSearch > button").hide();
							$("#fltSearchLayer .flightSearch #btnFltSearch").show();
							$("#fltSearchLayer .flightSearch > input").prop('placeholder', overpass.message("mypage.dpat.arliPut"));
							return false;
						});

						$("#fltSearchLayer #btnSave").unbind('click').click(function(){
							var el = $("#fltSearchLayer input:radio[name=arrival]:checked");
							if(el.length>0){
								var objectKeyDataset = function(object){
									var result = {};
									if(object != undefined){
										var keys = $(object).data();
										for(var i in keys){
											var name = i;
											result[name] =  keys[i]+"";
										}
									}
									return result;
								}
								var data = objectKeyDataset(el[0]);
								p.callback(data);
								LayerPopup.close("#fltSearchLayer");
							}else{
								overpass.alert(overpass.message("mypage.dpat.openInfoSelect"));
								return false;
							}
						});
					}

					var init = function(){
						fnEvent();
						fnDrawFltList();
					}
					init();

				}
			});
		},
		//회원 휴대폰 등록 레이어
		memberPhoneRegistLayer: function(p){
			p = $.extend({}, p || {});

			overpass.layer.createLayer({
				action: overpass.util.getUrl("/member/initMemberPhoneRegistLayer"),
				callback_parameter: p,
				data: p.data,
				success: function(pop){
					if ($.type(window.SSGDFS) != "object") {
						window.SSGDFS = {};
					};
					if ($.type(window.SSGDFS.MEMBER) != "object") {
						window.SSGDFS.MEMBER = {
							parameter: {},
							callback: null
						};
					};

					$.extend(SSGDFS.MEMBER, {
						parameter: p.parameter,
						callback: p.callback
					});
				}
			})
		},
		//회원 이메일 등록 레이어
		memberEmailRegistLayer: function(p){
			p = $.extend({}, p || {});

			overpass.layer.createLayer({
				action: overpass.util.getUrl("/member/initMemberEmailRegistLayer"),
				callback_parameter: p,
				data: p.data,
				success: function(pop){
					if ($.type(window.SSGDFS) != "object") {
						window.SSGDFS = {};
					};
					if ($.type(window.SSGDFS.MEMBER) != "object") {
						window.SSGDFS.MEMBER = {
							parameter: {},
							callback: null
						};
					};

					$.extend(SSGDFS.MEMBER, {
						parameter: p.parameter,
						callback: p.callback
					});
				}
			})
		},
		//미리계산기
		calculatorLayer : function(p){
			var callback = function(){
				overpass.layer.createLayer({
					action: overpass.util.getUrl("/cart/initCalculatorLayer"),
					method: "POST",
					data: { cart_data: JSON.stringify(p.data) },
					success: function(pop){
						overpass.util.closeLoadingbar();//loading

						if($.isFunction(p.callback)){
							p.callback();
						}
					}
				});
			}
			if(!overpass.fn.login.loginCheck()){
				var msg = {
					data : {
						msg : overpass.message("member.login.check"),
						btn2 : {
							msg : overpass.message("common.word.confirm"),
							callback : function(){
								overpass.fn.login.lyrLogin();
							}
						}
					}
				}
				overpass.confirm(msg);

			}else{
				overpass.util.openLoadingbar();//loading..
				callback(p);
			}

		},
		//재입고알림 레이어
		goosNotiReqLayer : function(p){

			if(!overpass.fn.login.loginCheck()){
				var msg = {
					data : {
						msg : overpass.message("member.login.check"),
						btn2 : {
							msg : overpass.message("common.word.confirm"),
							callback : function(){
								overpass.fn.login.isLogin();
							}
						}
					}
				}
				overpass.confirm(msg);
			}else{
				//재입고 신청 확인
				$.ajax({
					url : overpass.util.getUrl("/goos/chkGoosNotiReq"),
					type : "post",
					dataType : "JSON",
					data : {goos_cd : p.data.goos_cd},
					success : function(data){

						if(data.result == "Y"){
							/*
							재입고 신청이 완료된 상품입니다.
   							재입고알림 신청내역을 확인하시겠습니까?
   							*/
							overpass.confirm(overpass.message("goos.notireq.type33"), function(){
								overpass.link("REINGOOS", {goos_cd : p.data.goos_cd});
							});

						}else if(data.result == "NO_UP_GOOS"){
							overpass.alert("상위 상품코드를 넘겨주세요.");
						}else if(data.result == "NO_GOOS"){
							overpass.alert("존재하지 않는 상품입니다.");
						}else if(data.result == "20Y"){
							/* “재입고알림은 20건까지 신청가능 합니다. 신청내역 관리를 위해 마이페이지로 이동하시겠습니까?” */
							overpass.confirm(overpass.message("goos.notireq.type32"), function(){
								overpass.link("REINGOOS", {goos_cd : p.data.goos_cd});
							});

						}else{
							//재입고 신청
							overpass.layer.createLayer({
								action: overpass.util.getUrl("/goos/initGoosNotiReq"),
								data: p.data
							});
						}
					}
				});
			}
		},
		//주문변경안내 레이어
		ordInfoChngLayer: function(){
			overpass.layer.createLayer({
				dup: true,
				action: overpass.util.getUrl("/mypage/ordInfoChngAd")
			});
		},
		//취소안내 레이어
		ordCnclLayer: function(){
			overpass.layer.createLayer({
				dup: true,
				action: overpass.util.getUrl("/mypage/ordCnclAd")
			});
		},
		//수량할인(멀티유닛) 안내 레이어
		quantityDcInfoLayer : function(data){
			overpass.layer.createLayer({
				action: overpass.util.getUrl("/goos/initQuantityDcLayer"),
				data: data
			});
		},
		//묶음할인(구간할인) 안내 레이어
		pkgDcInfoLayer : function(data){
			overpass.layer.createLayer({
				action: overpass.util.getUrl("/goos/initPkgDcLayer"),
				data: data
			});
		},
		//함께할인(믹스앤매치) 안내 레이어
		withDcInfoLayer : function(data){

			overpass.layer.createLayer({
				action: overpass.util.getUrl("/goos/initWithDcLayer"),
				data: data,
				success : function(){
					$("button[name=withAddCart]").click(function(){

						var items = [];
						$("[name=withGoos]:checked").each(function(){
							items.push({
								goos_cd : $(this).data("goos_cd"),
								ord_qty : $(this).data("ord_qty")
							});
						});

						if(items.length > 0){
							overpass.fn.add.addCart({
								cart_divi_cd: "10",
								items: items,
								callback : function(){
									overpass.toast(overpass.message("cart.list.name09"), function(){
										location.reload();
									});//장바구니에 담겼습니다.
								}
							});
						}else{
							overpass.alert(overpass.message("cart.list.name14"));//장바구니에 담을 상품을 선택해주세요.
						}
					});
				}
			});
		},

		//상품의 옵션레이어
		optionLayer : function(p, pick){
			
			//전시상품리스트에서 상위상품의 옵션레이어를 띄울 때 마이픽버튼클릭에서는 체크를 해제 해준다.
			if(pick != undefined){
				$(pick).prop("checked", false);
			}
			
			overpass.layer.createLayer({
				action: overpass.util.getUrl("/goos/initGoosOptionLayer"),
				data: p.data,
				success : function(){
					require([overpass.global.js_path+'/js/p_detail.js']);
					require([overpass.global.js_path+'/js/goos/overpass.opt.pc.js']);
					require([overpass.global.js_common_path+'/common/js/overpass.goos.base.js']);

					if($.type(p.callback) == "function"){
						$("button[name=goosChange]").unbind().bind().click(function(){
							if($("#btnType").val() == "stockReq"){
								var item = [];
								$("[name=selected_opt]").each(function(){
									var set_items = [];

									//세트상품 담기
									$("[name=cmpsGoos]").each(function(){
										set_items.push({
											goos_cd : $(this).data("goos_cd"),
											cmps_grp_seq : $(this).data("cmps_grp_seq"),
											set_cmps_item_no : $(this).data("set_cmps_item_no"),
											hadl_bran_cd : $(this).data("hadl_bran_cd")
										});
									});

									item.push({
										goos_cd : $(this).data("goos_cd"),
										goos_qty : $(this).data("goos_qty"),
										opt_nm : $(this).find("[name=option]").text(),
										set_items : set_items
									});
								});
								p.callback(item);
							}else{
								var item = OPTION.fn.fnReturnGoosInfo();
								if(item.goos_cd != undefined || item.goos_cd != ""){
									p.callback(item);
								}
							}
						});
					}
					$("[name=grp]").click(function(){
						var index = $(this).data("grp_idx");
						$("[name=grpGoosList]").hide();
						$("[name=grpGoosList]").filter("[data-grp_idx='"+index+"']").show();
					});
				}
			});
		},

		//사이트 약관정보 상세 보기
		siteAddInfoLayer: function(p){
			if(p.data == undefined){
				return false;
			}
			overpass.layer.createLayer({
				action: overpass.util.getUrl("/common/initSiteAddInfoLayer"),
				data: p.data || {},
				success : function(pop){
					if($.isFunction(p.callback)){
						p.callback(pop);
					}
				}
			});
		},
		//신구단 탈퇴
		dgSecession : function(){

			if(!overpass.fn.login.loginCheck()){
				var msg = {
					data : {
						msg : overpass.message("member.login.check"),
						btn2 : {
							msg : overpass.message("common.word.confirm"),
							callback : function(){
								overpass.fn.login.isLogin();
							}
						}
					}
				}
				overpass.confirm(msg);
				return;
			}


				overpass.confirm(overpass.message("dg.dgSecession.msg00") + "<br>" + overpass.message("dg.dgSecession.msg01") + "<br>" + overpass.message("dg.dgSecession.msg02"), function(){


					//신구단 탈퇴
					$.ajax({
						url : overpass.util.getUrl("/dg/getDgSecession"),
						type : "post",
						dataType : "JSON",
						data : {SecessionYn : "Y"},
						success : function(data){

							if(data.result == "Y"){
								location.reload();
							}else{
								console.log("신구단 탈퇴 실패");
							}
						}
					});
				});

		},
		//상품리뷰 상세 레이어
		fnGoosEvalLayer : function(p){

			var goos_eval_no = p.goos_eval_no;
			var view_code = overpass.util.nvl2(p.view_code, "99");

			if(goos_eval_no != ""){
				overpass.layer.createLayer({
					action: overpass.util.getUrl("/goos/searchGoosEvalView"),
					data: {
						goos_eval_no : goos_eval_no,
						view_code: view_code
					},
					success : function(data) {
						initSwipers();
						initAccordions();
					},
					error: function(request, status, error){
						console.log("REVIEW DETAIL ERROR");
					}
				});
			}
		},
		// 스페셜 오더 신청 레이어
		registSpecialOrderGoosLayer : function(data){
			if(!overpass.fn.login.loginCheck()){
				var msg = {
					data : {
						msg : overpass.message("member.login.check"),
						btn2 : {
							msg : overpass.message("common.word.confirm"),
							callback : function(){
								overpass.fn.login.isLogin({
									popup: true,
									login: function() {
										overpass.layer.createLayer({
											action: overpass.util.getUrl("/mypage/initMySpecialOrderAddGoos"), //sch_bran_cd 취급브랜드 코드
											data: data
										});
									}
								});
							}
						}
					}
				}
				overpass.confirm(msg);
				return;
			}

			overpass.layer.createLayer({
				action: overpass.util.getUrl("/mypage/initMySpecialOrderAddGoos"), //sch_bran_cd 취급브랜드 코드
				data: data
			});
		},
	});

})(jQuery);