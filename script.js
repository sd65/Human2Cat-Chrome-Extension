chrome.extension.onMessage.addListener(function (message) {
	if(message.action=="Launch")
		if(document.activeElement.value)
			mainActions("translateInPlace");
		else
			mainActions("displayTranslation");
	else
		mainActions(message.action);
});

function mainActions (action)
{
	if(action == "translateInPlace") {
		if(document.activeElement.tagName == "TEXTAREA") {
			document.activeElement.select();
			var msg = window.getSelection().toString();
		}
		else {
			var msg = document.activeElement.textContent;
		}
		msg = guessAndTranslate(msg);
		if(document.activeElement.tagName == "TEXTAREA")
			document.activeElement.value = msg;
		else
			document.activeElement.textContent = msg;
	}
	if(action == "displayTranslation")
	{
		var msg = window.getSelection().toString();
		msg = guessAndTranslate(msg);
		picoModal(msg.replace(/\n/g, "<br/>")).show();
	}
}

///////////////////////
// Translate functions

function guessAndTranslate(msg)
{
	var words = msg.split(" ");
	var firstLetters = "";
	for (var i = 0; i < words.length; i++)
	    firstLetters += words[i].charAt(0);
	var countMandG = (firstLetters.match(/g|G|m|M/g) || []).length;
	var out = "";
	if(countMandG == firstLetters.length)
	  out = cat2human(msg);
	else
	  out = human2cat(msg);
	return out;
}

function human2cat(humanSentence) {
  var catWord = "";
  var catSentence= "";
  for (var i = 0; i < humanSentence.length; i++) {
    var letterCode = humanSentence.charCodeAt(i);
    letterBinary= ("00000000" + letterCode.toString(2)).slice(-8);
    if (letterBinary.charAt(2)==1)
      catWord = "Mi";
    else
      catWord = "Gr";
    if (letterBinary.charAt(3)==1)
      catWord += "a";
    if (letterBinary.charAt(4)==1)
      catWord += "o";
    if (letterBinary.charAt(5)==1)
      catWord += "u";
    if (letterBinary.charAt(6)==1)
      catWord += catWord.slice(-1);
    if (letterBinary.charAt(7)==0)
      catWord = catWord.toLowerCase();
    if (letterBinary.charAt(0)==1)
      catWord += "...";
    if (letterBinary.charAt(1)==1)
      catWord += ",";
    catSentence+=catWord + " ";
  }
  return catSentence;
}

function cat2human(catSentence) {
  var catWord = "";
  var humanBinary = "";
  var humanSentence= "";
  catSentence = catSentence.split(" ");
  for (var i = 0; i < catSentence.length; i++) {
    catWord = catSentence[i];
    if (catWord.indexOf('...') > -1)
      humanBinary = "1";
    else
      humanBinary = "0";
    if (catWord.indexOf(',') > -1)
      humanBinary += "1";
    else
      humanBinary += "0";
    if (catWord.charAt(1) == "i")
      humanBinary += "1";
    else
      humanBinary += "0";
    if (catWord.indexOf('a') > -1)
      humanBinary += "1";
    else
      humanBinary += "0";
    if (catWord.indexOf('o') > -1)
      humanBinary += "1";
    else
      humanBinary += "0";
    if (catWord.indexOf('u') > -1)
      humanBinary += "1";
    else
      humanBinary += "0";
    if (catWord.replace(/\W/g, '').slice(-2,-1)==catWord.replace(/\W/g, '').slice(-1))
      humanBinary += "1";
    else
      humanBinary += "0";
    if (catWord.charAt(0)==catWord.charAt(0).toUpperCase())
      humanBinary += "1";
    else
      humanBinary += "0";
    humanSentence+=String.fromCharCode(parseInt(humanBinary, 2));
  }
  return humanSentence;
}
