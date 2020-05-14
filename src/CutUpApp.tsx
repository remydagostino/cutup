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

  createTextBox() {
    // TODO: position, size should be dependent on current viewport

    this.setState((state, props) => ({
      counter: state.counter + 1,
      textBoxes: state.textBoxes.concat({
        id: String(state.counter),
        x: 50,
        y: 50,
        height: 24 * 4,
        width: 300,
        lines: [`${state.counter}a Hello world`, `${state.counter}b I am a banana`, `${state.counter}c merge text`, `${state.counter}d whatever happens`].map(
          (text) => ({ text, xOffset: 0 })
        ),
        text: `${state.counter}a\n${state.counter}b\n${state.counter}c\n${state.counter}d\n`
      })
    }));
  }

  updateTextBox(newData: Types.TextBox) {
    this.setState((state, props) => ({
      textBoxes: state.textBoxes.map((data) => 
        data.id === newData.id ? newData : data
      )
    }));
  }

  deleteTextBox(id: string) {
    this.setState((state, props) => ({
      textBoxes: state.textBoxes.filter((data) => data.id !== id)
    }));
  }

  render() {
    return (
      <div className='ca-app'>
        <CutUpCanvas 
          textBoxes={this.state.textBoxes} 
          updateTextBox={(data: Types.TextBox) => { this.updateTextBox(data); } }
          deleteTextBox={(id: string) => { this.deleteTextBox(id); } }
        />
        <div className='ca-box-control-panel'>
          <button className='ca-box-add-btn' onClick={() => { this.createTextBox(); }}>
            <span className='ca-box-add-btn_text'>+</span>
          </button> 
        </div>
      </div>
    );
  }
}