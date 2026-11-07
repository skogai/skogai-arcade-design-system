import "@skogai/arcade-react/styles.css";
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Announce,
  Badge,
  Button,
  Cabinet,
  Card,
  CardBody,
  CardEyebrow,
  CardFooter,
  CardTitle,
  Cursor,
  Dialogue,
  Frame,
  Hearts,
  Hud,
  HudAvatar,
  HudBar,
  HudBrand,
  HudFoot,
  HudStage,
  HudStats,
  Icon,
  Meter,
  Plaque,
  Quest,
  QuestStrip,
  Stat,
  Terminal,
  TerminalComposer,
  TerminalLine,
  TerminalSegment,
  TerminalTag,
  TextField,
  cabinetIds,
  cabinets,
  formatScore,
  formatTime,
  type CabinetId,
  type IconName,
} from "@skogai/arcade-react";

const scenes: Record<CabinetId, string> = {
  "sudo-hero": "/scene-sudo-hero.png",
  "wifi-wizards": "/scene-wifi-wizards.png",
  "honkers-hackers": "/scene-honkers-hackers.png",
  "skognet-syndicate": "/scene-skognet-syndicate.webp",
};

const avatars: Record<CabinetId, IconName> = {
  "sudo-hero": "sword",
  "wifi-wizards": "wifi",
  "honkers-hackers": "ghost",
  "skognet-syndicate": "chip",
};

function HudDemo({ id }: { id: CabinetId }) {
  const cab = cabinets[id];
  return (
    <Hud>
      <HudBar>
        <HudAvatar>
          <Icon name={avatars[id]} size={32} />
        </HudAvatar>
        <HudBrand tagline={`▸ ${cab.use.split(",")[0]!.toUpperCase()}`}>{cab.name.toUpperCase()}</HudBrand>
        <HudStats>
          <Stat label="HP" gauge={<Hearts value={6} max={7} />} value="6/7" />
          <Stat label="LEVEL 55" gauge={<Meter value={72} label="Level 55" />} value="72%" />
          <Stat label="SCORE" value={formatScore(12750)} valueClassName="sk-glow-primary" />
          <Stat label="TIME" value={formatTime(5025)} />
        </HudStats>
      </HudBar>
      <HudStage size="short" image={{ src: scenes[id], alt: `${cab.name} scene` }} />
      <Announce title="STAGE CLEAR!" sub="All daemons patched. Boss defeated." />
      <Dialogue name="GUIDE" portrait={<Icon name="shield" size={40} />}>
        Nice run, operator. Next cabinet is warming up.
      </Dialogue>
      <HudFoot>
        <Frame>
          <Icon name="diamond" size={16} /> 3/3 CORES
        </Frame>
        <Frame grow>SIDE QUEST: Find the hidden root shell</Frame>
        <Frame>
          <span className="done">✓ RANK S+</span>
        </Frame>
      </HudFoot>
    </Hud>
  );
}

