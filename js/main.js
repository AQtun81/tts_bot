import { dotnet } from '../_framework/dotnet.js'

const { setModuleImports, getAssemblyExports, getConfig } = await dotnet
    .withDiagnosticTracing(false)
    .withApplicationArgumentsFromQuery()
    .create();

setModuleImports('main.js', {
    SetInnerText:       (elementId, text)             => { document.getElementById(elementId).innerHTML = text; },
    DisplayChatMessage: (username, color, msgContent) => { displayChatMessage(username, color, msgContent) },
    PlayAudio:          (dataBytes)                   => { playAudio(dataBytes) },
    IsAudioPlaying:     ()                            => { isAudioPlaying() },
    SetAudioVolume:     (value)                       => { setAudioVolume(value) }
});

const config = getConfig();
const exports = await getAssemblyExports(config.mainAssemblyName);

window.cs = {
    playTTS:            (text) => exports.Program.PlayTTS(text),
    setChannelName:     (text) => exports.Program.SetChannelName(text),
    setSecretKey:       (text) => exports.Program.SetSecretKey(text),
    connectToChat:       (text) => exports.Program.ConnectToChat()
};

await dotnet.run();