import React from 'react';
import { TextElement } from '../types';

/**
 * Generates SVG <defs> for complex text effects like gradients and shadows.
 * This allows for high-fidelity rendering that can be captured by canvas export tools.
 * @param el The TextElement to generate definitions for.
 * @returns A React.ReactNode containing the SVG <defs> or null if no effects are applied.
 */
// FIX: Rewrote function using React.createElement to prevent JSX parsing errors in a .ts file.
export const getSvgDefs = (el: TextElement): React.ReactNode => {
    const gradientId = `gradient-${el.id}`;
    const shadowId = `shadow-${el.id}`;

    const defs: React.ReactNode[] = [];

    if (el.fill.type === 'GRADIENT') {
        const gradient = el.fill.gradient;
        if (gradient.type === 'LINEAR') {
            const rad = gradient.angle * (Math.PI / 180);
            const endX = Math.cos(rad);
            const endY = Math.sin(rad);
            const start = { x: 0.5 - endX / 2, y: 0.5 - endY / 2 };
            const end = { x: 0.5 + endX / 2, y: 0.5 + endY / 2 };
            
            defs.push(
                React.createElement(
                    'linearGradient',
                    { key: gradientId, id: gradientId, x1: `${start.x * 100}%`, y1: `${start.y * 100}%`, x2: `${end.x * 100}%`, y2: `${end.y * 100}%` },
                    gradient.stops.map(stop => React.createElement('stop', { key: `${stop.offset}-${stop.color}`, offset: `${stop.offset * 100}%`, stopColor: stop.color }))
                )
            );
        } else if (gradient.type === 'RADIAL') {
             const { cx, cy, r, stops } = gradient;
             defs.push(
                 React.createElement(
                     'radialGradient',
                     { key: gradientId, id: gradientId, cx: `${cx * 100}%`, cy: `${cy * 100}%`, r: `${r * 100}%` },
                     stops.map(stop => React.createElement('stop', { key: `${stop.offset}-${stop.color}`, offset: `${stop.offset * 100}%`, stopColor: stop.color }))
                 )
             );
        }
    }
    
    // Note: The complex multi-layer `text-shadow` for the 3D effect is not replicated here,
    // as it would require extremely complex and slow SVG filters. This implementation
    // ensures standard shadows and glows are exported correctly.
    if (el.effects.shadow) {
        const { color, offsetX, offsetY, blur } = el.effects.shadow;
        defs.push(
            React.createElement(
                'filter',
                { key: shadowId, id: shadowId, x: "-50%", y: "-50%", width: "200%", height: "200%" },
                React.createElement('feDropShadow', { dx: offsetX, dy: offsetY, stdDeviation: blur / 2, floodColor: color })
            )
        );
    }
    
    return defs.length > 0 ? React.createElement('defs', {}, defs) : null;
};

/**
 * Generates the necessary SVG attributes for a <text> element based on TextElement properties.
 * @param el The TextElement to generate props for.
 * @returns An object of SVG attributes.
 */
export const getTextSvgProps = (el: TextElement): React.SVGAttributes<SVGTextElement> => {
    const props: React.SVGAttributes<SVGTextElement> = {
        fontSize: el.fontSize,
        fontFamily: el.fontFamily,
        fontWeight: el.fontWeight,
        fontStyle: el.fontStyle,
        textDecoration: el.textDecoration,
        letterSpacing: el.letterSpacing,
        // FIX: `textTransform` is a CSS property, not a direct SVG attribute. It has been moved to the `style` object.
        style: {
            textTransform: el.textCase === 'none' ? 'none' : el.textCase,
        }
    };
    
    if (el.text.split('\n').length === 1 && !el.path) {
        props.textAnchor = el.textAlign === 'center' ? 'middle' : el.textAlign === 'right' ? 'end' : 'start';
    }

    if (el.fill.type === 'SOLID') {
        props.fill = el.fill.color;
    } else {
        props.fill = `url(#gradient-${el.id})`;
    }
    
    if (el.effects.shadow) {
        props.filter = `url(#shadow-${el.id})`;
    }
    
    if (el.effects.outline) {
        props.stroke = el.effects.outline.color;
        props.strokeWidth = el.effects.outline.width;
        props.strokeLinejoin = 'round';
    }

    return props;
};