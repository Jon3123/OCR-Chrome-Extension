///Jonathan Washington 
///OCR background script,
///Reads request that player wishes to OCR and retrieves OCR from sandbox
///and sends it content script

////iframe, used for contacting sandbox
var iframe = document.createElement('iframe');
var html = '<body>Foo</body>';
iframe.src = "box.html";
document.body.appendChild(iframe);
//////////////////////////////////////////
var imgData;
var ocrText;
///function when context menu is clicked.
function onClickHandler(info, tab) {
  if (info.menuItemId == 'context_image'){
	//Request image data
	requestImageData();
  }
}

//function to send message when image request to OCR image
function requestImageData(){
  // Send a message to the active tab
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		chrome.tabs.sendMessage(tabs[0].id, {action: 'Image_Data_Request'}, function(response) {});  
	});
}
///Event listener for menu
chrome.contextMenus.onClicked.addListener(onClickHandler);
///Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
	//Create the menu for the OCR, just for images
	var context = 'image';
    var title = 'OCR Image';
    var id = chrome.contextMenus.create({'title': title, 'contexts':[context],'id': 'context_' + context});
});

///set up for reading messages from iframe.
window.addEventListener('message', function(event) {
  if (event.data.action == 'OCR_Data'){
	  ocrText = event.data.context.ocr;
	  sendText();
  }
});
///Sends the image data URL to sanbox so it can OCR the image and return results.
function sendToFrame(imageData){
	var message = {
		action: 'OCR_Request',
		context: {img: imageData}
	};
	iframe.contentWindow.postMessage(message, '*');
};
///listens to messages from content script
chrome.runtime.onMessage.addListener(
  function(msg, sender, sendResponse) {
	if (msg.action == 'Image_Data_URL'){
		imgData = msg.context;
		sendToFrame(imgData);
	}else{
		if (msg.action == 'Clipboard_Request'){
			document.execCommand('copy')
		}
	}
  });
   
 function sendText(){ 
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		chrome.tabs.sendMessage(tabs[0].id, {action: 'OCR_Text', context: ocrText}, function(response) {});  
	});
 }
 
 document.addEventListener('copy', function(e) {
  e.clipboardData.setData('text/plain', ocrText);
  e.preventDefault();
});