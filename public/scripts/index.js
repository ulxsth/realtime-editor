const editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome");
editor.session.setMode("ace/mode/markdown");

const socket = io();

let isSystemSettingValue = false;

// イベントの受信
socket.on("insert", (msg) => {
  isSystemSettingValue = true;
  console.log(msg);
  editor.session.insert(msg.start, msg.lines[0]);
  isSystemSettingValue = false;
});

socket.on("remove", (msg) => {
  isSystemSettingValue = true;
  console.log(msg);
  editor.session.remove(new Range(msg.start.row, msg.start.column, msg.end.row, msg.end.column));
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
