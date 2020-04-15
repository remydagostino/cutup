import * as React from 'react';

import * as Types from '../types';

export default function TextBox(data: Types.TextBox) {
  return (
    <div className='ca-text-box'>
      {data.text}
    </div>
  );
};