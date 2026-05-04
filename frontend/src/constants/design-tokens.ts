import tokens from './design-tokens.json';

export type Tokens = typeof tokens;

export const DESIGN_TOKENS: Tokens = tokens;

export const COLORS = DESIGN_TOKENS.colors;
export const SPACING = DESIGN_TOKENS.spacing;
export const RADII = DESIGN_TOKENS.radii;
export const FONT = DESIGN_TOKENS.font;

export default DESIGN_TOKENS;
