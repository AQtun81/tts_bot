const messageElements = [];
const messageElementsCount = 512;
let messageElementsCounter = 0;
let AudioPlayer = new Audio();

{
    const msgContainer = document.getElementById("chatContainer");

    for (let i = 0; i < messageElementsCount; i++)
    {
        const divWrapper = document.createElement("div");

        const username = document.createElement("h4");
        username.className = "chatMessageUsername";
        divWrapper.appendChild(username);

        const msgContent = document.createElement("h4");
        msgContent.className = "chatMessageContents";
        divWrapper.appendChild(msgContent);

        msgContainer.appendChild(divWrapper);
        messageElements.push(divWrapper);
    }
}

async function onLoad()
{
    if (!window.csReady) await new Promise(resolve => document.addEventListener('cs:ready', resolve, { once: true }));

    let volume = Number(window.localStorage.getItem('tts-volume') ?? 0.5);
    let channel = window.localStorage.getItem('channel');
    let autoConnect = window.localStorage.getItem('auto-connect') === 'true';
    let secret = window.localStorage.getItem('secret');

    document.getElementById("volume").value = volume * 100;
    document.getElementById("channel").value = channel;
    document.getElementById("auto-connect").checked = autoConnect;
    document.getElementById("secret").value = secret;

    AudioPlayer.volume = volume;
    window.cs.setSecretKey(secret);
    if (autoConnect) connectToChat();
}

function displayChatMessage(username, color, msgContent)
{
    const parentElement = messageElements[messageElementsCounter].parentElement;
    if (!parentElement) return;
    parentElement.appendChild(messageElements[messageElementsCounter]);
    
    const children = messageElements[messageElementsCounter].children;
    children[0].innerText = username;
    children[0].style.color = color;
    children[1].innerText = msgContent;
    messageElementsCounter += 1;
    messageElementsCounter %= messageElementsCount;
    parentElement.scrollTop = parentElement.scrollHeight;
}


async function playAudio(dataBytes)
{
    AudioPlayer.pause();
    AudioPlayer.removeAttribute("src");
    AudioPlayer.currentTime = 0;
    AudioPlayer.load();
    
    const blob = new Blob([dataBytes], {
        type: "audio/mpeg"
    });

    const abortController = new AbortController();
    let blobUrl;
    try
    {
        blobUrl = URL.createObjectURL(blob);
        AudioPlayer.src = blobUrl;
        AudioPlayer.preload = "auto";

        const playbackEnded = new Promise((resolve, reject) => {
            AudioPlayer.addEventListener("ended", resolve, { once: true, signal: abortController.signal });
            AudioPlayer.addEventListener("error", reject, { once: true, signal: abortController.signal });
        });

        await AudioPlayer.play();
        await playbackEnded;
    }
    finally
    {
        abortController.abort();
        URL.revokeObjectURL(blobUrl);
    }
}

function setAudioVolume(value)
{
    window.localStorage.setItem('tts-volume', value);
    AudioPlayer.volume = value;
}

function setChannelName(value)
{
    window.localStorage.setItem('channel', value);
}

function setSecretKey(value)
{
    window.localStorage.setItem('secret', value);
    window.cs.setSecretKey(value);
}

function setAutoConnect(value)
{
    window.localStorage.setItem('auto-connect', value);
}

function connectToChat()
{
    let channel = window.localStorage.getItem('channel');
    if (!channel) return;

    const connectButton = document.getElementById("connectButton");
    connectButton.disabled = true;
    connectButton.value = `connected to ${channel}`;
    
    window.cs.connectToChat(channel);
}

onLoad();