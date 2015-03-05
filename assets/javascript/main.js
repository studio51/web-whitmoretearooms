$(document).ready(function() {

  // Don't initialize the carousel on mobile.. there's no point!

  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {

    $(".intro").addClass('mobile');

  } else {

    $("#carousel").owlCarousel({
      items : 1,
      lazyLoad : true,
      autoPlay : 8000,
      stopOnHover : false,
      navigation : false,
      slideSpeed : 500,
      singleItem:true,
      goToFirstSpeed : 2000,
      transitionStyle: "fade"
    });
  }

  // Hides all the testimonials except the first one, to start with.

  $("#testimonials li").hide().eq(0).show();

  // Function to cycle through the testimonials by fading them in/out

  (function showNextTestimonial() {
    $("#testimonials li:visible").delay(7500).fadeOut("slow", function() {
      $(this).appendTo("#testimonials ul");

      $("#testimonials li:first").fadeIn("slow", function() {
        showNextTestimonial();
      });
    });
  })();
});
