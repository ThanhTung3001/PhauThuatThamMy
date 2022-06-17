
// ###############################################################################################################################################
// 맞춤 게시판
function fn_load_myboard(code, page_subject) {
	var j_url, i_url, page_idx;
	var url_str, url_arr, url_tmp;

	url_str = location + "";

	if (url_str.indexOf('idx=') != -1) {
		url_arr = url_str.split("#");
		url_tmp = url_arr[0];

		url_arr = url_tmp.split("idx=");
		url_tmp = url_arr[1];


		if (url_tmp.indexOf('&') != -1) {
			url_arr = url_tmp.split("&");
			page_idx = url_arr[0];
		} else {
			page_idx = url_tmp;
		}
	}


	if (!page_idx) page_idx = 0;
	page_idx = page_idx * 1;

	if (!document.getElementById('load_mb_' + code)) {
		document.write("<a name='#a_mb_" + code + "'></a><a href='#a_mb_" + code + "' id='a_mb_" + code + "'></a><div id='load_mb_" + code + "'><iframe src='' width=100% height=10 frameborder=0 scrolling=no name='iframe_mb_" + code + "' id='iframe_mb_" + code + "'></iframe></div><script type='text/javascript'  id='js_mb_" + code + "' src=''></script><input type='hidden' name='page_idx_" + code + "'  id='page_idx_" + code + "'  value='" + page_idx + "' ><input type='hidden' name='page_subject_" + code + "'  id='page_subject_" + code + "'  value='" + page_subject + "' ><input type='hidden' name='page_url_" + code + "'  id='page_url_" + code + "'  value='" + location + "' > ");
	}

	window.CKEDITOR = null;

	if (url_str.indexOf('_form.htm') != -1) {
		document.getElementById('js_mb_' + code).src = "/html_editor/ckeditor_3.6.2/ckeditor.js";
	}

	try {
		j_url = "/shop_contents/myboard_list.htm?load_type=jquery&myboard_code=" + code + '&page_idx=' + page_idx;
		$('#load_mb_' + code).load(j_url);

	} catch (e) {
		i_url = "/shop_contents/myboard_list.htm?load_type=iframe&myboard_code=" + code + '&page_idx=' + page_idx;
		document.getElementById('iframe_mb_' + code).src = i_url;
	}
	//document.getElementById('a_mb_'+code).click();
}

function fn_load_myboard_url(code, url) {

	if (!url || url == '' || url == null) {
		url = "/shop_contents/myboard_list.htm?myboard_code=" + code + '&page_idx=' + document.getElementById('page_idx_' + code).value;
	}

	window.CKEDITOR = null;
	var url_str = url + "";
	if (url_str.indexOf('_form.htm') != -1) {
		document.getElementById('js_mb_' + code).src = "/html_editor/ckeditor_3.6.2/ckeditor.js";
	}

	try {
		var ok_url = url + "&load_type=jquery";
		$('#load_mb_' + code).load(ok_url);
	} catch (e) {
		var ok_url = url + "&load_type=iframe";
		document.getElementById('iframe_mb_' + code).src = ok_url;
	}
	document.getElementById('a_mb_' + code).click();
}

// ###############################################################################################################################################
// 댓글Plus
function fn_load_comment(code, page_subject) {
	var j_url, i_url, page_idx;
	var url_str, url_arr, url_tmp;

	url_str = location + "";

	if (url_str.indexOf('idx=') != -1) {

		url_arr = url_str.split("#");
		url_tmp = url_arr[0];

		if (url_str.indexOf('category_idx=') > 0 || url_str.indexOf('category1_idx=') > 0) {
			url_arr = url_tmp.split("&idx=");
			url_tmp = url_arr[1];
		} else {
			url_arr = url_tmp.split("idx=");
			url_tmp = url_arr[1];
		}

		if (url_tmp.indexOf('&') != -1) {
			url_arr = url_tmp.split("&");
			page_idx = url_arr[0];
		} else {
			page_idx = url_tmp;
		}
	}

	if (!page_idx) page_idx = 0;
	page_idx = page_idx * 1;

	if (!document.getElementById('load_cmt_' + code)) {
		document.write("<a name='#a_cmt_" + code + "'></a><a href='#a_cmt_" + code + "' id='a_cmt_" + code + "'></a><div id='load_cmt_" + code + "'><iframe src='' width=100% height=10 frameborder=0 scrolling=no name='iframe_cmt_" + code + "' id='iframe_cmt_" + code + "'></iframe></div><script type='text/javascript'  id='js_cmt_" + code + "' src=''></script><input type='hidden' name='cmt_page_idx_" + code + "'  id='cmt_page_idx_" + code + "'  value='" + page_idx + "' ><input type='hidden' name='cmt_page_subject_" + code + "'  id='cmt_page_subject_" + code + "'  value='" + page_subject + "' ><input type='hidden' name='cmt_page_url_" + code + "'  id='cmt_page_url_" + code + "'  value='" + location + "' > ");
	}

	window.CKEDITOR = null;

	if (url_str.indexOf('_form.htm') != -1) {
		document.getElementById('js_cmt_' + code).src = "/html_editor/ckeditor_3.6.2/ckeditor.js";
	}

	if (!page_subject) page_subject = '';
	page_subject = encodeURI(page_subject);
	page_url = escape(url_str);

	try {
		j_url = "/shop_contents/comment_list.htm?load_type=jquery&comment_code=" + code + '&page_idx=' + page_idx + '&page_subject=' + page_subject + '&page_url=' + page_url;
		$('#load_cmt_' + code).load(j_url);
	} catch (e) {
		i_url = "/shop_contents/comment_list.htm?load_type=iframe&comment_code=" + code + '&page_idx=' + page_idx + '&page_subject=' + page_subject + '&page_url=' + page_url;
		document.getElementById('iframe_cmt_' + code).src = i_url;
	}
	//document.getElementById('a_cmt_'+code).click();
}

