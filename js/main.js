import { dotnet } from '../_framework/dotnet.js'

const { setModuleImports, getAssemblyExports, getConfig } = await dotnet
    .withDiagnosticTracing(false)
    .withApplicationArgumentsFromQuery()
    .create();

setModuleImports('main.js', {
    SetInnerText:       (elementId, text)             => { document.getElementById(elementId).innerHTML = text; },
    DisplayChatMessage: (username, color, msgContent) => { displayChatMessage(username, color, msgContent) },
    PlayAudio:    async (dataBytes)                   => { await playAudio(dataBytes) },
    SetAudioVolume:     (value)                       => { setAudioVolume(value) },
    OnReady:            ()                            => { document.dispatchEvent(new Event('cs:ready')); window.csReady = true; },
});

const config = getConfig();
const exports = await getAssemblyExports(config.mainAssemblyName);

window.cs = {
    playTTS:            (text)    => exports.Program.PlayTTS(text),
    setSecretKey:       (text)    => exports.Program.SetSecretKey(text),
    connectToChat:      (channel) => exports.Program.ConnectToChat(channel)
};

await dotnet.run();