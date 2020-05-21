import * as React from 'React';
import * as Types from './types'
import * as TextLines from './data/text-lines';
import { cynicalInstructions } from './data/initial-state';

import CutUpCanvas from './views/CutUpCanvas';
import EditOverlay from './views/EditOverlay';

export interface CutUpAppProps {

}

export default class CutUpApp extends React.Component<CutUpAppProps, Types.CutUpAppState> {
  globalKeydownHandler: (ev: KeyboardEvent) => void;

  constructor(props: CutUpAppProps) {
    super(props);

    this.state = cynicalInstructions();

    this.globalKeydownHandler = (...args) => { 
      return globalKeydownHandler.apply(this, args);
    }

    (window as any).debugAppState = () => {
      console.log(this.state);
    };
  }

  openNewTextEdit() {
    this.setState({textEditContent: ''});
  }

  openTextBoxForEdit(editingTextboxId: string) {
    const textBox = this.state.textBoxes.find(({ id }) => id === editingTextboxId);

    if (textBox) {
      this.setState({
        textEditContent: textBox.text,
        editingTextboxId
      });
    }
  }

  createTextBox() {
    this.setState((state: Types.CutUpAppState) => {
      const newTextBox = textToTextbox(String(state.counter), state.textEditContent);

      // For some reason, creating a new text box was not possible
      // TODO: display the error somehow
      if (newTextBox === null) {
        return null;
      } 

      if (state.editingTextboxId !== null) {
        return {
          counter: null,
          editingTextboxId: null,
          textEditContent: null,
          textBoxes: state.textBoxes.map((textBox) => {
            if (textBox.id === state.editingTextboxId) {
              return {
                id: textBox.id,
                x: textBox.x,
                y: textBox.y,
                height: newTextBox.height,
                width: newTextBox.width,
                lines: newTextBox.lines,
                text: newTextBox.text
              }
            } else {
              return textBox;
            }
          })
        };
      } else {
        return {
          counter: state.counter + 1,
          editingTextboxId: null,
          textEditContent: null,
          textBoxes: state.textBoxes.concat(newTextBox)
        };
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
      selectedTextBox: null,
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
        <button key='add' className='ca-app_primaryButton ca-box-add-btn' onClick={() => { this.openNewTextEdit(); }}>
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
          selectedTextBox={this.state.selectedTextBox}
          updateTextBox={(data: Types.TextBox) => { this.updateTextBox(data); } }
          editTextBoxContent={(id: string) => { this.openTextBoxForEdit(id); } }
          deleteTextBox={(id: string) => { this.deleteTextBox(id); } }
          updateSelectedTextBox={(selectedTextBox) => this.setState({ selectedTextBox })}
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

  // TODO: position, size should be dependent on current viewport
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


      
