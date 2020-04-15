import * as React from 'react';

import * as Types from '../types';

export default class TextBox extends React.Component<Types.TextBox> {
  render() {
    const data = this.props;

    return (
      <div className='ca-textbox' style={boxToCss(data)}>
        <textarea 
          className='ca-textbox_editable'
          autoComplete='off'
          spellCheck='false'
        >{data.text}</textarea>
        <div className='ca-textbox_controls'>
          <div className='ca-textbox_grab-handle'></div>
          <div className='ca-textbox_line-height-increase'></div>
          <div className='ca-textbox_line-height-decrease'></div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    // attach drag listeners
  }

  componentWillUnmount() {
    // remove drag listeners
  }
};

function boxToCss(box: Types.Box): React.CSSProperties {
  return {
    left: box.x,
    top: box.y,
    width: box.width,
    height: box.height
  };
}