import * as React from 'react'

import TextBox from './TextBox';
import * as Types from '../types'

export interface CutUpCanvasProps {
  textBoxes: Array<Types.TextBox>;
  selectedTextBox: null | string;
  editTextBoxContent: (id: string) => void;
  updateTextBox: (textBox: Types.TextBox) => void;
  deleteTextBox: (id: string) => void;
  updateSelectedTextBox: (id: string | null) => void;
}

export interface CutUpCanvasState {
  draggingBoxId: null | string;
}

export default class CutUpCanvas extends React.Component<CutUpCanvasProps, CutUpCanvasState> {
  rootEl: React.RefObject<HTMLDivElement>;
  dragOffsetX: null | number;
  dragOffsetY: null | number;

  constructor(props: CutUpCanvasProps) {
    super(props);

    this.rootEl = React.createRef();
    this.dragOffsetX = null;
    this.dragOffsetY = null;

    this.state = {
      draggingBoxId: null,
    };
  }

  render() {
    // TODO: colliding and laying out boxes should be it's own component
    const { selectedTextBox } = this.props;
    const boxes: Array<Types.TextBox> = collideBoxes(this.props.textBoxes);

    const boxViews = boxes.map((data, index) => {
      return (
        <div 
          className='ca-canvas_box' 
          style={boxToCss(data)} 
          key={index}
        >
          <TextBox textBoxData={data} />
        </div>
      )
    });

    // TODO: grabbers should be collected into another view
    const grabberViews = this.props.textBoxes.map((data, index) => {
      const isSelected = selectedTextBox === data.id;

      return (
        <div 
          className={'ca-canvas_boxGrabber ' + (isSelected ? 'ca-canvas_boxGrabber_selected' : '') }
          style={({ left: data.x, top: data.y })}
          key={data.id}
        >
          <div 
            className='ca-canvas_boxGrabberLabel' 
            onPointerDown={(ev) => { this.boxMouseDown(data.id, ev.clientX, ev.clientY); }}
          >{data.id}</div>

          <div 
            className='ca-canvas_boxGrabberEditButton' 
            onPointerDown={(ev) => { this.props.editTextBoxContent(data.id); }}
          >+</div>

          <div 
            className='ca-canvas_boxGrabberDeleteButton' 
            onPointerDown={(ev) => { this.props.deleteTextBox(data.id); }}
          >×</div>
        </div>
      )
    });

    const classNames = [
      'ca-canvas', 
      this.state.draggingBoxId != null ? 'ca-canvas__dragging' : false
    ].filter(Boolean);

    const canvasHeight = boxes.reduce((acc, box) => {
      return Math.max(acc, box.y + box.height);
    }, this.rootEl.current ? this.rootEl.current.clientHeight : 0);

    return (
      <div
        ref={this.rootEl}
        className={classNames.join(' ')}
        style={({ height: canvasHeight })}
        onPointerMove={(ev) => { this.canvasMouseMove(ev); }}
        onPointerUp={(ev) => { this.resetDragState(ev); }}
        onPointerDown={(ev) => { this.clearBoxSelection(ev); }}
      >
        <div className='ca-canvas_boxes'>{boxViews}</div>
        <div className='ca-canvas_grabbers'>{grabberViews}</div>
      </div>
    );
  }

  boxMouseDown(boxId: string, clientX: number, clientY: number): void {
    const boxData = this.props.textBoxes.find(({ id }) => id === boxId);

    this.props.updateSelectedTextBox(boxId);

    if (boxData) { 
      const { x, y } = boxData;

      this.dragOffsetX = clientX - x,
      this.dragOffsetY = clientY - y,

      this.setState((state) => ({ draggingBoxId: boxId }));
    }
  }

  canvasMouseMove(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const { dragOffsetX, dragOffsetY } = this;
    const { draggingBoxId } = this.state;

    if (draggingBoxId != null && dragOffsetX != null && dragOffsetY != null) {
      const boxData = this.props.textBoxes.find(({ id }) => id === draggingBoxId);

      this.props.updateTextBox({
        ...boxData,
        x: ev.clientX - dragOffsetX,
        y: ev.clientY - dragOffsetY
      });

      ev.preventDefault();
    }
  }

  resetDragState(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    this.setState({ 
      draggingBoxId: null
    });
  }

  clearBoxSelection(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (ev.target === this.rootEl.current) {
      this.props.updateSelectedTextBox(null);
    }
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
    const restBoxesCollided = collideBoxes(restBoxes);
    const allBoxes = [firstBox].concat(restBoxesCollided)

    // If the later boxes collided, it's possible that they're big enough for us to collide with now
    if (restBoxesCollided.length < restBoxes.length) {
      return collideBoxes(allBoxes);
    } else {
      return allBoxes;
    }
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
    width: Math.max(textBox1.width, textBox2.width) + lines.reduce((acc, l) => Math.max(acc, l.xOffset), 0),
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
