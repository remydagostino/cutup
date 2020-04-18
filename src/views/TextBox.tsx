import * as React from 'react';

import * as Types from '../types';

interface TextBoxProps {
  textBoxData: Types.TextBox;
  updateTextBox: (data: Types.TextBox) => void;
  deleteTextBox: (id: string) => void;
}

export default class TextBox extends React.Component<TextBoxProps> {
  render() {
    const data = this.props.textBoxData;

    return (
      <div className='ca-textbox'>
        <div 
          className='ca-textbox_editable ca-oldyfont'
          spellCheck='false'
          role='textbox'
          contentEditable='true'
          onBlur={(ev) => this.saveChanges(ev.target.innerHTML)}
          dangerouslySetInnerHTML={sanitizeHtml(data.text)}
        ></div>
        <div className='ca-textbox_controls'>
          <div className='ca-textbox_line-height-increase'></div>
          <div className='ca-textbox_line-height-decrease'></div>
        </div>
      </div>
    );
  }

  saveChanges(newText: string) {
    if (newText.trim() !== '') {
      this.props.updateTextBox({
        ...this.props.textBoxData,
        text: newText
      });
    } else {
      this.props.deleteTextBox(this.props.textBoxData.id);
    }
  }
};

function sanitizeHtml(htmlString: string): { __html: string } {
  // TODO: ..... :P
  return {
    __html: htmlString
  }
} 