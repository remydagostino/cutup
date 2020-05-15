import * as React from 'React';
import * as Types from './types'

import CutUpCanvas from './views/CutUpCanvas';
import EditOverlay from './views/EditOverlay';

export interface CutUpAppProps {

}

interface CutUpAppState {
  textBoxes: Array<Types.TextBox>;
  counter: number;
  visualDebugMode: boolean;
  textEditContent: null | string;
  textEditCallback: null | Types.TextEditCallback;
}


export default class CutUpApp extends React.Component<CutUpAppProps, CutUpAppState> {
  globalKeydownHandler: (ev: KeyboardEvent) => void;

  constructor(props: CutUpAppProps) {
    super(props);

    this.state = {
      textBoxes: [],
      counter: 1,
      visualDebugMode: false,
      textEditContent: null,
      textEditCallback: null
    };

    this.globalKeydownHandler = (...args) => { 
      return globalKeydownHandler.apply(this, args);
    }
  }

  createTextBox() {
    // TODO: position, size should be dependent on current viewport
    this.setState({
      textEditContent: '',
      textEditCallback: (text: string) => {
        this.setState((state, props) => {
          return {
            counter: state.counter + 1,
            textBoxes: state.textBoxes.concat(textToTextbox(String(state.counter), text))
          };
        });
      }
    });
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
    const { textEditContent, textEditCallback } = this.state;

    const editingOverlay = (textEditContent !== null && textEditCallback !== null) 
      ? (<EditOverlay content={textEditContent} editCallback={textEditCallback} />)
      : null

    return (
      <div className={'ca-app' + (this.state.visualDebugMode ? ' ca-app_visualDebugMode' : '')}>
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
        { editingOverlay }
      </div>
    );
  }

  componentDidMount() {
    window.document.addEventListener('keydown', this.globalKeydownHandler);
  }

  componentWillUnmount() {
    window.document.removeEventListener('keydown', this.globalKeydownHandler);
  }
}

function textToTextbox(id: string, text: string): Types.TextBox {
  return {
    id,
    x: 50,
    y: 50,
    height: 24,
    width: 300,
    lines: [{ text, xOffset: 0 }],
    text
  };
}


function globalKeydownHandler(this: CutUpApp, ev: KeyboardEvent): void {
  // : Shift + '`'
  if (ev.shiftKey === true && ev.keyCode === 192) {
    this.setState((state) => ({ visualDebugMode: !state.visualDebugMode }));
  }
  // : escape
  else if (ev.keyCode === 27) {
    this.setState({ textEditContent: null, textEditCallback: null });
  }
}
