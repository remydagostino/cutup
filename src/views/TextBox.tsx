import * as React from 'react';

import * as Types from '../types';

interface TextBoxProps {
  textBoxData: Types.TextBox;
  spacing: number;
  updateTextBox: (data: Types.TextBox) => void;
  deleteTextBox: (id: string) => void;
}

export default class TextBox extends React.Component<TextBoxProps> {
  render() {
    const data = this.props.textBoxData;

    const lines = data.lines.map((line, i) => {
      return (
        <li className='ca-textbox_textstyle ca-textbox_lines_line' key={i} style={({ left: `${line.xOffset}px` })}>{line.text}</li>
      )
    });

    return (
      <div className='ca-textbox'>
        <ul className='ca-textbox_lines'>
          {lines}
        </ul>
      </div>
    );
  }
};

