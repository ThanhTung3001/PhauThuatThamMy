;(function($) {

	var OVERPASS = window.overpass;
	var FN = OVERPASS.fn;
	var chatbot;//챗봇 팝업

	/**
	 * 코너 컨텐츠 형태에 따른 트래킹 및 링크 이동
	 * area_no : 영역번호
	 * conts_dist_no : 컨텐츠 식별번호
	 * conts_divi_cd : 컨텐츠구분코드 (TR0002)
	 * rel_no : 컨텐츠번호
	 * rel_divi_cd : 관련구분코드 (TR0003)
	 * url : 이동URL
	 */

	$.extend(OVERPASS, {
		// [START] TRAKING
		tracking: {
			/**
			 * page: "페이지아이디"
			 * param1 : "엑셀 문서에 정의된 1뎁스 코드"
			 * param2 : "엑셀 문서에 정의된 2뎁스 코드"
			 * param3 : "엑셀 문서에 정의된 3뎁스 코드"
			 * param4 : "엑셀 문서에 정의된 4뎁스 코드"
			 * param5 : "엑셀 문서에 정의된 5뎁스 코드"
			 * param6 : "엑셀 문서에 정의된 6뎁스 코드"
			 * callback : callback function 정의
			 * pin ex )
			 * var p = {
					page: "페이지아이디"
					, param1 : "엑셀 문서에 정의된 1뎁스 코드"
					, param2 : "엑셀 문서에 정의된 2뎁스 코드"
					, param3 : "엑셀 문서에 정의된 3뎁스 코드"
					, param4 : "엑셀 문서에 정의된 4뎁스 코드"
					, param5 : "엑셀 문서에 정의된 5뎁스 코드"
					, param6 : "엑셀 문서에 정의된 6뎁스 코드"
					, param7 : "엑셀 문서에 정의된 7뎁스 코드"
					, callback: function (result) {
						overpass.link('MAIN');
					}
				}
			 * **/
			loggingClick: function (pin) {
				if (overpass.global.isApp) {
					try {
						//앱인경우
						if (typeof WiseTracker != 'undefined') {
						    var wisetrackerClickCd = "^" + $.trim(pin.page) + "^" +  $.trim(pin.param1)+ "^" +  $.trim(pin.param2)+ "^" +  $.trim(pin.param3)+ "^" +  $.trim(pin.param4)+ "^" +  $.trim(pin.param5);
						    if(wisetrackerClickCd.indexOf("^^")>-1) {
						        wisetrackerClickCd = wisetrackerClickCd.substr(0, wisetrackerClickCd.indexOf("^^"));
                            }
						    if(wisetrackerClickCd != "" ) {
						        WiseTracker.sendClickData("EVT", wisetrackerClickCd);
                            }
						}
					} catch (e) {
					}
				}
                if (typeof n_click_logging != 'undefined') {
                    if (pin.type != null || pin.type != undefined) {
                        if (pin.type == 'greating' || pin.type == 'keyword') {
                            /**
                             * 개인화 영역 관련 페이지로딩시 호출
                             * type : greating = 그리팅메세지
                             *        keyword = 추천키워드
                             * param1 : 순서
                             * param2 : 컨텐츠명(그리팅메세지), 추천키워드
                             */
                            n_click_logging("/load?type=" + $.trim(pin.type) + "&param1=" + $.trim(pin.param1).replace(/\&/g, '') + "&param2=" + $.trim(pin.param2).replace(/\&/g, ''))
                        }

                    } else {
                        //웹인경우
                        n_click_logging(
                            '/click?page=' + $.trim(pin.page).replace(/\&/g, '') + '&param1=' + $.trim(pin.param1).replace(/\&/g, '') + "&param2=" + $.trim(pin.param2).replace(/\&/g, '') +
                            "&param3=" + $.trim(pin.param3).replace(/\&/g, '') + "&param4=" + $.trim(pin.param4).replace(/\&/g, '') + "&param5=" + $.trim(pin.param5).replace(/\&/g, '') +
                            "&param6=" + $.trim(pin.param6).replace(/\&/g, '') + "&param7=" + $.trim(pin.param7).replace(/\&/g, '') + "&href=" + $.trim(SSGDFS.pageIcfCd)
                            + "&reffer=" + $.trim(SSGDFS.beforPageIcfCd)
                        );
                    }

                }


				if($.isFunction(pin.callback)){
					pin.callback(pin);
				}
			},
			/* 별도 적용이 필요한 영역 */
			areaClick: function(area, aria_expanded){
				$(area).bind('click', function(){
					var clicklog_page = $.trim($(this).data('page')).replace(/\&/g,'');
					var clicklog_param1 = $.trim($(this).data('param1')).replace(/\&/g,'');
					var clicklog_param2 = $.trim($(this).data('param2')).replace(/\&/g,'');
					var clicklog_param3 = $.trim($(this).data('param3')).replace(/\&/g,'');
					var clicklog_param4 = $.trim($(this).data('param4')).replace(/\&/g,'');
					var clicklog_param5 = $.trim($(this).data('param5')).replace(/\&/g,'');
					var clicklog_param6 = $.trim($(this).data('param6')).replace(/\&/g,'');
					var clicklog_param7 = $.trim($(this).data('param7')).replace(/\&/g,'');
					
					// 기존 클릭로그 적용
					if (overpass.global.isApp) {
						try {
							//앱인경우
							if (typeof WiseTracker != 'undefined') {
								WiseTracker.sendClickData("EVT", "^" + $.trim(clicklog_page) + "^" +  $.trim(clicklog_param1)+ "^" +  $.trim(clicklog_param2)+ "^" +  $.trim(clicklog_param3)+ "^" +  $.trim(clicklog_param4)+ "^" +  $.trim(clicklog_param5));
							}
						} catch (e) {
						}
					}

                    if($(this).attr("aria-expanded") == "false" && aria_expanded != undefined) {
                        return false;
                    }else{
                        n_click_logging(
                            '/click?page=' + $.trim(clicklog_page) + '&param1=' + $.trim(clicklog_param1) + "&param2=" + $.trim(clicklog_param2) +
                            "&param3=" + $.trim(clicklog_param3) + "&param4=" + $.trim(clicklog_param4) + "&param5=" + $.trim(clicklog_param5) +
                            "&param6=" + $.trim(clicklog_param6) + "&param7=" + $.trim(clicklog_param7)+ "&href="+$.trim(SSGDFS.pageIcfCd)
                            +"&reffer="+ $.trim(SSGDFS.beforPageIcfCd)
                        );
                    }

				})
			},
            wiseBannerClick: function (pin) {
				if (overpass.global.isApp) {
					try {
						//앱인경우
                        if (typeof WiseTracker != 'undefined') {
                            var param = new Object();
                            param['ckTp'] = 'EVT'; //고정
                            param['ckData'] = $.trim(pin.ckdata);
                            param['mvt4'] = $.trim(pin.mvt4);
                            param['mvt5'] = $.trim(pin.mvt5);
                            param['mvt6'] = $.trim(pin.mvt6);
                            WiseTracker.sendJsonClickData(JSON.stringify(param));

                            if(pin.mvt3 != "" ) {
                                WiseTracker.sendClickData("MVT3", $.trim(pin.mvt3));
							    WiseTracker.sendClickData("EVT", $.trim(pin.evt));
                            }
						}
					} catch (e) {
					}
				}

			},

		},
		//[END] TRAKING
		commonLog: function(pin){
			try{
				var uri = document.location.href;
				if (overpass.global.isApp) {
					try {
						//앱인경우
						if (typeof WiseTracker != 'undefined') {
                            WiseTracker.sendClickData("EVT", "^" + $.trim(pin.page) + "^" +  $.trim(pin.param1)+ "^" +  $.trim(pin.param2)+ "^" +  $.trim(pin.param3)+ "^" +  $.trim(pin.param4)+ "^" +  $.trim(pin.param5));
						}
					} catch (e) {
					}
				} else {
					//웹인경우
					n_click_logging(
						'/click?page=' + $.trim(pin.page).replace(/\&/g,'') + '&param1=' + $.trim(pin.param1).replace(/\&/g,'') + "&param2=" + $.trim(pin.param2).replace(/\&/g,'')+ "&param3=" + $.trim(pin.param3).replace(/\&/g,'') + "&param4=" + $.trim(pin.param4).replace(/\&/g,'') + "&param5=" + $.trim(pin.param5).replace(/\&/g,'') + "&uri="+$.trim(SSGDFS.pageIcfCd)
					);
				}
				if($.isFunction(pin.callback)){
					pin.callback(pin);
				}
			}catch(e){
				console.log('공통로그 수집에러');
			}
		},
		//[START] LINK
		link: function(slink, pin){
			var defaultMsg = '준비중입니다.[' + slink + ']';

			//메인
			if (slink == "MAIN") {
				overpass.util.go(overpass.util.https('/main/initMain' + overpass.global.ext), pin);
			}//약관정보
			else if (slink == "ADDINFO") {
				overpass.util.go(overpass.util.https("/common/initSiteAddInfo" + overpass.global.ext), pin);
			}//장바구니
			else if (slink == "CART") {
				overpass.util.go(overpass.util.https('/cart/initCart' + overpass.global.ext), pin);
			}//로그인 레이어
			else if (slink == "LOGINLAYER") {
				overpass.fn.login.lyrLogin(pin);
			}//로그인
			else if (slink == "LOGIN") {
				overpass.util.go(overpass.util.https('/login/login' + overpass.global.ext), pin);
			}//로그아웃
			else if (slink == "LOGOUT") {
				if (overpass.global.isApp) {
					var message = {
						'group':'login',
						'function':'logout'
					}
					fnAppScheme(message);
				}else{
					if(chatbot != undefined && !chatbot.closed){//팝업이 존재시에만 처리함.
						chatbot.window.postMessage('SSG_LOGOUT');
						chatbot.close();
					}
				}
				overpass.util.setCookie({name: "APP_SID", value: "", path: "/", age:0, domain: overpass.global.cookie_domain });
				overpass.util.setCookie({name:"auto_chk",value:'N', path: "/"});
				overpass.util.setCookie({name:"LOGID",value:'', path: "/"});

				overpass.util.go(overpass.util.https('/login/logout' + overpass.global.ext), pin);
			}//회원가입
			else if (slink == "MEMBERJOINMAIN") {
				overpass.util.go(overpass.util.https('/member/memberJoinMain' + overpass.global.ext), pin);
			}//휴대폰으로 가입
			else if (slink == "MEMBERTELJOIN") {
				overpass.util.go(overpass.util.https('/member/memberTelJoin' + overpass.global.ext), pin);
			}//이메일로 가입
			else if (slink == "MEMBEREMAILJOIN") {
				overpass.util.go(overpass.util.https('/member/memberEmailJoin' + overpass.global.ext), pin);
			}//PC-회원가입
			else if (slink == "MEMBERJOIN") {
				overpass.util.go(overpass.util.https('/member/memberJoin' + overpass.global.ext), pin);
			}//본인인증
			else if (slink == "KMCAUTH") {
				overpass.util.go(overpass.util.https('/member/myKmcAuth' + overpass.global.ext), pin);
			}//본인인증 페이지(pc)
			else if (slink == "KMCAUTHPAGE") {
				overpass.util.go(overpass.util.https('/member/kmcAuthPage' + overpass.global.ext), pin);
			}//연령인증 페이지
			else if (slink == "ADTAUTHPAGE") {
				overpass.util.go(overpass.util.https('/member/memberAdtAuth' + overpass.global.ext), pin);
			}//회원정보확인
			else if (slink == "MEMBERCONFIRM") {
				overpass.util.go(overpass.util.https('/member/memberInfoConfirm' + overpass.global.ext), pin);
			}//회원-이메일등록페이지
			else if (slink == "MEMBEREMAILREGIST") {
				overpass.util.go(overpass.util.https('/member/initMemberEmailRegist' + overpass.global.ext), pin);
			}//회원-전화번호등록페이지
			else if (slink == "MEMBERPHONEREGIST") {
				overpass.util.go(overpass.util.https('/member/initMemberPhoneRegist' + overpass.global.ext), pin);
			}//LNB
			else if (slink == "LNB") {
				overpass.util.go(overpass.util.https('/dispctg/initLnb' + overpass.global.ext), pin);
			}//부띠끄 브랜드 메인
			else if (slink == "BTQBRANMAIN") {
				overpass.util.go(overpass.util.https('/dispctg/initBtqBranMain' + overpass.global.ext), pin);
			}//부띠끄 브랜드 샤넬 하위카테고리
			else if (slink == "BTQCHANELLOWCTG") {
				overpass.util.go(overpass.util.https('/dispctg/initBtqChanelLowCtg' + overpass.global.ext), pin);
			}//부띠끄 브랜드 하위카테고리
			else if (slink == "BTQBRANLOWCTG") {
				overpass.util.go(overpass.util.https('/dispctg/initBtqBranLowCtg' + overpass.global.ext), pin);
			}//부띠끄 브랜드 맥 특정 하위카테고리
			else if(slink == "BTQMACLOWCTG") {
				overpass.util.go(overpass.util.https('/dispctg/initBtqMacLowCtg' + overpass.global.ext), pin);
			}//부띠끄 브랜드 달팡 특정 하위카테고리
			else if(slink == "BTQDARPHINLOWCTG") {
				overpass.util.go(overpass.util.https('/dispctg/initBtqDarphinLowCtg' + overpass.global.ext), pin);
			}//부띠끄 브랜드 mode(신제품/전체상품보기)별 페이지
			else if(slink == "BTQBRANMODECTG") {
				overpass.util.go(overpass.util.https('/dispctg/initBtqBranModeCtg' + overpass.global.ext), pin);
			}//사업자정보
			else if(slink == "BIZINFO"){
				overpass.util.go(overpass.util.https('/common/initBizInfo' + overpass.global.ext), pin);
			}//마이페이지 출국정보관리
			else if (slink == "MYDPATINFO") {
				overpass.util.go(overpass.util.https('/mypage/initMyDpatInfo' + overpass.global.ext), pin);
			}//마이페이지 출국정보등록
			else if (slink == "MYDPATINFOREGIST") {
				overpass.util.go(overpass.util.https('/mypage/initMyDpatInfoRegister' + overpass.global.ext), pin);
			}//마이페이지 출국정보상세
			else if (slink == "MYDPATINFODETAIL") {
				overpass.util.go(overpass.util.https('/mypage/initMyDpatInfoDetail' + overpass.global.ext), pin);
			}//마이페이지 환불계좌관리
			else if (slink == "MYREFUNDMGMT") {
				overpass.util.go(overpass.util.https('/mypage/initMyRefundMgmt' + overpass.global.ext), pin);
			}//마이페이지 결제수단
			else if (slink == "MYPAYMETHOD") {
				overpass.util.go(overpass.util.https('/mypage/initMyPayMethod' + overpass.global.ext), pin);
			}//마이페이지 결제수단등록
			else if (slink == "MYPAYMETHODREG") {
				overpass.util.go(overpass.util.https('/mypage/initMyPayMethodRegister' + overpass.global.ext), pin);
			}//상품리뷰 전체보기
			else if(slink == "MYREVIEWLIST"){
				overpass.util.go(overpass.util.https('/mypage/initMyGoosReview' + overpass.global.ext), pin);
			}//제휴멤버십관리
			else if(slink == "MYAFMEMSHIP") {
				overpass.util.go(overpass.util.https('/mypage/initMyAfMemshipMgmt' + overpass.global.ext), pin);
			}//내가 응모한 이벤트
			else if(slink == "MYDRAWEVENT") {
				overpass.util.go(overpass.util.https('/mypage/initMyDrawEvent' + overpass.global.ext), pin);
			}//신한은행환전
			else if(slink == "MYSHBEXCHANGE") {
				overpass.util.go(overpass.util.https('/mypage/initMyShbExchange' + overpass.global.ext), pin);
			}//여권정보등록/수정
			else if(slink == "MYPSPTREGISTMOD") {
				overpass.util.go(overpass.util.https('/mypage/initMyPsptRegistMod' + overpass.global.ext), pin);
			}//공식스토어 메인
			else if(slink == "OFCLSTOREMAIN") {
				overpass.util.go(overpass.util.https('/dispctg/initOfclStoreMain' + overpass.global.ext), pin);
			}//브랜드몰
			else if (slink == "BRANMALL") {
				overpass.util.go(overpass.util.https('/dispctg/initBranMall' + overpass.global.ext), pin);
			}//마이페이지 메인
			else if (slink == "MYPAGEMAIN") {
				overpass.util.go(overpass.util.https('/mypage/initMypageMain' + overpass.global.ext), pin);
			}//브랜드스토리
			else if (slink == "BRANSTORY") {
				overpass.util.go(overpass.util.https('/dispctg/initBranStory' + overpass.global.ext), pin);
			}//상품리뷰 포토리스트
			else if (slink == "EVALPHOTOLIST") {
				overpass.util.go(overpass.util.https('/goos/searchGoosEvalPhotoList' + overpass.global.ext), pin);
			}//상품리뷰 리스트
			else if (slink == "GOOSEVALLIST") {
				overpass.util.go(overpass.util.https('/goos/searchGoosEvalList' + overpass.global.ext), pin);
			}//상품리뷰 상세페이지
			else if (slink == "GOOSEVALVIEW") {
				if(pin.view_code == undefined){
					//view_code > 공유리뷰용 10 / 포토리스트 20 / 신세계픽 30 / 체험단픽 31 / 사용자픽 32 / 맞춤필터 40(적용할지 미정) / 전체 99
					pin.view_code = '99'; // 전체조회
				}
				overpass.util.go(overpass.util.https('/goos/getGoosEvalView' + overpass.global.ext), pin);
			}//마이페이지 회원혜택
			else if (slink == "MYMEMBENEFITS") {
				overpass.util.go(overpass.util.https('/mypage/initMyMemBenefits' + overpass.global.ext), pin);
			}//브랜드스토어 메인
			else if (slink == "BRANSTOREMAIN") {
				overpass.util.go(overpass.util.https('/dispctg/initBranStoreMain' + overpass.global.ext), pin);
			}//브랜드스토어 하위카테고리
			else if (slink == "BRANSTORELOWCTG") {
				overpass.util.go(overpass.util.https('/dispctg/initBranStoreLowCtg' + overpass.global.ext), pin);
			}//신세계상품권 전환
			else if (slink == "MYSSGGCCONVT") {
				overpass.util.go(overpass.util.https('/mypage/initMySsgGcConvt' + overpass.global.ext), pin);
			}//온라인 전용혜택
			else if (slink == "MYONLINEBENEFITS") {
				overpass.util.go(overpass.util.https('/mypage/initMyOnlineBenefits' + overpass.global.ext), pin);
			}//밀크서비스
			else if (slink == "MILKMAIN") {
				overpass.util.go(overpass.util.https('/mypage/initMilkMain' + overpass.global.ext), pin);
			}//밀크서비스 연동
			else if (slink == "MILKCONNECT") {
				overpass.util.go(overpass.util.https('/mypage/initMilkConnect' + overpass.global.ext), pin);
			}//밀크서비스 연동해지
			else if (slink == "MILKDISCONNECT") {
				overpass.util.go(overpass.util.https('/mypage/initMilkDisconnect' + overpass.global.ext), pin);
			}//공항주류할인
			else if (slink == "AIRPORTLIQUOR") {
				overpass.util.go(overpass.util.https('/dispctg/initLiquorMain' + overpass.global.ext), pin);
			}//MYCONTACT(마이페이지 1:1 문의내역)
			else if (slink == "CSTCONTACT") {
				overpass.util.go(overpass.util.https('/mypage/initMyCounselList' + overpass.global.ext), pin);
			}//마이페이지 상품 Q&A내역
			else if (slink == "MYGOOSQNA"){
				overpass.util.go(overpass.util.https('/mypage/initMyGoosCounsel' + overpass.global.ext), pin);
			}//공지사항 상세
			else if (slink == "NOTIDETAIL") {
				overpass.util.go(overpass.util.https('/customer/getNoti' + overpass.global.ext), pin);
			}//공지사항 메뉴
			else if (slink == "DGNOTIAUCTION") {
				overpass.util.go(overpass.util.https('/customer/initNotice' + overpass.global.ext ), pin);
			}//마이페이지-대량 출국정보 변경 (mg)
			else if (slink == "MGEXITCHNGORDERLIST") {
				overpass.util.go(overpass.util.https('/mypage/initMgExitChngOrderList' + overpass.global.ext), pin);
			}//마이페이지-주문-출국정보변경 가능 주문내역
			else if (slink == "EXITCHNGORDERLIST") {
				overpass.util.go(overpass.util.https('/mypage/initExitChngOrderList' + overpass.global.ext), pin);
			}//마이페이지-주문내역
			else if (slink == "MYORDERLIST") {
				overpass.util.go(overpass.util.https('/mypage/initMyOrderList' + overpass.global.ext), pin);
			}//마이페이지-주문상세
			else if (slink == "MYDTORDERINFO"){
				overpass.util.go(overpass.util.https('/mypage/initDtOrderInfo' + overpass.global.ext), pin);
			}//마이페이지-주문내역(오프라인)
			else if (slink == "MYORDERLISTOFF") {
				overpass.util.go(overpass.util.https('/mypage/initMyOffOrderList' + overpass.global.ext), pin);
			}//신구단 등급 및 혜택
			else if (slink == "DGRANK") {
				overpass.util.go(overpass.util.https('/dg/initRankBenefits' + overpass.global.ext), pin);
			}//신구단 주문내역
			else if (slink == "DGORDERLIST") {
				overpass.util.go(overpass.util.https('/dg/initOrderList' + overpass.global.ext), pin);
			}//고객센터-1:1문의 등록
			else if (slink == "ONOCOUNSEL") {
				overpass.util.go(overpass.util.https('/customer/initOnoCounsel' + overpass.global.ext), pin);
			}//마이페이지-주문취소-주문취소신청(취소신청가능내역)
			else if (slink == "MYORDERCNCL") {
				overpass.util.go(overpass.util.https('/mypage/initMyOrderCnclList' + overpass.global.ext), pin);
			}//마이페이지-주문취소-취소접수현황
			else if (slink == "MYORDERCNCLREQ") {
				overpass.util.go(overpass.util.https('/mypage/initMyOrderCnclReqList' + overpass.global.ext), pin);
			}//마이페이지-주문취소-취소신청
			else if (slink == "ORDERCNCLREQ") {
				overpass.util.go(overpass.util.https('/mypage/initOrderCnclReq' + overpass.global.ext), pin);
			}//마이페이지-주문취소-취소상세
			else if (slink == "ORDERCNCLDTL") {
				overpass.util.go(overpass.util.https('/mypage/initOrderCnclDtl' + overpass.global.ext), pin);
			}//마이페이지-패스워드변경
			else if (slink == "MYPWCHANGEMOD") {
				overpass.util.go(overpass.util.https('/mypage/initMyPwChangeMod' + overpass.global.ext), pin);
			}//마이페이지-회원정보수정
			else if (slink == "MYINFOCHANGE") {
				overpass.util.go(overpass.util.https('/mypage/initMyInfoChange' + overpass.global.ext), pin);
			}//마이페이지-로그인수단관리페이지
			else if (slink == "MYLOGINCONN") {
				overpass.util.go(overpass.util.https('/mypage/initMyLoginConn' + overpass.global.ext), pin);
			}//통합컨텐츠 상세
			else if (slink == "EVENTDETAIL") {
				overpass.util.go(overpass.util.https('/event/initEventDetail' + overpass.global.ext), pin);
			}//회원 - 아이디찾기 및 패스워드 찾기
			else if (slink == "LOGINFIND") {
				overpass.util.go(overpass.util.https('/login/initLoginFind' + overpass.global.ext), pin);
			}//회원 - 아이디찾기 수단선택 페이지
			else if (slink == "LOGINFINDIDPAGE") {
				overpass.util.go(overpass.util.https('/login/initLoginFindIdPage' + overpass.global.ext), pin);
			}//회원 - 패스워드찾기 아이디입력 페이지
			else if (slink == "LOGINFINDPWINPUTID") {
				overpass.util.go(overpass.util.https('/login/initLoginFindPwInputId' + overpass.global.ext), pin);
			}//회원 - 패스워드찾기 수단선택 페이지
			else if (slink == "LOGINFINDPWPAGE") {
				overpass.util.go(overpass.util.https('/login/initLoginFindPwPage' + overpass.global.ext), pin);
			}//회원 - 이메일인증으로 찾기 페이지
			else if (slink == "LOGINFINDEMAIL") {
				overpass.util.go(overpass.util.https('/login/initLoginFindEmail' + overpass.global.ext), pin);
			}//회원 - 휴대폰인증으로 찾기 페이지
			else if (slink == "LOGINFINDPHONE") {
				overpass.util.go(overpass.util.https('/login/initLoginFindPhone' + overpass.global.ext), pin);
			}//회원 - 본인인증으로 찾기 페이지
			else if (slink == "LOGINFINDCI") {
				overpass.util.go(overpass.util.https('/login/initLoginFindCi' + overpass.global.ext), pin);
			}//회원 - 여권인증으로 찾기 페이지
			else if (slink == "LOGINFINDPSPT") {
				overpass.util.go(overpass.util.https('/login/initLoginFindPspt' + overpass.global.ext), pin);
			}//마이페이지-마이픽폴더생성
			else if (slink == "MYPICKFOLDINSERT"){
				overpass.util.go(overpass.util.https('/mypage/initinsertMyPickList' + overpass.global.ext), pin);
			}//마이페이지-위시리스트
			else if (slink == "MYPICKLIST"){
				overpass.util.go(overpass.util.https('/mypage/initMyPickMain' + overpass.global.ext), pin);
			}//마이페이지-폴더디테일
			else if (slink == "MYPICKGOOSDETAIL"){
				overpass.util.go(overpass.util.https('/mypage/getMypickGoos' + overpass.global.ext), pin);
			}//신구단-상품-폴더디테일
			else if (slink == "DGMYPICKGOOSDETAIL"){
				overpass.util.go(overpass.util.https('/dg/getDgMypickGoos' + overpass.global.ext), pin);
			}//마이페이지-임직원전용
			else if (slink == "EMPLOYEE"){
				overpass.util.go(overpass.util.https('/mypage/initEmployeeMain' + overpass.global.ext), pin);
			}//고객센터
			else if (slink == "CUSTOMER") {
				overpass.util.go(overpass.util.https('/customer/initCustomerMain' + overpass.global.ext), pin);
			}//고객센터-면세가이드
			else if (slink == "SHOPPINGGUIDE") {
				overpass.util.go(overpass.util.https('/customer/initShoppingGuide' + overpass.global.ext), pin);
			}//고객센터-공항이용정보
			else if (slink == "AIRPORTGUIDE") {
				overpass.util.go(overpass.util.https('/customer/initAirport' + overpass.global.ext), pin);
			}//고객센터-스페셜오더
			else if (slink == "SPECIALORDER") {
				overpass.util.go(overpass.util.https('/mypage/initMySpecialOrder' + overpass.global.ext), pin);
			}//고객센터-스페셜오더 상세(PC전용)
			else if (slink == "SODETAIL") {
				overpass.util.go(overpass.util.https('/mypage/initMySpecialOrderDetail' + overpass.global.ext), pin);
			}//고객센터-혜택안내
			else if (slink == "BENEFIT") {
				overpass.util.go(overpass.util.https('/customer/initBenefit' + overpass.global.ext), pin);
			}//고객센터-멤버십안내
			else if (slink == "MEMBERSHIP") {
				overpass.util.go(overpass.util.https('/customer/initMembership' + overpass.global.ext), pin);
			}//고객센터-지점안내
			else if (slink == "STOR") {
				overpass.util.go(overpass.util.https('/customer/initCtStor' + overpass.global.ext), pin);
			}//고객센터-지점상세
			else if (slink == "STORDTL") {
				overpass.util.go(overpass.util.https('/customer/initCtStorDtl' + overpass.global.ext), pin);
			}//고객센터-지점안내
			else if (slink == "STORBRAN") {
				overpass.util.go(overpass.util.https('/customer/initCtStorBran' + overpass.global.ext), pin);
			}//고객센터-오프라인혜택안내
			else if (slink == "STORBENEFIT") {
				overpass.util.go(overpass.util.https('/customer/initCtStorBenefit' + overpass.global.ext), pin);
			}//고객센터-브랜드상세안내(PC)
			else if (slink == "STORBRANDTL") {
				overpass.util.go(overpass.util.https('/customer/initCtStorBranDtl' + overpass.global.ext), pin);
			}//설정
			else if (slink == "SETTING") {
				if(overpass.global.isApp){
					var message = {
						'group':'move',
						'function':'native',
						'args':
   		     				{
   		     				type: 'setting'
   		     				}
					}
					fnAppScheme(message);
				}else{
					overpass.util.go(overpass.util.https('/mypage/initSetting' + overpass.global.ext), pin);
				}
			}//고객센터-FAQ
			else if (slink == "CUSTOMERFAQ") {
				overpass.util.go(overpass.util.https('/customer/initFaq' + overpass.global.ext), pin);
			}//신구단(DG)-FAQ
			else if (slink == "DGFAQ") {
				overpass.util.go(overpass.util.https('/dg/initDgFaq' + overpass.global.ext), pin);
			}//신구단(DG)-Q&A등록
			else if (slink == "DGCOUNSEL") {
				overpass.util.go(overpass.util.https('/dg/initDgCounsel' + overpass.global.ext), pin);
			}//신구단-공동구매
			else if (slink == "DGGROUPBUY") {
				overpass.util.go(overpass.util.https('/dg/initGroupBuyMain' + overpass.global.ext), pin);
			}//신구단-공동구매 상세
			else if (slink == "DGGROUPBUYDTL") {
				overpass.util.go(overpass.util.https('/dg/initGroupBuyDtl' + overpass.global.ext), pin);
			}//신구단-공동구매 구매가능 상세
			else if (slink == "DGGROUPBUYPURCHASEDTL") {
				overpass.util.go(overpass.util.https('/dg/initGroupBuyPurchaseDtl' + overpass.global.ext), pin);
			}//신구단-공동구매 참여내역 상세
			else if (slink == "DGGROUPBUYMYDTL") {
				overpass.util.go(overpass.util.https('/dg/initGroupBuyMyDtl' + overpass.global.ext), pin);
			}//신구단(DG)-Q&A내역
			else if (slink == "DGCOUNSELLIST") {
				overpass.util.go(overpass.util.https('/dg/initDgCounselList' + overpass.global.ext), pin);
			}//신구단(DG)-구매목록
			else if (slink == "DGORDERGOOSLIST") {
				overpass.util.go(overpass.util.https('/dg/getDgOrderGoosList' + overpass.global.ext), pin);
			}//마이페이지 신세계상품권전환 메인
			else if (slink == "MYSSGGCMAIN") {
				overpass.util.go(overpass.util.https('/mypage/initMySsgGcMain' + overpass.global.ext), pin);
			}//뷰티전문관
			else if (slink == "BTSHOP") {
				overpass.util.go(overpass.util.https('/dispctg/initBtShopMain' + overpass.global.ext), pin);
			}//뷰티랭킹
			else if (slink == "BTRANK") {
				overpass.util.go(overpass.util.https('/dispctg/initBtRanking' + overpass.global.ext), pin);
			}//패션전문관
			else if (slink == "FSSHOP") {
				overpass.util.go(overpass.util.https('/dispctg/initFsShopMain' + overpass.global.ext), pin);
			}//패션전문관-트렌드더보기
			else if (slink == "FSTRENDS") {
				overpass.util.go(overpass.util.https('/dispctg/fsMoreTrends' + overpass.global.ext), pin);
			}//패션전문관-패션PICK
			else if (slink == "FSPICK") {
				overpass.util.go(overpass.util.https('/dispctg/initFsPick' + overpass.global.ext), pin);
			}//재입고 신청 내역
			else if (slink == "REINGOOS") {
				overpass.util.go(overpass.util.https('/mypage/initReinGoosList' + overpass.global.ext), pin);
			}//패션전문관-핫테마관
			else if (slink == "FSHOTTHEME") {
				overpass.util.go(overpass.util.https('/dispctg/initFsHotThemeShop' + overpass.global.ext), pin);
			}//뷰티전문관-핫테마관
			else if (slink == "BTHOTTHEME") {
				overpass.util.go(overpass.util.https('/dispctg/initBtHotThemeShop' + overpass.global.ext), pin);
			}//뷰티전문관,패션전문관-핫테마관 모아보기
			else if (slink == "STOREHOTTHEMECOLLECT") {
				overpass.util.go(overpass.util.https('/dispctg/initHotThemeCollection' + overpass.global.ext), pin);
			}//뷰티전문관-매거진
			else if (slink == "BTMAGAZINE") {
				overpass.util.go(overpass.util.https('/dispctg/initBtMagazine' + overpass.global.ext), pin);
			}//패션전문관-매거진
			else if (slink == "FSMAGAZINE") {
				overpass.util.go(overpass.util.https('/dispctg/initFsMagazine' + overpass.global.ext), pin);
			}//히스토리
			else if (slink == "HISTORY") {
				overpass.util.go(overpass.util.https('/history/initHistoryMain' + overpass.global.ext), pin);
			}//신구단 커뮤니티 메인화면 , 목록 (내가 쓴글 , 내가쓴 댓글)
			else if (slink == "DGMYBBSMAIN") {
				overpass.util.go(overpass.util.https('/dg/getDgMyCommunityList' + overpass.global.ext), pin);
			}//신구단 커뮤니티 메인화면 , 목록
			else if (slink == "DGBBSMAIN") {
				overpass.util.go(overpass.util.https('/dg/getDgCommunityList' + overpass.global.ext), pin);
			}//신구단 커뮤니티 상세
			else if (slink == "DGBBSDETAIL") {
				overpass.util.go(overpass.util.https('/dg/getCommunityDetail' + overpass.global.ext), pin);
			}//신구단쇼핑-재고신청 등록
			else if(slink == "DGSTOCKREG"){
				overpass.util.go(overpass.util.https('/dg/initStockRegist' + overpass.global.ext), pin);
			}//신구단쇼핑-재고신청 승인대기
			else if(slink == "DGSTOCKRECEIPT"){
				overpass.util.go(overpass.util.https('/dg/initStockReceipt' + overpass.global.ext), pin);
			}//신구단쇼핑-재고신청 승인완료
			else if(slink == "DGSTOCKCOMPLETE"){
				overpass.util.go(overpass.util.https('/dg/initStockComplete' + overpass.global.ext), pin);
			}//신구단쇼핑-재고신청 신청내역
			else if(slink == "DGSTOCKREQLIST"){
				overpass.util.go(overpass.util.https('/dg/initStockReqList' + overpass.global.ext), pin);
			}//신구단메인화면
			else if(slink == "DGMAIN"){
				overpass.util.go(overpass.util.https('/dg/initDgMain' + overpass.global.ext), pin);
			}//신구단-오늘의 추천상품 상세
			else if (slink == "DGTODAYGOOS") {
				overpass.util.go(overpass.util.https('/dg/seachTodaySuggestGoosList' + overpass.global.ext), pin);
			}//신구단 - 이벤트 상세
			else if (slink == "DGEVENT") {
				overpass.util.go(overpass.util.https('/dg/seachEventInfoList' + overpass.global.ext), pin);
			}//신구단 - 경매 메인
			else if (slink == "DGAUCTION") {
				overpass.util.go(overpass.util.https('/dg/initAuctionMain' + overpass.global.ext), pin);
			}//신구단 - 경매 진행중 상세
			else if (slink == "DGAUCTIONDTL") {
				overpass.util.go(overpass.util.https('/dg/initAuctionDtl' + overpass.global.ext), pin);
			}//신구단 - 경매 낙찰 상세
			else if (slink == "DGAUCTIONBIDDTL") {
				overpass.util.go(overpass.util.https('/dg/initAuctionBidDtl' + overpass.global.ext), pin);
			}//신구단 - 경매 참여내역 상세
			else if (slink == "DGAUCTIONMYDTL") {
				overpass.util.go(overpass.util.https('/dg/initAuctionMyDtl' + overpass.global.ext), pin);
			}//마이페이지 MG - 경매 메인
			else if (slink == "MGAUCTION") {
				overpass.util.go(overpass.util.https('/mypage/mg/initAuctionMain' + overpass.global.ext), pin);
			}//마이페이지 MG - 경매 진행중 상세
			else if (slink == "MGAUCTIONDTL") {
				overpass.util.go(overpass.util.https('/mypage/mg/initAuctionDtl' + overpass.global.ext), pin);
			}//마이페이지 MG - 경매 참여중 상세
			else if (slink == "MGAUCTIONPARTICIPATEDTL") {
				overpass.util.go(overpass.util.https('/mypage/mg/initAuctionParticipateDtl' + overpass.global.ext), pin);
			}//마이페이지 MG - 경매 낙찰 상세
			else if (slink == "MGAUCTIONBIDDTL") {
				overpass.util.go(overpass.util.https('/mypage/mg/initAuctionBidDtl' + overpass.global.ext), pin);
			}//마이페이지 MG - 경매 참여내역 상세
			else if (slink == "MGAUCTIONMYDTL") {
				overpass.util.go(overpass.util.https('/mypage/mg/initAuctionMyDtl' + overpass.global.ext), pin);
			}//마이페이지 MG- 대량구매 주문내역
			else if (slink == "MGORDERLIST") {
				overpass.util.go(overpass.util.https('/mypage/mg/initMyOrderList' + overpass.global.ext), pin);
			}//마이페이지 MG - 대량구매 주문상세
			else if (slink == "MGDTORDERINFO"){
				overpass.util.go(overpass.util.https('/mypage/mg/initDtOrderInfo' + overpass.global.ext), pin);
			}//뷰티전문관-뷰티매거진
			else if (slink == "BTMAGAZINE") {
				overpass.util.go(overpass.util.https('/dispctg/initBtMagazine' + overpass.global.ext), pin);
			}//혜택 메인 리스트관
			else if (slink == "EVENTMAIN") {
				overpass.util.go(overpass.util.https('/event/initEventMain' + overpass.global.ext), pin);
			}//혜택 메인 리스트관 (신구단)
			else if (slink == "DGEVENTMAIN") {
				overpass.util.go(overpass.util.https('/dg/initDgEventMain' + overpass.global.ext), pin);
			}//컨텐츠관 메인
			else if (slink == "CONTENTMAIN") {
				overpass.util.go(overpass.util.https('/event/initContentMain' + overpass.global.ext), pin);
			}//마이페이지 혜택(쿠폰, 데일리적립금, 추가사용적립금, 제휴캐시, 포인트)
			else if (slink == "MYBENEFITSMAIN") {
				overpass.util.go(overpass.util.https('/mypage/initMyBenefitsMain' + overpass.global.ext), pin);
			}//마이페이지 혜택 쿠폰존
			else if (slink == "COUPONZONE") {
				overpass.util.go(overpass.util.https('/mypage/initBenefitsCpnZone' + overpass.global.ext), pin);
			}//마이페이지 회원탈퇴동의
			else if (slink == "MYWITHDRAWAGREE") {
				overpass.util.go(overpass.util.https('/mypage/initMyWithdrawAgree' + overpass.global.ext), pin);
			}//마이페이지 회원탈퇴
			else if (slink == "MYWITHDRAW") {
				overpass.util.go(overpass.util.https('/mypage/initMyWithdraw' + overpass.global.ext), pin);
			}//마이페이지 - 마이픽init
			else if(slink == "MYPICKINIT"){
				overpass.util.go(overpass.util.https('/mypage/initMyPickMain' + overpass.global.ext), pin);
			}//포인트선물하기
			else if(slink == "MYGIFTLIST"){
				overpass.util.go(overpass.util.https('/mypage/getBenePointGift' + overpass.global.ext), pin);
			}//포인트선물하기 (도착한 선물)
			else if(slink == "RECEIVEGIFTPOINT"){
				overpass.util.go(overpass.util.https('/mypage/giftPointReceive' + overpass.global.ext), pin);
			}
			else if(slink == "MYORDERLIST"){
				overpass.util.go(overpass.util.https('/mypage/initMyOrderList' + overpass.global.ext), pin);
			}//상품상세
			else if (slink == "GOOSDETAIL") {
				overpass.util.go(overpass.util.https('/goos/initDetailGoos' + overpass.global.ext), pin);
			}// 내 쇼핑 프로파일 등록(마이페이지)
			else if(slink == "MYSHOPPINGPROFILE"){
				overpass.util.go(overpass.util.https('/mypage/initMyShoppingProfile' + overpass.global.ext), pin);
			}//신구단 - MY PICK
			else if (slink == "DGMYPICK") {
				overpass.util.go(overpass.util.https('/dg/initMypickDetail' + overpass.global.ext ), pin);
			}//신구단 - 배송서비스 신청
			else if(slink == "DGDELIREG"){
				overpass.util.go(overpass.util.https('/dg/delivery/initDgDeliReg' + overpass.global.ext ), pin);
			}//신구단 - 배송서비스 리스트
			else if(slink == "DGDELILIST"){
				overpass.util.go(overpass.util.https('/dg/delivery/initDgDeliList' + overpass.global.ext ), pin);
			}//여권정보확인
			else if(slink == "MYPSPTCONFIRM") {
				overpass.util.go(overpass.util.https('/mypage/initMyPsptConfirm' + overpass.global.ext), pin);
			}//마이페이지 쿠폰(PC)
			else if(slink == "MYBENEFITSCPN") {
				overpass.util.go(overpass.util.https('/mypage/initMyBenefitsCpn' + overpass.global.ext), pin);
			}// 내 쇼핑 프로필
			else if(slink == "MYSHOPPROFILE") {
				overpass.util.go(overpass.util.https('/mypage/initMyShoppingProfile' + overpass.global.ext), pin);
			}// 구매사은포인트 내역 (MG) 리워드
			else if(slink == "BUYINGPOINT") {
				overpass.util.go(overpass.util.https('/mypage/mg/initBuyingPoint' + overpass.global.ext), pin);
			}//마이페이지 적립금(PC)
			else if(slink == "MYBENEFITSSAVEAMT") {
				overpass.util.go(overpass.util.https('/mypage/initMyBenefitsSaveAmt' + overpass.global.ext), pin);
			}//마이페이지 MG - 빠른구매
			else if(slink == "MGFASTORDER"){
				overpass.util.go(overpass.util.https('/mypage/mg/initFastOrderList' + overpass.global.ext), pin);
			}// 3시간전
			else if(slink == "THREEHOURS") {
				overpass.util.go(overpass.util.https('/shop/initThreeHours' + overpass.global.ext), pin);
			}// 타임세일
			else if(slink == "TIMESALE") {
				overpass.util.go(overpass.util.https('/shop/initTimeSale' + overpass.global.ext), pin);
			}// 랭킹
			else if(slink == "RANKING") {
				overpass.util.go(overpass.util.https('/rank/initRanking' + overpass.global.ext), pin);
			}// 배송지확인 내역 (MG)
			else if(slink == "MGADDR") {
				overpass.util.go(overpass.util.https('/mypage/mg/initMgaddrList' + overpass.global.ext), pin);
			}// 제휴캐시
			else if(slink == "MYBENEFITSAFCASH") {
				overpass.util.go(overpass.util.https('/mypage/initMyBenefitsAfCash' + overpass.global.ext), pin);
			}// 고객센터 이벤트 당첨자 확인
			else if(slink == "GETWINNERRESULT"){
				overpass.util.go(overpass.util.https('/customer/getWinnerResult' + overpass.global.ext), pin);
			}//마이페이지 MG - 일괄구매
			else if(slink == "BUNDLEORDER"){
				overpass.util.go(overpass.util.https('/mypage/mg/initBundleOrderList' + overpass.global.ext), pin);
			}//재입고 알림 내역 상태 변경
			else if (slink == "REINPUTSTATUS") {
				overpass.util.go(overpass.util.https('/mypage/initReinGoosList' + overpass.global.ext), pin);
			}//마이페이지 결제할인포인트(PC)
			else if(slink == "MYBENEFITSPAYPOINT") {
				overpass.util.go(overpass.util.https('/mypage/initMyBenefitsPayPoint' + overpass.global.ext), pin);
			}//신디라이브러리(챗봇)
			else if(slink == "CINDY") {
				//overpass.util.go(overpass.util.https('http://dev-cb.ssgdfs.com/kr/' + overpass.global.ext), pin);
				//로그인 체크
				if(!overpass.fn.login.loginCheck()){
					overpass.util.go(overpass.util.https('/login/login' + overpass.global.ext), pin);
				}else{

					if(overpass.global.isApp){
						var message = {
							'group':'move',
							'function':'native',
							'args':
   		     					{
   		     					type: 'chatbot'
   		     					}
						}
						fnAppScheme(message);
					}else{
						var options = 'width=785, height=812, resizable=no';
						//window.open(overpass.util.go('http://dev-cb.ssgdfs.com/kr/', pin), "CINDY", options);
						//window.open('http://dev-cb.ssgdfs.com/kr/', 'CINDY', options);

						if(document.URL.indexOf("app.ssgdfs.com")> 0 ){
							overpass.service.chatbot = overpass.service.chatbot.replace( "www", "app");
						}
						chatbot = window.open(overpass.service.chatbot, '_blank', options);
					}
				}
			}//마이페이지 쿠폰사용가능브랜드
			else if(slink == "MYUSABLECPNBRAN") {
				overpass.util.go(overpass.util.https('/mypage/initBenefitsCpnUsableBran' + overpass.global.ext), pin);
			}//마이페이지 썸머니
			else if(slink == "MYSUMMONEY") {
				overpass.util.go(overpass.util.https('/mypage/initSumMoney' + overpass.global.ext), pin);
			}//마이페이지 쇼핑 프로필
			else if(slink == "MYPROFILE") {
				overpass.util.go(overpass.util.https('/mypage/initMyShoppingProfile' + overpass.global.ext), pin);
			}//신구단 공지사항 상세
			else if (slink == "DGNOTIDETAIL") {
				overpass.util.go(overpass.util.https('/dg/getNoti' + overpass.global.ext), pin);
			}//마이페이지 추가적립금(PC)
			else if(slink == "MYBENEFITSADDAMT") {
				overpass.util.go(overpass.util.https('/mypage/initMyBenefitsAddAmt' + overpass.global.ext), pin);
			}//마이페이지 썸머니(이벤트)(PC)
			else if(slink == "MYBENEFITSSUMEVENT") {
				overpass.util.go(overpass.util.https('/mypage/initMyBenefitsSumEvent' + overpass.global.ext), pin);
			}//묶은할인상품리스트
			else if(slink == "PKGGOOSLIST"){
				overpass.util.go(overpass.util.https('/goos/initPkgDcGoos' + overpass.global.ext), pin);
			}// 검색 엔진 결과
			else if(slink == "SEARCHUI"){
				overpass.util.go(overpass.util.https('/search/total' + overpass.global.ext), pin);
			}//당첨자 발표 리스트
			else if(slink == "WINLIST"){
				overpass.util.go(overpass.util.https('/customer/initCtEventList' + overpass.global.ext), pin);
			}//당첨자 발표 상세(김희은)
			else if(slink == "WINLDETAIL"){
				overpass.util.go(overpass.util.https('/customer/getWinnerResult' + overpass.global.ext), pin);
			}
			//공지사항 리스트
			else if(slink == "NOTILIST"){
				overpass.util.go(overpass.util.https('/customer/initNotice' + overpass.global.ext), pin);
			}//DG - 빠른구매
			else if(slink == "DGFASTORDER"){
				overpass.util.go(overpass.util.https('/dg/initFastOrderList' + overpass.global.ext), pin);
			}//오마이갓딜
			else if(slink == "OMYGODDEAL"){
				overpass.util.go(overpass.util.https('/shop/initOmyGodDealMain' + overpass.global.ext), pin);
			}//스마트 픽 카트
			else if(slink == "SPCART"){
				overpass.util.go(overpass.util.https('/customer/initCtSmartPickCart' + overpass.global.ext), pin);
			}//세일 전체보기
			else if(slink == "SALEALLVIEW"){
				overpass.util.go(overpass.util.https('/shop/initSaleAllView' + overpass.global.ext), pin);
			}//오마이갓딜
            else if(slink == "OMYGODDEAL"){
                overpass.util.go(overpass.util.https('/shop/initOmyGodDealMain' + overpass.global.ext), pin);
            }//고객센터 - 지점안내(지점)
			else if(slink == "PCSTORINFO"){
				overpass.util.go(overpass.util.https("/customer/initCtInfoStorIntro" + overpass.global.ext), pin);
			}//마케팅 수신동의 관리
			else if(slink == "MARKETINGAGREEMGMT"){
				overpass.util.go(overpass.util.https("/mypage/initMarketingAgreeMgmt" + overpass.global.ext), pin);
			}//라이브커머스 메인
			else if(slink == "LIVESHOP"){
				overpass.util.go(overpass.util.https("/live/initLiveShop" + overpass.global.ext), pin);
			}//라이브커머스 편성표
			else if(slink == "LIVEGUIDE"){
				overpass.util.go(overpass.util.https("/live/initLiveGuide" + overpass.global.ext), pin);
			}//라이브커머스 방송 상세
			else if(slink == "LIVEBDCTDETAIL"){
				overpass.util.go(overpass.util.https("/live/initLiveBroadcastDetail" + overpass.global.ext), pin);
			}//라이브커머스 기획전 상세
			else if(slink == "LIVEPLANDETAIL"){
				overpass.util.go(overpass.util.https("/live/initDetailLivePlan" + overpass.global.ext), pin);
			}//라이브커머스 VOD 상세
			else if(slink == "LIVEVODDETAIL"){
				overpass.util.go(overpass.util.https("/live/initLiveVodDetail" + overpass.global.ext), pin);
			}//신구단 메뉴
			else if(slink == "DGMENU"){
				overpass.util.go(overpass.util.https("/dg/initDgMenu" + overpass.global.ext), pin);
			}//공지사항 리스트(시스템 공지, 지점안내 공지)
			else if(slink == "NOTILISTSYS"){
					overpass.util.go(overpass.util.https('/customer/initSysNotice' + overpass.global.ext), pin);
			}//공지사항 상세(시스템 공지, 지점안내 공지)
			else if (slink == "NOTIDETAILSYS") {
					overpass.util.go(overpass.util.https('/customer/getNotiSys' + overpass.global.ext), pin);
			}//혜택 검색
			else if (slink == "BENESEARCH") {
					overpass.util.go(overpass.util.https('/event/getBenefitSearchPage' + overpass.global.ext), pin);
			}
		}
		//[END] LINK
	});

	//[START] DISPCTG 전시
	(function(){
		if ($.type(FN.disp) != "object") {
			FN.disp = {};
		};

		$.extend(FN.disp, {
			//카테고리 이동 하기
			goDispCtg: function(pin) {
				var param = $.param(pin);

				var form_attr = {
					method : overpass.global.isApp && overpass.global.app_cd == "10" ? "get" : "post"
				}

				if(pin.tr_yn && pin.tr_yn == 'Y') {
					overpass.tracking.fireClick(pin);
				} else {
					if(overpass.util.nvl(pin.lCate_nm) != ""){	//SEO 방식호출인 경우
						var lCateNm = pin.lCate_nm;	//대분류명
						var mCateNm = "0";				//중분류명
						var strPath = "";						//SEO경로

						if(overpass.util.nvl(pin.mCate_nm) != ""){	//중분류
							mCateNm = pin.mCate_nm
							strPath = lCateNm+"/"+mCateNm;
						}else{	//대분류
							strPath = lCateNm;
						}


						overpass.util.setFormSubmit(overpass.util.getUrl("/dispctg/ctg/"+strPath),pin,form_attr);
					}else if(overpass.util.nvl(pin.bran_nm) != ""){		//SEO 방식 브랜드 호출인 경우
						overpass.util.setFormSubmit(overpass.util.getUrl("/dispctg/brand/"+$.trim(pin.bran_nm)),pin, form_attr);
					}else{
						overpass.util.go(overpass.util.https('/dispctg/initDispCtg'+overpass.global.ext),pin);
					}
				}
			},
			//카테고리 경로 정보 불러오기
			fnCategoryPathInfo: function(pin) {
				$.ajax({
					url: overpass.util.getUrl("/dispctg/getDsDispCtgJson"),
					data: pin,
					type: "post",
					/*dataType: "json",*/
					success: function(data) {
						var form_attr = {
							method : overpass.global.isApp && overpass.global.app_cd == "10" ? "get" : "post"
						}
						if(data != "") {
							pin = $.extend(pin, { disp_type_cd: data.DISP_TYPE_CD, disp_ctg_sub_nm: data.DISP_CTG_SUB_NM});
							if(typeof pin.templ_type_cd != "undefined") data.TEMPL_TYPE_CD = pin.templ_type_cd;

							if("10" == data.TEMPL_TYPE_CD || "40" == data.TEMPL_TYPE_CD) {	//10:연결없음, 40:템플릿
								if(parseInt(data.DEPTH_NO) == 3) {
									overpass.util.setFormSubmit(overpass.util.getUrl("/dispctg/brand/"+pin.disp_ctg_sub_nm),pin, form_attr);
								} else if(parseInt(data.DEPTH_NO) == 4) {
									var branCateNm  = "category";
									if(overpass.util.nvl(data.DISP_CTG_SUB_NM) != ""){
										branCateNm = data.DISP_CTG_SUB_NM
									}
									overpass.util.setFormSubmit(overpass.util.getUrl("/dispctg/brand/"+pin.bran_nm+"/"+branCateNm),pin, form_attr);
								} else if(parseInt(data.DEPTH_NO) >= 5) {
									if("50" == data.DISP_TYPE_CD) {	//BTQ
										overpass.link("BTQBRANLOWCTG", {disp_ctg_no: pin.disp_ctg_no});
									} else if("40" == data.DISP_TYPE_CD) { //브랜드스토어
										overpass.link("BRANSTORELOWCTG", {disp_ctg_no: pin.disp_ctg_no});
									}
								}
							}else if("20" == data.TEMPL_TYPE_CD && (data.LINK_URL != null && data.LINK_URL != "")) {	//20:URL 이동
								//새창
								if("20" == data.LINK_FRAME_TYPE_CD) {
									window.open(data.LINK_URL);
								} else {
									window.location.href = data.LINK_URL;
								}
							}
						}else{
							if(overpass.util.nvl(pin.bran_nm) != ""){		//SEO 방식 브랜드 호출인 경우
								overpass.util.setFormSubmit(overpass.util.getUrl("/dispctg/brand/"+$.trim(pin.bran_nm)),pin, form_attr);
							}
						}
					},
					error: function(e) {
						if(e != undefined && e.error_message != ""){
							overpass.alert(e.error_message);
						}
					}
				});
			},
			fnWishContents: function(rel_no, rel_divi_cd, btn, clss) {
				var items = [];
				items.push({
					rel_no : rel_no
				});
				overpass.fn.add.addWish({
					rel_divi_cd : rel_divi_cd, //10: 상품, 20: 브랜드, 30: 행사, 40 : 컨텐츠
					items : items,
					isMsgShow : true,
					btn : $(btn)
				});
				//class명이 관리되어야 하는 케이스
				if(typeof clss != "undefined") {
					if($(btn).hasClass(clss))	$(btn).removeClass(clss);
					else 						$(btn).addClass(clss)
				}
			},
			//배너 이동 하기
			goBannerDetail: function(pin) {
				var param = $.param(pin);
				if(overpass.util.nvl(pin.conts_form_cd) != "") {
					//컨텐츠:배너
					if(pin.conts_form_cd  == "130") {
						//상품
						if(pin.link_type_cd == "20") {
							var seo_cont_nm = pin.seo_cont_nm.split(",");
							pin = $.extend(pin, { goos_cd: pin.url, bran_nm: seo_cont_nm[0], lCate_nm: seo_cont_nm[1], mCate_nm: seo_cont_nm[2] });
							overpass.fn.goos.goDetail(pin);
						//통합컨텐츠
						} else if(pin.link_type_cd == "40") {
							overpass.link('EVENTDETAIL', {event_no: pin.url});
						//브랜드
						} else if(pin.link_type_cd == "50") {
							overpass.fn.disp.fnCategoryPathInfo({bran_nm: pin.seo_cont_nm});
						//카테고리
						} else if(pin.link_type_cd == "60") {
							var cate_nm = pin.seo_cont_nm.split(",");
							var lCate_nm = cate_nm[0];
							var mCate_nm = cate_nm[1];

							if(($.type(lCate_nm) == "undefined" || lCate_nm == "") && ($.type(mCate_nm) == "undefined" || mCate_nm == "")) {
								overpass.fn.disp.goDispCtg({disp_ctg_no: pin.url});
							}  else {
								if(($.type(mCate_nm) == "undefined" || mCate_nm == "")) {
									overpass.fn.disp.goDispCtg({disp_ctg_no: pin.url, lCate_nm: lCate_nm});
								} else {
									overpass.fn.disp.goDispCtg({disp_ctg_no: pin.url, lCate_nm: lCate_nm, mCate_nm: mCate_nm});
								}
							}
						} else {
							if($.type(pin.url) == "undefined" || pin.url == "") {
								return;
							}

							var param = $.param(pin);
							overpass.util.go(pin.url, param);
						}

					//컨텐츠:브랜드이미지
					} else if(pin.conts_form_cd == "161"
								|| pin.conts_form_cd == "162"
								|| pin.conts_form_cd == "163"
								|| pin.conts_form_cd == "164") {
						if($.type(pin.url) == "undefined" || pin.url == "") {
							if($.type(pin.seo_cont_nm) != "undefined" && pin.seo_cont_nm != "") {
								overpass.fn.disp.fnCategoryPathInfo({bran_nm: pin.seo_cont_nm});
							}
						} else {
							var param = $.param(pin);
							overpass.util.go(pin.url, param);
						}

					//컨텐츠:통합컨텐츠
					} else if(pin.conts_form_cd == "190"
								|| pin.conts_form_cd == "191"
								|| pin.conts_form_cd == "192"
								|| pin.conts_form_cd == "193") {
						if($.type(pin.url) == "undefined" || pin.url == "") {
							overpass.link('EVENTDETAIL', {event_no: pin.move_cont_no});
						} else {
							var param = $.param(pin);
							overpass.util.go(pin.url, param);
						}
					}
				}
			},
			//메인공지팝업 호출
			mainNotiPop: function(cookie) {
				var html = "<button type=\"button\" class=\"btPopup\" aria-haspopup=\"true\" onclick=\"javascript:overpass.fn.disp.mainNotiPop();\" data-clicklog data-page=\"MAIN\" data-param1=\"HIS\">이벤트팝업 보기</button>";
				if(cookie == "Y") {
					$.ajax({
						url: overpass.util.getUrl("/main/getMainNotiListCount"),
						type: "POST",
						dataType: "JSON",
						success: function(data) {
							if(data.count > 0) {
								if($("#asideWrap .btFloating .btRight .btPopup").length == 0) $("#asideWrap .btFloating .btRight").append(html);
							}
						}
					});
				}else{
					overpass.layer.createLayer({
						action: overpass.util.getUrl("/main/getMainNotiList"),
						success: function(data) {
							if(data.length > 0) {
								if($("#asideWrap .btFloating .btRight .btPopup").length == 0) $("#asideWrap .btFloating .btRight").append(html);
								$("#layerPopup_notichk").click(function() {
									overpass.util.setCookie({
										name: "notiLyr",
										value: "Y",
										age: 0,
										ageType: "toDay"
									});
									LayerPopup.close("#layerPopup");
								});
								$(".notiPop button.closeL").click(function() {
									//최초 닫기일 때만 세션만 유지되는 쿠키 생성
									if(overpass.util.getCookie("notiLyr") != "Y") {
										overpass.util.setCookie({
											name: "notiLyr",
											value: "Y"
										});
									}
									LayerPopup.close("#layerPopup");
								})
							}
						}
					});
				}
			}
		});
	})();
	//[END] DISPCTG

	//상품
	(function(){
		if ($.type(FN.goos) != "object") {
			FN.goos = {};
		};

		// [START] GOOS
		$.extend(FN.goos, {
			/*
			 * [필수파라미터] goos_cd, bran_nm, lCate_nm, mCate_nm
			 * [선택파라미터] target:'' ===> '_blank':새 창으로.
			 * post 방식으로 변경하면서 새창적용 안함. 필요시 추가 2020.11.20 lhs
			 */
			//상품상세이동
			goDetail : function(pin) {
				var form_attr = {
						method : overpass.global.isApp && overpass.global.app_cd == "10" ? "get" : "post"
					}; //안드로이드에서는 페이지 이동시 get방식으로 넘겨야한다.

				if(overpass.util.nvl(pin.goos_cd) != ""){

					var branNm = "0";
					var lCateNm = "0";
					var mCateNm = "0";

					if(overpass.util.nvl(pin.bran_nm) != ""){
						branNm = pin.bran_nm
					}
					if(overpass.util.nvl(pin.lCate_nm) != ""){
						lCateNm = pin.lCate_nm
					}
					if(overpass.util.nvl(pin.mCate_nm) != ""){
						mCateNm = pin.mCate_nm
					}

					//연령인증제한상품 체크
					if(pin.limit_age_yn == "Y"){
						//로그인안했으면 로그인레이어 or 로그인페이지 이동
						if(!overpass.fn.login.loginCheck()){
							//PC
							if(overpass.global.chnl_cd == "10"){
								overpass.fn.login.lyrLogin({adtAuthYn : "Y"});
							}
							//MOBILE, APP
							else{
								overpass.fn.login.isLogin({adtAuthYn : "Y"});
							}
						}else{
							//본인인증체크
							if("Y" == overpass.global.adt_auth_yn){
								overpass.util.setFormSubmit(overpass.util.getUrl("/goos/view/"+branNm+"/"+lCateNm+"/"+mCateNm+"/"+pin.goos_cd),pin, form_attr);
							}
							//본인인증확인여부 체크
							else{
								overpass.confirm(overpass.message("goos.valid.check02"), function(){
									overpass.link('ADTAUTHPAGE');
								});
							}
						}
					}else{
						overpass.util.setFormSubmit(overpass.util.getUrl("/goos/view/"+branNm+"/"+lCateNm+"/"+mCateNm+"/"+pin.goos_cd), pin, form_attr);
					}
				}
			},
			/*
			 * 장바구니 담기
			 * [필수파라미터] goos_cd
			 * [선택파라미터] sale_shop_divi_cd, sale_shop_no, sale_area_no, conts_dist_no
			 */
			addCart : function(pin){
				pin  = $.extend({ord_qty : 1, cart_divi_cd : "10"}, pin);

				if(pin.id != undefined && pin.id != ""){
					var ord_qty = $("#"+ pin.id).val();
					if($.type(ord_qty) != "number" && $.type(Number(ord_qty)) != "number") ord_qty = 1;
					pin.items[0].ord_qty = ord_qty;
				}

				//로그인 체크
				if(!overpass.fn.login.loginCheck()){
					//PC
					if(overpass.global.chnl_cd == "10"){
						overpass.fn.login.lyrLogin();
					}
					//MOBILE, APP
					else{
						overpass.fn.login.isLogin();
					}
					return;
				}

				var items = pin.items;
				if(items == undefined){
					items = [pin];
				}

				overpass.fn.add.addCart({
					cart_divi_cd: pin.cart_divi_cd,
					items: items,
					callback : function(){
						if(overpass.global.chnl_cd != "10"){
							//"장바구니에 담겼습니다."
							overpass.toast(overpass.message("cart.list.name09"), function(){
								if(pin.callback != undefined && $.type(pin.callback) == "function"){
									pin.callback();
								}
							});
						}else{
							var button = $(pin.button);
							var cartMotion = button.parents(".prodCont").find(".cartMotion");
							if(cartMotion.length > 0){
								cartMotion.show();
							}else{
								//"장바구니에 담겼습니다."
								overpass.toast(overpass.message("cart.list.name09"), function(){
									if(pin.callback != undefined && $.type(pin.callback) == "function"){
										pin.callback();
									}
								});
							}
						}
					}
				});
			},
			//이미지 태그 삭제
			removeImgTag : function(img){
				$(img).remove();
			},
			//연관 이미지
			imageSearch : function(imgUrl) {
				return location.href = overpass.util.getUrl("/search/img/initCorrImageView?path=icon&imgUrl=") + imgUrl;
			}
		});
		// [END] GOOS
	})();


	//파일
	(function(){
		if ($.type(FN.file) != "object") {
			FN.file = {};
		};

		// [START] GOOS
		$.extend(FN.file, {

			/*
			  파일선택시 미리보기 노출
			  param : input: 업로드객체, fileType: 업로드가능유형, fileSize: 업로드가능용량 메가단위
			  sample: {input : this, 'fileType': '10,20,30', 'fileSize' : '10'}
			  			1. fileType
			              이미지, 동영상만 가능한 경우 : '10,20'
			              이미지, 파일만 가능한 경우 : '10,20'
			              이미지, 파일, 동영상 모두 가능한 경우 : '' or  '10,20,30'
			            2. fileSize : null 인 경우 기본 10메가 설정
			 */
			fnFileUploadPreView : function(p) {

				var input = p.input;

				if ($(input).val() != "") {

					var uploadType = overpass.util.nvl(p.fileType);

					var allowFileExt = "";	//업로드 가능확장자
					var fileExt = $(input).val().split('.').pop().toUpperCase();	//첨부파일 확장자

					if(uploadType == ""){	//이미지, 동영상, 문서
						allowFileExt = overpass.upload.file_ext_img+","+overpass.upload.file_ext_video+","+overpass.upload.file_ext_text;
					}else{
						if(uploadType.indexOf(overpass.upload.file_type_img) > -1){	//이미지
							allowFileExt = allowFileExt +(allowFileExt != ""?",":"")+overpass.upload.file_ext_img;
						}
						if(uploadType.indexOf(overpass.upload.file_type_video) > -1){// 동영상
							allowFileExt = allowFileExt +(allowFileExt != ""?",":"")+overpass.upload.file_ext_video;
						}
						if(uploadType.indexOf(overpass.upload.file_type_text) > -1){// 파일
							allowFileExt = allowFileExt +(allowFileExt != ""?",":"")+overpass.upload.file_ext_text;
						}
					}

					var arrFileExt = allowFileExt.split(",");	//업로드가능여부 체크용 확장자
					var fileType ;	//업로드파일유형

					var btn = $(input).closest(".cont").find("button.del");

					//파일별 업로드 확장자 제한 체크
					if($.inArray(fileExt, arrFileExt) == -1) {
						overpass.alert(overpass.message('event.bbs.file.fileext', allowFileExt)); /*{overpass.upload.file_ext_text} 파일만 업로드 할 수 있습니다.*/
						$(input).val(null); //남아있는 file 정보 삭제
						overpass.fn.file.fnDelFileUploadPreView(btn);
						return;
					}

					var fileType = "";

					if($.inArray(fileExt, overpass.upload.file_ext_img.split(",")) != -1) {
						fileType = overpass.upload.file_type_img;
					}else if($.inArray(fileExt, overpass.upload.file_ext_video.split(",")) != -1) {
						fileType = overpass.upload.file_type_video;
					}else if($.inArray(fileExt, overpass.upload.file_ext_text.split(",")) != -1) {
						fileType = overpass.upload.file_type_text;
					}

					if(fileType != "") {
						var fileMaxMbSize = overpass.upload.maxsize_default;
						if(p.fileSize != undefined && !isNaN(Number(p.fileSize))) {
							fileMaxMbSize = Number(p.fileSize);
						} else {
							if(fileType == overpass.upload.file_type_img) {
								fileMaxMbSize = overpass.upload.maxsize_img;
							} else if(fileType == overpass.upload.file_type_video) {
								fileMaxMbSize = overpass.upload.maxsize_vod;
							} else if(fileType == overpass.upload.file_type_text) {
								fileMaxMbSize = overpass.upload.maxsize_text;
							}
						}

						//파일별 업로드 사이즈제한 체크
						if(input.files[0].size > (fileMaxMbSize*1024*1024)){
							overpass.alert(overpass.message('event.bbs.file.filesize', fileMaxMbSize));
							$(input).val(null);
							overpass.fn.file.fnDelFileUploadPreView(btn);
							return;
				        }

						$(input).closest(".cont").find("button").show();

						var tObj = $(input).closest("[id^=uploadCont]");

						if(fileType == overpass.upload.file_type_img) { // 이미지
							tObj.find("figure").attr("class","img");
							tObj.find("figure").show();
							var preImg = $(input).parent().find();
							var reader = new FileReader();
							reader.onload = function (e) {
								$(input).closest(".cont").find("figure.img img").attr('src', e.target.result);
							};
							reader.readAsDataURL(input.files[0]);
						} else if(fileType == overpass.upload.file_type_video) { // 동영상
							tObj.find("figure").hide();
							tObj.attr("class", "cont vod");
						} else if(fileType == overpass.upload.file_type_text) { // 문서
							var fileValue = $(input).val().split("\\");
							var fileNm = fileValue[fileValue.length-1];
							tObj.find("figure").hide();
							tObj.attr("class", "cont txt");
							tObj.find("p[name='fileNm']").text(fileNm);
							tObj.find("p[name='fileNm']").show();
						}
					}

				}
			},
			// 이미지/문서첨부 파일 삭제
			fnDelFileUploadPreView : function(obj){
				obj.hide();
				var fileDiv = obj.closest(".cont");
				fileDiv.find("figure").attr("class", "img");
				fileDiv.find("figure.img").show();
				fileDiv.find("img").attr("src", null);
				fileDiv.find("figure").attr("style", "display:none;");
				fileDiv.find("p[name=fileNm]").hide();
				fileDiv.find("p[name=fileNm]").text("");
				fileDiv.find("input[type='file']").val(null);
				if(fileDiv.attr("class") != "cont") {
					fileDiv.attr("class", "cont");
				}
			},
		});
		// [END] FILE
	})();

	//HISTORY
	(function(){
		var running = false; // (중복방지)do nothing
		if ($.type(FN.history) != "object") {
			FN.history = {};
		};
		/**
		 * parameter => {rel_divi_cd : "", list: [{rel_no: "", recent_conts_no: ""}, {rel_no: "", recent_conts_no: ""}]}
		 */
		$.extend(FN.history, {
			deleteHistory: function(pin){
				if(running === true){
					return false;
				}
				running = true;

				var p = $.extend({
					rel_divi_cd: "",
					list: []
				}, pin);

				(function(){
					var list = [];
					if ($.isArray(p.list) !== true || p.list.length == 0) {
						throw "정보가 없습니다.";
					}
					$.each(p.list, function(idx, o) {
						list.push($.extend({
							rel_divi_cd : o.rel_divi_cd == undefined ? p.rel_divi_cd : o.rel_divi_cd, //10: 상품, 20: 검색어, 30: 행사, 40: 브랜드, 50: 카테고리
							rel_no: "",
							recent_conts_no: ""
						}, o));
					});

					p.list = list;
				})();

				$.ajax({
					url: overpass.util.getUrl("/history/deleteHistory"),
					type: "POST",
					dataType: "JSON",
					data: { history_data: JSON.stringify(p.list) },
					success: function(data) {
						if(data.ret_code == "S"){
							if($.isFunction(pin.callback)){
								pin.callback();
							}
						}else{
							if(data.ret_msg != ""){
								overpass.alert(data.ret_msg);
							}
						}
					},
					error: function(e) {
						if(e == undefined || e.error_message == undefined){
							overpass.alert("삭제 중 오류가 발생하였습니다.");
						}else{
							overpass.alert(e.error_message);
						}
					},
					complete: function() {
						running = false;
					}
				});
			}
		});
	})();

	//LOCATION
	(function(){
		if ($.type(FN.location) != "object") {
			FN.location = {};
		};

		// [START] LOCATION
		$.extend(FN.location, {
			// 가까운 지점찾기
			getNearStor : function(storPosition, callback) {
				var resultData = {code : '', message : '', latitude : '', longitude : '' };
				var getLang = window.location.href;

				if (navigator.geolocation) { // GPS를 지원하면
					// 현재 위치 정보를 가져온다.
					navigator.geolocation.getCurrentPosition(
						function(position) {
							resultData.code = "S";
							resultData.latitude = position.coords.latitude;
							resultData.longitude = position.coords.longitude;
							resultData.mindif = 5;
							//resultData.message = storPosition[0][0];

							for(var i in storPosition){
								var type = storPosition[i][1];
								if(type == "10"){
									//좌표로 찾기
									overpass.fn.location.fnPointNearStor(storPosition[i], resultData);
								} else {
									//구역으로 찾기
									overpass.fn.location.fnZoneNearStor(storPosition[i], resultData);
								}
							}

							callback(resultData);
						},
						function(error) {
								resultData.code = 'F';
								resultData.message = overpass.fn.location.displayError(error);
								callback(resultData);
						},
						{
							enableHighAccuracy: false,
							maximumAge: 0,
							timeout: Infinity
						}
					);
				} else {
					resultData.code = 'F';
					resultData.message = 'GPS를 지원하지 않습니다';
					callback(resultData);
				}
			},

			// 가까운 지점찾기(앱)
			getNearStorApp : function(resultData, storPosition, callback) {
				if (resultData.latitude != 0) { // GPS를 지원하면
					// 현재 위치 정보를 가져온다.
					resultData.code = "S";
					resultData.mindif = 5;

					for(var i in storPosition){
						var type = storPosition[i][1];
						if(type == "10"){
							//좌표로 찾기
							overpass.fn.location.fnPointNearStor(storPosition[i], resultData);
						} else {
							//구역으로 찾기
							overpass.fn.location.fnZoneNearStor(storPosition[i], resultData);
						}
					}
					callback(resultData);
				} else {
					resultData.code = 'F';
					resultData.message = 'GPS를 지원하지 않습니다';
					callback(resultData);
				}
			},

			// 가까운 지점코드를 구함(좌표)
			fnPointNearStor: function(storPosition,resultData) {
				// 사용자의 위치와 지점 사이의 거리를 얻습니다.
				var distance = overpass.fn.location.computeDistance(resultData.latitude, resultData.longitude, storPosition[2], storPosition[3]);

				// 가장 짧은 거리값
				if ( resultData.mindif >= distance ) {
					resultData.mindif = distance;		// 가장 가까운 거리
					resultData.message = storPosition[0];
				}

				return resultData;
			},

			// 가까운 지점코드를 구함(구역)
			fnZoneNearStor: function(storPosition,resultData) {
				if(
				  (resultData.latitude <= storPosition[2] && resultData.longitude >= storPosition[3]) &&
				  (resultData.latitude <= storPosition[4] && resultData.longitude <= storPosition[5]) &&
				  (resultData.latitude >= storPosition[6] && resultData.longitude >= storPosition[7]) &&
				  (resultData.latitude >= storPosition[8] && resultData.longitude <= storPosition[9])
				){
					resultData.message = storPosition[0];
				}

				return resultData;
			},

			displayError : function(error) {
				var errorTypes = {
					0: "알 수 없는 오류",
					1: "사용자가 권한 거부",
					2: "위치를 찾을 수 없음",
					3: "요청 응답 시간 초과"
				};
				var errorMessage = errorTypes[error.code];
				if (error.code == 0 || error.code == 2) {
					errorMessage = errorMessage + " " + error.message;
				}
				return errorMessage;
			},

			// 호도각(degress)각도에서 라디안(radians) 값으로 변환
			degreesToRadians : function(degress) {
				  radians = (degress * Math.PI)/180;
			    return radians;
			},

			// 구면 코사인 법칙(Spherical Law of Cosine) 으로 두 위도/경도 지점의 거리를 구함
			computeDistance : function(latitude1, longitude1, latitude2, longitude2) {

			    var startLatRads = overpass.fn.location.degreesToRadians(latitude1);
			    var startLongRads = overpass.fn.location.degreesToRadians(longitude1);
			    var destLatRads = overpass.fn.location.degreesToRadians(latitude2);
			    var destLongRads = overpass.fn.location.degreesToRadians(longitude2);

			    var Radius = 6371; //지구의 반경(km)
			    var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) +
			                   Math.cos(startLatRads) * Math.cos(destLatRads) *
			                   Math.cos(startLongRads - destLongRads)) * Radius;

			    return distance;	// 반환 거리 단위 (km)
			},

		});
		// [END] LOCATION

	})();

})(jQuery);