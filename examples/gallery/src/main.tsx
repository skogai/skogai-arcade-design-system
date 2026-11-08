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
  Dialog,
  Fan,
  Felt,
  Frame,
  HandCard,
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
  Pile,
  PileColumn,
  Plaque,
  PlayingCard,
  Quest,
  QuestStrip,
  ScoreTable,
  Seat,
  Stat,
  TableFooter,
  TableFooterSep,
  TableHeader,
  TableMain,
  TablePage,
  Terminal,
  TerminalComposer,
  TerminalLine,
  TerminalSegment,
  TerminalTag,
  TextField,
  cabinetIds,
  cabinets,
  cardName,
  formatScore,
  formatTime,
  type CabinetId,
  type CardGlow,
  type IconName,
  type Rank,
  type Suit,
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


type Meld = [Rank, Suit, CardGlow];
const ginHand: Meld[] = [
  ["7", "spades", "set"], ["7", "hearts", "set"], ["7", "clubs", "set"],
  ["4", "diamonds", "run"], ["5", "diamonds", "run"], ["6", "diamonds", "run"],
  ["9", "clubs", "run"], ["10", "clubs", "run"], ["J", "clubs", "run"],
  ["A", "hearts", "none"],
];
const MELD_NOTE = { set: ", in a set", run: ", in a run", pass: "", dim: "", none: ", deadwood" };

function GinTable() {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <TablePage className="table-demo">
      <TableHeader
        mode="gin"
        status="Your turn — draw from the stock or the discard pile."
        score="YOU 027 · AI 014"
      />
      <TableMain>
        <PileColumn aria-label="North AI" role="group">
          <Seat
            badge={<Badge tone="muted" icon="▢">WAITING</Badge>}
            name="NORTH AI"
            count="10 cards"
          />
          <Fan variant="ai">
            {Array.from({ length: 10 }, (_, i) => (
              <PlayingCard key={i} faceDown size="sm" />
            ))}
          </Fan>
        </PileColumn>
        <Felt
          aria-label="Draw piles"
          style={{
            boxSizing: "border-box", width: "100%", maxWidth: 880, display: "flex", flexWrap: "wrap",
            justifyContent: "center", alignItems: "center", gap: "24px 48px", padding: "32px 24px",
          }}
        >
          <Pile aria-label="Draw from stock, 31 cards left" label="STOCK · 31">
            {[10, 7, 4].map((top, i) => (
              <PlayingCard key={top} faceDown style={{ left: 4 + i * 2, top }} />
            ))}
          </Pile>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Plaque tone="green" label="SETS" value="01" style={{ minWidth: 104 }} />
            <Plaque tone="cyan" label="RUNS" value="02" style={{ minWidth: 104 }} />
            <div className="sk-plaque sk-plaque-yellow" style={{ minWidth: 104 }}>
              <span className="sk-plaque-label">DEADWOOD</span>
              <span className="sk-plaque-value">001</span>
            </div>
          </div>
          <Pile aria-label="Take the 8 of hearts from the discard pile" label="DISCARD · DROP OR TAP">
            <PlayingCard rank="3" suit="spades" style={{ left: 6, top: 7, transform: "rotate(-4deg)" }} />
            <PlayingCard rank="8" suit="hearts" style={{ left: 8, top: 6, transform: "rotate(3deg)" }} />
          </Pile>
        </Felt>
        <PileColumn aria-label="Your hand" role="group" style={{ width: "100%" }}>
          <Fan>
            {ginHand.map(([rank, suit, glow], i) => (
              <HandCard
                key={rank + suit}
                aria-label={cardName(rank, suit) + MELD_NOTE[glow]}
                aria-pressed={picked === i}
                raised={picked === i}
                onClick={() => setPicked(picked === i ? null : i)}
              >
                <PlayingCard rank={rank} suit={suit} glow={glow} />
              </HandCard>
            ))}
          </Fan>
          <div className="sk-legend">
            <Badge tone="success" icon="▣">SET</Badge>
            <Badge tone="cyan" icon="▣">RUN</Badge>
            <span className="sk-hint">Drag to reorder · tap a card to discard</span>
          </div>
        </PileColumn>
      </TableMain>
      <TableFooter>
        <Button variant="outline">SORT RANK</Button>
        <Button variant="outline">SORT SUIT</Button>
        <TableFooterSep />
        <Button variant="primary">▶ KNOCK · 01</Button>
        <Button variant="outline">NEW DEAL</Button>
      </TableFooter>
    </TablePage>
  );
}

function RoundResult() {
  return (
    <TablePage className="table-demo">
      <Dialog
        eyebrow="ROUND 04 · RESULT"
        title="KNOCK! +13"
        titleVariant="announce"
        lede="You knocked on 1 deadwood. North AI was stuck with 14, so you take the difference."
        onClose={() => {}}
        actions={
          <>
            <Button variant="ghost">CLOSE</Button>
            <Button variant="primary">▶ DEAL NEXT</Button>
          </>
        }
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
          <Plaque tone="green" label="YOU" value="040" />
          <Plaque tone="violet" label="NORTH AI" value="014" />
          <Plaque tone="cyan" label="TARGET" value="100" />
        </div>
        <ScoreTable
          caption="HEARTS · LOWEST WINS"
          rows={[
            { seat: "YOU · SOUTH", score: "004", lead: true },
            { seat: "WEST AI", score: "007" },
            { seat: "NORTH AI", score: "011" },
            { seat: "EAST AI", score: "015" },
          ]}
        />
      </Dialog>
    </TablePage>
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
      <h2 className="sk-h3 section-h">CARD ARCADE · TABLES</h2>
      <Cabinet cabinet="sudo-hero" className="tables">
        <GinTable />
        <RoundResult />
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
  .tables { display: grid; gap: 24px; }
  .table-demo { min-height: 0; border: 1px solid var(--sk-border); border-radius: var(--sk-radius-panel); overflow: hidden; }
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
