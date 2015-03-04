$(document).ready(function() {

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
