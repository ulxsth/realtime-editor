type Operation = string | number;

export class TextOperation {
  /**
   * 一連のテキスト操作を表す操作の配列。
   * この配列は、挿入、削除、または保持のいずれかの操作を表す。
   * 移動：カーソルを進める。正の整数。
   * 挿入：文字列を挿入する。文字列。
   * 削除：文字列を削除する。負の整数。
  */
  private ops: Operation[];

  /**
   * 操作を適用する範囲の文字列の大きさ
  */
  private baseLength: number;

  /**
   * 操作を適用した後の文字列の大きさ
  */
  private targetLength: number;

  constructor() {
    this.ops = []
    this.baseLength = 0;
    this.targetLength = 0;
  }

  private isRetain = (op: Operation): op is number => {
    return typeof op === "number" && op > 0;
  }

  private isInsert = (op: Operation): op is string => {
    return typeof op === "string";
  }

  private isDelete = (op: Operation): op is number => {
    return typeof op === "number" && op < 0;
  }

  /**
   * TextOperation インスタンスに移動操作を追加する。
   * @param n 進める文字数
   * @returns 操作を追加した後の TextOperation インスタンス
   */
  public retain = (n: number): TextOperation => {
    if (n === 0) return this;
    this.baseLength += n;
    this.targetLength += n;

    // 直前の操作が retain であれば、それと結合する
    const previouseOp = this.ops[this.ops.length - 1];
    if (this.isRetain(previouseOp)) {
      this.ops[this.ops.length - 1] = previouseOp + n;
    } else {
      this.ops.push(n);
    }

    return this;
  }

  /**
   * TextOperation インスタンスに挿入操作を追加する。
   * @param str 挿入する文字列
   * @returns 操作を追加した後の TextOperation インスタンス
   */
  public insert = (str: string): TextOperation => {
    if (str === "") return this;
    this.targetLength += str.length;

    // 直前の操作が insert であれば、それと結合する
    const previouseOp = this.ops[this.ops.length - 1];
    if (this.isInsert(previouseOp)) {
      this.ops[this.ops.length - 1] = previouseOp + str;
    } else {
      this.ops.push(str);
    }

    return this;
  }

  /**
   * TextOperation インスタンスに削除操作を追加する。
   * @param n 削除する文字数
   * @returns 操作を追加した後の TextOperation インスタンス
   */
  public delete = (n: number): TextOperation => {
    if (n === 0) return this;
    this.baseLength += n;

    // 直前の操作が delete であれば、それと結合する
    const previouseOp = this.ops[this.ops.length - 1];
    if (this.isDelete(previouseOp)) {
      this.ops[this.ops.length - 1] = previouseOp + n;
    } else {
      this.ops.push(-n);
    }

    return this;
  }

  /**
   * 一連の操作を行った前後で、文字列にまったく変化がないかを判定する。
   * @returns boolean
   */
  public isNoop = (): boolean => {
    return this.ops.length === 0 || (this.ops.length === 1 && this.isRetain(this.ops[0]));
  }

  /**
   * 操作を適用する。
   * @param str 操作を適用する文字列
   * @returns 操作を適用した後の文字列
   * @throws 与えられた文字列と、操作の基準となる文字列の長さが異なる場合
   */
  public apply = (str: string): string => {
    if (this.baseLength !== str.length) {
      throw new Error("The operation's base length must be equal to the string's length.");
    }

    const newStrArr: string[] = [];
    let strIndex = 0;
    for (const op of this.ops) {
      if (this.isRetain(op)) {
        if (strIndex + op > str.length) {
          throw new Error("Operation can't be applied: string is too short.");
        }
        newStrArr.push(str.slice(strIndex, strIndex + op));
        strIndex += op;
      } else if (this.isInsert(op)) {
        newStrArr.push(op);
      } else {
        strIndex -= op;
      }
    }

    if (strIndex !== str.length) {
      throw new Error("The operation didn't operate on the whole string.");
    }

    return newStrArr.join('');
  }
}
