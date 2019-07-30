$(document).ready(function() {
  //------------------------------------//
  //Navbar//
  //------------------------------------//

  var menu = $(".nav")[0];
  menu = $(menu);

  $(window).bind("scroll", function(e) {
    if ($(window).scrollTop() > 200) {
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

  let isMainPage = $(".slide").length;
  console.log(isMainPage);

  if (!isMainPage) {
    menu.addClass("open");
  }

  //------------------------------------//
  //Scroll To//
  //------------------------------------//
  $(".scroll").click(function(event) {
    event.preventDefault();
    $("html,body").animate({ scrollTop: $(this.hash).offset().top }, 800);
  });
});
