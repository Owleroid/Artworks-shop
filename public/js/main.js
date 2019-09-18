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

  for (let i = 0; i < mobMenubtn.length; i++) {
    mobMenubtn[i].addEventListener("click", function() {
      if (!navLinks.hasClass("show")) {
        navLinks.addClass("show");
        if (!menu.hasClass("open")) {
          menu.addClass("open");
        }
      } else {
        if (isMainPage) {
          if ($(window).scrollTop() < showMenuPosition) {
            menu.removeClass("open");
          }
        }
        navLinks.removeClass("show");
      }
    });
  }

  if (!isMainPage) {
    menu.addClass("open");
  } else {
    $(window).bind("scroll", function(e) {
      if ($(window).scrollTop() > showMenuPosition) {
        if (!menu.hasClass("open")) {
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

  var modal = document.getElementById("modal-contacts");

  // Get the button that opens the modal
  var contatctsButtons = document.querySelectorAll("#contacts");

  contatctsButtons.forEach(btn => {
    btn.onclick = function() {
      // When the user clicks the button, open the modal
      modal.style.display = "block";
    };
  });

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});
