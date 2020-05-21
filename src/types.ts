export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TextBox extends Box {
  id: string;
  text: string;
  lines: Array<TextBoxLine>;
}

export interface TextBoxLine {
  text: string;
  xOffset: number;
}

export type TextEditCallback = (text: string) => void;

export interface CutUpAppState {
  textBoxes: Array<TextBox>;
  counter: number;
  visualDebugMode: boolean;
  textEditContent: null | string;
  selectedTextBox: null | string;
}

