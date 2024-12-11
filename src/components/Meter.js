import React from 'react';

export const Meter = ({ progress }) => {
    const circumference = 534.07; // Circumference of the circle (2 * pi * radius)
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="meter-container" style={{ width: '100%', height: 'auto', maxWidth: '200px' }}>
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
            >
                <circle
                    cx="100"
                    cy="100"
                    r="85"
                    className="odometer-background"
                    style={{ stroke: '#e6e6e6', strokeWidth: 20 }}
                />
                <circle
                    cx="100"
                    cy="100"
                    r="85"
                    className="odometer-progress"
                    style={{
                        stroke: 'url(#gradient)',
                        strokeWidth: 20,
                        strokeLinecap: 'round',
                        transform: 'rotate(-90deg)',
                        transformOrigin: '50% 50%',
                        strokeDasharray: circumference,
                        strokeDashoffset: offset,
                    }}
                />
                <text
                    x="50%"
                    y="50%"
                    className="odometer-text"
                    style={{ fontFamily: 'Arial, sans-serif', fontSize: '24px', fill: 'white' }}
                    dominantBaseline="middle"
                    textAnchor="middle"
                >
                    {progress}%
                </text>
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(0, 139, 104, 0.9)"/>
                        <stop offset="40%" stopColor="rgba(0, 176, 141, 0.8)"/>
                        <stop offset="70%" stopColor="rgba(0, 139, 104, 0.7)"/>
                        <stop offset="100%" stopColor="rgba(0, 95, 67, 0.8)"/>
                    </linearGradient>

                </defs>
            </svg>
        </div>
    );
};
