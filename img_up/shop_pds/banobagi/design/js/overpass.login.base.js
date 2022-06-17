/**
 * 업무관련(로그인관련메소드)
 */
;(function($) {
	if ($.type(window.overpass.fn) != "object") {
		window.overpass.fn = {};
	};
	if ($.type(window.overpass.fn.login) != "object") {
		window.overpass.fn.login = {};
	};

	var lockLoginPop = false;

	$.extend(overpass.fn.login,{
		snsSyncYn: false,
		_login_callback: null,

		// p : popup, returnUrl
		lyrLogin : function(p, close_call_back) {
			_login_callback = null;

			p = $.extend({popup:true, nomember: false} , p||{});
			if(p.popup){
				if ( !lockLoginPop ) {
					if (p == undefined) {
						p = {};
					}
					
					if(p.login_callback != undefined && $.type(p.login_callback) == "function"){
						_login_callback = p.login_callback;
					}
					
					overpass.layer.createLayer({
						action: overpass.util.getUrl("/login/initLoginLayer"),
						data:{
							returnUrl: p.returnUrl,
							adtAuthYn : p.adtAuthYn
						},
						success: function(){
							$("#loginLayerCls").click(function(){
								lockLoginPop = false;
							});

							// 백그라운드 클릭 시
							$(".dimmed").click(function(){
								lockLoginPop = false;
							});
						}
					});

					lockLoginPop = true;
				}
			//바닥로그인
			}else{
				var pin = {};
				if(p.adtAuthYn == "Y"){
					pin = {
						adtAuthYn : p.adtAuthYn
					}
				}
	           window.location.href = overpass.util.getUrl("/login/login", pin);
			}
		},

		/**
		 * 로그인 여부를 반드시 확인하고 업무를 진행할 경우 사용한다. 로그인 되어야지 사용할 수 있는 action들은 모드 isLogin을 통하도록 한다.
		 * {
		 * 	login: function -> 팝업 로그인 성공 후 호출되는 콜백 함수
		 *  nomember:false  => true: 비회원 로그인, false : 회원로그인
			popup : true => 팝업여부 디폴트 true
			예:overpass.isLogin({login:function(){}});
		 * }
		 */
		isLogin: function(p) {
			_login_callback = null;
									  	/* 기본 팝업창  */  	/* 비회원로그인후 by pass */ 	/* true: 비회원 로그인, false : 회원로그인  */
			p = $.extend({login: null, popup:false, nomember:false, returnUrl:null}, p || {});

			$.ajax({
				type: "POST",
				url: overpass.util.getUrl("/login/isLogin"),
				dataType: "json",
				async: false,
				success : function(data) {
					if (data.login) {
						if ( data.auto_login_yn ) {
							overpass._login_app_callback({login:true});
							return;
						}

						if ($.type(p.login) == "function") {
							p.login({nomember:data.nomember, member:data.member});
							return;
						}

						if(p.returnUrl){
							location.href = p.returnUrl;
						}

					} else {
						_login_callback = p.login;

						//p.nomember : true인 경우 (로그인창 안에 비회원구매 버튼이 활성화 된다)
						var deps = p.deps ? p.deps : 1;
						overpass.fn.login.lyrLogin({
							popup:p.popup,
							login_callback: _login_callback,
//							nomember:p.nomember,
//							eval:p.eval,
							returnUrl:p.returnUrl,
							adtAuthYn : p.adtAuthYn,
							deps : deps
						 });
					};
				}
			});
		},

		// 로그인 상태 확인
		loginCheck: function(p) {
	    	var memberLogin = false;
			p = $.extend({login: null, nomember:false}, p || {});  /* true: 비회원 로그인, false : 회원로그인  */
			$.ajax({
				type: "POST",
				url: overpass.util.getUrl("/login/isLogin"),
				dataType: "json",
				async: false,
				success : function(data) {
					memberLogin = data.login;
				}
			});
			return memberLogin;
		},

		// kmc 본인인증(mo)
		initKMC : function (p) {
			var form = (function() {
				if ($("#kmcAuthForm").length == 0) {
					$("<form id='kmcAuthForm'></form>").attr({
						action: overpass.util.getUrl("/member/myKmcAuth"),
						method: "POST"
					}).appendTo("body");
				}
				return $("#kmcAuthForm").empty();
			})();

			form.append($("<input type='hidden' name='urlCode'></input>").val(p.auth_cd));
			form.append($("<input type='hidden' name='tr_url'></input>").val(overpass.global.scheme + ":" + overpass.global.base_domain_url + overpass.global.lang_divi_cd + "/member/kmcReturn" + overpass.global.ext));
			form.append($("<input type='hidden' name='plusInfo'></input>").val(p.auth_cd));
			form.append($("<input type='hidden' name='sns_id'></input>").val(p.sns_id));
			form.append($("<input type='hidden' name='sns_gubun_code'></input>").val(p.sns_gubun_code));
			form.append($("<input type='hidden' name='sns_email'></input>").val(p.sns_email));

			//form.append($("<input type='hidden' name='loginId'></input>").val(p.login_id));
			form.append($("<input type='hidden' name='connYn'></input>").val(p.conn_yn));

			if(p.parameters != undefined){
				var count=0, len = Object.keys(p.parameters).length;
				for(var key in p.parameters ) {
					var ipt = form.find('input[name='+key+']');
					if(ipt.length>0){
						ipt.val(p.parameters[key]);
					}else{
						form.append($("<input type='hidden' name='"+key+"'></input>").val(p.parameters[key]));
					}
				}
			}

			form.submit();
		},
		
		// kmc 본인인증(pc popup)
		initPopKMC : function (p) {
			if ($.type(window.SSGDFS) != "object") {
				window.SSGDFS = {};
			};
			if ($.type(window.SSGDFS.KMC) != "object") {
				window.SSGDFS.KMC = {};
			};
			
			var data = {
				'urlCode': p.auth_cd,
				"tr_url" : overpass.global.scheme + ":" + overpass.global.base_domain_url + overpass.util.getUrl("/member/kmcReturn"),
				'plusInfo' : p.auth_cd,
				'sns_id' : p.sns_id,
				'sns_gubun_code' : p.sns_gubun_code,
				'sns_email' : p.sns_email
				//'loginId' : p.login_id,
				//'connYn' : p.conn_yn
			};

			if(p != undefined && typeof p.parameters == "object"){
				data = $.extend(data, p.parameters);
				
				$.extend(SSGDFS.KMC, {
					parameter: p.parameters
				});
			}
			//KMC callback set
			if($.isFunction(p.callback)){
				$.extend(SSGDFS.KMC, {
					callback: p.callback
				});
			}
			
			$.ajax({
				url: overpass.util.getUrl("/member/myKmcPopAuth"),
				type: "POST",
				dataType:"json",
				data: data,
				success:function(result){
					var popup_name = "popupKMC";
					var form = (function() {
						var form_id = "formKmc";
						
						if ($("#" + form_id).length == 0) {
							$("<form id='" + form_id + "' name='"+ form_id +"'></form>").appendTo("body");
						}
						var v_form = $("#" + form_id).attr({
							action: "https://www.kmcert.com/kmcis/web/kmcisReq.jsp",
							method: "post",
							target: popup_name
						});
						return v_form.empty();
					})();
					
					$("<input type='hidden' name='cpId'></input>").val(result.cpId).appendTo(form);
					$("<input type='hidden' name='urlCode'></input>").val(result.urlCode).appendTo(form);
					$("<input type='hidden' name='certNum'></input>").val(result.certNum).appendTo(form);
					$("<input type='hidden' name='date'></input>").val(result.date).appendTo(form);
					$("<input type='hidden' name='certMet'></input>").val(result.certMet).appendTo(form);
					$("<input type='hidden' name='extendVar'></input>").val(result.extendVar).appendTo(form);
					$("<input type='hidden' name='tr_cert'></input>").val(result.tr_cert).appendTo(form);
					$("<input type='hidden' name='tr_url'></input>").val(result.tr_url).appendTo(form);
					$("<input type='hidden' name='plusInfo'></input>").val(result.plusInfo).appendTo(form);
					
					window.open('', popup_name, 'width=425, height=550, resizable=0, scrollbars=no, status=0, titlebar=0, toolbar=0, left=435, top=250' );
					form.submit();
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					alert("오류가 생겼습니다.\n다시 시도해 주세요.");
				}
			});
		}
	})

})(jQuery);