/**
 * UrbanIncident Fusion & Causal Intelligence
 * Official Stitch Design System Tokens
 * Source: projects/10068096406533480453 (Google Stitch)
 */

export const stitchTokens = {
  colors: {
    // Canvas & Foundation
    background: '#f8faf4',
    surface: '#f8faf4',
    surfaceDim: '#d9dbd4',
    surfaceBright: '#f8faf4',
    surfaceVariant: '#e1e3dd',

    // Surfaces & Containers
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow: '#f2f4ee',
    surfaceContainer: '#edefe8',
    surfaceContainerHigh: '#e7e9e2',
    surfaceContainerHighest: '#e1e3dd',

    // Inks & Typography
    onSurface: '#191c19',          // High emphasis
    onSurfaceVariant: '#444844',   // Medium emphasis
    inverseSurface: '#2e312d',
    inverseOnSurface: '#f0f1eb',

    // Outlines & Dividers
    outline: '#747874',
    outlineVariant: '#c4c7c2',     // Hairline dividers
    surfaceTint: '#5a605a',

    // Primary Brand & CTAs
    primary: '#1f2420',
    primaryContainer: '#343a35',
    onPrimary: '#ffffff',
    onPrimaryContainer: '#9ea49d',
    primaryFixed: '#dee4dd',
    primaryFixedDim: '#c2c8c1',

    // Secondary (Intelligence & Blue Focus)
    secondary: '#2a6194',
    secondaryContainer: '#92c5fd',
    onSecondary: '#ffffff',
    onSecondaryContainer: '#135283',
    secondaryFixed: '#d0e4ff',
    secondaryFixedDim: '#9ccaff',

    // Tertiary (Telemetry Normal / Green Status)
    tertiary: '#002a15',
    tertiaryContainer: '#004225',
    onTertiary: '#ffffff',
    onTertiaryContainer: '#68b184',
    tertiaryFixed: '#a8f3c1',
    tertiaryFixedDim: '#8cd6a6',

    // Error & Critical Status
    error: '#ba1a1a',
    errorContainer: '#ffdad6',
    onError: '#ffffff',
    onErrorContainer: '#93000a',

    // Operational Status Accents
    status: {
      critical: {
        text: '#b42318',
        bg: '#fdf2f2',
        border: '#fecdca',
        dot: '#ba1a1a',
      },
      warning: {
        text: '#a15c07',
        bg: '#fefbe8',
        border: '#fedf89',
        dot: '#a15c07',
      },
      verified: {
        text: '#28724a',
        bg: '#edf7f1',
        border: '#c2e5d3',
        dot: '#28724a',
      },
      info: {
        text: '#2a6194',
        bg: '#d0e4ff',
        border: '#92c5fd',
        dot: '#2a6194',
      },
      neutral: {
        text: '#444844',
        bg: '#edefe8',
        border: '#c4c7c2',
        dot: '#747874',
      },
    },
  },

  typography: {
    fontSans: "'Inter', system-ui, -apple-system, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },

  radii: {
    sm: '0.25rem',   // 4px
    DEFAULT: '0.25rem',
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    full: '9999px',
  },

  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
  },
} as const;

export const tokens = stitchTokens;
export type DesignTokens = typeof stitchTokens;
