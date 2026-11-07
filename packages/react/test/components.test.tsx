import { render, screen } from "@testing-library/react";
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
  Dialogue,
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
