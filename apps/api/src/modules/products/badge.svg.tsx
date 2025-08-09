import React from 'react';

export function BadgeSvg(props: {
  text: string;
  voteCount: number;
  theme: 'light' | 'dark';
}) {
  const { text, voteCount, theme } = props;
  const bgColor = theme === 'dark' ? '#1f2937' : '#ffffff';
  const textColor = theme === 'dark' ? '#f9fafb' : '#111827';
  const textColorSecondary = theme === 'dark' ? '#9ca3af' : '#6b7280';
  const base64 =
    'data:image/png;base64,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';

  return (
    <svg width="180" height="54" xmlns="http://www.w3.org/2000/svg">
      <rect
        width="100%"
        height="100%"
        fill={bgColor}
        stroke={'#e5e7eb'}
        rx="12"
      />
      <image
        href={base64}
        x="15"
        y="15"
        width="24"
        height="24"
      />
      <text
        x="48"
        y="22"
        fontFamily="Arial, sans-serif"
        fontSize="10"
        fill={textColorSecondary}
      >
        {text}
      </text>
      <text
        x="48"
        y="40"
        fontFamily="Arial, sans-serif"
        fontSize="16"
        fill={textColor}
        fontWeight="bold"
      >
        FF2050.AI
      </text>

      <text
        x="150"
        y="24"
        textAnchor={'middle'}
        fontSize="14"
        fill="#facc15">
        ▲
      </text>
      <text
        x="150"
        y="40"
        textAnchor={'middle'}
        fontFamily="Arial, sans-serif"
        fontSize="12"
        fontWeight="bold"
        fill={textColor}
      >
        {voteCount}
      </text>
    </svg>
  );
}
