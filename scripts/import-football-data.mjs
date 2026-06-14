import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const defaultOutput = path.join(projectRoot, "automation", "matches.imported.json");
const teamMapPath = path.join(projectRoot, "automation", "team-names.zh.json");
const localSourcePath = path.join(projectRoot, "automation", "matches.json");
const timezone = "Asia/Shanghai";

const args = parseArgs(process.argv.slice(2));
const token = args.token || process.env.FOOTBALL_DATA_TOKEN;
const season = args.season || process.env.FOOTBALL_DATA_SEASON || "2026";
const competition = args.competition || process.env.FOOTBALL_DATA_COMPETITION || "WC";
const outputPath = path.resolve(projectRoot, args.output || defaultOutput);

const teamNames = JSON.parse(await readFile(teamMapPath, "utf8"));
const localSource = JSON.parse(await readFile(localSourcePath, "utf8"));
const payload = args.fixture ? await loadFixture(args.fixture) : await fetchFootballData({ token, season, competition });
const matches = (payload.matches || []).map((match) => normalizeFootballDataMatch(match, teamNames));

const nextSource = {
  meta: {
    sourceName: `football-data.org ${competition} ${season}`,
    timezone,
    importedAt: getNowText(timezone),
    note: "由 scripts/import-football-data.mjs 从 football-data.org 导入。",
  },
  teamRatings: localSource.teamRatings || {},
  matches,
};

await writeFile(outputPath, `${JSON.stringify(nextSource, null, 2)}\n`, "utf8");
console.log(`已导入 ${matches.length} 场比赛到 ${path.relative(projectRoot, outputPath)}`);

function parseArgs(items) {
  return items.reduce((result, item) => {
    if (!item.startsWith("--")) return result;
    const [key, value = true] = item.slice(2).split("=");
    result[key] = value;
    return result;
  }, {});
}

async function loadFixture(fixtureRef) {
  const filePath = path.isAbsolute(fixtureRef) ? fixtureRef : path.resolve(projectRoot, fixtureRef);
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function fetchFootballData({ token, season, competition }) {
  if (!token) {
    console.log("未设置 FOOTBALL_DATA_TOKEN，跳过 football-data.org 导入。");
    process.exit(0);
  }

  const url = `https://api.football-data.org/v4/competitions/${competition}/matches?season=${season}`;
  const response = await fetch(url, {
    headers: {
      "X-Auth-Token": token,
    },
  });

  if (!response.ok) {
    throw new Error(`football-data.org 获取失败：${response.status} ${response.statusText}`);
  }

  return response.json();
}

function normalizeFootballDataMatch(match, teamNames) {
  const dateParts = getZonedParts(match.utcDate, timezone);
  const home = translateTeam(match.homeTeam?.name || match.homeTeam?.shortName || "主队待定", teamNames);
  const away = translateTeam(match.awayTeam?.name || match.awayTeam?.shortName || "客队待定", teamNames);

  return {
    id: `match-fd-${match.id}`,
    providerId: match.id,
    isoDate: dateParts.isoDate,
    kick: dateParts.time,
    stage: normalizeStage(match.stage),
    group: normalizeGroup(match.group),
    home,
    away,
    state: normalizeState(match.status),
    actualScore: getActualScore(match),
  };
}

function translateTeam(name, teamNames) {
  return teamNames[name] || name;
}

function normalizeStage(stage) {
  if (!stage) return "待定";
  if (stage === "GROUP_STAGE") return "小组赛";
  if (stage.includes("FINAL") || stage.includes("ROUND") || stage.includes("LAST") || stage.includes("QUARTER")) {
    return "淘汰赛";
  }
  return stage;
}

function normalizeGroup(group) {
  if (!group) return undefined;
  const match = String(group).match(/Group\s+([A-Z])/i);
  if (match) return `${match[1].toUpperCase()} 组`;
  return group;
}

function normalizeState(status) {
  return {
    FINISHED: "已完赛",
    IN_PLAY: "进行中",
    PAUSED: "中场休息",
    TIMED: "未开赛",
    SCHEDULED: "未开赛",
    POSTPONED: "延期",
    SUSPENDED: "中断",
    CANCELED: "取消",
  }[status] || status || "待定";
}

function getActualScore(match) {
  const fullTime = match.score?.fullTime || {};
  if (typeof fullTime.home !== "number" || typeof fullTime.away !== "number") return null;
  if (match.status !== "FINISHED") return null;
  return `${fullTime.home}-${fullTime.away}`;
}

function getZonedParts(utcDate, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(utcDate));
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    isoDate: `${value.year}-${value.month}-${value.day}`,
    time: `${value.hour}:${value.minute}`,
  };
}

function getNowText(timeZone) {
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day} ${value.hour}:${value.minute}`;
}
