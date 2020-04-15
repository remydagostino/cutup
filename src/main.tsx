import * as React from 'react';
import * as ReactDOM from 'react-dom';

import CutUpApp from './CutUpApp';

import './main.css';

const container = document.createElement('div');
const idAttribute = document.createAttribute('id');
idAttribute.value = 'app-container';
container.setAttributeNode(idAttribute);
document.body.appendChild(container);

ReactDOM.render(<CutUpApp />, container);
