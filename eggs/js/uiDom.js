
$(DOMStrings.toggleBtn).click(function(){
  //console.log('clicked');

  if($(DOMStrings.navList).is(":visible")){
    $(DOMStrings.navList).hide();
  }else {
    $(DOMStrings.navList).show();
  }
  if ($(window).width() < 768 && $(DOMStrings.mainPopUp).is(":visible")) {
    $(DOMStrings.mainPopUp).hide();
  }

});
$(document).mouseup(function (e) {
  if ($(e.target).closest(DOMStrings.navigation).length === 0 && $(window).width() < 768) {
            $(DOMStrings.navList).hide();
           }
       });

///////////////////////////////
//disp dividend pane
$(DOMStrings.dividendBtn).click(function(){

  //console.log('dic case expression:');
  if ($(DOMStrings.dividendBox).is(":visible")) {
    $(DOMStrings.dividendBox).hide();
  }else {
    myInfo.dividendPopData();
    if($(DOMStrings.mainPopUp).is(":visible")){
      $(DOMStrings.mainPopUp).hide();
    }
    $(DOMStrings.dividendBox).show();
  }

    if($(DOMStrings.toggleBtn).is(":visible") && $(window).width() < 768){
      $(DOMStrings.navList).hide();
    }
});
$(DOMStrings.profileBtn).click(function(){

  if ($(DOMStrings.profileBox).is(":visible")) {
    $(DOMStrings.profileBox).hide();
  }else {
    if($(DOMStrings.mainPopUp).is(":visible")){
      $(DOMStrings.mainPopUp).hide();
    }
    myInfo.profileUpdate();
    $(DOMStrings.profileBox).show();
  }
    if($(DOMStrings.toggleBtn).is(":visible") && $(window).width() < 768){
      $(DOMStrings.navList).hide();
    }
});
$(DOMStrings.newsBtn).click(function(){

  if ($(DOMStrings.newsBox).is(":visible")) {
    $(DOMStrings.newsBox).hide();
  }else {
    if($(DOMStrings.mainPopUp).is(":visible")){
      $(DOMStrings.mainPopUp).hide();
    }
    $(DOMStrings.newsBox).show();
  }
    if($(DOMStrings.toggleBtn).is(":visible") && $(window).width() < 768){
      $(DOMStrings.navList).hide();
    }
});
$(DOMStrings.reffbtn).click(function(){

  if ($(DOMStrings.refbox).is(":visible")) {
    $(DOMStrings.refbox).hide();
  }else {
    if($(DOMStrings.mainPopUp).is(":visible")){
      $(DOMStrings.mainPopUp).hide();
    }
    $(DOMStrings.refbox).show();
  }
    if($(DOMStrings.toggleBtn).is(":visible") && $(window).width() < 768){
      $(DOMStrings.navList).hide();
    }
});
$(DOMStrings.aboutbtn).click(function(){

  if ($(DOMStrings.aboutbox).is(":visible")) {
    $(DOMStrings.aboutbox).hide();
  }else {
    if($(DOMStrings.mainPopUp).is(":visible")){
      $(DOMStrings.mainPopUp).hide();
    }
    $(DOMStrings.aboutbox).show();
  }
    if($(DOMStrings.toggleBtn).is(":visible") && $(window).width() < 768){
      $(DOMStrings.navList).hide();
    }
});
$(DOMStrings.endPopUp).click(function(){
  if($(DOMStrings.mainPopUp).is(":visible") ){
    $(DOMStrings.mainPopUp).hide();
  }
});
//disp dividend pane
$(DOMStrings.rankbtn).click(function(){

  //console.log('dic case expression:');
  if ($(DOMStrings.rankbox).is(":visible")) {
    $(DOMStrings.rankbox).hide();
  }else {
    myInfo.dividendPopData();
    if($(DOMStrings.mainPopUp).is(":visible")){
      $(DOMStrings.mainPopUp).hide();
    }
    $(DOMStrings.rankbox).show();
  }

    if($(DOMStrings.toggleBtn).is(":visible") && $(window).width() < 768){
      $(DOMStrings.navList).hide();
    }
});

/////////////////////////////////////
//dis chat
$(DOMStrings.chatBtn).click(function(){

    $(DOMStrings.chatBox).show();
    if($(DOMStrings.toggleBtn).is(":visible")){
      $(DOMStrings.navList).hide();
    }
});
$(document).mouseup(function (e) {
  if ($(e.target).closest(DOMStrings.chatBox).length === 0 && $(window).width() < 768) {
            $(DOMStrings.chatBox).hide();
           }
       });
