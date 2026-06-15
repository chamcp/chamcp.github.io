import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const defaultOutput = path.join(projectRoot, "automation", "matches.imported.json");
const teamMapPath = path.join(projectRoot, "automation", "team-names.zh.json");
const localSourcePath = path.join(projectRoot, "automation", "matches.json");
const apiBase = "https://wheniskickoff.com/data/v1";
const timezone = "Asia/Shanghai";

const args = parseArgs(process.argv.slice(2));
const outputPath = path.resolve(projectRoot, args.output || defaultOutput);

const teamNames = JSON.parse(await readFile(teamMapPath, "utf8"));
const localSource = JSON.parse(await readFile(localSourcePath, "utf8"));

const [matchesPayload, teamsPayload] = await Promise.all([
  fetchJSON(`${apiBase}/matches.json`),
  fetchJSON(`${apiBase}/teams.json`),
]);

const teamRatings = buildTeamRatings(teamsPayload.data || []);
const matches = (matchesPayload.data || [])
  .filter((m) => m.home && m.away)
  .map((m) => normalizeMatch(m, teamNames));

const nextSource = {
  meta: {
    sourceName: "wheniskickoff.com World Cup 2026 API",
    sourceType: "remote",
    timezone,
    importedAt: getNowText(timezone),
    note: "由 scripts/import-wheniskickoff.mjs 从 wheniskickoff.com 自动导入。",
  },
  teamRatings: { ...localSource.teamRatings, ...teamRatings },
  matches,
};

await writeFile(outputPath, `${JSON.stringify(nextSource, null, 2)}\n`, "utf8");
console.log(`已从 wheniskickoff.com 导入 ${matches.length} 场比赛到 ${path.relative(projectRoot, outputPath)}`);

function parseArgs(items) {
  return items.reduce((result, item) => {
    if (!item.startsWith("--")) return result;
    const [key, value = true] = item.slice(2).split("=");
    result[key] = value;
    return result;
  }, {});
}

async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`获取 ${url} 失败：${response.status} ${response.statusText}`);
  }
  return response.json();
}

function buildTeamRatings(teams) {
  const ratings = {};
  for (const t of teams) {
    const name = teamNames[t.name];
    if (!name) continue;
    if (t.rank) {
      ratings[name] = Math.round(98 - (t.rank - 1) * 0.7);
    } else {
      ratings[name] = 70;
    }
  }
  return ratings;
}

function normalizeMatch(m, teamNames) {
  const dateParts = parseDateTime(m.datetime_utc || `${m.date}T${m.time_utc}:00Z`, timezone);
  const home = translateTeam(m.home_name || m.home, teamNames);
  const away = translateTeam(m.away_name || m.away, teamNames);

  return {
    id: `match-wik-${m.num}`,
    providerNum: m.num,
    isoDate: dateParts.isoDate,
    kick: dateParts.time,
    stage: normalizeStage(m.phase),
    group: m.group ? `${m.group.toUpperCase()} 组` : undefined,
    home,
    away,
    match: `${home} vs ${away}`,
    state: normalizeState(m.status),
    actualScore: getActualScore(m),
  };
}

function translateTeam(name, teamNames) {
  return teamNames[name] || name;
}

function normalizeStage(phase) {
  if (!phase || phase === "group") return "小组赛";
  return "淘汰赛";
}

function normalizeState(status) {
  if (!status) return "未开赛";
  return {
    FINISHED: "已完赛",
    SCHEDULED: "未开赛",
    LIVE: "进行中",
    POSTPONED: "延期",
    CANCELED: "取消",
  }[status] || "未开赛";
}

function getActualScore(m) {
  if (m.status !== "FINISHED") return null;
  if (typeof m.score_home !== "number" || typeof m.score_away !== "number") return null;
  return `${m.score_home}-${m.score_away}`;
}

function parseDateTime(utcStr, tz) {
  const d = new Date(utcStr);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const v = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return {
    isoDate: `${v.year}-${v.month}-${v.day}`,
    time: `${v.hour}:${v.minute}`,
  };
}

function getNowText(tz) {
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const v = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return `${v.year}-${v.month}-${v.day} ${v.hour}:${v.minute}`;
}
