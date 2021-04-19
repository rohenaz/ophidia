import React from 'react';

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width={props.width}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    enableBackground="new 0 0 24 24"
    className={props.className}
    fill="none"
    stroke="currentColor"
    style={props.style}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default CloseIcon;
