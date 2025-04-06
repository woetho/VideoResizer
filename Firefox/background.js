chrome.browserAction.onClicked.addListener((tab) => {
    chrome.storage.local.get('videoResizerEnabled', (data) => {
      const enabled = !data.videoResizerEnabled;
      chrome.storage.local.set({ videoResizerEnabled: enabled });
  
      chrome.tabs.sendMessage(tab.id, { toggleResizer: enabled });
  
      chrome.browserAction.setTitle({
        tabId: tab.id,
        title: enabled ? "Disable Video Resizer" : "Enable Video Resizer"
      });
    });
  });
  