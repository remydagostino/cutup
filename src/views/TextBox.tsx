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

    return (
      <div className='ca-textbox'>
        <ul className='ca-textbox_lines ca-textbox_debugLines'>
          {data.lines.map((line, i) => (<li className='ca-textbox_textstyle' key={i}>{line}</li>))}
        </ul>
        <div className='ca-textbox_controls'>
          <div className='ca-textbox_line-height-increase'></div>
          <div className='ca-textbox_line-height-decrease'></div>
        </div>
      </div>
    );
  }
};

function spacingToStyle(spacing: number): React.CSSProperties {
  const ems = spacing + 0.5;

  return {
    lineHeight: `${ems}em`,
    top: `${-1.5 + (ems / 2)}em`,
    paddingTop: `${Math.max(3 - ems, 0)}em`
  };
}

// Quick hack for measuring purposes
// TODO: Move this into a helper function for easier testing
function measureContentHeight(className: string, width: number, spacing: number, content: string) {
  const measureDiv = document.createElement('div')

  try {
    measureDiv.className = className;
    measureDiv.style.visibility = 'hidden';
    measureDiv.style.width = `${width}px`;
    measureDiv.style.whiteSpace = 'pre-wrap';
    measureDiv.style.lineHeight = String(spacingToStyle(spacing).lineHeight);
    measureDiv.innerText = content + '&nbsp;';

    document.body.appendChild(measureDiv);

    return measureDiv.clientHeight;
  } 
  catch (ex) {
    return 0;
  }
  finally {
    measureDiv.remove();
  }
}
