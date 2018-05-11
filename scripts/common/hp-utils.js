(function(HP){

	HP.Utils = {
		ready: function (func) {
			document.addEvent('domready', func);
		}
	}
	
})(window.HP||(window.HP={}));