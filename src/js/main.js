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

  // Hides all the reviews except the first one, to start with.

  $("#reviews li").hide().eq(0).show();

  // Function to cycle through the reviews by fading them in/out

  (function showNextTestimonial() {
    $("#reviews li:visible").delay(7500).fadeOut("slow", function() {
      $(this).appendTo("#reviews ul");

      $("#reviews li:first").fadeIn("slow", function() {
        showNextTestimonial();
      });
    });
  })();
});

(function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
ga('create', 'UA-44699183-4', 'auto');
ga('send', 'pageview');
