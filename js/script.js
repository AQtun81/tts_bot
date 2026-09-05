const messageElements = [];
const messageElementsCount = 1024;
let messageElementsCounter = 0;
let AudioPlayer = new Audio();
let IsPlaying = false;

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
    await new Promise(resolve => setTimeout(resolve, 1000));

    let volume = Number(window.localStorage.getItem('volume'));
    let channel = String(window.localStorage.getItem('channel'));
    let autoConnect = window.localStorage.getItem('auto-connect') === 'true';
    let secret = String(window.localStorage.getItem('secret'));

    document.getElementById("volume").value = volume * 100;
    document.getElementById("channel").value = channel;
    document.getElementById("auto-connect").checked = autoConnect;
    document.getElementById("secret").value = secret;

    AudioPlayer.volume = volume;
    window.cs.setChannelName(channel);
    window.cs.setSecretKey(secret);
    if (autoConnect) connectToChat();
}

function displayChatMessage(username, color, msgContent)
{
    const parentElement = messageElements[messageElementsCounter].parentElement;
    if (parentElement) parentElement.appendChild(messageElements[messageElementsCounter]);
    
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
    AudioPlayer.load();
    
    const blob = new Blob([dataBytes], {
        type: "audio/mpeg"
    });
    
    let currentUrl = URL.createObjectURL(blob);

    AudioPlayer = new Audio();
    AudioPlayer.src = currentUrl;
    AudioPlayer.preload = "auto";

    await AudioPlayer.play();
    
    IsPlaying = true;
    
    await new Promise(resolve => {
        AudioPlayer.addEventListener("ended", resolve, { once: true });
    });
    
    IsPlaying = false;
}

function isAudioPlaying()
{
    return IsPlaying;
}

function setAudioVolume(value)
{
    window.localStorage.setItem('volume', value);
    AudioPlayer.volume = value;
}

function setChannelName(value)
{
    window.localStorage.setItem('channel', value);
    window.cs.setChannelName(value);
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
    window.cs.connectToChat();
}

onLoad();