import React from 'react';

interface RGBTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p' | 'div';
}

const RGBText: React.FC<RGBTextProps> = ({ text, className = '', as: Tag = 'h1' }) => {
  return (
    <Tag className={`rgb-text font-bold tracking-wider ${className}`}>
      {text}
    </Tag>
  );
};

export default RGBText;