function Kit() {
  const [log, setLog] = useState<string[]>([]);
  const [cmd, setCmd] = useState("");
  return (
    <div className="grid">
      <section>
        <h2 className="sk-h4 section-h">BUTTONS</h2>
        <div className="row">
          <Button variant="primary" icon="▶">
            INSERT COIN
          </Button>
          <Button variant="secondary">CO-OP</Button>
          <Button variant="outline">OPTIONS</Button>
          <Button variant="ghost">DETAILS</Button>
          <Button variant="success" icon="✓">
            DEPLOY
          </Button>
          <Button variant="danger" icon="✕">
            ABORT
          </Button>
          <Button variant="primary" disabled>
            LOCKED
          </Button>
        </div>
        <h2 className="sk-h4 section-h">BADGES</h2>
        <div className="row">
          <Badge tone="primary" icon="★">NEW</Badge>
          <Badge tone="accent" icon="▣">ONLINE</Badge>
          <Badge tone="success" icon="✓">DONE</Badge>
          <Badge tone="warning" icon="⚡">BOSS</Badge>
          <Badge tone="danger" icon="✕">FAILED</Badge>
          <Badge tone="muted" icon="▢">OFFLINE</Badge>
        </div>
        <h2 className="sk-h4 section-h">PLAQUES</h2>
        <div className="row plaques">
          <Plaque label="SCORE" value={formatScore(12750)} />
          <Plaque tone="cyan" label="PING" value="18MS" />
          <Plaque tone="green" label="UPTIME" value="99.9%" />
        </div>
      </section>
      <section>
        <Card variant="raised">
          <CardEyebrow>▸ MISSION 02</CardEyebrow>
          <CardTitle>DEFEAT FIREWALL BOSS</CardTitle>
          <CardBody>Active boss spawn. ETA two minutes. Bring backup or roll solo.</CardBody>
          <CardFooter>
            <span className="sk-meta">REWARD · 2,500 XP</span>
            <Button variant="primary" icon="▶">
              START
            </Button>
          </CardFooter>
        </Card>
        <div style={{ height: 16 }} />
        <TextField label="CALLSIGN" placeholder="sudo_hero" help="Shown on the leaderboard." />
      </section>
      <section className="span">
        <QuestStrip>
          <Quest title="PATCH KERNEL" status="done" icon="✓" progress={100} meta="+250 XP" />
          <Quest title="FIREWALL BOSS" status="active" icon="⚡" progress={62} meta="02:18 LEFT" />
          <Quest title="DEPLOY TO PROD" status="locked" icon="▣" progress={0} meta="UNLOCK AT LV.45" />
        </QuestStrip>
      </section>
      <section className="span">
        <Terminal
          title="sudo-hero"
          path="~/quests/03"
          composer={
            <TerminalComposer
              prompt="$"
              value={cmd}
              placeholder="type a command…"
              onChange={(e) => setCmd(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && cmd.trim()) {
                  setLog((l) => [...l, cmd]);
                  setCmd("");
                }
              }}
            />
          }
          status={
            <>
              <TerminalSegment tone="ok">● main</TerminalSegment>
              <TerminalSegment tone="warn">⚠ 2</TerminalSegment>
              <TerminalSegment spacer />
              <TerminalSegment>UTF-8</TerminalSegment>
            </>
          }
        >
          <TerminalLine kind="in" prompt="$">
            arcade deploy --stage 3
          </TerminalLine>
          <TerminalLine kind="out">
            <TerminalTag tone="info">INFO</TerminalTag>building cabinet…
          </TerminalLine>
          <TerminalLine kind="ok">
            <TerminalTag tone="ok">OK</TerminalTag>shipped v0.9.7 in 02:18
          </TerminalLine>
          {log.map((l, i) => (
            <TerminalLine key={i} kind="in" prompt="$">
              {l}
            </TerminalLine>
          ))}
          <Cursor />
        </Terminal>
      </section>
    </div>
  );
}

function App() {
  const [active, setActive] = useState<CabinetId>("sudo-hero");
  return (
    <div className="page">
      <header className="top">
        <h1 className="sk-h2 sk-glow-magenta">SKOGAI ARCADE</h1>
        <p className="sk-body-md lede">
          One chassis, four cabinets. Every component below is token-driven: switching the cabinet
          retints the whole subtree.
        </p>
        <div className="row" role="tablist" aria-label="Cabinet">
          {cabinetIds.map((id) => (
            <Button
              key={id}
              role="tab"
              aria-selected={active === id}
              variant={active === id ? "outline" : "ghost"}
              onClick={() => setActive(id)}
            >
              {cabinets[id].name.toUpperCase()}
            </Button>
          ))}
        </div>
      </header>
      <Cabinet cabinet={active} surface className="cab">
        <Kit />
      </Cabinet>
      <h2 className="sk-h3 section-h">HUD FRAME · ALL CABINETS</h2>
      <div className="huds">
        {cabinetIds.map((id) => (
          <Cabinet key={id} cabinet={id}>
            <HudDemo id={id} />
          </Cabinet>
        ))}
      </div>
    </div>
  );
}

const style = document.createElement("style");
style.textContent = `
  body { margin: 0; }
  .page { max-width: 1200px; margin: 0 auto; padding: 32px 16px 64px; }
  .top { margin-bottom: 24px; }
  .top h1 { margin: 0 0 12px; }
  .lede { color: var(--sk-fg-2); max-width: 60ch; margin: 0 0 16px; }
  .row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
  .plaques > * { min-width: 160px; }
  .section-h { color: var(--sk-fg-muted); margin: 24px 0 12px; }
  .cab { padding: 24px; border: 1px solid var(--sk-border); border-radius: var(--sk-radius-panel); }
  .grid { display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); gap: 24px; }
  .grid .span { grid-column: 1 / -1; }
  .huds { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
  .huds .sk-announce-title { font-size: var(--sk-text-20); }
  @media (max-width: 900px) { .grid, .huds { grid-template-columns: minmax(0, 1fr); } }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
