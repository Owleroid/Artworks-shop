$(document).ready(function() {
  //------------------------------------//
  //Navbar//
  //------------------------------------//

  var menu = $(".nav")[0];
  menu = $(menu);
  let showMenuPosition = 200;

  let isMainPage = $(".slide").length;

  if (!isMainPage) {
    menu.addClass("open");
    showMenuPosition = -10;
  }

  $(window).bind("scroll", function(e) {
    if ($(window).scrollTop() > showMenuPosition) {
      if (!menu.hasClass("open")) {
        console.log(menu.css("top"));
        menu.addClass("open");
      }
    } else {
      if (menu.hasClass("open")) {
        menu.removeClass("open");
      }
    }
  });

  //------------------------------------//
  //Scroll To//
  //------------------------------------//
  $(".scroll").click(function(event) {
    event.preventDefault();
    $("html,body").animate({ scrollTop: $(this.hash).offset().top }, 800);
  });
});
