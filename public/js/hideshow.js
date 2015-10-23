//  Andy Langton's show/hide/mini-accordion @ http://andylangton.co.uk/jquery-show-hide

// this tells jquery to run the function below once the DOM is ready
$(document).ready(function() {

// choose text for the show/hide link - can contain HTML (e.g. an image)
var showText='Show';
var hideText='Hide';

// initialise the visibility check
var is_visible = false;

// append show/hide links to the element directly preceding the element with a class of "toggle"

// hide all of the elements with a class of 'toggle'
$('.Navlist').show();

// capture clicks on the toggle links
$('span.toggle-button').click(function() {

// switch visibility
is_visible = !is_visible;

// change the link text depending on whether the element is shown or hidden
if ($(this).text()==showText) {
$(this).text(hideText);
$(this).parent().next('.Navlist').slideDown('slow');
}
else {
$(this).text(showText);
$(this).parent().next('.Navlist').slideUp('slow');
}

// return false so any link destination is not followed
return false;

});
});

// 토클링크