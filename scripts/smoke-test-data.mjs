import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const dataPath = path.join(projectRoot, "data.js");

const code = await readFile(dataPath, "utf8");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(code, context, { filename: dataPath });

const data = context.window.WORLD_CUP_DATA;
const errors = [];

if (!data) errors.push("没有找到 window.WORLD_CUP_DATA");
if (!data?.meta?.schemaVersion) errors.push("缺少 meta.schemaVersion");
if (!Array.isArray(data?.dayOrder)) errors.push("dayOrder 必须是数组");
if (!data?.days?.today) errors.push("缺少 days.today");
if (!Array.isArray(data?.schedule)) errors.push("schedule 必须是数组");

(data?.dayOrder || []).forEach((dayKey) => {
  const day = data.days?.[dayKey];
  if (!day) {
    errors.push(`缺少 days.${dayKey}`);
    return;
  }
  if (!Array.isArray(day.predictions)) errors.push(`${dayKey}.predictions 必须是数组`);
  if (!Array.isArray(day.reviews)) errors.push(`${dayKey}.reviews 必须是数组`);
  (day.predictions || []).forEach((prediction) => {
    ["id", "matchId", "time", "match", "pick", "score", "confidence"].forEach((field) => {
      if (!prediction[field]) errors.push(`${dayKey} 的预测缺少 ${field}`);
    });
  });
});

if (errors.length) {
  throw new Error(`data.js 自检失败：\n- ${errors.join("\n- ")}`);
}

console.log("data.js 自检通过。");
