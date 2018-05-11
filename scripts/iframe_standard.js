/**Mootools framework code to build Cleansheet UI elements*/

/*This function creates a dynamic element iframe, it receives parent element to insert iFrame and jsp file url (with actual Facebook  html code)*/
function insertIframe(parent,url,layout, show_faces,width,height,action,font,color){




var href= location.href;
var full_url= url + 'layout=' + layout +'&show_faces=' + show_faces +'&width='+ width +'&action=' + action + '&font=' + font + '&colorscheme='+ color +'&height=' + height +'&href='+ encodeURI(href);
    parent.getElement('iframe').setProperties({'src':full_url});



	








}

/*This event can be called from outside this js file, wire up insertIframe function with actual DOM elements*/
window.addEvent('domready',function(){

	var url = 'http://www.facebook.com/plugins/like.php?';	
	var layout ='standard';
	var show_faces='false';
	var width='400';
	var height='40';
	var action='like';
	var font='verdana';
	var color='dark';

	//insertIframe($$('.js_fb_like')[0],url,layout, show_faces,width,height,action,font,color);

});