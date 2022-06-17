;(function($){
	
	(function(){
		if (overpass.layer == undefined) {
			overpass.layer = {};
		}
	})();
	
	$.extend(overpass, {
		alert: function(m,f){
			
			var p = {
				data: {
					msg: "",
					msg_dtl: "",
					btn2 : {
						msg : overpass.message("common.word.confirm")
					},
					close : function(layer){
						$(layer).parents("[name=alertBox]").next("div").remove();
						$(layer).parents("[name=alertBox]").remove();
					}
				}
			};
			
			if($.type(m) === "object"){
				if($.isEmptyObject(m.data)){
					$.extend(p.data, m || {});
				}else{
					$.extend(p.data, m.data || {});
				}
				
				if(!$.isEmptyObject(p.data.msg_dtls)){
					$.each(p.data.msg_dtls, function(idx, msg){
						if(p.data.msg_dtl != ""){
							p.data.msg_dtl += "<br>";
						}
						p.data.msg_dtl += msg;
					});
					delete p.data.msg_dtls;
				}
			}else if($.type(m) === "string"){
				p.data.msg = m;
				if($.isFunction(f)){
					p.data.btn2.callback = f;
				}
			}
			
			overpass.layer.createConfirmLayer(p);
		},
		confirm: function(m,f){
			var p = {
				data: {
					msg: "",
					msg_dtls: [],
					btn1 : {
						msg : overpass.message("common.word.cancel")
					},
					btn2 : {
						msg : overpass.message("common.word.confirm")
					},
					close : function(layer){
						$(layer).parents("[name=alertBox]").next("div").remove();
						$(layer).parents("[name=alertBox]").remove();
					}
				}
			};
			
			if($.type(m) === "object"){
				if($.isEmptyObject(m.data)){
					m.btn1 = $.extend(p.data.btn1, m.btn1);
					m.btn2 = $.extend(p.data.btn2, m.btn2);
					$.extend(p.data, m || {});
				}else{
					m.data.btn1 = $.extend(p.data.btn1, m.data.btn1);
					m.data.btn2 = $.extend(p.data.btn2, m.data.btn2);
					$.extend(p.data, m.data || {});
				}
				
				if(!$.isEmptyObject(p.data.msg_dtls)){
					$.each(p.data.msg_dtls, function(idx, msg){
						if(p.data.msg_dtl != ""){
							p.data.msg_dtl += "<br>";
						}
						p.data.msg_dtl += msg;
					});
					delete p.data.msg_dtls;
				}
			}else{
				p.data.msg = m;
				if($.isFunction(f)){
					p.data.btn2.callback = f;
				}
			}
			overpass.layer.createConfirmLayer(p);
		},
		toast : function(msg, callback, p){
			p = $.extend({} , p);
			var layerPopupContainer = $("#layerPopupContainer");
			var toast_id = (p.toast_id != undefined && p.toast_id != "") ? p.toast_id : "toastBox";
			var toast_type = (p.toast_type != undefined && p.toast_type != "") ? p.toast_type : "";
			var toast_class= (p.toast_class != undefined && p.toast_class != "") ? p.toast_class : "";
			
			if($("#" + toast_id).length > 0){
				$("#" + toast_id).remove();//이미 있는 토스트 메시지 삭제
			}
			
			$.ajax({
				url : overpass.util.getUrl("/common/initToast"),
				dataType : "html",
				type : "GET",
				data : { toast_id : toast_id, msg : msg, toast_type : toast_type, img_path : p.img_path, toast_class : toast_class},
				error : function(e){
					console.log("TOAST ERROR : " + e);
				}
			}).done(function(html){
				$(".mypickMessagePop").remove();
				layerPopupContainer.before(html);
				
				//4초뒤에 콜백 실행
				if($.isFunction(callback)){
					setTimeout(function(){
						callback();
					}, 4000)
				}
			});
		}
	});
	
})(jQuery);