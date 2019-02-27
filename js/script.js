var $ = jQuery.noConflict();
const remote = require('electron').remote; //electron code
const shell = require('electron').shell;
const Store = require('electron-store');
const store = new Store();
const storeHistory = new Store();

$(document).ready(function(){
  $("#upload_button").attr("disabled", true);
  $('input[type="text"]').get(0).focus();
  var filetype;
  var MagicWord;
  var movedInt;
  var clickedInt;
  var settings = store.get('settings');
  var history = store.get("history");

  if (settings == true) {
    //console.log(store.get('settings'));
    $(".settings_checkbox").attr("checked", "checked");
    clickedInt = 2;
  }

  $(".hist_val").click(function() {

  });

  $("#delete_").click(function() {
    store.delete("history");
    $(".no-hist").removeClass("remove");
    $(".history_div").removeClass("show");
    $(".hist_val").remove();
  });

  $(".checkmark").click(function() {
    if (clickedInt == 1) {
      store.set('settings', true);
      //console.log(store.get('settings'));
      clickedInt = 2;
    } else {
      store.delete('settings');
      //console.log(store.get('settings'));
      clickedInt = 1;
    }
  });

  $(".clipboard").click(function(){
    $("#copied_url").addClass("show");
    setTimeout(function() {
      $("#copied_url").removeClass("show");
    }, 2000);
  });

  $(".search").click(function() {
    setTimeout(function() {
      $("#data").addClass("moveup");
    }, 600);
    $("#FolderName").addClass("moveup");
    $("#back_up").addClass("rotate");
    movedInt = 4;
  });

  $(".settings").click(function(){
    $(this).toggleClass("rotate");
    $(".settings_div").toggleClass("moveup");
  });

  $("#phpframe").on('load', function() {
    var value = $(this).contents().find("#link").prop('href');
    if (value == null || value == "") {
      //do nothing
    } else {
      if (clickedInt !== 2) {
        shell.openExternal(value);
      }
      $("#p1").text(value);
      $(".clipboard").addClass("show");
    }
  });

  $("#close_app").click(function(){ 
    var window = remote.getCurrentWindow();
    window.close();
  });

  $("#inputfilename").keypress(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    var list = store.get('history');
    var val = $(this).val();
    if (keycode == 13) {
      if (list) {
        storeHistory.set('history', list.concat(val));
      }
      else {
        storeHistory.set('history', [val]);
      }
        $("#FolderName").addClass("move");
        setTimeout(function() {
          movedInt = 2;
          $(".main_wrap").addClass("move");
          $("#back_up").addClass("move");
        }, 600);
      $(".no-hist").addClass("remove");
      $(".history_div").addClass("show");
      $(".history_container").append("<p class='hist_val' onclick='copyval()'>"+val+"</p>");
    }
  });

  $.each(history, function(index, val) {
    $(".no-hist").addClass("remove");
    $(".history_div").addClass("show");
    $(".history_container").append("<p class='hist_val' onclick='copyval()'>"+val+"</p>");
  });

  $("#back_up").click(function() {
    if (movedInt == 2) {
      $(".main_wrap").removeClass("move");
      $("#back_up").removeClass("move");
      setTimeout(function() {
        $("#FolderName").removeClass("move");
        movedInt = 1;
      }, 600);
    } else if (movedInt == 3) {
      $(".iframe_wrapper").removeClass("move"); 
      setTimeout(function() {
        $(".main_wrap").removeClass("movemore");
        movedInt = 2;
      }, 600);
    } else if (movedInt == 4) {
      $("#back_up").removeClass("rotate");
      $("#data").removeClass("moveup");
      setTimeout(function() {
        $("#FolderName").removeClass("moveup");
        movedInt = 1;
      }, 600);
    }
  });

  $("input[type='file']").change(function(e){
    var ext = this.value.match(/\.(.+)$/)[1];
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        $("#upload_button").attr("disabled", false);
        filetype = true;
        break;
      default: 
        filetype = false;
        $("#upload_button").attr("disabled", true);
    }
    var fileName = e.target.files[0].name;
    if (filetype == true) {
      $("#image-name").text('"' + fileName +  '" has been selected.');
    } else {
      $("#image-name").text(':C Sorry, But "' + fileName + '" Isnt A Jpg or Jpeg');
    }
  });

  $("#upload_button").click(function() {
    if (filetype == true) {  
      $(".main_wrap").addClass("movemore");   
      setTimeout(function() {
        $(".iframe_wrapper").addClass("move"); 
        movedInt = 3;
      }, 600);
    }
  });

});