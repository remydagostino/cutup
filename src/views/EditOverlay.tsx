import * as React from 'react';

import * as Types from '../types';

interface EditOverlayProps {
  content: string;
  updateContent: (text: string) => void;
  closeOverlay: () => void;
}

export default class EditOverlay extends React.Component<EditOverlayProps> {
  render() {
    const { content, updateContent } = this.props;

    return (
      <div className='ca-editOverlay'>
        <div className='ca-editOverlay_paper'>
          <textarea
            value={content}
            onChange={(ev) => { updateContent((ev.target as HTMLTextAreaElement).value) }}
          ></textarea>
        </div>
        <button 
          className='ca-editOverlay_close'
          onClick={(ev) => this.props.closeOverlay()}
          title='Close overlay'
        >×</button>
      </div>
    );
  }
};

