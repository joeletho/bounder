import React, { memo } from 'react';
import { ControlButton } from '@xyflow/react';

function Button({ id, className, onClick, imageUrl, alt, title, children }) {
  return (
    <ControlButton id={id} onClick={onClick} className={className} title={title}>
      {imageUrl ? <img src={imageUrl} alt={alt} /> : null}
      {children}
    </ControlButton>
  );
}

export default memo(Button);
