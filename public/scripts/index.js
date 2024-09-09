const editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome");
editor.session.setMode("ace/mode/markdown");

const socket = io();

let isSystemSettingValue = false;

// イベントの受信
socket.on("insert", (msg) => {
  isSystemSettingValue = true;
  msg.lines.reverse();
  for (let i = 0; i < msg.lines.length; i++) {
    const br = msg.lines.length - 1 === i ? "" : "\n";
    editor.session.insert(msg.start, br + msg.lines[i]);
  }
  isSystemSettingValue = false;
});

socket.on("remove", (msg) => {
  isSystemSettingValue = true;
  editor.session.remove({ start: msg.start, end: msg.end });
  isSystemSettingValue = false;
});

// イベントの発信
editor.session.on('change', (delta) => {
  if (isSystemSettingValue) {
    return;
  }
  const channelId = 'channel1';

  socket.emit("change", {
    delta: delta,
    channelId: channelId,
  });
});
