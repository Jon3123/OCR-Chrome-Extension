///Jonathan Washington
///


function buttonClick(){
	var request = {
		action: 'Clipboard_Request'
	};
	chrome.runtime.sendMessage(request, function(response){});
	
};
document.addEventListener('DOMContentLoaded', function() {
  var checkPageButton = document.getElementById('but');
  checkPageButton.addEventListener('click',buttonClick() , false);
}, false);


