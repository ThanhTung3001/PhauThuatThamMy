/*20-11-11 select박스 수정보완*/
$(".custom-select").each(function() {
  var classes = $(this).attr("class"),
    id = $(this).attr("id"),
    name = $(this).attr("name");
  var template = '<div class="' + classes + '">';
  template +=
    '<span class="custom-select-trigger">' +
    $(this).attr("placeholder") +
    "</span>";
  template += '<div class="custom-options">';
  $(this)
    .find("option")
    .each(function() {
      template +=
        '<span class="custom-option ' +
        $(this).attr("class") +
        '" data-value="' +
        $(this).attr("value") +
        '">' +
        $(this).html() +
        "</span>";
    });
  template += "</div></div>";

  $(this).wrap('<div class="custom-select-wrapper"></div>');
  $(this).hide();
  $(this).after(template);
});
$(".custom-option:first-of-type").hover(
  function() {
    $(this)
      .parents(".custom-options")
      .addClass("option-hover");
  },
  function() {
    $(this)
      .parents(".custom-options")
      .removeClass("option-hover");
  }
);
$(".custom-select-trigger").on("click", function() {
  $("html").one("click", function() {
    $(this).parents(".select_box").removeClass("open")
    .find(".custom-select").removeClass("opened");
  });



  $(".select_box").removeClass("open").find(".custom-select").removeClass("opened");

  $(this).parents(".select_box").addClass("open")
    .find(".custom-select")
    .toggleClass("opened");
  event.stopPropagation();
});


$(".custom-option").on("click", function() {
  $(this)
    .parents(".custom-select-wrapper")
    .find("select")
    .val($(this).data("value"));
  $(this)
    .parents(".custom-options")
    .find(".custom-option")
    .removeClass("selection");
  $(this)
    .parents(".select_box")
    .removeClass("open");
  $(this).addClass("selection");
  $(this)
    .parents(".custom-select")
    .removeClass("opened");
  $(this)
    .parents(".custom-select")
    .find(".custom-select-trigger")
    .text($(this).text());


var select_val = $(this).attr("data-value");
    $(this).parents(".select_box").children("input[type='hidden']").val(select_val);

    if(select_val.length < "1"){
    $(this).parents(".write").find(".success_check").children("input").prop("checked", false).parents(".write").find(".custom-select").find(".custom-select-trigger").removeClass("input_focus_label");



  }
    if(select_val.length > "1"){
     $(this).parents(".write").find(".success_check").children("input").prop("checked", true).parents(".write").find(".custom-select").find(".custom-select-trigger").addClass("input_focus_label");




    }

});



//자신제외 클릭시 닫힘 추가
$(document).mouseup(function (e) {
    var select_box = $(".select_box"); //셀렉트박스
    var custom_select = $(".custom-select"); //커스텀셀렉트


    if (!select_box.is(e.target) && select_box.has(e.target).length === 0){
    select_box.removeClass("open");
    }

    if (!custom_select.is(e.target) && custom_select.has(e.target).length === 0){
    custom_select.removeClass("opened");
    }

});



