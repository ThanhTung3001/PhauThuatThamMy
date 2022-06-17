(function($, window) {
    // 가로 스크롤 생성 여부 체크
    $.fn.hasHorizontalScrollBar = function() {
        return this.get(0) ? this.get(0).scrollWidth - 3 >= this.innerWidth() : false;
    }

    // 세로 스크롤 생성 여부 체크
    $.fn.hasVerticalScrollBar = function() {
        return this.get(0) ? this.get(0).scrollHeight - 3 >= this.innerHeight() : false;
    }

    // 개발연동시 기본 셀렉트 변경후 디자인 셀렉트 반영
    $.fn.seletMenuUpdate = function(def) {
        var parent = this.parent();
        parent.attr('first', true);
        if(def === true){
        	parent.find(".ui-selectmenu-button").addClass("ui-selectment-button-default");
        }else{
        	parent.find(".ui-selectmenu-button").removeClass("ui-selectment-button-default");
        }
        parent.find(".ui-menu").off("mousewheel DOMMouseScroll");
        parent.find(".ui-menu").off("scroll");
        parent.find(".scrollbar").off("mousedown");
        parent.find('.scrollbar-wrap').remove();
        this.customSelect("refresh");
    }

    $(function() {
        // Support: jQuery <1.8
        if (!$.fn.addBack) {
            $.fn.addBack = function(selector) {
                return this.add(selector == null ?
                    this.prevObject : this.prevObject.filter(selector)
                );
            };
        }

        // jquery ui 커스텀 셀렉트

        var t = $;
        var selectMenu = {
            init: function() {

                var agent = navigator.userAgent.toLowerCase();
                var ieTest = ((navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1)) ? true : false;
                // var ieTest = false;
                var customSelect = {}

                customSelect._setAria = function(item) {
                    var id = this.menuItems.eq(item.index).attr("id");
                    var ariaObj = {
                        "aria-labelledby": id
                    }

                    //ie Accessibility
                    if (!ieTest) {
                        ariaObj["aria-activedescendant"] = id;
                        this.menu.attr("aria-activedescendant", id);
                    }
                    this.button.attr(ariaObj);
                    //ie Accessibility
                }

                customSelect._buttonEvents = {}
                customSelect._buttonEvents.click = function(event) {
                	this.element.data("selectedIndex", this.element.prop("selectedIndex"));
                	
                    //ie Accessibility
                    var button = $(this.button);
                    if (!button.data('buttonObj')) {

                        var obj = {
                            timer: null,
                            opend: false
                        }
                        button.data('buttonObj', obj)
                    }

                    var obj = button.data('buttonObj');
                    if (!obj.opend) {
                        obj.opend = true;
                        obj.timer = setTimeout(function() {
                            obj.opend = false;
                        }, 1000)

                        this._setSelection();
                        this._toggle(event);
                    }
                    //ie Accessibility
                }

                customSelect._drawButton = function() {
                    // 추가 : 셀렉트 박스 메세지
                    if (this.element.attr('data-msg')) {
                    	var ss = " selected";
                    	if(this.element.find("option[selected]").length > 0){
                    		ss = "";
                    	}
                        this.element.prepend('<option value="" hidden' + ss + '>' + this.element.attr('data-msg') + '</option>');
                        this.element[0].selectedIndex = 0;
                    }

                    var e, i = this,
                        s = this._parseOption(this.element.find("option[selected]"), this.element[0].selectedIndex);
                    this.labels = this.element.labels().attr("for", this.ids.button),
                        this.element.hide(),
                        this.button = t("<button>", {
                            tabindex: this.options.disabled ? -1 : 0,
                            id: this.ids.button,
                            role: "combobox",
                            "aria-expanded": "false",
                            "aria-autocomplete": "list",
                            "aria-owns": this.ids.menu,
                            "aria-haspopup": "true",
                            "type" : "button",
                            title: this.element.attr("title")
                        }).insertAfter(this.element),
                        this._addClass(this.button, "ui-selectmenu-button ui-selectmenu-button-closed"), 
                        this.buttonItem = this._renderButtonItem(s).appendTo(this.button),
                        this.options.width !== !1 && this._resizeButton(),
                        this._on(this.button, this._buttonEvents),
                        this.button.one("focusin", function() {
                            i._rendered || i._refreshMenu()
                        })
                        if (this.element.attr('data-msg') && this.element[0].selectedIndex == 0){
                        	this.button.addClass("ui-selectment-button-default");
                        }

                    //.ui-selectmenu-text > 텍스트 구분자 태그 적용
                    var htmlText = this._fnMultiTxt(s.label, this.element.find("option:selected").attr('class'));
                    this.buttonItem.html(htmlText);
                    // 표시할 텍스트가 없으면 첫번째 옵션 표시
                    if(this.buttonItem.html() == ""){
                    	this.buttonItem.html(this.element.find('option').eq(0).text());
                    }

                    var ooo = this.element.find("option:selected");
                    var pre = ooo.data("prefix");//s.element.data("prefix");
                    if(typeof(pre) == "string" && pre.length > 0){
                    	this.button.prepend('<span class="prefix">' + pre + '</span>');
                    }
                    
                	var txt = ooo.data("multitext");//s.element.data("multitext");
	                if(typeof(txt) == "string" && txt.length > 0){
	                	txt = replaceURL(txt);
	                	this.button.prepend('<span class="option" ' + txt + '></span>')
	                	this.button.removeClass("ui-no-option");
	                }else{
	                	this.button.addClass("ui-no-option");
	                }
	                if(this.element.val() == ""){
	                	this.button.addClass("ui-default-option");
	                }

	                if(!this.element.find("option[selected]").is("[hidden]")){
	                	this.button.removeClass("ui-default-option ui-selectment-button-default");
	                }
                    
                    
                    var idx1 = this.element.prop("selectedIndex"),
                    	idx2 = this.element.find("option[selected]").index();
                    if(idx1 != idx2){
                    	this.element.prop("selectedIndex", idx2);
                    }
                }

                //option > 텍스트에 구분자를 지정하여 <span 태그로 래핑 
                customSelect._fnMultiTxt = function(label, clNm) {
                    var optMultiTxt = this.element.attr('data-multiText');
                    var textArr = (optMultiTxt === undefined) ? [label] : label.split(optMultiTxt);
                    var classArr = (clNm === undefined) ? [] : clNm.split(' ');
                    var htmlText = "";
                    if ($(textArr).length > 1) {
                        $(textArr).each(function(idx) {
                            cls = (classArr[idx] !== undefined) ? classArr[idx] : '';
                            htmlText += '<span' + ((classArr.length !== 0) ? ' class="' + cls + '"' : '') + '>' + textArr[idx] + '</span>';
                        });
                    } else {
                        htmlText = textArr[0];
                    }
                    return htmlText;
                }

                // list render
                customSelect._renderItem = function(ul, item) {
                    var li = $("<li>"),
                		txt = item.element.data("multitext"),
                		pre = item.element.data("prefix");

                    var link = item.element.data("link");
                    if(typeof(link) == "string"){
                    	li.data("link", link);
                    }
                    
                    // .ui-menu-item > 텍스트 구분자 태그 적용
                    var htmlText = this._fnMultiTxt(item.label, item.element.attr('class'));

                    // 첫 실행 시에 선택값 적용하기
                    var opt = {
                        html: htmlText
                    };
                    if(item.element.is("[selected]") || item.value == this.element.val()){
                    	opt["aria-selected"] = "true";
                    }
                    var wrapper = $("<button>", opt);
                    
                    if(typeof(pre) == "string" && pre.length > 0){
                    	wrapper.prepend('<span class="prefix">' + pre + '</span>');
                    }
                    
                    if(typeof(txt) == "string" && txt.length > 0){
                    	txt = replaceURL(txt);
                    	wrapper.prepend('<span class="option" ' + txt + '></span>');
                    	li.removeClass("ui-no-option");
	                }else{
	                	li.addClass("ui-no-option");
                    }


                    if (item.disabled) {
                        li.addClass("ui-state-disabled");
                    }

                    // 추가 : 셀렉트 박스 메세지
                    if (item.element.attr('hidden')) {
                        li.css('display', 'none');
                    }
                    
                    var action = item.element.data("action");
                    if(typeof(action) != "undefined"){
                    	if(typeof(action.name) != "undefined" && typeof(action.func) != "undefined"){
                    		var str = '<button class="ui-action-button"';
                    		str += ' onclick=\'' + action.func + '\'';
                    		str += '>' + action.name + '</button>';
                    		li.append(str);
                    	}
                    }

                    return li.prepend(wrapper).appendTo(ul);
                }
                
                customSelect._drawMenu = function() {
                    var that = this;

                    // Create menu
                    this.menu = $("<ul>", {
                        "aria-hidden": "true",
                        "aria-labelledby": this.ids.button,
                        id: this.ids.menu
                    });

                    // Wrap menu
                    this.menuWrap = $("<div>").append(this.menu);
                    this._addClass(this.menuWrap, "ui-selectmenu-menu", "ui-front");
                    this.menuWrap.appendTo(this._appendTo());

                    // Initialize menu widget
                    this.menuInstance = this.menu
                        .menu({
                            classes: {
                                "ui-menu": "ui-corner-bottom"
                            },
                            role: "listbox",
                            select: function(event, ui) {
                                event.preventDefault();

                                // Support: IE8
                                // If the item was selected via a click, the text selection
                                // will be destroyed in IE
                                
                                if(that.element.get(0).selectedIndex != ui.item.index()){
                                	var link = ui.item.data("link");
                                	if(typeof(link) == "string"){
                                		location.href = link;
                                	}
                                }

                                that._setSelection();
                                that._select(ui.item.data("ui-selectmenu-item"), event);
                            },
                            focus: function(event, ui) {
                                var item = ui.item.data("ui-selectmenu-item");

                                // Prevent inital focus from firing and check if its a newly focused item
                                if (that.focusIndex != null && item.index !== that.focusIndex) {
                                    that._trigger("focus", event, {
                                        item: item
                                    });
                                    if (!that.isOpen) {
                                        that._select(item, event);
                                    }
                                }
                                that.focusIndex = item.index;

                                //ie Accessibility
                                if (!ieTest) {
                                    that.button.attr("aria-activedescendant", that.menuItems.eq(item.index).attr("id"));
                                }
                                //ie Accessibility
                            }
                        })
                        .menu("instance");

                    // Don't close the menu on mouseleave
                    this.menuInstance._off(this.menu, "mouseleave");

                    // Cancel the menu's collapseAll on document click
                    this.menuInstance._closeOnDocumentClick = function() {
                        return false;
                    };

                    // Selects often contain empty items, but never contain dividers
                    this.menuInstance._isDivider = function() {
                        return false;
                    };
                }


                customSelect.close = function(event) {
                    if (!this.isOpen) {
                        return;
                    }

                    this.isOpen = false;
                    this._toggleAttr();

                    this.range = null;
                    this._off(this.document);

                    this._trigger("close", event);

                    //ie Accessibility
                    if ($(this.button).data('buttonObj')) {
                        $(this.button).data('buttonObj').opend = false;
                    }
                    $(this.button).focus()
                    //ie Accessibility
                }


                $.widget("custom.customSelect", $.ui.selectmenu, customSelect);

                var customMenu = {}
                customMenu.refresh = function() {
                    var menus, items, newSubmenus, newItems, newWrappers,
                        that = this,
                        icon = this.options.icons.submenu,
                        submenus = this.element.find(this.options.menus);

                    this._toggleClass("ui-menu-icons", null, !!this.element.find(".ui-icon").length);

                    // Initialize nested menus
                    newSubmenus = submenus.filter(":not(.ui-menu)")
                        .hide()
                        .attr({
                            role: this.options.role,
                            "aria-hidden": "true",
                            "aria-expanded": "false"
                        })
                        .each(function() {
                            var menu = $(this),
                                item = menu.prev(),
                                submenuCaret = $("<span>").data("ui-menu-submenu-caret", true);

                            that._addClass(submenuCaret, "ui-menu-icon", "ui-icon " + icon);
                            item
                                .attr("aria-haspopup", "true")
                                .prepend(submenuCaret);
                            menu.attr("aria-labelledby", item.attr("id"));
                        });

                    this._addClass(newSubmenus, "ui-menu", "ui-widget ui-widget-content ui-front");

                    menus = submenus.add(this.element);
                    items = menus.find(this.options.items);
                    // Initialize menu-items containing spaces and/or dashes only as dividers
                    items.not(".ui-menu-item").each(function() {
                        var item = $(this);
                        if (that._isDivider(item)) {
                            that._addClass(item, "ui-menu-divider", "ui-widget-content");
                        }

                        //ie Accessibility
                        item.on('click', function() {
                            that.focus('focus', item)
                        })
                        //ie Accessibility
                    });

                    // Don't refresh list items that are already adapted
                    newItems = items.not(".ui-menu-item, .ui-menu-divider");
                    newWrappers = newItems.children()
                        .not(".ui-menu")
                        .not(".ui-action-button")
                        .uniqueId()
                        .attr({
                            tabIndex: -1,
                            role: this._itemRole()
                        });
                    this._addClass(newItems, "ui-menu-item")
                        ._addClass(newWrappers, "ui-menu-item-wrapper");
                    // Add aria-disabled attribute to any disabled menu item
                    items.filter(".ui-state-disabled").attr("aria-disabled", "true");

                    // If the active item has been removed, blur the menu
                    if (this.active && !$.contains(this.element[0], this.active[0])) {
                        this.blur();
                    }

                }


                customMenu.focus = function(event, item) {
                	if(event == null){ return; }
                	
                    var nested, focused, activeParent;
                    this.blur(event, event && event.type === "focus");

                    this._scrollIntoView(item);

                    this.active = item.first();

                    focused = this.active.children(".ui-menu-item-wrapper");
                    this._addClass(focused, null, "ui-state-active");

                    // Only update aria-activedescendant if there's a role
                    // otherwise we assume focus is managed elsewhere

                    //ie Accessibility
                    if (this.options.role && ieTest) {
                        this.element.attr("aria-activedescendant", focused.attr("id"));
                    }
                    //ie Accessibility

                    // Highlight active parent menu item, if any
                    activeParent = this.active
                        .parent()
                        .closest(".ui-menu-item")
                        .children(".ui-menu-item-wrapper");
                    this._addClass(activeParent, null, "ui-state-active");

                    if (event && event.type === "keydown") {
                        this._close();
                    } else {
                        this.timer = this._delay(function() {
                            this._close();
                        }, this.delay);
                    }

                    nested = item.children(".ui-menu");
                    if (nested.length && event && (/^mouse/.test(event.type))) {
                        this._startOpening(nested);
                    }
                    this.activeMenu = item.parent();

                    this._trigger("focus", event, {
                        item: item
                    });
                }

                $.widget('custom.menu', $.ui.menu, customMenu)

            },
            
            update: function(target) {
                var select = target;
                if (select.data('selectBox')) {
                    select.customSelect("refresh");
                } else {

                    select.parent().attr('first', true);
                    var opt = {
                        appendTo: select.parent(),
                        
                        select: function(event, ui) {
                            select.trigger('select');
                            var list = select.parent().find('.ui-menu-item');
                            list.find('a').removeAttr('aria-selected');
                            list.eq(ui.item.index).find('a').attr('aria-selected', true);
                            
                            $(this).siblings(".ui-selectment-button-default").removeClass("ui-selectment-button-default");

                            //접근성 추가 : 포커스 이동
                            //select.closest('.selectWrap').find('.ui-selectmenu-text').eq(0).attr('tabindex', 0).focus();

                            //.ui-selectmenu-text 에 선택한 메뉴의 html 적용
                            var spanCnt = list.eq(ui.item.index).find('a>span').length;
                            if (spanCnt > 1) {
                                var copySpan = list.eq(ui.item.index).find('a').html();
                                select.closest('.selectWrap').find('.ui-selectmenu-text').html(copySpan);
                            }
                            
                            var btn = select.siblings('.ui-selectmenu-button');
                            btn.find("span.prefix").remove();
                            btn.find("span.option").remove();
                            
                            var pre = ui.item.element.data("prefix");
                            if(typeof(pre) == "string" && pre.length > 0){
                            	btn.prepend('<span class="prefix">' + pre + '</span>');
                            }
                            
                            var txt = ui.item.element.data("multitext");
                            if(typeof(txt) == "string" && txt.length > 0){
                            	//var btn = select.siblings('.ui-selectmenu-button');
                            	//btn.find("span.option").remove();
                            	txt = replaceURL(txt);
                            	btn.prepend('<span class="option" ' + txt + '></span>');
                            	btn.removeClass("ui-no-option");
                            }else{
                            	btn.addClass("ui-no-option");
                            }
                            
                            try{
                            	var targ = $(ui.item.element.attr("scrollTo"));
                            	GlobalScroll.scrollTo(targ.offset().top);
                            }catch(e){}

                        },
                        close: function() {
                            select.trigger('close');
                        },
                        change: function(event, ui) {
                            select.trigger('change');
                        },
                        open: function() {
                            var parent = select.parent();
                            var uiMenu = parent.find(".ui-menu");
                            
                            var idx = select.prop("selectedIndex"),
                            	dat = select.data("selectedIndex"),
                            	btns = uiMenu.find(".ui-menu-item button:not(.ui-action-button)");
                            if(typeof(dat) == "number" && dat >= 0 && idx != dat){
                            	select.prop("selectedIndex", dat);
                            }
                            btns.removeClass("ui-state-selected");
                            if(dat >= 0){
                            	btns.eq(dat).addClass("ui-state-selected");
                            }

                            //방향 설정
                            var direction = select.attr('data-direction') === "up" ? "up" : "down";
                            if (direction === "up") {
                                var menuH = parent.find('.ui-selectmenu-menu').outerHeight();
                                parent.find('.ui-selectmenu-menu').css('top', -menuH);
                            }

                            uiMenu.css({
                                'width': ''
                            });
                            if (uiMenu.hasVerticalScrollBar() && parent.attr('first') == 'true') {
                                parent.attr('first', false);
                                uiMenu.css('overflow-y', 'hidden');
                                /** 
                                * 20210527 브랜드 사이트 lamer 페이지 상품 색상 선택 디자인 셀렉트 박스 수정
                                */
                                if (select.closest('.listColorSelect').length) {
                                  parent.find('.ui-selectmenu-menu').css('overflow-y','hidden');
                                  uiMenu.css('max-height',parseInt(parent.find('.ui-selectmenu-menu').css('max-height')));
                                }

                                parent.find('.ui-selectmenu-menu').append(
                                    '<div class="scrollbar-wrap">' +
                                    '<div class="scrollbar"></div>' +
                                    '</div>'
                                );

                                var contentH = uiMenu.get(0).scrollHeight;
                                var screenH = uiMenu.height();
                                var cScrollH = contentH - screenH;


                                //추가 : 스크롤 높이 계산
                                parent.find('div.scrollbar-wrap').css('height', screenH);

                                var bar = parent.find('div.scrollbar');
                                var bgH = parent.find('div.scrollbar-wrap').height();
                                bar.height(bgH / 3);
                                var barH = bar.height();
                                var n = bgH - barH;

                                uiMenu.on("mousewheel DOMMouseScroll", function(e, delta) {
                                    var E = e.originalEvent;
                                    delta = 0;
                                    if (E.detail) {
                                        delta = E.detail * -40;
                                    } else {
                                        delta = E.wheelDelta;
                                    };

                                    var scrollTop = $(this).scrollTop() + (Math.round(delta * -1)) / 10;
                                    var tt = contentH - screenH;

                                    $(this).scrollTop(scrollTop);
                                    if (scrollTop < 0) {
                                        scrollTop = 0;
                                    } else if (scrollTop > cScrollH) {
                                        scrollTop = cScrollH;
                                    }

                                    var m = (scrollTop / cScrollH) * n;

                                    bar.css({
                                        'top': m + 'px'
                                    });
                                    e.preventDefault();
                                });

                                uiMenu.on('scroll', function() {
                                    var scrollTop = ($(this).scrollTop() / cScrollH) * n;
                                    bar.css({
                                        'top': scrollTop + 'px'
                                    })
                                });

                                var y1 = 0;

                                bar.on('mousedown', function(e) {
                                    y1 = e.pageY - parseInt(bar.css('top'));
                                    $(document).on('mousemove', moveHandler);
                                    $(document).on('mouseleave , mouseup', mouseLeave);
                                });

                                function mouseLeave() {
                                    $(document).off('mousemove', moveHandler);
                                    $(document).off('mouseleave , mouseup , mouseout', mouseLeave);
                                }

                                function moveHandler(e) {
                                    var y2 = e.pageY - y1;
                                    if (y2 < 0) {
                                        y2 = 0;
                                    } else if (y2 >= n) {
                                        y2 = n;
                                    }
                                    bar.css('top', y2);
                                    var cc = (y2 / n) * (cScrollH);
                                    uiMenu.scrollTop(cc);
                                }
                            }
                            /**
                             * 20210609
                             * 상품 옵션 변경 팝업 에 셀렉트 박스 펼칠 시 스크롤 이동
                             */
                            if (parent.closest('.optionFrm').length) {
                                parent.closest('.layCont').scrollTop(parent.find('.ui-selectmenu-menu').outerHeight(true) + parent.outerHeight(true) + parent.position().top);
                                // parent.closest('.layCont').scrollTop(parent.closest('.layCont').height());
                                // parent.closest('.layCont').scrollTop(99999);
                            }
                            select.trigger('open');
                        }
                    }
                    if (select.attr('style')) {
                        var w = parseInt(select.attr('style').replace('width:', ''));
                        opt.width = w;
                    }

                    select.customSelect(opt);
                    select.data('selectBox', true);

                    var maxHeight;
                    if (select.attr('data-height')) {
                        // 높이 설정
                        maxHeight = select.attr('data-height');
                    } else {
                        //기본 높이 값
                        maxHeight = '240px';
                    }
                    select.customSelect('menuWidget').css('max-height', maxHeight);

                    select.one('close', function() {
                        select.parent().find('.ui-menu-item').eq(select[0].selectedIndex).find('a').attr('aria-selected', true);
                    });

                    select.one('open', function() {
                        var a = select.parent().find('.ui-menu-item a');
                        a.removeAttr('tabindex');
                        a.on('click', function() {})
                    })

                }
            },

        }
        
        function replaceURL(txt){
        	try{
        		txt = txt.replace("url(/", "url(\"/");
        		txt = txt.replace("url(http", "url(\"http");
        		txt = txt.replace(")", "\")");
        	}catch(e){
        		return txt;
        	}
    		return txt;
        };

        // 셀렉트 생성
        $(function() {
            selectMenu.init();
            $(document).find('.selectWrap').each(function() {
                selectMenu.update($(this).find('select'));
            });
            window.SelectMenu = selectMenu;
            
        });
    })
})(jQuery, window)