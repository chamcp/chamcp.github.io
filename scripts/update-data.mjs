import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const defaultSource = path.join(projectRoot, "automation", "matches.json");
const defaultOverrides = path.join(projectRoot, "automation", "prediction-overrides.json");
const defaultOutput = path.join(projectRoot, "data.js");
const timezone = "Asia/Shanghai";

const args = parseArgs(process.argv.slice(2));
const sourceRef = args.source || process.env.MATCHES_SOURCE_URL || defaultSource;
const outputPath = path.resolve(projectRoot, args.output || defaultOutput);
const todayISO = args.date || getTodayISO(timezone);
const nowText = args.now || getNowText(timezone);

const sourceData = await loadJson(sourceRef);
const predictionOverrides = await loadOptionalJson(args.overrides || process.env.PREDICTION_OVERRIDES || defaultOverrides);
validateSourceData(sourceData);
validatePredictionOverrides(predictionOverrides);

if (args["validate-only"]) {
  console.log("数据源校验通过。");
  process.exit(0);
}

const generatedData = buildTrackerData(sourceData, todayISO, nowText, predictionOverrides);
const nextFile = `window.WORLD_CUP_DATA = ${JSON.stringify(generatedData, null, 2)};\n`;

if (args.check) {
  const currentFile = await readFile(outputPath, "utf8");
  if (normalizeForCheck(currentFile) !== normalizeForCheck(nextFile)) {
    console.error("data.js 不是最新生成结果。请运行：node scripts/update-data.mjs");
    process.exit(1);
  }
  console.log("data.js 已是最新生成结果。");
} else {
  if (args["skip-unchanged"] && (await isOutputContentUnchanged(outputPath, nextFile))) {
    console.log("数据内容没有变化，保留当前 data.js。");
    process.exit(0);
  }

  await writeFile(outputPath, nextFile, "utf8");
  console.log(`已更新 ${path.relative(projectRoot, outputPath)}`);
}

function parseArgs(items) {
  return items.reduce((result, item) => {
    if (!item.startsWith("--")) return result;
    const [key, value = true] = item.slice(2).split("=");
    result[key] = value;
    return result;
  }, {});
}

