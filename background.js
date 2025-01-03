// background.js

// Initialize the toggle state on installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ extensionEnabled: true }, () => {
        console.log("GemGem is enabled by default.");
    });
    updateIcon(true);
});

// Listen for action (toolbar button) clicks to toggle the extension
chrome.action.onClicked.addListener((tab) => {
    chrome.storage.sync.get("extensionEnabled", (data) => {
        const newState = !data.extensionEnabled;
        chrome.storage.sync.set({ extensionEnabled: newState }, () => {
            updateIcon(newState);
            // Notify the active tab about the state change
            chrome.tabs.sendMessage(tab.id, {
                type: "TOGGLE_EXTENSION",
                enabled: newState,
            });
        });
    });
});

// Function to update the toolbar icon based on state
function updateIcon(enabled) {
    const iconPath = enabled
        ? {
              16: "icon/icon16.png",
              48: "icon/icon48.png",
              128: "icon/icon128.png",
          }
        : {
              16: "icon/icon16_disabled.png",
              48: "icon/icon48_disabled.png",
              128: "icon/icon128_disabled.png",
          };
    chrome.action.setIcon({ path: iconPath });
}

// Optional: Listen for messages from content scripts if needed
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "REQUEST_EXTENSION_STATE") {
        chrome.storage.sync.get("extensionEnabled", (data) => {
            sendResponse({ enabled: data.extensionEnabled });
        });
        return true; // Keeps the message channel open for sendResponse
    }
});
