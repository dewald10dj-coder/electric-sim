import React from 'react';
import { ComponentType } from '../types/circuit';

interface ComponentIconProps {
  type: ComponentType;
  size?: number;
}

const ComponentIcon: React.FC<ComponentIconProps> = ({ type, size = 32 }) => {
  const iconStyle = {
    width: size,
    height: size,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  const renderIcon = () => {
    switch (type) {
      case 'resistor':
        return (
          <svg viewBox="0 0 32 32" style={iconStyle}>
            <path d="M4 16h6l2-4 2 8 2-8 2 4h14" />
            <rect x="8" y="12" width="16" height="8" rx="1" />
          </svg>
        );
      
      case 'capacitor':
        return (
          <svg viewBox="0 0 32 32" style={iconStyle}>
            <path d="M4 16h10" />
            <path d="M18 16h10" />
            <line x1="14" y1="8" x2="14" y2="24" />
            <line x1="18" y1="8" x2="18" y2="24" />
          </svg>
        );
      
      case 'inductor':
        return (
          <svg viewBox="0 0 32 32" style={iconStyle}>
            <path d="M4 16h4" />
            <path d="M24 16h4" />
            <path d="M8 16a2 2 0 0 1 4 0a2 2 0 0 1 4 0a2 2 0 0 1 4 0a2 2 0 0 1 4 0" />
          </svg>
        );
      
      case 'diode':
        return (
          <svg viewBox="0 0 32 32" style={iconStyle}>
            <path d="M4 16h8" />
            <path d="M20 16h8" />
            <polygon points="12,8 12,24 20,16" />
            <line x1="20" y1="8" x2="20" y2="24" />
          </svg>
        );
      
      case 'dc_source':
        return (
          <svg viewBox="0 0 32 32" style={iconStyle}>
            <circle cx="16" cy="16" r="12" />
            <line x1="12" y1="16" x2="20" y2="16" />
            <line x1="16" y1="12" x2="16" y2="20" />
          </svg>
        );
      
      case 'ac_source':
        return (
          <svg viewBox="0 0 32 32" style={iconStyle}>
            <circle cx="16" cy="16" r="12" />
            <path d="M10 16c0-4 2-6 6-6s6 2 6 6-2 6-6 6-6-2-6-6z" />
          </svg>
        );
      
      case 'battery':
        return (
          <svg viewBox="0 0 32 32" style={iconStyle}>
            <line x1="8" y1="12" x2="8" y2="20" />
            <line x1="12" y1="10" x2="12" y2="22" />
            <line x1="20" y1="10" x2="20" y2="22" />
            <line x1="24" y1="12" x2="24" y2="20" />
            <path d="M4 16h4M24 16h4" />
          </svg>
        );
      
      case 'switch':
        return (
          <svg viewBox="0 0 32 32" style={iconStyle}>
            <path d="M4 16h8" />
            <path d="M20 16h8" />
            <path d="M12 16l6-4" />
            <circle cx="12" cy="16" r="1" fill="currentColor" />
            <circle cx="20" cy="16" r="1" fill="currentColor" />
          </svg>
        );
      
      case 'relay':
        return (
          <svg viewBox="0 0 32 32" style={iconStyle}>
            <rect x="8" y="8" width="16" height="16" rx="2" />
            <path d="M12 12l8 8M12 20l8-8" />
            <circle cx="6" cy="16" r="2" />
            <circle cx="26" cy="16" r="2" />
          </svg>
        );
      
      case 'contactor':
        return (
          <svg viewBox="0 0 32 32" style={iconStyle}>
            <rect x="6" y="6" width="20" height="20" rx="2" />
            <path d="M10 10l12 12M10 22l12-12" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="16" y1="26" x2="16" y2="30" />
          </svg>
        );
      
      case 'circuit_breaker':
        return (
          <svg viewBox="0 0 32 32" style={iconStyle}>
            <rect x="8" y="8" width="16" height="16" rx="2" />
            <path d="M12 12h8v8h-8z" />
            <line x1="16" y1="4" x2="16" y2="8" />
            <line x1="16" y1="24" x2="16" y2="28" />
          </svg>
        );
      
      case 'voltmeter':
        return (
          <svg viewBox="0 0 32 32" style={iconStyle}>
            <circle cx="16" cy="16" r="12" />
            <text x="16" y="20" textAnchor="middle" fontSize="8" className="fill-current">V</text>
          </svg>
        );
      
      case 'ammeter':
        return (
          <svg viewBox="0 0 32 32" style={iconStyle}>
            <circle cx="16" cy="16" r="12" />
            <text x="16" y="20" textAnchor="middle" fontSize="8" className="fill-current">A</text>
          </svg>
        );
      
      case 'wattmeter':
        return (
          <svg viewBox="0 0 32 32" style={iconStyle}>
            <circle cx="16" cy="16" r="12" />
            <text x="16" y="20" textAnchor="middle" fontSize="8" className="fill-current">W</text>
          </svg>
        );
      
      default:
        return (
          <svg viewBox="0 0 32 32" style={iconStyle}>
            <rect x="8" y="8" width="16" height="16" rx="2" />
          </svg>
        );
    }
  };

  return <div className="text-gray-700 dark:text-gray-300">{renderIcon()}</div>;
};

export default ComponentIcon;