function fn_load_comment_url(code, url) {

	if (!url || url == '' || url == null) {
		url = "/shop_contents/comment_list.htm?comment_code=" + code + '&page_idx=' + document.getElementById('cmt_page_idx_' + code).value;
	}

	window.CKEDITOR = null;
	var url_str = url + "";
	if (url_str.indexOf('_form.htm') != -1) {
		document.getElementById('js_cmt_' + code).src = "/html_editor/ckeditor_3.6.2/ckeditor.js";
	}

	try {
		var ok_url = url + "&load_type=jquery";
		$('#load_cmt_' + code).load(ok_url);
	} catch (e) {
		var ok_url = url + "&load_type=iframe";
		document.getElementById('iframe_cmt_' + code).src = ok_url;
	}
	document.getElementById('a_cmt_' + code).click();
}


// ###############################################################################################################################################
// 블로그연동 
function fn_load_blog_link(code, page_subject, page_keyword) {
	var j_url, i_url, page_idx;
	var url_str, url_arr, url_tmp;

	url_str = location + "";

	if (url_str.indexOf('idx=') != -1) {

		url_arr = url_str.split("#");
		url_tmp = url_arr[0];

		url_arr = url_tmp.split("idx=");
		url_tmp = url_arr[1];

		if (url_tmp.indexOf('&') != -1) {
			url_arr = url_tmp.split("&");
			page_idx = url_arr[0];
		} else {
			page_idx = url_tmp;
		}
	}

	if (!page_keyword) page_keyword = '';
	page_keyword = encodeURI(page_keyword);

	if (!page_idx) page_idx = 0;
	page_idx = page_idx * 1;

	if (!document.getElementById('load_blog_link_' + code)) {
		document.write("<a name='#a_blog_link_" + code + "'></a><a href='#a_blog_link_" + code + "' id='a_blog_link_" + code + "'></a><div id='load_blog_link_" + code + "'><iframe src='' width=100% height=10 frameborder=0 scrolling=no name='iframe_blog_link_" + code + "' id='iframe_blog_link_" + code + "'></iframe></div><script type='text/javascript'  id='js_blog_link_" + code + "' src=''></script><input type='hidden' name='page_idx_" + code + "'  id='page_idx_" + code + "'  value='" + page_idx + "' ><input type='hidden' name='page_subject_" + code + "'  id='page_subject_" + code + "'  value='" + page_subject + "' ><input type='hidden' name='page_url_" + code + "'  id='page_url_" + code + "'  value='" + location + "' >");
	}

	window.CKEDITOR = null;

	if (url_str.indexOf('_form.htm') != -1) {
		document.getElementById('js_blog_link_' + code).src = "/html_editor/ckeditor_3.6.2/ckeditor.js";
	}

	if (!page_subject) page_subject = '';
	page_subject = encodeURI(page_subject);
	page_url = escape(url_str);

	try {
		j_url = "/shop_contents/blog_link_list.htm?load_type=jquery&blog_link_code=" + code + '&page_idx=' + page_idx + '&page_keyword=' + page_keyword + '&page_subject=' + page_subject + '&page_url=' + page_url;
		$('#load_blog_link_' + code).load(j_url);

	} catch (e) {
		i_url = "/shop_contents/blog_link_list.htm?load_type=iframe&blog_link_code=" + code + '&page_idx=' + page_idx + '&page_keyword=' + page_keyword + '&page_subject=' + page_subject + '&page_url=' + page_url;
		document.getElementById('iframe_blog_link_' + code).src = i_url;
	}

	//document.getElementById('a_blog_link_'+code).click();
}

function fn_load_blog_link_url(code, url) {

	if (!url || url == '' || url == null) {
		url = "/shop_contents/blog_link_list.htm?blog_link_code=" + code + '&page_idx=' + document.getElementById('page_idx_' + code).value;
	}

	window.CKEDITOR = null;
	var url_str = url + "";
	if (url_str.indexOf('_form.htm') != -1) {
		document.getElementById('js_blog_link_' + code).src = "/html_editor/ckeditor_3.6.2/ckeditor.js";
	}

	try {
		var ok_url = url + "&load_type=jquery";
		$('#load_blog_link_' + code).load(ok_url);
	} catch (e) {
		var ok_url = url + "&load_type=iframe";
		document.getElementById('iframe_blog_link_' + code).src = ok_url;
	}
	document.getElementById('a_blog_link_' + code).click();
}

// UTF-8 한글체크
