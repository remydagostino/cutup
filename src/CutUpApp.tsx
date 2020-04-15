import * as React from 'React';
import * as Types from './types'

import CutUpCanvas from './views/CutUpCanvas';

export interface CutUpAppProps {

}

interface CutUpAppState {
  textBoxes: Array<Types.TextBox>;
  counter: number;
}


export default class CutUpApp extends React.Component<CutUpAppProps, CutUpAppState> {
  constructor(props: CutUpAppProps) {
    super(props);

    this.state = {
      textBoxes: [],
      counter: 1
    };
  }

  addTextBox() {
    // TODO: position, size should be dependent on current viewport

    this.setState((state, props) => ({
      counter: state.counter + 1,
      textBoxes: state.textBoxes.concat({
        id: String(state.counter),
        x: 50,
        y: 50,
        height: 200,
        width: 300,
        spacing: 2,
        text: 'Hello world'
      })
    }));
  }

  render() {
    return (
      <div className='ca-app'>
        <CutUpCanvas textBoxes={this.state.textBoxes} />
        <div className='ca-box-control-panel'>
          <button className='ca-box-add-btn' onClick={() => { this.addTextBox() }}>
            <span className='ca-box-add-btn_text'>+</span>
          </button> 
        </div>
      </div>
    );
  }
}