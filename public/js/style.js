jQueryBridget( 'flickity', Flickity, $ );
var bidArray = {};

function animate() {
    $("body").fadeIn("slow");
}

function showBanner() {
    $(".banner").slideDown();
}

function showBody() {
    $("body").show();
}

$('.main-carousel').flickity({
    // options
    cellAlign: 'left',
    contain: true
  });

function bid (key) {
    $("#text-"+key).slideUp("fast"); $("#form-"+key).slideDown("fast");
}

function unbid (key) {
    $("#form-"+key).slideUp("fast"); $("#text-"+key).slideDown("fast");
}