///////////////////////////////////
///dis rank
$(DOMStrings.rankBtn).click(function(){
  if ($(DOMStrings.rankBox).is(":visible")) {
    $(DOMStrings.rankBox).hide();
  }else {
    $(DOMStrings.rankBox).show();

  }

    if($(DOMStrings.toggleBtn).is(":visible") && $(window).width() < 768){
      $(DOMStrings.navList).hide();
    }
});
$(document).mouseup(function (e) {
  if ($(e.target).closest(DOMStrings.rankBox).length === 0 && $(window).width() < 992) {
            $(DOMStrings.rankBox).hide();
           }
       });


///////////////////////////////////////
//
$(document).ready(function() {
  $(DOMStrings.allBetsBody).show();
  $(DOMStrings.allBetBtn).css({
    'color':'#ffffff',
    'text-shadow':'1px 1px 1px #000',
    'border-bottom':'3px groove #bbb'
  });
});

$(DOMStrings.allBetBtn).click(function(){
  console.log('allBetBtn');
  $('.bottom-panel-head-list li').css({
    'color':'#000',
    'text-shadow':'0 1px 1px #ff6511',
    'border-bottom':'none'
  });
  $(DOMStrings.allBetBtn).css({
    'color':'#ffffff',
    'text-shadow':'1px 1px 1px #000',
    'border-bottom':'3px groove #bbb'
  });

  $(DOMStrings.myBetsBody).hide();
  $(DOMStrings.customBetsBody).hide();
  $(DOMStrings.allBetsBody).show();
});
$(DOMStrings.myBetBtn).click(function(){
  $('.bottom-panel-head-list li').css({
    'color':'#000',
    'text-shadow':'0 1px 1px #ff6511',
    'border-bottom':'none'
  });
  $(DOMStrings.myBetBtn).css({
    'color':'#ffffff',
    'text-shadow':'1px 1px 1px #000',
    'border-bottom':'3px groove #bbb'
  });

  //console.log('myBetBtn');
  $(DOMStrings.allBetsBody).hide();
  $(DOMStrings.customBetsBody).hide();
  $(DOMStrings.myBetsBody).show();
});
$(DOMStrings.customBetBtn).click(function(){
  $('.bottom-panel-head-list li').css({
    'color':'#000',
    'text-shadow':'0 1px 1px #ff6511',
    'border-bottom':'none'
  });
  $(DOMStrings.customBetBtn).css({
    'color':'#ffffff',
    'text-shadow':'1px 1px 1px #000',
    'border-bottom':'3px groove #bbb'
  });

  console.log('myBetBtn');
  $(DOMStrings.allBetsBody).hide();
  $(DOMStrings.myBetsBody).hide();
  $(DOMStrings.customBetsBody).show();
});


///////////////////////////////////


$(DOMStrings.autoBetToggle).change(function (){
  if ($(this).is(":checked")) {
    $(DOMStrings.ultraBetTogglr).bootstrapToggle('disable');

  } else {
    $(DOMStrings.ultraBetTogglr).bootstrapToggle('enable');
  }

});

$(DOMStrings.ultraBetTogglr).change(function (){
  if ($(this).is(":checked")) {
    $(DOMStrings.autoBetToggle).bootstrapToggle('disable');

  } else {
    $(DOMStrings.autoBetToggle).bootstrapToggle('enable');
  }
});
////////////////////////////////////
$(DOMStrings.houseBtn).mouseover(function(){
  $(DOMStrings.homeToggler).show();
});
$(DOMStrings.homeToggler).mouseleave(function(){
  $(DOMStrings.homeToggler).hide();
});
$(document).mouseup(function (e) {
  if ($(e.target).closest(DOMStrings.homeToggler).length === 0 ) {
            $(DOMStrings.homeToggler).hide();
           }
       });
 $(DOMStrings.houseBtn).click(function(){
   $(DOMStrings.homeToggler).show();
 });

 //////////////////////////
 ////////////////////////////////////
 $(DOMStrings.infoBtn).mouseover(function(){
   $(DOMStrings.infoToggler).show();
 });
 $(DOMStrings.infoToggler).mouseleave(function(){
   $(DOMStrings.infoToggler).hide();
 });
 $(document).mouseup(function (e) {
   if ($(e.target).closest(DOMStrings.infoToggler).length === 0 ) {
             $(DOMStrings.infoToggler).hide();
            }
        });
  $(DOMStrings.infoBtn).click(function(){
    $(DOMStrings.infoToggler).show();
  });

  $(DOMStrings.copyLink).click(function() {
    let copyText = $(DOMStrings.disLink);
    /* Select the text field */
  copyText.select();
  /* Copy the text inside the text field */
  document.execCommand("copy");
  });
  $('.popup-info-panel-head').click(function(){
    $('.popup-info-panel').css('z-index','-1');
  });
  $('.popup-info-panel-body button').click(function(){
    $(DOMStrings.loginBtn).click();
  });
