document.getElementById('startButton').addEventListener('click', () => {
    chat_enabled = document.getElementById('chat').checked
    scroll_enabled = document.getElementById('scroll').checked
    message = document.getElementById('message').value

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: {
                chat: chat_enabled,
                scroll: scroll_enabled,
                message: message
            }
        });
    });
});
