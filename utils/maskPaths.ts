import { ShapeType } from '../types';

export const getMaskPath = (shape: ShapeType, width: number, height: number): string => {
    switch (shape) {
        case ShapeType.Rectangle:
            return `M0,0 H${width} V${height} H0 Z`;
        case ShapeType.Oval:
            return `M${width / 2},0 A${width / 2},${height / 2} 0 1,1 ${width / 2},${height} A${width / 2},${height / 2} 0 1,1 ${width / 2},0 Z`;
        case ShapeType.Triangle:
            return `M${width / 2},0 L${width},${height} L0,${height} Z`;
        case ShapeType.Star:
             const outerR = width / 2;
             const innerR = outerR * 0.4;
             let points = "";
             for (let i = 0; i < 10; i++) {
                 const r = (i % 2 === 0) ? outerR : innerR;
                 const angle = i * Math.PI / 5;
                 const x = (width / 2) + r * Math.sin(angle);
                 const y = (height / 2) - r * Math.cos(angle);
                 points += `${x},${y} `;
             }
             return `M${points.slice(0, -1)} Z`;
        case ShapeType.Pentagon:
            return `M${width / 2},0 L${width},${height * 0.38} L${width * 0.82},${height} L${width * 0.18},${height} L0,${height * 0.38} Z`;
        case ShapeType.Hexagon:
            return `M${width / 2},0 L${width},${height / 4} V${height * 3 / 4} L${width / 2},${height} L0,${height * 3 / 4} V${height / 4} Z`;
        case ShapeType.Octagon:
            return `M${width * 0.3},0 H${width * 0.7} L${width},${height * 0.3} V${height * 0.7} L${width * 0.7},${height} H${width * 0.3} L0,${height * 0.7} V${height * 0.3} Z`;
        case ShapeType.Rhombus:
            return `M${width / 2},0 L${width},${height / 2} L${width / 2},${height} L0,${height / 2} Z`;
        case ShapeType.Cross:
            return `M${width * 0.35},0 H${width * 0.65} V${height * 0.35} H${width} V${height * 0.65} H${width * 0.65} V${height} H${width * 0.35} V${height * 0.65} H0 V${height * 0.35} H${width * 0.35} Z`;
        default:
            return `M0,0 H${width} V${height} H0 Z`;
    }
};