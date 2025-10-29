import React from 'react';

const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12l8.954-8.955a.75.75 0 011.06 0l8.955 8.955M2.25 12v8.25a.75.75 0 00.75.75h3.75a.75.75 0 00.75-.75V16.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v3.75a.75.75 0 00.75.75h3.75a.75.75 0 00.75-.75V12m-18 0l8.954-8.955a.75.75 0 011.06 0l8.955 8.955"
    />
  </svg>
);

export default HomeIcon;