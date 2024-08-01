chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.action.type === 'fromContent') {

        if (message.action.data === 'alarm') {

            chrome.runtime.sendMessage({
                action: {
                    type: 'fromBackground',
                    data: 'alarm'
                }
            });

        }

    }

});
