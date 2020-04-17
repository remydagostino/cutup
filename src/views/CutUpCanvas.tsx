import * as React from 'react'

import TextBox from './TextBox';
import * as Types from '../types'

export interface CutUpCanvasProps {
  textBoxes: Array<Types.TextBox>;
  updateTextBox: (data: Types.TextBox) => void;
  deleteTextBox: (id: string) => void;
}

export interface CutUpCanvasState {
  draggingBoxId: null | string;
  dragOffsetX: null | number;
  dragOffsetY: null | number;
}

export default class CutUpCanvas extends React.Component<CutUpCanvasProps, CutUpCanvasState> {
  constructor(props: CutUpCanvasProps) {
    super(props);

    this.state = {
      draggingBoxId: null,
      dragOffsetX: null,
      dragOffsetY: null
    };
  }

  render() {
    const boxViews = this.props.textBoxes.map((data) => {
      return (
        <div 
          className='ca-canvas_box' 
          style={boxToCss(data)} 
          key={data.id}
          onMouseDown={(ev) => { this.boxMouseDown(data.id, ev); }}
        >
          <TextBox {...data} />
        </div>
      )
    });

    return (
      <div 
        className='ca-canvas' 
        onMouseMove={(ev) => { this.canvasMouseMove(ev); }}
        onMouseUp={(ev) => { this.resetDragState(ev); }}
      >
        {boxViews}
      </div>
    );
  }

  boxMouseDown(boxId: string, ev: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const boxData = this.props.textBoxes.find(({ id }) => id === boxId);

    this.setState({ 
      draggingBoxId: boxId,
      dragOffsetX: ev.clientX - boxData.x,
      dragOffsetY: ev.clientY - boxData.y
    });
  }

  canvasMouseMove(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const { draggingBoxId, dragOffsetX, dragOffsetY } = this.state;

    if (draggingBoxId != null && dragOffsetX != null && dragOffsetY != null) {
      const boxData = this.props.textBoxes.find(({ id }) => id === draggingBoxId);

      this.props.updateTextBox({
        ...boxData,
        x: ev.clientX - dragOffsetX,
        y: ev.clientY - dragOffsetY
      });
    }
  }

  resetDragState(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    this.setState({ 
      draggingBoxId: null,
      dragOffsetX: null,
      dragOffsetY: null
    })
  }
}

function boxToCss(box: Types.Box): React.CSSProperties {
  return {
    left: box.x,
    top: box.y,
    width: box.width,
    height: box.height
  };
}