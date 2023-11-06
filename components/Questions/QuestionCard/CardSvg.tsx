export const CardSvg = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      width="95"
      height="117"
      viewBox="0 0 95 117"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g filter="url(#filter0_d_37_811)">
        <rect x="4" width="86.4344" height="108.931" rx="6" fill="#29323B" />
        <rect
          x="5.5"
          y="1.5"
          width="83.4344"
          height="105.931"
          rx="4.5"
          stroke="white"
          strokeWidth="3"
        />
      </g>
      <rect
        x="17.0244"
        y="24.8647"
        width="18.9445"
        height="20.1286"
        fill="#83BFC2"
      />
      <rect
        x="38.3364"
        y="59.769"
        width="22.4966"
        height="46.1773"
        fill="#ED688D"
      />
      <circle cx="68.9984" cy="19.0185" r="10.0643" fill="#F9D54F" />
      <defs>
        <filter
          id="filter0_d_37_811"
          x="0"
          y="0"
          width="94.4346"
          height="116.931"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_37_811"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_37_811"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
