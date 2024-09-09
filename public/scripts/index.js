const editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome");
editor.session.setMode("ace/mode/markdown");

const socket = io();

let isSystemSettingValue = false;

// イベントの受信
socket.on("insert", (msg) => {
  isSystemSettingValue = true;
  console.log(msg);
  for (let i = 0; i < msg.lines.length; i++) {
    const br = msg.lines.length - 1 === i ? "" : "\n";
    editor.session.insert(msg.start, br + msg.lines[i]);
  }
  isSystemSettingValue = false;
});

socket.on("remove", (msg) => {
  isSystemSettingValue = true;
  console.log(msg);
  editor.session.remove({start: msg.start, end: msg.end});
  isSystemSettingValue = false;
});

// イベントの発信
editor.session.on('change', (delta) => {
  if (!isSystemSettingValue) {
    const text = editor.getValue();
    const channelId = 'channel1';
    console.log(text);

    socket.emit("change", {
      delta: delta,
      channelId: channelId,
    });
  }
});
