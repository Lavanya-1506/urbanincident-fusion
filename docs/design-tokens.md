# UrbanIncident Fusion — Enterprise Design System & Tokens

This document details the production design tokens, layout hierarchy, and component library for the **UrbanIncident Fusion & Causal Intelligence** platform.

---

## 1. Design Philosophy

- **Restrained Operational Palette**: The command center is designed for operations analysts working in multi-monitor, high-density environments. Surfaces rely on deep midnight-navy and charcoal shades rather than excessive gradients, neon glows, or decorative cards.
- **Data Integrity & Calibrated Metrics**: Operational values, model confidences, and sensor fresh lags are grounded in explicit telemetry contracts without simulated hype or arbitrary percentages.
- **Clear Information Hierarchy**: Information flows from macro-level operational summaries (Dashboard & 3D City) to micro-level evidence inspection (Investigation Workspace).

---

## 2. Color Tokens

### Surface Hierarchy
| Token | Hex Value | Semantic Role |
| :--- | :--- | :--- |
| `surface.base` | `#070b12` | Main viewport canvas |
| `surface.sidebar` | `#0a0f19` | Left navigation rail |
| `surface.card` | `#0f1726` | Primary operational data card |
| `surface.cardHover` | `#141e31` | Interactive table row / card hover |
| `surface.header` | `rgba(10, 15, 25, 0.85)` | Top bar with backdrop blur |
| `surface.popover` | `#162237` | Dropdowns, dialogs, flyouts |
| `surface.tableHeader`| `#0b121e` | Table column headers |
| `surface.input` | `#080d16` | Form inputs and search bar |

### Text & Typography
| Token | Hex Value | Semantic Role |
| :--- | :--- | :--- |
| `text.primary` | `#f8fafc` | Primary titles, critical metric figures |
| `text.secondary` | `#cbd5e1` | Subtitles, body descriptions, table text |
| `text.muted` | `#8493a8` | Unit labels, secondary timestamps, hints |
| `text.disabled` | `#475569` | Inactive buttons, disabled toggles |
| `text.code` | `#38bdf8` | Technical IDs (e.g. `INC-2026-8841`) |

### Semantic Severity & Status
| State | Text | Background | Border | Pulse Dot |
| :--- | :--- | :--- | :--- | :--- |
| **Critical** | `#f87171` | `rgba(239, 68, 68, 0.12)` | `rgba(239, 68, 68, 0.35)` | `#ef4444` |
| **Warning** | `#fbbf24` | `rgba(245, 158, 11, 0.12)` | `rgba(245, 158, 11, 0.35)` | `#f59e0b` |
| **Success** | `#34d399` | `rgba(16, 185, 129, 0.12)` | `rgba(16, 185, 129, 0.35)` | `#10b981` |
| **Info / Active** | `#38bdf8` | `rgba(56, 189, 248, 0.12)` | `rgba(56, 189, 248, 0.35)` | `#38bdf8` |

---

## 3. Radii, Spacing & Shadows

- **Border Radii**:
  - `rounded-xs`: `3px` (badges, tags)
  - `rounded-sm`: `5px` (buttons, inputs)
  - `rounded-md`: `7px` (cards, dialogs)
  - `rounded-lg`: `10px` (modal containers)
- **Shadows**:
  - `shadow-sm`: subtle elevation
  - `shadow-glow-cyan`: `0 0 15px -3px rgba(0, 242, 254, 0.3)`
  - `shadow-glow-red`: `0 0 15px -3px rgba(239, 68, 68, 0.35)`

---

## 4. Reusable UI Components Directory

All core primitives are located in [`src/components/ui/`](file:///c:/Users/Gaurav%20Nilkute/OneDrive/Desktop/urbanincident-fusion/src/components/ui):

1. **`Button.tsx`**: Primary, secondary, danger, ghost, outline variants with loading spinners and accessible keyboard focus-visible rings.
2. **`IconButton.tsx`**: Accessible icon button with title and aria-labels.
3. **`Tooltip.tsx`**: Non-intrusive tooltip for data explanations and latency definitions.
4. **`Badge.tsx`**: Semantic chip with status dot and custom sizing.
5. **`StatusIndicator.tsx`**: Pulsing or static telemetry dot.
6. **`SearchInput.tsx`**: Input field with icon, clear button, and shortcut badge.
7. **`Select.tsx`**: Styled select dropdown with arrow icon.
8. **`Tabs.tsx`**: Clean horizontal tab navigation with badge counts.
9. **`DateRangeControl.tsx`**: Preset temporal observation window picker (1h, 6h, 24h, 7d, Surge Scenario).
10. **`MetricCard.tsx`**: Compact KPI card with trend indicator and contextual metadata.
11. **`IncidentSeverityIndicator.tsx`**: Restrained severity badge with explanatory hover tooltip.
12. **`ConfidenceIndicator.tsx`**: Model confidence score with calibrated certainty tiers.
13. **`SourceHealthIndicator.tsx`**: Protocol indicator and freshness latency metrics.
14. **`DataTable.tsx`**: Full-featured typed table with sorting, row selection, and pagination.
15. **`EvidenceCard.tsx`**: Multi-source evidence item with occurred vs. received timestamps.
16. **`TimelineEventRow.tsx`**: Chronological event entry with payload inspection.
17. **`Skeleton.tsx`**: Accessible skeleton loader.
18. **`EmptyState.tsx`**: Illustrated empty state with action trigger.
19. **`ErrorPanel.tsx`**: Error panel with retry callback.
20. **`ConfirmationDialog.tsx`**: Modal for consequential operator overrides.
21. **`Toast.tsx`**: Non-intrusive operational notification toast provider.
