import { RotatingLines } from 'react-loader-spinner';
import React from 'react';

export default function SpinningFooter({ className, text, style, rotationStyle }) {
  className = className ?? 'saving';

  return (
    <div className={className}>
      <span
        className="saving visually-hidden"
        style={{
          marginLeft: '25px', marginBottom: '5px',
        }}
        {...style}
      >
        {text}
      </span>
      <RotatingLines
        strokeColor="grey"
        strokeWidth="5"
        animationDuration="0.75"
        width="20"
        visible={true}
        {...rotationStyle}
      />
    </div>);
}