import * as React from 'React';
import * as Types from './types'
import * as TextLines from './data/text-lines';

import CutUpCanvas from './views/CutUpCanvas';
import EditOverlay from './views/EditOverlay';

export interface CutUpAppProps {

}

interface CutUpAppState {
  textBoxes: Array<Types.TextBox>;
  counter: number;
  visualDebugMode: boolean;
  textEditContent: null | string;
}


export default class CutUpApp extends React.Component<CutUpAppProps, CutUpAppState> {
  globalKeydownHandler: (ev: KeyboardEvent) => void;

  constructor(props: CutUpAppProps) {
    super(props);

    this.state = {
      textBoxes: [],
      counter: 1,
      visualDebugMode: false,
      textEditContent: null
    };

    this.globalKeydownHandler = (...args) => { 
      return globalKeydownHandler.apply(this, args);
    }
  }

  openTextEdit() {
    // TODO: position, size should be dependent on current viewport
    this.setState({textEditContent: ''});
  }

  createTextBox() {
    this.setState((state) => {
      const textBox = textToTextbox(String(state.counter), state.textEditContent);

      // For some reason, creating a new text box was not possible
      // TODO: display the error somehow
      if (textBox === null) {
        return null;
      } 

      return {
        counter: state.counter + 1,
        textBoxes: state.textBoxes.concat(textBox),
        textEditContent: null
      };
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

  updateTextEditContent(text: string) {
    this.setState({ textEditContent: text });
  }

  render() {
    const { textEditContent } = this.state;

    const editingOverlay = (textEditContent !== null) 
      ? (
          <EditOverlay 
            content={textEditContent} 
            updateContent={(text: string) => this.updateTextEditContent(text)} 
          />
        )
      : null

    const buttonSet = [
      (textEditContent === null && 
        <button key='add' className='ca-app_primaryButton ca-box-add-btn' onClick={() => { this.openTextEdit(); }}>
          <span className='ca-app_primaryButtonText'>+</span>
        </button>
      ),
      (textEditContent !== null && 
        <button key='commit' className='ca-app_primaryButton ca-box-commit-btn' onClick={() => { this.createTextBox(); }}>
          <span className='ca-app_primaryButtonText'>✓</span>
        </button> 
      )
    ].filter(Boolean);

    return (
      <div className={'ca-app' + (this.state.visualDebugMode ? ' ca-app_visualDebugMode' : '')}>
        <CutUpCanvas 
          textBoxes={this.state.textBoxes} 
          updateTextBox={(data: Types.TextBox) => { this.updateTextBox(data); } }
          deleteTextBox={(id: string) => { this.deleteTextBox(id); } }
        />
        <div className='ca-box-control-panel'>
          {buttonSet} 
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

function textToTextbox(id: string, text: string): null | Types.TextBox {
  const measuredText = measureText(text, 'ca-textbox_textstyle', 300);

  if (measuredText === null) {
    return null;
  }

  return {
    id,
    x: 50,
    y: 50,
    height: measuredText.lines.length * 24,
    width: measuredText.maxWidth,
    lines: measuredText.lines.map((line) => ({ text: line, xOffset: 0 })),
    text
  };
}

function measureText(text: string, className: string, width: number): null | ({ lines: Array<string>, maxWidth: number }) {
  return TextLines.inTextWrapper(window.document, className, width, (wrapper) => {
    const lines = TextLines.paragraphsToLines(TextLines.textToParagraphs(text), width, wrapper);
    const widestLine = lines.reduce((acc, line) => Math.max(acc, wrapper.measure(line)), 0);

    return {
      lines,
      maxWidth: widestLine
    };
  });
}


function globalKeydownHandler(this: CutUpApp, ev: KeyboardEvent): void {
  // : Shift + '`'
  if (ev.shiftKey === true && ev.keyCode === 192) {
    this.setState((state) => ({ visualDebugMode: !state.visualDebugMode }));
  }
  // : escape
  else if (ev.keyCode === 27) {
    this.setState({ textEditContent: null });
  }
}


      
