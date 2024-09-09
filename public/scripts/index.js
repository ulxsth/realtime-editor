const editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome");
editor.session.setMode("ace/mode/markdown");

const socket = io();

let isSystemSettingValue = false;

// イベントの受信
socket.on("change", (delta) => {
  isSystemSettingValue = true;
  if (delta.action === "insert") {
    delta.lines.reverse();
    for (let i = 0; i < delta.lines.length; i++) {
      const br = delta.lines.length - 1 === i ? "" : "\n";
      editor.session.insert(delta.start, br + delta.lines[i]);
    }
  } else if(delta.action === "remove") {
    editor.session.remove({ start: delta.start, end: delta.end });
  }
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
