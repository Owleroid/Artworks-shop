$(document).ready(function() {
  //------------------------------------//
  //Navbar//
  //------------------------------------//

  var menu = $(".nav")[0];
  menu = $(menu);
  let mobMenubtn = $(".nav-btn");
  let navLinks = $($(".nav-links")[0]);
  let isMainPage = $(".slide").length;
  let showMenuPosition = 200;

  console.log(
    "Nav = " +
      menu +
      " Mob menu = " +
      mobMenubtn.length +
      " Links = " +
      navLinks
  );

  for (let i = 0; i < mobMenubtn.length; i++) {
    mobMenubtn[i].addEventListener("click", function() {
      if (!navLinks.hasClass("show")) {
        console.log("Menu was closed, i opening it");
        navLinks.addClass("show");
        if (!menu.hasClass("open")) {
          menu.addClass("open");
        } else {
          if (isMainPage) {
            menu.removeClass("open");
          }
        }
      } else {
        navLinks.removeClass("show");
      }
    });
  }

  if (!isMainPage) {
    menu.addClass("open");
  } else {
    $(window).bind("scroll", function(e) {
      console.log($(window).scrollTop());
      if ($(window).scrollTop() > showMenuPosition) {
        console.log("show menu");
        if (!menu.hasClass("open")) {
          console.log("well");
          menu.addClass("open");
        }
      } else {
        if (menu.hasClass("open")) {
          if (!navLinks.hasClass("show")) {
            menu.removeClass("open");
          }
        }
      }
    });
  }

  //------------------------------------//
  //Scroll To//
  //------------------------------------//
  $(".scroll").click(function(event) {
    event.preventDefault();
    $("html,body").animate({ scrollTop: $(this.hash).offset().top }, 800);
  });
});