async function loadJson(ref) {
  if (/^https?:\/\//.test(ref)) {
    const response = await fetch(ref);
    if (!response.ok) {
      throw new Error(`获取数据失败：${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  const filePath = path.isAbsolute(ref) ? ref : path.resolve(projectRoot, ref);
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function loadOptionalJson(ref) {
  try {
    return await loadJson(ref);
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw error;
  }
}

function validateSourceData(source) {
  const errors = [];
  const seenIds = new Set();

  if (!source || typeof source !== "object") {
    throw new Error("数据源必须是 JSON 对象。");
  }

  if (!Array.isArray(source.matches) || !source.matches.length) {
    errors.push("matches 必须是非空数组。");
  }

  (source.matches || []).forEach((match, index) => {
    const label = `第 ${index + 1} 场`;
    ["id", "isoDate", "kick", "stage", "home", "away"].forEach((field) => {
      if (!match[field]) errors.push(`${label} 缺少 ${field}`);
    });

    if (match.id) {
      if (seenIds.has(match.id)) {
        errors.push(`${label} 的 id 重复：${match.id}`);
      }
      seenIds.add(match.id);
    }

    if (match.isoDate && !/^\d{4}-\d{2}-\d{2}$/.test(match.isoDate)) {
      errors.push(`${label} 的 isoDate 格式应为 YYYY-MM-DD：${match.isoDate}`);
    }

    if (match.kick && !/^\d{2}:\d{2}$/.test(match.kick)) {
      errors.push(`${label} 的 kick 格式应为 HH:mm：${match.kick}`);
    }

    if (match.actualScore !== null && match.actualScore !== undefined && !/^\d+-\d+$/.test(match.actualScore)) {
      errors.push(`${label} 的 actualScore 格式应为 2-1 或 null：${match.actualScore}`);
    }

    if (match.prediction) {
      ["pick", "score", "confidence", "reason"].forEach((field) => {
        if (!match.prediction[field]) errors.push(`${label} 的 prediction 缺少 ${field}`);
      });

      if (match.prediction.score && !/^\d+-\d+$/.test(match.prediction.score)) {
        errors.push(`${label} 的 prediction.score 格式应为 2-1：${match.prediction.score}`);
      }

      if (match.prediction.confidence && !["高", "中", "低"].includes(match.prediction.confidence)) {
        errors.push(`${label} 的 prediction.confidence 只能是 高 / 中 / 低：${match.prediction.confidence}`);
      }
    }
  });

  if (errors.length) {
    throw new Error(`数据源校验失败：\n- ${errors.join("\n- ")}`);
  }
}

function validatePredictionOverrides(overrides) {
  const errors = [];

  ["byMatchKey", "byMatchId"].forEach((group) => {
    Object.entries(overrides?.[group] || {}).forEach(([key, prediction]) => {
      ["pick", "score", "confidence", "reason"].forEach((field) => {
        if (!prediction[field]) errors.push(`${group}.${key} 缺少 ${field}`);
      });

      if (prediction.score && !/^\d+-\d+$/.test(prediction.score)) {
        errors.push(`${group}.${key} 的 score 格式应为 2-1：${prediction.score}`);
      }

      if (prediction.confidence && !["高", "中", "低"].includes(prediction.confidence)) {
        errors.push(`${group}.${key} 的 confidence 只能是 高 / 中 / 低：${prediction.confidence}`);
      }
    });
  });

  if (errors.length) {
    throw new Error(`预测覆盖校验失败：\n- ${errors.join("\n- ")}`);
  }
}

function normalizeForCheck(text) {
  return text.replace(/"lastUpdated": "[^"]+"/, '"lastUpdated": "<ignored>"');
}

async function isOutputContentUnchanged(filePath, nextText) {
  try {
    const currentText = await readFile(filePath, "utf8");
    return normalizeForCheck(currentText) === normalizeForCheck(nextText);
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

function buildTrackerData(source, today, lastUpdated, overrides = {}) {
  const matches = [...(source.matches || [])]
    .map((match) => normalizeMatch(match, source.teamRatings || {}, overrides))
    .sort(compareMatches);
  const days = buildDays(matches, today);
  const schedule = matches.map((match) => ({
    id: match.id,
    isoDate: match.isoDate,
    coverageDate: match.coverageDate,
    date: formatDisplayDate(match.isoDate),
    stage: match.stage,
    home: match.home,
    away: match.away,
    match: match.match,
    kick: match.kick,
    state: match.state,
    actualScore: match.actualScore,
  }));

  return {
    meta: {
      schemaVersion: 3,
      lastUpdated,
      timezone: source.meta?.timezone || timezone,
      updateMode: "auto",
      currentDayKey: "today",
      source: `自动生成：${source.meta?.sourceName || "比赛数据"}`,
      note: "data.js 由 scripts/update-data.mjs 生成；以后只需要更新数据源或接入外部接口。",
    },
    dayOrder: ["yesterday", "today", "tomorrow"],
    days,
    schedule,
  };
}

function normalizeMatch(match, ratings, overrides) {
  const hour = Number(String(match.kick || "00:00").split(":")[0]);
  const coverageDate = hour < 6 ? addDays(match.isoDate, -1) : match.isoDate;
  const phase = match.phase || [match.stage, match.group].filter(Boolean).join(" ") || match.stage;
  const prediction = normalizePrediction(match, ratings, overrides);

  return {
    ...match,
    coverageDate,
    phase,
    match: match.match || `${match.home} vs ${match.away}`,
    state: match.state || "未开赛",
    actualScore: match.actualScore || null,
    prediction,
  };
}

function normalizePrediction(match, ratings, overrides) {
  if (match.prediction) {
    return {
      pick: match.prediction.pick,
      score: match.prediction.score,
      confidence: match.prediction.confidence,
      reason: match.prediction.reason,
      source: match.prediction.source || "seed",
    };
  }

  const override = findPredictionOverride(match, overrides);
  if (override) {
    return {
      pick: override.pick,
      score: override.score,
      confidence: override.confidence,
      reason: override.reason,
      source: "override",
    };
  }

  return createAutoPrediction(match, ratings);
}

function findPredictionOverride(match, overrides = {}) {
  const byId = overrides.byMatchId?.[match.id];
  if (byId) return byId;

  const key = `${match.isoDate}|${match.home}|${match.away}`;
  return overrides.byMatchKey?.[key] || null;
}

function createAutoPrediction(match, ratings) {
  const homeRating = ratings[match.home] || 75;
  const awayRating = ratings[match.away] || 75;
  const diff = homeRating - awayRating;

  if (diff >= 8) {
    return {
      pick: `${match.home}胜`,
      score: "2-0",
      confidence: "高",
      reason: `${match.home}综合评分优势明显，攻防稳定性更好`,
      source: "auto",
    };
  }

  if (diff >= 3) {
    return {
      pick: `${match.home}胜`,
      score: "2-1",
      confidence: "中",
      reason: `${match.home}整体实力略占优，但比赛可能接近`,
      source: "auto",
    };
  }

  if (diff <= -8) {
    return {
      pick: `${match.away}胜`,
      score: "0-2",
      confidence: "高",
      reason: `${match.away}综合评分优势明显，客场仍有更高胜面`,
      source: "auto",
    };
  }

  if (diff <= -3) {
    return {
      pick: `${match.away}胜`,
      score: "1-2",
      confidence: "中",
      reason: `${match.away}整体实力略占优，但比赛可能接近`,
      source: "auto",
    };
  }

  return {
    pick: "平局",
    score: "1-1",
    confidence: "低",
    reason: "双方评分接近，胜负不确定性较高",
    source: "auto",
  };
}

function buildDays(matches, today) {
  const dayMap = {
    yesterday: addDays(today, -1),
    today,
    tomorrow: addDays(today, 1),
  };

  return Object.fromEntries(
    Object.entries(dayMap).map(([key, isoDate]) => [key, buildDay(matches, key, isoDate, today)]),
  );
}

function buildDay(matches, key, isoDate, today) {
  const dayMatches = matches.filter((match) => match.coverageDate === isoDate);
  const predictions = dayMatches.map((match) => buildPrediction(match));
  const reviews = isoDate <= today ? dayMatches.map((match) => buildReview(match)) : [];

  return {
    label: labelForDay(key),
    date: formatDisplayDate(isoDate),
    isoDate,
    summary: buildSummary(key, predictions, reviews, isoDate, today),
    predictions,
    reviews,
  };
}

function buildPrediction(match) {
  const late = isLateKick(match.kick) ? " late" : "";
  const confidenceBucket = confidenceToBucket(match.prediction.confidence);

  return {
    id: `pred-${match.id.replace(/^match-/, "")}`,
    matchId: match.id,
    time: match.kick,
    match: match.match,
    phase: match.phase,
    pick: match.prediction.pick,
    score: match.prediction.score,
    confidence: match.prediction.confidence,
    bucket: `${confidenceBucket}${late}`.trim(),
    reason: match.prediction.reason,
    source: match.prediction.source,
  };
}

function buildReview(match) {
  const prediction = buildPrediction(match);
  const actualOutcome = getActualOutcome(match);
  const status = actualOutcome ? (actualOutcome === match.prediction.pick ? "hit" : "miss") : "pending";
  const exact = Boolean(match.actualScore && match.actualScore === match.prediction.score);

  return {
    id: `review-${match.id.replace(/^match-/, "")}`,
    predictionId: prediction.id,
    matchId: match.id,
    match: match.match,
    predict: `${match.prediction.pick} ${match.prediction.score}`,
    actual: match.actualScore || "待开奖",
    actualScore: match.actualScore,
    status,
    exact,
    note: getReviewNote(status, exact),
  };
}

function getActualOutcome(match) {
  if (!match.actualScore) return null;
  const [homeScore, awayScore] = match.actualScore.split("-").map(Number);
  if (Number.isNaN(homeScore) || Number.isNaN(awayScore)) return null;
  if (homeScore > awayScore) return `${match.home}胜`;
  if (homeScore < awayScore) return `${match.away}胜`;
  return "平局";
}

function getReviewNote(status, exact) {
  if (status === "pending") return "比赛未结束，暂不计入命中率";
  if (exact) return "方向和比分均精准";
  if (status === "hit") return "方向命中，比分仍有偏差";
  return "方向未命中，需要复盘球队状态和临场变化";
}

function buildSummary(key, predictions, reviews, isoDate, today) {
  if (!predictions.length) {
    return `${labelForDay(key)}暂无已录入比赛。`;
  }

  if (isoDate > today) {
    return `${labelForDay(key)}有 ${predictions.length} 场赛前预测，比赛结束后会自动进入复盘。`;
  }

  const completed = reviews.filter((item) => item.status !== "pending");
  const hits = completed.filter((item) => item.status === "hit");
  const pending = reviews.length - completed.length;

  if (!completed.length) {
    return `${labelForDay(key)}的比赛还在进行或等待开赛，复盘结果先标为待复盘。`;
  }

  return `${labelForDay(key)} ${predictions.length} 场预测中，已复盘 ${completed.length} 场，命中 ${hits.length} 场${pending ? `，还有 ${pending} 场待复盘` : ""}。`;
}

function labelForDay(key) {
  return {
    yesterday: "昨天",
    today: "今天",
    tomorrow: "明天",
  }[key] || key;
}

function confidenceToBucket(confidence) {
  return {
    高: "high",
    中: "mid",
    低: "low",
  }[confidence] || "low";
}

function isLateKick(kick) {
  const hour = Number(String(kick || "00:00").split(":")[0]);
  return hour < 6 || hour >= 22;
}

function compareMatches(a, b) {
  return `${a.isoDate} ${a.kick}`.localeCompare(`${b.isoDate} ${b.kick}`);
}

function addDays(isoDate, amount) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + amount));
  return date.toISOString().slice(0, 10);
}

function formatDisplayDate(isoDate) {
  const [, month, day] = isoDate.split("-").map(Number);
  return `${month}月${day}日`;
}

function getTodayISO(timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
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
