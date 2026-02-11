import React from 'react';

interface ToolSliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: number;
    min: number;
    max: number;
}

export const ToolSlider: React.FC<ToolSliderProps> = ({ value, min, max, style, ...props }) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <input
            type="range"
            className="tool-slider"
            min={min}
            max={max}
            value={value}
            style={{
                ...style,
                background: `linear-gradient(to right, #ffffff 0%, #ffffff ${percentage}%, rgba(255, 255, 255, 0.2) ${percentage}%, rgba(255, 255, 255, 0.2) 100%)`
            }}
            {...props}
        />
    );
};
