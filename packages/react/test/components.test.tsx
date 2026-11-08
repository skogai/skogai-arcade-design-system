import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import {
  Announce,
  Badge,
  Button,
  Cabinet,
  Card,
  CardBody,
  CardEyebrow,
  CardTitle,
  Cursor,
  Dialog,
  Dialogue,
  Fan,
  HandCard,
  PlayingCard,
  ScoreTable,
  TableHeader,
  cardName,
  fanPosition,
  Hearts,
  Icon,
  iconNames,
  Meter,
  Plaque,
  Quest,
  QuestStrip,
  Stat,
  Terminal,
  TerminalComposer,
  TerminalLine,
  TextField,
  formatScore,
  formatTime,
  useCabinet,
} from "../src/index.js";

describe("Button", () => {
  it("maps variant and size to reference classes", () => {
    render(
      <Button variant="primary" size="lg" icon="▶">
        START
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "START" });
    expect(btn.className).toBe("sk-btn sk-btn-primary sk-btn-lg");
    expect(btn.getAttribute("type")).toBe("button");
  });

  it("defaults to the plain chassis button and forwards refs", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>PATCH</Button>);
    expect(ref.current?.className).toBe("sk-btn");
  });
});

describe("Cabinet", () => {
  it("sets data-cabinet and exposes it via context", () => {
    function Probe() {
      return <span>{useCabinet() ?? "base"}</span>;
    }
    const { container } = render(
      <Cabinet cabinet="sudo-hero" surface>
        <Probe />
      </Cabinet>,
    );
    const root = container.firstElementChild!;
    expect(root.getAttribute("data-cabinet")).toBe("sudo-hero");
    expect(root.className).toBe("sk-app");
    expect(screen.getByText("sudo-hero")).toBeTruthy();
  });
});

describe("primitives", () => {
  it("Badge, Plaque and Card render the documented anatomy", () => {
    const { container } = render(
      <>
        <Badge tone="accent" icon="▣">
          ONLINE
        </Badge>
        <Plaque tone="cyan" label="SCORE" value="012,750" />
        <Card variant="raised">
          <CardEyebrow>★ DAILY</CardEyebrow>
          <CardTitle>BOSS RUSH</CardTitle>
          <CardBody>Clear three bosses.</CardBody>
        </Card>
      </>,
    );
    expect(container.querySelector(".sk-badge.sk-badge-accent")?.textContent).toBe("▣ONLINE");
    expect(container.querySelector(".sk-plaque.sk-plaque-cyan .sk-plaque-value")?.textContent).toBe(
      "012,750",
    );
    expect(container.querySelector(".sk-card.sk-card-raised h3.sk-card-title")).toBeTruthy();
  });

  it("QuestStrip sizes columns to its quests and Quest exposes progress", () => {
    const { container } = render(
      <QuestStrip>
        <Quest title="BOOT" status="done" icon="✓" />
        <Quest title="PATCH" status="active" icon="⚡" progress={140} meta="2/3" />
      </QuestStrip>,
    );
    const strip = container.querySelector<HTMLElement>(".sk-quest-strip")!;
    expect(strip.style.getPropertyValue("--sk-quest-cols")).toBe("2");
    expect(container.querySelectorAll("li.sk-quest")).toHaveLength(2);
    expect(container.querySelector(".sk-quest-done")).toBeTruthy();
    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBe("100");
  });

  it("TextField links label, input and error text", () => {
    render(<TextField label="CALLSIGN" error="Taken" />);
    const input = screen.getByLabelText("CALLSIGN");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    const note = document.getElementById(input.getAttribute("aria-describedby")!);
    expect(note?.textContent).toBe("Taken");
    expect(note?.className).toContain("sk-field-error");
  });
});

describe("HUD", () => {
  it("Hearts and Meter draw blocks with accessible values", () => {
    const { container } = render(
      <Stat
        label="HP"
        gauge={
          <>
            <Hearts value={6} max={7} />
            <Meter value={72} label="Level" />
          </>
        }
        value="6/7"
      />,
    );
    expect(container.querySelectorAll(".sk-hearts i")).toHaveLength(7);
    expect(container.querySelectorAll(".sk-hearts i.empty")).toHaveLength(1);
    expect(screen.getByRole("img", { name: "HP 6 of 7" })).toBeTruthy();
    expect(container.querySelectorAll(".sk-meter i:not(.empty)")).toHaveLength(5);
    expect(screen.getByRole("meter", { name: "Level" }).getAttribute("aria-valuenow")).toBe("72");
  });

  it("Announce and Dialogue are framed", () => {
    const { container } = render(
      <>
        <Announce title="ECO-GRID ONLINE!" sub="Synced." />
        <Dialogue name="ELDER OAK" portrait="◆">
          Prepare for deep root integration.
        </Dialogue>
      </>,
    );
    expect(container.querySelector(".sk-frame.sk-announce h2")?.textContent).toBe("ECO-GRID ONLINE!");
    expect(container.querySelector(".sk-frame.sk-dialogue .sk-dialogue-name")?.textContent).toBe(
      "ELDER OAK",
    );
  });
});

