chrome.commands.onCommand.addListener(function(command) {
  if (command == "LaunchAutoViaKeyboard")
    sendToTab("LaunchAutoViaKeyboard");
});

chrome.contextMenus.create({
  "title": "Display translation", 
  "contexts": ["selection"], 
  "onclick": function() {
    sendToTab("displayTranslation")
  }
});

chrome.contextMenus.create({
  "title": "Translate in place", 
  "contexts": ["editable"], 
  "onclick": function() {
    sendToTab("translateInPlace")
  }
});

function sendToTab(actionName)
{
  chrome.tabs.query({
      "active": true,
      "currentWindow": true
  }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
          "action" : actionName
      });
  });
}
