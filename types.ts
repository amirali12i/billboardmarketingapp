export enum ElementType {
  Image = 'IMAGE',
  Text = 'TEXT',
  Shape = 'SHAPE',
  Group = 'GROUP',
  Icon = 'ICON',
  VectorShape = 'VECTOR_SHAPE',
}

export enum ShapeType {
  Rectangle = 'RECTANGLE',
  Oval = 'OVAL',
  Triangle = 'TRIANGLE',
  Star = 'STAR',
  Pentagon = 'PENTAGON',
  Hexagon = 'HEXAGON',
  Octagon = 'OCTAGON',
  Rhombus = 'RHOMBUS',
  Cross = 'CROSS',
}

export interface SolidFill {
  type: 'SOLID';
  color: string;
}

export interface LinearGradient {
    type: 'LINEAR';
    angle: number; // degrees
    stops: { offset: number; color: string }[];
}

export interface RadialGradient {
    type: 'RADIAL';
    cx: number; // 0-1
    cy: number; // 0-1
    r: number;  // 0-1
    stops: { offset: number; color: string }[];
}

export type Gradient = LinearGradient | RadialGradient;


export interface GradientFill {
  type: 'GRADIENT';
  gradient: Gradient;
}

export type Fill = SolidFill | GradientFill;

export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity';


interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  rotationX?: number;
  rotationY?: number;
  zIndex: number;
  visible?: boolean;
  locked?: boolean;
  groupId?: string;
  flippedHorizontal?: boolean;
  flippedVertical?: boolean;
  blendMode?: BlendMode;
}

export interface ImageElement extends BaseElement {
  type: ElementType.Image;
  src: string;
  filters: {
    opacity: number;
    brightness: number;
    contrast: number;
    grayscale: number;
    saturate: number;
    hueRotate: number;
  };
  mask?: ShapeType;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isCropping?: boolean;
  naturalWidth: number;
  naturalHeight: number;
}

export interface TextElement extends BaseElement {
  type: ElementType.Text;
  text: string;
  fontSize: number;
  fontFamily: 'Vazirmatn' | 'Lalezar';
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  textAlign: 'left' | 'center' | 'right';
  fill: Fill;
  effects: {
    shadow?: { color: string; offsetX: number; offsetY: number; blur: number };
    outline?: { color: string; width: number };
    threeD?: { depth: number; color: string; direction: number };
  };
  isEditing?: boolean;
  lineHeight: number;
  letterSpacing: number;
  textCase: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  path?: {
      elementId: string;
      startOffset: number; // percentage
  }
}

export interface ShapeElement extends BaseElement {
  type: ElementType.Shape;
  shape: ShapeType;
  fill: Fill;
}

export interface IconElement extends BaseElement {
  type: ElementType.Icon;
  iconName: string;
  fill: SolidFill;
}

export interface VectorShapeElement extends BaseElement {
  type: ElementType.VectorShape;
  shapeName: string;
  fill: Fill;
}

export interface GroupElement extends BaseElement {
  type: ElementType.Group;
  childElementIds: string[];
}

export type CanvasElement = ImageElement | TextElement | ShapeElement | GroupElement | IconElement | VectorShapeElement;

export interface Template {
  id: string;
  name: string;
  // FIX: Using a distributive Omit to correctly type the elements array.
  // `Omit<CanvasElement, ...>` doesn't work well with discriminated unions, as it only considers common properties.
  // This verbose but correct approach ensures each object literal in a template is correctly type-checked against its specific element type.
  elements: (
    | Omit<ImageElement, 'id' | 'zIndex'>
    | Omit<TextElement, 'id' | 'zIndex'>
    | Omit<ShapeElement, 'id' | 'zIndex'>
    | Omit<GroupElement, 'id' | 'zIndex'>
    | Omit<IconElement, 'id' | 'zIndex'>
    | Omit<VectorShapeElement, 'id' | 'zIndex'>
  )[];
}

export interface CopywritingSuggestions {
    headlines: string[];
    slogans: string[];
}

export interface BrandKit {
  colors: string[];
  logo: string | null;
}

export interface Page {
    id: string;
    name: string;
    elements: CanvasElement[];
    history: CanvasElement[][];
    historyIndex: number;
}

export interface Project {
  id: string;
  name: string;
  pages: Page[];
  activePageIndex: number;
  lastModified: number;
}

export interface LayoutSuggestion {
    elementId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
}

export interface AiConcept {
    image: string;
    headline: string;
    slogan: string;
}