describe("Icon", () => {
  it("renders every sprite icon as crisp rects", () => {
    expect(iconNames.length).toBe(19);
    for (const name of iconNames) {
      const { container, unmount } = render(<Icon name={name} />);
      expect(container.querySelectorAll("rect").length).toBeGreaterThan(0);
      unmount();
    }
  });

  it("is decorative unless titled", () => {
    const { container } = render(
      <>
        <Icon name="coin" />
        <Icon name="trophy" size={40} title="Rank S+" />
      </>,
    );
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    const titled = screen.getByRole("img", { name: "Rank S+" });
    expect(titled.getAttribute("class")).toBe("sk-icon sk-icon-40");
  });
});

describe("Terminal", () => {
  it("renders window chrome, lines, composer and cursor", () => {
    const { container } = render(
      <Terminal title="sudo-hero" path="~/quests/03" composer={<TerminalComposer />}>
        <TerminalLine kind="in" prompt="$">
          deploy --stage 3
        </TerminalLine>
        <TerminalLine kind="ok">✓ shipped</TerminalLine>
        <Cursor shape="bar" />
      </Terminal>,
    );
    expect(container.querySelector(".skt-window .skt-titlebar .skt-path")?.textContent).toBe(
      "~/quests/03",
    );
    expect(container.querySelector(".skt-line .skt-prompt")?.textContent).toBe("$");
    expect(container.querySelector(".skt-ok")?.textContent).toBe("✓ shipped");
    expect(container.querySelector(".skt-cursor.bar")).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Command" })).toBeTruthy();
  });
});

describe("format", () => {
  it("pads scores per house style", () => {
    expect(formatScore(12750)).toBe("012,750");
    expect(formatScore(1234567)).toBe("1,234,567");
    expect(formatScore(0, 3)).toBe("000");
  });

  it("formats clock values", () => {
    expect(formatTime(138)).toBe("02:18");
    expect(formatTime(5025)).toBe("01:23:45");
    expect(formatTime(5, { hours: true })).toBe("00:00:05");
  });
});

describe("Card Arcade", () => {
  it("PlayingCard renders a face with court label and meld glow", () => {
    const { container } = render(<PlayingCard rank="K" suit="hearts" glow="set" size="sm" />);
    const card = container.querySelector(".sk-playing-card.sk-playing-card-sm")!;
    expect(card.getAttribute("data-suit")).toBe("hearts");
    expect(card.getAttribute("data-glow")).toBe("set");
    expect(card.querySelector(".sk-card-court-label")?.textContent).toBe("KING");
    expect(card.querySelectorAll(".sk-card-rank")).toHaveLength(2);
    expect(screen.getByRole("img", { name: "hearts" })).toBeTruthy();
  });

  it("PlayingCard draws a back when face down", () => {
    const { container } = render(<PlayingCard faceDown />);
    expect(container.querySelector("[data-face-down] .sk-card-back .sk-card-emblem")).toBeTruthy();
    expect(container.querySelector(".sk-card-face")).toBeNull();
  });

  it("cardName and fanPosition follow the design's curve", () => {
    expect(cardName("Q", "spades")).toBe("Queen of spades");
    expect(cardName("7", "clubs")).toBe("7 of clubs");
    expect(fanPosition(0, 10, 20, 18)).toEqual({ rot: -10, dy: 18 });
    expect(fanPosition(0, 1, 20, 18)).toEqual({ rot: 0, dy: 0 });
  });

  it("Fan places each card along the curve", () => {
    const { container } = render(
      <Fan>
        <HandCard aria-label="a">
          <PlayingCard rank="2" suit="clubs" />
        </HandCard>
        <HandCard aria-label="b" raised onClick={() => {}}>
          <PlayingCard rank="3" suit="clubs" />
        </HandCard>
      </Fan>,
    );
    const slots = container.querySelectorAll<HTMLElement>(".sk-hand > div");
    expect(slots).toHaveLength(2);
    expect(slots[0]!.style.getPropertyValue("--rot")).toBe("-10");
    expect(slots[1]!.style.getPropertyValue("--rot")).toBe("10");
    expect(screen.getByLabelText("b").className).toBe("sk-hand-card is-pickable is-raised");
  });

  it("TableHeader marks the current mode and toggles sound", () => {
    render(<TableHeader mode="hearts" status="Follow suit." score="YOU 004 · N 011" />);
    expect(screen.getByRole("link", { name: "HEARTS" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "GIN RUMMY" }).getAttribute("aria-current")).toBeNull();
    const sound = screen.getByRole("button", { name: "Mute card sounds" });
    fireEvent.click(sound);
    expect(screen.getByRole("button", { name: "Unmute card sounds" }).getAttribute("aria-pressed")).toBe(
      "false",
    );
  });

  it("Dialog is labelled by its title and closes; ScoreTable lists seats", () => {
    let closed = false;
    render(
      <Dialog title="RULES" onClose={() => (closed = true)} actions={<button>GOT IT</button>}>
        <ScoreTable caption="HEARTS" rows={[{ seat: "YOU", score: "004", lead: true }]} />
      </Dialog>,
    );
    expect(screen.getByRole("dialog", { name: "RULES" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(closed).toBe(true);
    expect(screen.getByRole("columnheader", { name: "SEAT" })).toBeTruthy();
    expect(document.querySelector("td.is-lead")?.textContent).toBe("004");
  });
});
