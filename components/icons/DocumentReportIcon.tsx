import React from 'react';

const DocumentReportIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M9 17.25v1.5m3-1.5v1.5m3-1.5v1.5M9 13.5v-1.5m3 1.5v-1.5m3 1.5v-1.5M3 13.5h18M3 7.5h18m-9 12.75h.008v.008H12v-.008z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6z"
    />
  </svg>
);

export default DocumentReportIcon;