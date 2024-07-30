console.log('content.js loaded')
chat_enabled = false
scroll_enabled = false
my_message = ''

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log(`chat: ${message.action.chat}`)
    chat_enabled = message.action.chat
    console.log(`scroll: ${message.action.scroll}`)
    scroll_enabled = message.action.scroll
    console.log(`message: ${message.action.message}`)
    my_message = message.action.message
})


// =========================

function simulateKeyEvent(element, text) {
    return new Promise((resolve) => {
        let index = 0;

        function typeNextChar() {
            if (index < text.length) {
                const char = text[index];

                const keydownEvent = new KeyboardEvent("keydown", {
                    key: char,
                    code: `Key${char.toUpperCase()}`,
                    keyCode: char.charCodeAt(0),
                    which: char.charCodeAt(0),
                    bubbles: true,
                    cancelable: true,
                });

                const keypressEvent = new KeyboardEvent("keypress", {
                    key: char,
                    code: `Key${char.toUpperCase()}`,
                    keyCode: char.charCodeAt(0),
                    which: char.charCodeAt(0),
                    bubbles: true,
                    cancelable: true,
                });

                const keyupEvent = new KeyboardEvent("keyup", {
                    key: char,
                    code: `Key${char.toUpperCase()}`,
                    keyCode: char.charCodeAt(0),
                    which: char.charCodeAt(0),
                    bubbles: true,
                    cancelable: true,
                });

                element.dispatchEvent(keydownEvent);
                element.dispatchEvent(keypressEvent);
                element.dispatchEvent(keyupEvent);
                element.innerText += char;

                index++;
                setTimeout(typeNextChar, 0); // Adjust typing speed here
            } else {
                resolve();
            }
        }

        typeNextChar();
    });
}

function simulateClick(element) {
    return new Promise((resolve) => {
        function simulateMouseEvent(element, eventName, coordX, coordY) {
            element.dispatchEvent(new MouseEvent(eventName, {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: coordX,
                clientY: coordY,
                button: 0
            }));
        }

        const box = element.getBoundingClientRect();
        const coordX = box.left + (box.right - box.left) / 2;
        const coordY = box.top + (box.bottom - box.top) / 2;

        simulateMouseEvent(element, "mousedown", coordX, coordY);
        setTimeout(() => {
            simulateMouseEvent(element, "mouseup", coordX, coordY);
            setTimeout(() => {
                simulateMouseEvent(element, "click", coordX, coordY);
                resolve();
            }, 0); // Adjust delay between events if needed
        }, 0);
    });
}


async function processMessages() {
    while (true) {
        try {
            textareaDiv = document.querySelector("div.composer_rich_textarea");
            textareaDiv.setAttribute("contenteditable", "true");

            if (document.URL.includes("https://web.rubika.ir/#c=u0EurbN003d15b16388fd565a7121ebc") && chat_enabled) {
                const lastMsg = document.querySelector("div[data-chat-id].bubbles-inner div.bubbles-date-group:last-child div[data-msg-id]:last-child div.bubble");
                if (lastMsg && lastMsg.classList.contains("is-in")) { // if last msg is user
                    const textMsg = document.querySelector('div[data-chat-id].bubbles-inner div.bubbles-date-group:last-child div[data-msg-id]:last-child div.bubble div[rb-copyable]');
                    const userMsg = textMsg.innerText;
                    const outputMsg = my_message + ' : ' + userMsg;
                    console.warn(outputMsg);
                    await simulateKeyEvent(textareaDiv, outputMsg);
                    const sendBtn = document.querySelector('button.send div.c-ripple.rr');
                    if (sendBtn) {
                        await simulateClick(sendBtn);
                    }

                }
            }
            await new Promise(resolve => setTimeout(resolve, 100)); // Adjust polling interval if needed
        } catch (err) {
            console.error(err);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
}

processMessages();

async function processScroll() {
    while (true) {
        try {
            const scrollDownBtn = document.querySelector('button.bubbles-go-down.rbico-arrow_down div.c-ripple.rp');
            if (scrollDownBtn && scroll_enabled) {
                await simulateClick(scrollDownBtn);
            }
            await new Promise(resolve => setTimeout(resolve, 100)); // Adjust polling interval if needed
        } catch (err) {
            console.error(err);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
}

processScroll();
console.warn("done");
