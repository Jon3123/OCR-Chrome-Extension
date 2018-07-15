///Jonathan Washington
///OCR content script
///Retrieves data URL of image and displays OCR text 


var imgData;
///Canvas used for drawing img to retrieve data URL
var canvas = document.createElement('canvas');
var ctx = null;
var clickedImage = null;

function retrieveImageDataURL(){
	canvas.width = clickedImage.width;
	canvas.height = clickedImage.height;
	ctx = canvas.getContext("2d");
	ctx.drawImage(clickedImage,0,0);
	return canvas.toDataURL('image/png');
}

///Listens for messages from background script
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
	if (msg.action == 'Image_Data_Request'){
		try{
			imgData = retrieveImageDataURL();
			var message = {
				action: 'Image_Data_URL',
				context: imgData
			};
			chrome.runtime.sendMessage(message, function(response){});
		}catch(err){
			window.alert('Error in processing image, please go to image URL and try again.');
		}
	}else{
		if (msg.action == 'OCR_Text'){
			var oText = msg.context;
			window.alert('Text read: ' + oText);
		}
	}
});

//Obtains the image right click image used in retrieve image data.
document.addEventListener("mousedown", function(event){
    //right click
    if(event.button == 2) { 
        clickedImage = event.target;
		clickedImage.crossOrigin = 'anonymous';
    }
}, true);