class AceAdapter {
  constructor(public editor: AceAjax.Editor) {
    editor.on("change", this.onChange);
  }

  private onChange = (delta: AceAjax.Delta) => {
    console.log("Delta: ", delta);

    // delta から Operation を生成

  }
}
