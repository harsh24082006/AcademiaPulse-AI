import React from 'react';

const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    fill="none"
    {...props}
  >
    <path
      d="M50 10 L10 90 H25 L35 60 H65 L75 90 H90 Z"
      stroke="currentColor"
      strokeWidth="8"
      className="text-indigo-600 dark:text-indigo-400"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <path
      d="M30 75 C 40 55, 60 55, 70 75"
      stroke="currentColor"
      strokeWidth="6"
      className="text-sky-500 dark:text-sky-400"
      strokeLinecap="round"
    />
  </svg>
);

// Base64 encoded version for embedding in exports
export const LOGO_BASE64 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSJub25lIj48cGF0aCBkPSJNNTAgMTAgTDEwIDkwIEgyNSBMMzUgNjAgSDY1IEw3NSA5MCBIOTAgWiIgc3Ryb2tlPSIjNDMzOGNhIiBzdHJva2Utd2lkdGg9IjgiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0zMCA3NSBDIDQwIDU1LCA2MCA1NSwgNzAgNzUiIHN0cm9rZT0iIzA4OTFkMCIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=';

export default Logo;