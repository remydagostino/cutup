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
    const boxes: Array<Types.TextBox> = collideBoxes(this.props.textBoxes);

    const boxViews = boxes.map((data, index) => {
      return (
        <div 
          className='ca-canvas_box' 
          style={boxToCss(data)} 
          key={index}
        >
          <TextBox 
            textBoxData={data}
            spacing={this.props.textBoxes.length} 
            updateTextBox={this.props.updateTextBox}
            deleteTextBox={this.props.deleteTextBox} 
          />
        </div>
      )
    });

    const grabberViews = this.props.textBoxes.map((data, index) => {
      return (
        <div 
          className='ca-canvas_box' 
          style={({ left: data.x, top: data.y })}
          key={index}
        >
          <div 
            className='ca-canvas_box-grabber' 
            onMouseDown={(ev) => { this.boxMouseDown(data.id, ev); }}
          >{data.id}</div>
        </div>
      )
    });

    const classNames = [
      'ca-canvas', 
      this.state.draggingBoxId != null ? 'ca-canvas__dragging' : false
    ].filter(Boolean);

    return (
      <div 
        className={classNames.join(' ')}
        onMouseMove={(ev) => { this.canvasMouseMove(ev); }}
        onMouseUp={(ev) => { this.resetDragState(ev); }}
      >
        <div>{boxViews}</div>
        <div>{grabberViews}</div>
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


function collideBoxes(boxes: Array<Types.TextBox>): Array<Types.TextBox> {
  // if no boxes left, return empty list
  // if only one box left, return that box
  if (boxes.length <= 1) {
    return boxes;
  }

  const firstBox = boxes[0];
  const restBoxes = boxes.slice(1);
  const firstCollision = boxes.slice(1).findIndex((otherBox) => {
    return doBoxesOverlap(firstBox, otherBox);
  });

  if (firstCollision === -1) {
    return [firstBox].concat(collideBoxes(restBoxes));
  } else {
    const collidedBox = restBoxes.splice(firstCollision, 1)[0];

    return collideBoxes([mergeTextBoxes(firstBox, collidedBox)].concat(restBoxes));
  }
}

function mergeTextBoxes(textBox1: Types.TextBox, textBox2: Types.TextBox): Types.TextBox {
  const textBox1Lines = textBox1.lines.map((line, index) => {
    return {
      text: line.text,
      xOffset: line.xOffset + (textBox1.x < textBox2.x ? 0 : Math.abs(textBox1.x - textBox2.x)),
      yOffset: textBox1.y + (index * 24)
    };
  });

  const textBox2Lines = textBox2.lines.map((line, index) => {
    return {
      text: line.text,
      xOffset: line.xOffset + (textBox2.x < textBox1.x ? 0 : Math.abs(textBox1.x - textBox2.x)),
      yOffset: textBox2.y + (index * 24)
    };
  });

  const orderedLines = [...textBox1Lines, ...textBox2Lines].sort((l1, l2) => l1.yOffset - l2.yOffset);

  const lines = orderedLines.map(({ text, xOffset }) => ({ text, xOffset }));

  return {
    id: '',
    x: Math.min(textBox1.x, textBox2.x),
    y: Math.min(textBox1.y, textBox2.y),
    height: textBox1.height + textBox2.height,
    width: Math.max(textBox1.width, textBox2.width),
    lines: lines,
    text: lines.map(({ text }) => text).join(' ')
  }
}

function doBoxesOverlap(box1: Types.Box, box2: Types.Box): boolean {
  return (
    box1.x < box2.x + box2.width &&
    box1.x + box1.width > box2.x &&
    box1.y < box2.y + box2.height &&
    box1.y + box1.height > box2.y
  );
}

function boxToCss(box: Types.Box): React.CSSProperties {
  return {
    left: box.x,
    top: box.y,
    width: box.width,
    height: box.height
  };
}
