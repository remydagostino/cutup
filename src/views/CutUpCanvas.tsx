import * as React from 'react'

import TextBox from './TextBox';
import * as Types from '../types'

export interface CutUpCanvasProps {
  textBoxes: Array<Types.TextBox>
}

export default class CutUpCanvas extends React.Component<CutUpCanvasProps> {
  render() {
    const boxViews = this.props.textBoxes.map((data) =>
      (<TextBox key={data.id} {...data} />)
    );

    return (
      <div className='ca-canvas'>
        {boxViews}
      </div>
    );
  }
}