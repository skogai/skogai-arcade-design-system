# Skogai Arcade

Production implementation of the **Skogai Arcade design system**: a pixel-art, neon-arcade design language with one chassis and four sub-brand **cabinets**. It is the foundation layer for the wider Skogai framework.

```
packages/
  tokens/   @skogai/arcade-tokens   single source of truth → CSS vars, JSON, Tailwind v4 theme, typed JS
  css/      @skogai/arcade-css      framework-agnostic CSS: base type, components, HUD frame, terminal kit, fonts, icons
  react/    @skogai/arcade-react    typed, cabinet-aware React components
examples/
  gallery/  Vite playground showing every component in every cabinet
project/    original Claude Design handoff bundle (reference only — do not edit)
```

## Quick start

```bash
npm install
npm run check      # build all packages, typecheck, run tests
npm run gallery    # build, then open the Vite gallery
```

### Plain HTML / any framework

```html
<link rel="stylesheet" href="@skogai/arcade-css/arcade.css" />

<div data-cabinet="sudo-hero" class="sk-app">
  <button class="sk-btn sk-btn-primary">▶ START</button>
</div>
```

- `arcade.css`: everything, with the display/body faces loaded from Google Fonts.
- `arcade.local.css`: the same without the remote `@import`, for CSP-strict or self-hosted apps.
- Individual layers (`tokens.css`, `fonts.css`, `base.css`, `components.css`, `terminal.css`) if you compose your own bundle.

### React

```tsx
import "@skogai/arcade-react/styles.css";
import { Cabinet, Button, QuestStrip, Quest, Plaque, formatScore } from "@skogai/arcade-react";

<Cabinet cabinet="wifi-wizards" surface>
  <Plaque label="SCORE" value={formatScore(12750)} />  {/* 012,750 */}
  <QuestStrip>
    <Quest title="PATCH KERNEL" status="done" icon="✓" progress={100} />
    <Quest title="FIREWALL BOSS" status="active" icon="⚡" progress={62} meta="02:18 LEFT" />
  </QuestStrip>
  <Button variant="primary" icon="▶">START</Button>
</Cabinet>
```

Components: `Cabinet` / `useCabinet`, `Button`, `Badge`, `Plaque`, `QuestStrip` / `Quest`, `Card` (+ `Eyebrow`/`Title`/`Body`/`Footer`), `Input` / `TextField`, the HUD set (`Hud`, `Frame`, `HudBar`, `HudAvatar`, `HudBrand`, `HudStats`, `Stat`, `Hearts`, `Meter`, `HudStage`, `Announce`, `Dialogue`, `HudFoot`), `Icon` (19 pixel glyphs), and the terminal kit (`Terminal`, `TerminalBlock`, `TerminalLine`, `Prompt`, `Cursor`, `TerminalTag`, `TerminalSegment`, `TerminalComposer`). Helpers: `formatScore`, `formatTime`, `cx`.

### Tailwind v4

```css
@import "tailwindcss";
@import "@skogai/arcade-tokens/tokens.css";
@import "@skogai/arcade-tokens/tailwind.css";
```

This gives you `bg-sk-card`, `text-sk-primary`, `font-sk-display`, `rounded-sk-control`, `shadow-sk-card`, and `cabinet-sudo-hero:` style variants.

## Cabinets

Scope any subtree with `data-cabinet` (or `<Cabinet>`). Surfaces, borders, ring, primary, accent and headline glow all swap; component rules never change.

| Cabinet | `data-cabinet` | Primary | Accent | Use |
|---|---|---|---|---|
| (base) | — | magenta | cyan | Parent Skogai arcade |
| Sudo Hero | `sudo-hero` | violet | pink | Solo, terminal-led, personal dashboards |
| Wi-Fi Wizards | `wifi-wizards` | magenta | cyan | Co-op, network/sync, party UI |
| Honkers & Hackers | `honkers-hackers` | cyan | yellow | Time-attack, casual, daily mini-games |
| Skog-Net Syndicate | `skognet-syndicate` | acid green | magenta | City-forest network, eco/infra |

Adding a cabinet means adding one entry to `cabinets` in `packages/tokens/src/tokens.ts`. Any neon can be a primary or accent, because every neon has a full interactive ramp (`-hover`, `-border`, glow).

## Changing tokens

Edit `packages/tokens/src/tokens.ts`, then `npm run build`. Never edit generated output. `packages/tokens/test/parity.test.ts` checks that every token in the reference bundle (`project/colors_and_type.css`) is still emitted with the same value, in `:root` and in every cabinet.

## House rules (enforced or encouraged)

From the brief in `project/SKILL.md` and `project/README.md`:

- One `primary` action per screen. Glow only on interactive neon, never on body copy.
- Display type is Press Start 2P (uppercase), UI chrome is Silkscreen (10–16px), body is VT323 (18–24px), code is JetBrains Mono, and the terminal face is BigBlueTerm.
- Square edges: radius 0 / 2 / 4 / 6px. No pills, no background gradients.
- Don't mix two cabinet accents on one screen.
- Component CSS contains **no raw hex values** and references **only defined tokens**. `packages/css/test/css.test.ts` fails the build otherwise.

## Differences from the prototype

The prototype CSS hard-coded magenta and cyan in several components. Here those read the cabinet's roles instead. **The base theme renders the same**; inside a cabinet the components now retint correctly:

- `.sk-btn-primary`, `.sk-badge-primary`, `.sk-card-eyebrow`, quest progress and active quest icon, terminal prompt and file-tree selection → `--sk-primary`. `.sk-btn-secondary` → `--sk-accent`.
- `--sk-shadow-*` are re-declared on every cabinet scope. In the prototype they resolved once at `:root`, so cabinet borders never reached them.
- Disabled buttons now beat every variant's hover and glow (the prototype's primary turned hot pink on hover while disabled), and `.sk-btn-success` has a proper hover state.
- Additions: `sk-btn-sm|lg|block`, `sk-badge-accent`, `sk-plaque-primary`, `sk-field-error`, invalid/disabled inputs, `sk-glow-primary|accent|pink|red`, `.sk-app`, `.sk-sr-only`, responsive quest strip and HUD, and `prefers-reduced-motion` handling.

> **Note:** the prose in `project/README.md` says Wi-Fi Wizards is "cyan" and Honkers & Hackers is "yellow". The prototype's actual tokens make Wi-Fi Wizards magenta-primary/cyan-accent and Honkers cyan-primary/yellow-accent. This implementation follows the tokens.
