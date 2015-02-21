$(document).ready(function() {

  var latitude = 52.96656435104726,
      longitude = -2.2864058017730;

  var map = new GMaps({
    el: '#map',
    lat: latitude,
    lng: longitude
  });

  map.controls({
    panControl: false,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    overviewMapControl: false
  });

  // $("#map").GMaps({
  //   controls: {
  //     panControl: false,
  //     zoomControl: true,
  //     mapTypeControl: false,
  //     scaleControl: false,
  //     streetViewControl: false,
  //     overviewMapControl: false
  //   },
  //   scrollwheel: false,
  //   draggable: true,
  //   markers: [{
  //     latitude: latitude,
  //     longitude: longitude
  //   }],
  //   latitude: latitude,
  //   longitude: longitude
  // });


  $('#testimonials li').hide().eq(0).show();

  (function showNextTestimonial(){

    $('#testimonials li:visible').delay(7500).fadeOut('slow',function(){

      $(this).appendTo('#testimonials ul');

      $('#testimonials li:first').fadeIn('slow',function(){
        showNextTestimonial();
      });
    });
  })();
});
