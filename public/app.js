const trigramMap = {
  "111": { name: "乾", symbol: "☰", nature: "天", element: "金" },
  "110": { name: "兑", symbol: "☱", nature: "泽", element: "金" },
  "101": { name: "离", symbol: "☲", nature: "火", element: "火" },
  "100": { name: "震", symbol: "☳", nature: "雷", element: "木" },
  "011": { name: "巽", symbol: "☴", nature: "风", element: "木" },
  "010": { name: "坎", symbol: "☵", nature: "水", element: "水" },
  "001": { name: "艮", symbol: "☶", nature: "山", element: "土" },
  "000": { name: "坤", symbol: "☷", nature: "地", element: "土" },
};

const kingWen = {
  "乾-乾": "乾为天", "坤-坤": "坤为地", "坎-震": "水雷屯", "艮-坎": "山水蒙",
  "坎-乾": "水天需", "乾-坎": "天水讼", "坤-坎": "地水师", "坎-坤": "水地比",
  "巽-乾": "风天小畜", "乾-兑": "天泽履", "坤-乾": "地天泰", "乾-坤": "天地否",
  "乾-离": "天火同人", "离-乾": "火天大有", "坤-艮": "地山谦", "震-坤": "雷地豫",
  "兑-震": "泽雷随", "艮-巽": "山风蛊", "坤-兑": "地泽临", "巽-坤": "风地观",
  "离-震": "火雷噬嗑", "艮-离": "山火贲", "艮-坤": "山地剥", "坤-震": "地雷复",
  "乾-震": "天雷无妄", "艮-乾": "山天大畜", "艮-震": "山雷颐", "兑-巽": "泽风大过",
  "坎-坎": "坎为水", "离-离": "离为火", "兑-艮": "泽山咸", "震-巽": "雷风恒",
  "乾-艮": "天山遁", "震-乾": "雷天大壮", "离-坤": "火地晋", "坤-离": "地火明夷",
  "巽-离": "风火家人", "离-兑": "火泽睽", "坎-艮": "水山蹇", "震-坎": "雷水解",
  "艮-兑": "山泽损", "巽-震": "风雷益", "兑-乾": "泽天夬", "乾-巽": "天风姤",
  "兑-坤": "泽地萃", "坤-巽": "地风升", "兑-坎": "泽水困", "坎-巽": "水风井",
  "兑-离": "泽火革", "离-巽": "火风鼎", "震-震": "震为雷", "艮-艮": "艮为山",
  "巽-艮": "风山渐", "震-兑": "雷泽归妹", "震-离": "雷火丰", "离-艮": "火山旅",
  "巽-巽": "巽为风", "兑-兑": "兑为泽", "巽-坎": "风水涣", "坎-兑": "水泽节",
  "巽-兑": "风泽中孚", "震-艮": "雷山小过", "坎-离": "水火既济", "离-坎": "火水未济",
};

const palaceInfo = {
  乾为天: { palace: "乾", element: "金", shi: 6 }, 天风姤: { palace: "乾", element: "金", shi: 1 },
  天山遁: { palace: "乾", element: "金", shi: 2 }, 天地否: { palace: "乾", element: "金", shi: 3 },
  风地观: { palace: "乾", element: "金", shi: 4 }, 山地剥: { palace: "乾", element: "金", shi: 5 },
  火地晋: { palace: "乾", element: "金", shi: 4 }, 火天大有: { palace: "乾", element: "金", shi: 3 },
  兑为泽: { palace: "兑", element: "金", shi: 6 }, 泽水困: { palace: "兑", element: "金", shi: 1 },
  泽地萃: { palace: "兑", element: "金", shi: 2 }, 泽山咸: { palace: "兑", element: "金", shi: 3 },
  水山蹇: { palace: "兑", element: "金", shi: 4 }, 地山谦: { palace: "兑", element: "金", shi: 5 },
  雷山小过: { palace: "兑", element: "金", shi: 4 }, 雷泽归妹: { palace: "兑", element: "金", shi: 3 },
  离为火: { palace: "离", element: "火", shi: 6 }, 火山旅: { palace: "离", element: "火", shi: 1 },
  火风鼎: { palace: "离", element: "火", shi: 2 }, 火水未济: { palace: "离", element: "火", shi: 3 },
  山水蒙: { palace: "离", element: "火", shi: 4 }, 风水涣: { palace: "离", element: "火", shi: 5 },
  天水讼: { palace: "离", element: "火", shi: 4 }, 天火同人: { palace: "离", element: "火", shi: 3 },
  震为雷: { palace: "震", element: "木", shi: 6 }, 雷地豫: { palace: "震", element: "木", shi: 1 },
  雷水解: { palace: "震", element: "木", shi: 2 }, 雷风恒: { palace: "震", element: "木", shi: 3 },
  地风升: { palace: "震", element: "木", shi: 4 }, 水风井: { palace: "震", element: "木", shi: 5 },
  泽风大过: { palace: "震", element: "木", shi: 4 }, 泽雷随: { palace: "震", element: "木", shi: 3 },
  巽为风: { palace: "巽", element: "木", shi: 6 }, 风天小畜: { palace: "巽", element: "木", shi: 1 },
  风火家人: { palace: "巽", element: "木", shi: 2 }, 风雷益: { palace: "巽", element: "木", shi: 3 },
  天雷无妄: { palace: "巽", element: "木", shi: 4 }, 火雷噬嗑: { palace: "巽", element: "木", shi: 5 },
  山雷颐: { palace: "巽", element: "木", shi: 4 }, 山风蛊: { palace: "巽", element: "木", shi: 3 },
  坎为水: { palace: "坎", element: "水", shi: 6 }, 水泽节: { palace: "坎", element: "水", shi: 1 },
  水雷屯: { palace: "坎", element: "水", shi: 2 }, 水火既济: { palace: "坎", element: "水", shi: 3 },
  泽火革: { palace: "坎", element: "水", shi: 4 }, 雷火丰: { palace: "坎", element: "水", shi: 5 },
  地火明夷: { palace: "坎", element: "水", shi: 4 }, 地水师: { palace: "坎", element: "水", shi: 3 },
  艮为山: { palace: "艮", element: "土", shi: 6 }, 山火贲: { palace: "艮", element: "土", shi: 1 },
  山天大畜: { palace: "艮", element: "土", shi: 2 }, 山泽损: { palace: "艮", element: "土", shi: 3 },
  火泽睽: { palace: "艮", element: "土", shi: 4 }, 天泽履: { palace: "艮", element: "土", shi: 5 },
  风泽中孚: { palace: "艮", element: "土", shi: 4 }, 风山渐: { palace: "艮", element: "土", shi: 3 },
  坤为地: { palace: "坤", element: "土", shi: 6 }, 地雷复: { palace: "坤", element: "土", shi: 1 },
  地泽临: { palace: "坤", element: "土", shi: 2 }, 地天泰: { palace: "坤", element: "土", shi: 3 },
  雷天大壮: { palace: "坤", element: "土", shi: 4 }, 泽天夬: { palace: "坤", element: "土", shi: 5 },
  水天需: { palace: "坤", element: "土", shi: 4 }, 水地比: { palace: "坤", element: "土", shi: 3 },
};

const lineLabels = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];
const lineOptions = [
  { value: 6, label: "老阴 6（动，阴变阳）" },
  { value: 7, label: "少阳 7（静，阳）" },
  { value: 8, label: "少阴 8（静，阴）" },
  { value: 9, label: "老阳 9（动，阳变阴）" },
];

const branchByTrigram = {
  乾: { lower: ["子", "寅", "辰"], upper: ["午", "申", "戌"] },
  兑: { lower: ["巳", "卯", "丑"], upper: ["亥", "酉", "未"] },
  离: { lower: ["卯", "丑", "亥"], upper: ["酉", "未", "巳"] },
  震: { lower: ["子", "寅", "辰"], upper: ["午", "申", "戌"] },
  巽: { lower: ["丑", "亥", "酉"], upper: ["未", "巳", "卯"] },
  坎: { lower: ["寅", "辰", "午"], upper: ["申", "戌", "子"] },
  艮: { lower: ["辰", "午", "申"], upper: ["戌", "子", "寅"] },
  坤: { lower: ["未", "巳", "卯"], upper: ["丑", "亥", "酉"] },
};

const branchElement = {
  子: "水", 亥: "水", 寅: "木", 卯: "木", 巳: "火", 午: "火",
  申: "金", 酉: "金", 辰: "土", 戌: "土", 丑: "土", 未: "土",
};

const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const monthBranches = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"];
const solarMonthStarts = [
  { month: 2, day: 4 }, { month: 3, day: 6 }, { month: 4, day: 5 }, { month: 5, day: 6 },
  { month: 6, day: 6 }, { month: 7, day: 7 }, { month: 8, day: 8 }, { month: 9, day: 8 },
  { month: 10, day: 8 }, { month: 11, day: 7 }, { month: 12, day: 7 }, { month: 1, day: 6 },
];
const produces = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
const controls = { 木: "土", 土: "水", 水: "火", 火: "金", 金: "木" };
const sixGods = ["青龙", "朱雀", "勾陈", "螣蛇", "白虎", "玄武"];
const trigramBitsByName = Object.fromEntries(Object.entries(trigramMap).map(([bits, trigram]) => [trigram.name, bits]));
const clashPairs = [["子", "午"], ["丑", "未"], ["寅", "申"], ["卯", "酉"], ["辰", "戌"], ["巳", "亥"]];
const harmonyPairs = [["子", "丑"], ["寅", "亥"], ["卯", "戌"], ["辰", "酉"], ["巳", "申"], ["午", "未"]];
const hexagramClashNames = new Set(["乾为天", "坤为地", "震为雷", "巽为风", "坎为水", "离为火", "艮为山", "兑为泽", "天雷无妄", "雷天大壮"]);
const hexagramHarmonyNames = new Set(["天地否", "地天泰", "泽水困", "水泽节", "火山旅", "山火贲", "雷地豫", "地雷复"]);

const topicSpirit = {
  career: { spirit: "官鬼", focus: "职位、规则、压力与机会并看" },
  wealth: { spirit: "妻财", focus: "收入、客户、成本和回款并看" },
  relationship: { spirit: "官鬼 / 妻财", focus: "关系中的承诺、回应和阻力并看" },
  health: { spirit: "官鬼 / 子孙", focus: "病象与恢复力并看" },
  study: { spirit: "父母", focus: "文书、成绩、资格和助力并看" },
  travel: { spirit: "父母 / 子孙", focus: "行程、手续、安全和顺畅度并看" },
  general: { spirit: "世爻", focus: "自身状态、动爻和应爻关系并看" },
};

const els = {
  lineEditor: document.querySelector("#lineEditor"),
  method: document.querySelector("#method"),
  userName: document.querySelector("#userName"),
  gender: document.querySelector("#gender"),
  question: document.querySelector("#question"),
  topic: document.querySelector("#topic"),
  castBtn: document.querySelector("#castBtn"),
  coinBtn: document.querySelector("#coinBtn"),
  resetBtn: document.querySelector("#resetBtn"),
  coins: [...document.querySelectorAll(".coin")],
  coinCaster: document.querySelector("#coinCaster"),
  coinLog: document.querySelector("#coinLog"),
  progressText: document.querySelector("#progressText"),
  progressDots: document.querySelector("#progressDots"),
  baseName: document.querySelector("#baseName"),
  baseTrigrams: document.querySelector("#baseTrigrams"),
  baseLines: document.querySelector("#baseLines"),
  changedName: document.querySelector("#changedName"),
  changedTrigrams: document.querySelector("#changedTrigrams"),
  changedLines: document.querySelector("#changedLines"),
  movingLines: document.querySelector("#movingLines"),
  shiYing: document.querySelector("#shiYing"),
  useSpirit: document.querySelector("#useSpirit"),
  castTime: document.querySelector("#castTime"),
  auxGrid: document.querySelector("#auxGrid"),
  omenGrid: document.querySelector("#omenGrid"),
  yaoTable: document.querySelector("#yaoTable"),
  aiEndpoint: document.querySelector("#aiEndpoint"),
  aiModel: document.querySelector("#aiModel"),
  aiBtn: document.querySelector("#aiBtn"),
  aiStatus: document.querySelector("#aiStatus"),
  aiOutput: document.querySelector("#aiOutput"),
};

let currentLines = [];
let tossLog = [];
let nextTossIndex = 0;
let coinAnimationTimer;
let lastAiSignature = "";
let aiRequestId = 0;

function initLineEditor() {
  els.lineEditor.innerHTML = lineLabels
    .map((label, index) => {
      const options = lineOptions
        .map((item) => `<option value="${item.value}">${item.label}</option>`)
        .join("");
      return `<label class="line-choice" style="order:${6 - index}"><span>${label}</span><select name="line-${index + 1}" autocomplete="off" data-line="${index}">${options}</select></label>`;
    })
    .join("");

  els.lineEditor.querySelectorAll("select").forEach((select, index) => {
    select.value = currentLines[index] || 7;
    select.addEventListener("change", () => {
      currentLines[index] = Number(select.value);
      cast();
    });
  });
}

function tossCoins() {
  const coins = Array.from({ length: 3 }, () => {
    const value = Math.random() > 0.5 ? 3 : 2;
    return { value, side: value === 3 ? "背" : "字" };
  });
  return {
    coins,
    value: coins.reduce((sum, coin) => sum + coin.value, 0),
    text: coins.map((coin) => coin.side).join(" "),
  };
}

function syncEditor() {
  els.lineEditor.querySelectorAll("select").forEach((select, index) => {
    select.value = currentLines[index] || 7;
  });
}

function updateCoinLog() {
  els.coinLog.innerHTML = tossLog.length ? tossLog.join("<br>") : "<span>点击铜钱或“掷一次”，从初爻开始逐爻成卦。</span>";
}

function setCoinControlsDisabled(disabled) {
  els.coinBtn.disabled = disabled;
  els.coins.forEach((coin) => {
    coin.disabled = disabled;
    coin.setAttribute("aria-disabled", String(disabled));
  });
}

function renderProgress() {
  els.progressDots.innerHTML = lineLabels
    .map((label, index) => {
      const value = currentLines[index];
      const text = value ? `${label} ${lineName(value)}` : label;
      return `<span class="progress-dot ${value ? "is-filled" : ""}">${text}</span>`;
    })
    .join("");

  if (currentLines.length >= 6) {
    els.progressText.textContent = "六爻已成，铜钱已锁定；如需重来请点击重置。";
  } else {
    els.progressText.textContent = `点击三枚铜钱，当前将生成${lineLabels[currentLines.length]}。`;
  }
  setCoinControlsDisabled(els.method.value === "coins" && currentLines.length >= 6);
}

function lineName(value) {
  return lineOptions.find((item) => item.value === value)?.label.slice(0, 2) || "";
}

function strokeMarkup(value) {
  const bit = lineToBit(value);
  const moving = value === 6 || value === 9;
  const mark = value === 9 ? "○" : value === 6 ? "×" : "";
  const segments = bit
    ? '<span class="stroke-segment"></span>'
    : '<span class="stroke-segment"></span><span></span><span class="stroke-segment"></span>';
  return `<div class="stroke ${bit ? "yang" : "yin"}">${segments}${moving ? `<span class="moving-mark">${mark}</span>` : ""}</div>`;
}

function renderCoins(toss) {
  clearTimeout(coinAnimationTimer);
  if (!toss) {
    els.coins.forEach((coin) => {
      coin.classList.remove("is-tail", "is-flipping", "is-settling");
      setCoinChars(coin, ["乾", "通", "隆", "宝"]);
      coin.querySelector(".coin-side").textContent = "待掷";
    });
    return;
  }

  els.coins.forEach((coin, index) => {
    const side = toss.coins[index].side;
    coin.classList.remove("is-flipping");
    void coin.offsetWidth;
    coin.classList.toggle("is-tail", side === "背");
    coin.classList.add("is-flipping", "is-settling");
    setCoinChars(coin, side === "背" ? ["", "泉", "", "宝"] : ["乾", "通", "隆", "宝"]);
    coin.querySelector(".coin-side").textContent = side === "背" ? "三" : "二";
  });

  coinAnimationTimer = setTimeout(() => {
    els.coins.forEach((coin) => {
      coin.classList.remove("is-flipping", "is-settling");
    });
  }, 460);
}

function setCoinChars(coin, chars) {
  ["top", "right", "bottom", "left"].forEach((position, index) => {
    coin.querySelector(`.coin-char.${position}`).textContent = chars[index] || "";
  });
}

function resetResultPlaceholders() {
  els.baseName.textContent = "待成卦";
  els.baseTrigrams.textContent = currentLines.length ? `已定${currentLines.length}爻，继续成卦` : "掷满六次后生成";
  els.changedName.textContent = "待变卦";
  els.changedTrigrams.textContent = currentLines.length ? "已定爻同步显示" : "动爻成变";
  els.movingLines.textContent = "-";
  els.shiYing.textContent = "-";
  els.useSpirit.textContent = topicSpirit[els.topic.value].spirit;
  els.castTime.textContent = "";
  renderLines(els.baseLines, currentLines);
  renderLines(els.changedLines, currentLines.map(changedValue));
  els.yaoTable.innerHTML = "";
  els.auxGrid.innerHTML = "";
  els.omenGrid.innerHTML = "";
}

function lineToBit(value) {
  return value === 7 || value === 9 ? 1 : 0;
}

function changedValue(value) {
  if (value === 6) return 7;
  if (value === 9) return 8;
  return value;
}

function getTrigrams(lines) {
  const lowerKey = lines.slice(0, 3).map(lineToBit).join("");
  const upperKey = lines.slice(3, 6).map(lineToBit).join("");
  return { lower: trigramMap[lowerKey], upper: trigramMap[upperKey] };
}

function hexName(trigrams) {
  return kingWen[`${trigrams.upper.name}-${trigrams.lower.name}`] || `${trigrams.upper.nature}${trigrams.lower.nature}`;
}

function relation(selfElement, lineElement) {
  if (selfElement === lineElement) return "兄弟";
  if (produces[lineElement] === selfElement) return "父母";
  if (produces[selfElement] === lineElement) return "子孙";
  if (controls[lineElement] === selfElement) return "官鬼";
  if (controls[selfElement] === lineElement) return "妻财";
  return "同参";
}

function pairedBranch(branch, pairs) {
  const pair = pairs.find(([left, right]) => left === branch || right === branch);
  if (!pair) return "";
  return pair[0] === branch ? pair[1] : pair[0];
}

function clashes(left, right) {
  return pairedBranch(left, clashPairs) === right;
}

function harmonizes(left, right) {
  return pairedBranch(left, harmonyPairs) === right;
}

function branchFromGanzhi(value) {
  return branches.find((branch) => String(value || "").includes(branch)) || "";
}

function dayStemIndex() {
  return dayGanzhiIndex(new Date()) % 10;
}

function godStartIndex() {
  const stem = dayStemIndex();
  if (stem === 0 || stem === 1) return 0;
  if (stem === 2 || stem === 3) return 1;
  if (stem === 4) return 2;
  if (stem === 5) return 3;
  if (stem === 6 || stem === 7) return 4;
  return 5;
}

function dayGanzhiIndex(date) {
  const base = new Date(2000, 0, 1);
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.floor((target - base) / 86400000);
  return ((days + 54) % 60 + 60) % 60;
}

function ganzhi(index) {
  return `${stems[index % 10]}${branches[index % 12]}`;
}

function hourBranchIndex(date) {
  return Math.floor(((date.getHours() + 1) % 24) / 2);
}

function hourGanzhi(date, dayIndex) {
  const branchIndex = hourBranchIndex(date);
  const stemIndex = ((dayIndex % 10) % 5) * 2 + branchIndex;
  return `${stems[stemIndex % 10]}${branches[branchIndex]}`;
}

function solarYear(date) {
  const lichun = new Date(date.getFullYear(), 1, 4);
  return date < lichun ? date.getFullYear() - 1 : date.getFullYear();
}

function yearGanzhiIndex(date) {
  return ((solarYear(date) - 1984) % 60 + 60) % 60;
}

function yearGanzhi(date) {
  return ganzhi(yearGanzhiIndex(date));
}

function solarMonthIndex(date) {
  const year = date.getFullYear();
  const starts = solarMonthStarts.map((item, index) => ({
    index,
    date: new Date(item.month === 1 ? year + 1 : year, item.month - 1, item.day),
  }));
  const prevChou = new Date(year, 0, 6);
  if (date < starts[0].date) {
    return date >= prevChou ? 11 : 10;
  }
  for (let i = starts.length - 1; i >= 0; i -= 1) {
    if (date >= starts[i].date) return starts[i].index;
  }
  return 0;
}

function monthGanzhi(date) {
  const monthIndex = solarMonthIndex(date);
  const yearStem = yearGanzhiIndex(date) % 10;
  const firstMonthStem = { 0: 2, 5: 2, 1: 4, 6: 4, 2: 6, 7: 6, 3: 8, 8: 8, 4: 0, 9: 0 }[yearStem];
  return `${stems[(firstMonthStem + monthIndex) % 10]}${monthBranches[monthIndex]}`;
}

function voidBranches(dayIndex) {
  const xunStart = Math.floor(dayIndex / 10) * 10;
  return `${branches[(xunStart + 10) % 12]}、${branches[(xunStart + 11) % 12]}`;
}

function auxInfo(date = new Date()) {
  const dayIndex = dayGanzhiIndex(date);
  const monthIndex = solarMonthIndex(date);
  const hour = hourGanzhi(date, dayIndex);
  return {
    dateText: new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date),
    year: yearGanzhi(date),
    month: monthGanzhi(date),
    monthBuild: `${monthBranches[monthIndex]}${branchElement[monthBranches[monthIndex]]}`,
    day: ganzhi(dayIndex),
    hour,
    voids: voidBranches(dayIndex),
  };
}

function shiYingPositions(name) {
  const shi = palaceInfo[name]?.shi || 6;
  const ying = ((shi + 2) % 6) + 1;
  return { shi, ying };
}

function yaoDetails(lines, trigrams, name, palaceElement = palaceInfo[name]?.element || trigrams.upper.element) {
  const lowerBranches = branchByTrigram[trigrams.lower.name].lower;
  const upperBranches = branchByTrigram[trigrams.upper.name].upper;
  const start = godStartIndex();
  const positions = shiYingPositions(name);

  const details = lines.map((line, index) => {
    const branch = index < 3 ? lowerBranches[index] : upperBranches[index - 3];
    const element = branchElement[branch];
    const tags = [];
    if (positions.shi === index + 1) tags.push("世");
    if (positions.ying === index + 1) tags.push("应");
    return {
      position: lineLabels[index],
      value: line,
      yinYang: lineToBit(line) ? "阳" : "阴",
      moving: line === 6 || line === 9,
      branch,
      element,
      relative: relation(palaceElement, element),
      god: sixGods[(start + index) % 6],
      changedValue: changedValue(line),
      tags,
    };
  });
  const palaceDetails = palaceSourceDetails(name, palaceElement);
  const visibleRelatives = new Set(details.map((item) => item.relative));

  return details.map((item, index) => {
    const hidden = palaceDetails[index];
    if (!hidden || visibleRelatives.has(hidden.relative)) return { ...item, hidden: null };
    return {
      ...item,
      hidden: {
        relative: hidden.relative,
        branch: hidden.branch,
        element: hidden.element,
        fly: {
          relative: item.relative,
          branch: item.branch,
          element: item.element,
        },
      },
    };
  });
}

function palaceSourceDetails(name, palaceElement) {
  const palaceName = palaceInfo[name]?.palace;
  const bits = trigramBitsByName[palaceName];
  if (!palaceName || !bits) return [];

  const lines = [...bits, ...bits].map((bit) => (bit === "1" ? 7 : 8));
  const trigrams = getTrigrams(lines);
  const lowerBranches = branchByTrigram[trigrams.lower.name].lower;
  const upperBranches = branchByTrigram[trigrams.upper.name].upper;

  return lines.map((line, index) => {
    const branch = index < 3 ? lowerBranches[index] : upperBranches[index - 3];
    const element = branchElement[branch];
    return {
      position: lineLabels[index],
      value: line,
      branch,
      element,
      relative: relation(palaceElement, element),
    };
  });
}

function annotateLineSignals(details, changedDetails, info) {
  const voidSet = new Set(String(info.voids || "").split("、").filter(Boolean));
  const monthBranch = branchFromGanzhi(info.month);
  const dayBranch = branchFromGanzhi(info.day);

  details.forEach((item, index) => {
    const changed = changedDetails[index] || {};
    const notes = [];
    const highlight = [];

    if (voidSet.has(item.branch)) {
      notes.push({ type: "void", label: "旬空", text: `${item.branch}临日空` });
      highlight.push("旬空");
    }
    if (monthBranch && clashes(item.branch, monthBranch)) {
      notes.push({ type: "month-break", label: "月破", text: `${item.branch}冲月建${monthBranch}` });
      highlight.push("月破");
    }
    if (dayBranch && clashes(item.branch, dayBranch)) {
      notes.push({ type: "day-clash", label: "日冲", text: `${item.branch}受日辰${dayBranch}冲` });
      highlight.push("日冲");
    }
    if (monthBranch && harmonizes(item.branch, monthBranch)) {
      notes.push({ type: "month-harmony", label: "月合", text: `${item.branch}与月建${monthBranch}合` });
    }
    if (dayBranch && harmonizes(item.branch, dayBranch)) {
      notes.push({ type: "day-harmony", label: "日合", text: `${item.branch}与日辰${dayBranch}合` });
    }
    if (item.moving) {
      notes.push({ type: "moving", label: "动爻", text: `${item.position}${lineName(item.value)}动，化${changed.relative || ""}${changed.branch || ""}${changed.element || ""}` });
      highlight.push("动");
    }
    if (item.hidden) {
      const fly = item.hidden.fly ? `，飞${item.hidden.fly.relative}${item.hidden.fly.branch}${item.hidden.fly.element}` : "";
      notes.push({ type: "hidden", label: "伏神", text: `伏${item.hidden.relative}${item.hidden.branch}${item.hidden.element}${fly}` });
      highlight.push("伏");
    }
    if (item.moving && changed.branch && changed.branch !== item.branch) {
      const relationText = describeChangeRelation(item, changed);
      notes.push({ type: "change", label: "变爻", text: `${item.relative}${item.branch}${item.element}化${changed.relative}${changed.branch}${changed.element}${relationText ? `，${relationText}` : ""}` });
    }

    item.notes = notes;
    item.flags = highlight;
  });
}

function describeChangeRelation(item, changed) {
  if (!changed?.element || item.element === changed.element) return "本气不变";
  if (produces[item.element] === changed.element) return "本爻生变爻";
  if (produces[changed.element] === item.element) return "变爻回生";
  if (controls[item.element] === changed.element) return "本爻克变爻";
  if (controls[changed.element] === item.element) return "变爻回克";
  return "";
}

function buildDiagnostics({ base, changed, details, changedDetails, info }) {
  const voidBranchesText = info.voids || "-";
  const monthBranch = branchFromGanzhi(info.month);
  const dayBranch = branchFromGanzhi(info.day);
  const moving = details.filter((item) => item.moving);
  const hidden = details.filter((item) => item.hidden);
  const voidLines = linesWithNote(details, "void");
  const monthBreakLines = linesWithNote(details, "month-break");
  const dayClashLines = linesWithNote(details, "day-clash");
  const harmonyLines = details
    .filter((item) => item.notes?.some((note) => note.type === "month-harmony" || note.type === "day-harmony"))
    .map((item) => `${item.position}${item.branch}`);
  const hexagramHarmonyClash = [
    hexagramClashNames.has(base.name) ? `本卦${base.name}为六冲卦` : "",
    hexagramHarmonyNames.has(base.name) ? `本卦${base.name}为六合卦` : "",
    changed.name !== base.name && hexagramClashNames.has(changed.name) ? `变卦${changed.name}为六冲卦` : "",
    changed.name !== base.name && hexagramHarmonyNames.has(changed.name) ? `变卦${changed.name}为六合卦` : "",
  ].filter(Boolean);

  const changeFocus = moving.map((item) => {
    const index = details.indexOf(item);
    const changedItem = changedDetails[index] || {};
    const relationText = describeChangeRelation(item, changedItem);
    return `${item.position}${item.relative}${item.branch}${item.element}化${changedItem.relative || ""}${changedItem.branch || ""}${changedItem.element || ""}${relationText ? `（${relationText}）` : ""}`;
  });

  const hiddenFocus = hidden.map((item) => {
    const fly = item.hidden.fly ? `，飞${item.hidden.fly.relative}${item.hidden.fly.branch}${item.hidden.fly.element}` : "";
    return `${item.position}伏${item.hidden.relative}${item.hidden.branch}${item.hidden.element}${fly}`;
  });

  return {
    void: {
      title: "旬空",
      value: `${voidBranchesText}空`,
      detail: voidLines.length ? `${voidLines.join("、")}落空` : "本卦六爻未临旬空",
    },
    monthBreak: {
      title: "月破",
      value: monthBreakLines.length ? monthBreakLines.join("、") : "无",
      detail: monthBranch ? `月建${monthBranch}；${monthBreakLines.length ? "被月建所冲者为月破" : "六爻未见月破"}` : "未取到月建",
    },
    dayClash: {
      title: "日冲",
      value: dayClashLines.length ? dayClashLines.join("、") : "无",
      detail: dayBranch ? `日辰${dayBranch}；${dayClashLines.length ? "受日辰所冲" : "六爻未见日冲"}` : "未取到日辰",
    },
    harmonyClash: {
      title: "六合六冲",
      value: hexagramHarmonyClash.length ? hexagramHarmonyClash.join("；") : "本变卦未入固定六合/六冲卦",
      detail: harmonyLines.length ? `爻支与月日六合：${harmonyLines.join("、")}` : "爻支未见与月日六合",
    },
    moving: {
      title: "动爻",
      value: moving.length ? moving.map((item) => item.position).join("、") : "无",
      detail: changeFocus.length ? changeFocus.join("；") : "六爻皆静，以世应、用神旺衰为主",
    },
    hidden: {
      title: "伏神",
      value: hidden.length ? hidden.map((item) => item.position).join("、") : "无",
      detail: hiddenFocus.length ? hiddenFocus.join("；") : "本卦所需六亲均已上卦",
    },
  };
}

function linesWithNote(details, type) {
  return details
    .filter((item) => item.notes?.some((note) => note.type === type))
    .map((item) => `${item.position}${item.branch}`);
}

function renderLines(target, lines, details = []) {
  target.innerHTML = lines
    .map((line, index) => {
      const moving = line === 6 || line === 9;
      const tag = details[index]?.tags?.join(" / ") || "";
      return `
        <div class="yao-line">
          ${strokeMarkup(line)}
          <span class="line-tag">${moving ? "动" : ""}${tag ? ` ${tag}` : ""}</span>
        </div>
      `;
    })
    .join("");
}

function renderTable(details, changedDetails) {
  const useSpirits = selectedUseSpirits();
  const header = `
    <div class="yao-row is-header" aria-hidden="true">
      <span>爻位</span><span>六神</span><span>本卦爻</span><span>本卦六亲</span><span>伏藏</span><span>世应</span><span>动</span><span>变卦爻</span><span>变卦六亲</span><span>提示</span>
    </div>
  `;
  els.yaoTable.innerHTML = header + details
    .map((item, index) => ({ item, changed: changedDetails[index] }))
    .reverse()
    .map(({ item, changed }) => {
      const rowClasses = [
        "yao-row",
        item.moving ? "has-moving" : "",
        item.hidden ? "has-hidden" : "",
        (isUseSpirit(item, useSpirits) || isUseSpirit(item.hidden, useSpirits)) ? "is-use-spirit-row" : "",
      ].filter(Boolean).join(" ");
      return `
      <div class="${rowClasses}">
        <strong>${item.position}</strong>
        <span>${item.god}</span>
        <div class="yao-mini">${strokeMarkup(item.value)}</div>
        <span>${relationMarkup(item)}</span>
        <span>${hiddenMarkup(item.hidden)}</span>
        <span>${item.tags.join(" ") || "-"}</span>
        <span><strong class="${item.moving ? "is-moving" : ""}">${item.moving ? `${item.value} ${lineName(item.value)}` : "静"}</strong></span>
        <div class="yao-mini">${strokeMarkup(changed.value)}</div>
        <span>${item.moving ? relationMarkup(changed) : "-"}</span>
        <span>${noteBadges(item.notes)}</span>
      </div>
    `;
    })
    .join("");
}

function noteBadges(notes = []) {
  if (!notes.length) return "-";
  return `<span class="note-badges">${notes.map((note) => `<span class="note-badge note-${note.type}" title="${escapeHtml(note.text)}">${escapeHtml(note.label)}</span>`).join("")}</span>`;
}

function relationMarkup(item) {
  const useClass = isUseSpirit(item, selectedUseSpirits()) ? " is-use-spirit" : "";
  return `<span class="relation-pair${useClass}"><span class="relative-name">${item.relative}</span><span class="branch-token element-${item.element}">${item.branch}${item.element}</span></span>`;
}

function hiddenMarkup(item) {
  if (!item) return "-";
  const flyText = item.fly ? `，飞${item.fly.relative}${item.fly.branch}${item.fly.element}` : "";
  return `<span class="hidden-pair" title="伏${item.relative}${item.branch}${item.element}${flyText}"><span class="hidden-spirit">伏</span>${relationMarkup(item)}</span>`;
}

function selectedUseSpirits() {
  return (topicSpirit[els.topic.value]?.spirit || "")
    .split("/")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isUseSpirit(item, useSpirits = selectedUseSpirits()) {
  return Boolean(item?.relative && useSpirits.includes(item.relative));
}

function renderAux(info, base) {
  const items = [
    ["公历", info.dateText],
    ["年柱", info.year],
    ["月柱", info.month],
    ["日柱", info.day],
    ["时柱", info.hour],
    ["月建", info.monthBuild],
    ["日空", info.voids],
    ["卦宫", `${palaceInfo[base.name]?.palace || base.upper.name}宫${palaceInfo[base.name]?.element || base.upper.element}`],
  ];
  els.auxGrid.innerHTML = items
    .map(([label, value]) => `<div class="aux-item"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
}

function renderOmenGrid(diagnostics) {
  if (!diagnostics) {
    els.omenGrid.innerHTML = "";
    return;
  }

  els.omenGrid.innerHTML = Object.values(diagnostics)
    .map((item) => `
      <div class="omen-item">
        <span>${escapeHtml(item.title)}</span>
        <strong>${escapeHtml(item.value)}</strong>
        <em>${escapeHtml(item.detail)}</em>
      </div>
    `)
    .join("");
}

function currentCastData() {
  if (currentLines.length < 6) return null;

  const baseTrigrams = getTrigrams(currentLines);
  const changedLines = currentLines.map(changedValue);
  const changedTrigrams = getTrigrams(changedLines);
  const base = { ...baseTrigrams, name: hexName(baseTrigrams) };
  const changed = { ...changedTrigrams, name: hexName(changedTrigrams) };
  const palaceElement = palaceInfo[base.name]?.element || base.upper.element;
  const details = yaoDetails(currentLines, baseTrigrams, base.name, palaceElement);
  const changedDetails = yaoDetails(changedLines, changedTrigrams, base.name, palaceElement);
  const info = auxInfo();
  annotateLineSignals(details, changedDetails, info);
  const diagnostics = buildDiagnostics({ base, changed, details, changedDetails, info });
  return { base, changed, details, changedDetails, info, diagnostics };
}

function cast(options = {}) {
  const { autoAnalyze = false } = options;

  if (els.method.value === "manual") {
    currentLines = [...els.lineEditor.querySelectorAll("select")].map((select) => Number(select.value));
  }

  if (currentLines.length < 6) {
    resetResultPlaceholders();
    renderProgress();
    els.aiStatus.textContent = "请先完成六爻排盘。";
    els.aiOutput.innerHTML = "";
    return;
  }

  const { base, changed, details, changedDetails, info, diagnostics } = currentCastData();
  const changedLines = currentLines.map(changedValue);
  const positions = shiYingPositions(base.name);
  const moving = details.filter((item) => item.moving);
  const selectedTopic = topicSpirit[els.topic.value];

  els.baseName.textContent = base.name;
  els.baseTrigrams.textContent = `${base.upper.symbol}${base.upper.name}${base.upper.nature}上，${base.lower.symbol}${base.lower.name}${base.lower.nature}下`;
  els.changedName.textContent = moving.length ? changed.name : "无变卦";
  els.changedTrigrams.textContent = moving.length
    ? `${changed.upper.symbol}${changed.upper.name}${changed.upper.nature}上，${changed.lower.symbol}${changed.lower.name}${changed.lower.nature}下`
    : "六爻皆静";
  els.movingLines.textContent = moving.length ? moving.map((item) => item.position).join("、") : "无动爻";
  els.shiYing.textContent = `${palaceInfo[base.name]?.palace || base.upper.name}宫，世在${lineLabels[positions.shi - 1]}，应在${lineLabels[positions.ying - 1]}`;
  els.useSpirit.textContent = selectedTopic.spirit;
  els.castTime.textContent = info.dateText;

  renderLines(els.baseLines, currentLines, details);
  renderLines(els.changedLines, changedLines);
  renderTable(details, changedDetails);
  renderAux(info, base);
  renderOmenGrid(diagnostics);
  renderProgress();
  els.aiStatus.textContent = "排盘完成，AI 解卦提示将自动生成。";

  if (autoAnalyze) {
    analyzeWithAI({ skipDuplicate: true });
  }
}

function reset() {
  currentLines = [];
  tossLog = [];
  nextTossIndex = 0;
  els.userName.value = "";
  els.gender.value = "";
  els.question.value = "";
  els.topic.value = "career";
  els.method.value = "coins";
  els.coinCaster.hidden = false;
  els.coinBtn.hidden = false;
  els.lineEditor.hidden = true;
  syncEditor();
  updateCoinLog();
  renderCoins();
  renderProgress();
  els.aiOutput.innerHTML = "";
  els.aiStatus.textContent = "请先完成六爻排盘。";
  lastAiSignature = "";
  cast();
}

els.castBtn.addEventListener("click", () => cast({ autoAnalyze: true }));
els.aiBtn.addEventListener("click", analyzeWithAI);

async function analyzeWithAI(options = {}) {
  const { skipDuplicate = false } = options;
  const castData = currentCastData();
  const endpoint = els.aiEndpoint.value.trim() || "/api/analyze";
  const model = els.aiModel.value.trim() || "gpt-5.2";

  if (!castData) {
    els.aiStatus.textContent = "请先完成六爻排盘，再生成 AI 解卦。";
    return;
  }

  const signature = JSON.stringify({
    model,
    userName: els.userName.value.trim(),
    gender: els.gender.value,
    question: els.question.value.trim(),
    topic: els.topic.value,
    lines: currentLines,
    base: castData.base.name,
    changed: castData.changed.name,
  });

  if (skipDuplicate && signature === lastAiSignature) {
    return;
  }

  lastAiSignature = signature;
  const requestId = ++aiRequestId;
  const aiPrompt = buildAiPrompt(castData);
  els.aiBtn.disabled = true;
  els.aiStatus.textContent = "AI 正在分析卦象…";
  renderAiLoading();

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt: aiPrompt,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(await readErrorResponse(response));
    }

    if (requestId !== aiRequestId) return;
    const text = await readTextStream(response, {
      onChunk(partialText) {
        if (requestId !== aiRequestId) return;
        renderAiOutput(partialText, { streaming: true });
        els.aiStatus.textContent = `AI 正在分析卦象，已接收 ${Array.from(partialText).length} 字。`;
      },
    });

    if (requestId !== aiRequestId) return;
    renderAiOutput(text || "未获取到可显示的分析文本。");
    try {
      await saveReadingRecord({
        castData,
        model,
        prompt: aiPrompt,
        aiText: text,
        status: "success",
      });
      els.aiStatus.textContent = "AI 解卦完成，记录已保存。";
    } catch (saveError) {
      els.aiStatus.textContent = `AI 解卦完成，但保存失败：${saveError.message}`;
    }
  } catch (error) {
    if (requestId !== aiRequestId) return;
    lastAiSignature = "";
    els.aiStatus.textContent = `AI 请求失败：${error.message}`;
    els.aiOutput.innerHTML = "";
    await saveReadingRecord({
      castData,
      model,
      prompt: aiPrompt,
      aiText: "",
      status: "error",
      error: error.message,
    }).catch(() => {});
  } finally {
    if (requestId === aiRequestId) {
      els.aiBtn.disabled = false;
    }
  }
}

async function saveReadingRecord({ castData, model, prompt, aiText, status, error = "" }) {
  const response = await fetch("/api/public/records", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userName: els.userName.value.trim(),
      gender: els.gender.options[els.gender.selectedIndex].textContent,
      question: els.question.value.trim(),
      topic: els.topic.options[els.topic.selectedIndex].textContent,
      model,
      lines: currentLines,
      castData,
      prompt,
      aiText,
      status,
      error,
    }),
  });

  if (!response.ok) {
    throw new Error(await readErrorResponse(response));
  }

  return response.json();
}

async function readErrorResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      const data = await response.json();
      return data.error?.message || (typeof data.error === "string" ? data.error : "") || `请求失败：${response.status}`;
    } catch {
      return `请求失败：${response.status}`;
    }
  }

  const text = await response.text();
  return text.trim() || `请求失败：${response.status}`;
}

async function readTextStream(response, { onChunk } = {}) {
  if (!response.body) {
    const text = await response.text();
    let visibleText = "";
    await revealText(text, {
      onChunk(chunk) {
        visibleText += chunk;
        onChunk?.(visibleText);
      },
    });
    return text;
  }

  if ((response.headers.get("content-type") || "").includes("text/event-stream")) {
    return readSseTextStream(response, { onChunk });
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    text += decoder.decode(value, { stream: true });
    if (text.includes("[AI_ERROR]")) {
      throw new Error(text.replace("[AI_ERROR]", "").trim() || "AI 平台请求失败。");
    }
    onChunk?.(text);
  }

  text += decoder.decode();
  return text;
}

async function readSseTextStream(response, { onChunk } = {}) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";

  const handleEvent = async (rawEvent) => {
    const lines = rawEvent.split(/\r?\n/);
    const eventName = lines
      .find((line) => line.startsWith("event:"))
      ?.slice(6)
      .trim() || "message";
    const payload = lines
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .join("\n");

    if (!payload || eventName === "ready" || eventName === "done") return;

    let data;
    try {
      data = JSON.parse(payload);
    } catch {
      data = { text: payload };
    }

    if (eventName === "error" || data.error) {
      throw new Error(data.error || "AI 平台请求失败。");
    }

    if (data.text) {
      await revealText(data.text, {
        onChunk(chunk) {
          text += chunk;
          onChunk?.(text);
        },
      });
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split(/\n\n|\r\n\r\n/);
    buffer = events.pop() || "";
    for (const event of events) {
      await handleEvent(event);
    }
  }

  buffer += decoder.decode();
  if (buffer.trim()) await handleEvent(buffer);
  return text;
}

async function revealText(value, { onChunk } = {}) {
  const chars = Array.from(String(value || ""));
  for (let index = 0; index < chars.length; index += 2) {
    onChunk?.(chars.slice(index, index + 2).join(""));
    await wait(10);
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function inlineFormat(value) {
  const placeholders = [];
  const stash = (html) => {
    const token = `%%AIINLINE${placeholders.length}%%`;
    placeholders.push([token, html]);
    return token;
  };

  const raw = String(value)
    .replace(/`([^`]+?)`/g, (_, code) => stash(`<code>${escapeHtml(code)}</code>`))
    .replace(/\*\*([^*]+?)\*\*/g, (_, strong) => stash(`<strong>${escapeHtml(strong)}</strong>`))
    .replace(/__([^_]+?)__/g, (_, strong) => stash(`<strong>${escapeHtml(strong)}</strong>`))
    .replace(/\*([^*]+?)\*/g, "$1")
    .replace(/_([^_]+?)_/g, "$1");

  let html = escapeHtml(raw);
  placeholders.forEach(([token, replacement]) => {
    html = html.replace(token, replacement);
  });
  return html;
}

function renderAiLoading() {
  els.aiOutput.innerHTML = `
    <div class="ai-loading" aria-live="polite">
      <div class="ai-loading-dots" aria-hidden="true"><span></span><span></span><span></span></div>
      <div>
        <strong>正在连接 AI 并整理排盘重点</strong>
        <p>会依次处理用神世应、旬空月破日冲、六合六冲、动爻变爻与伏神。</p>
      </div>
    </div>
  `;
}

function renderAiOutput(text, options = {}) {
  const { streaming = false } = options;
  const normalized = String(text || "").replace(/\r\n/g, "\n").trim();
  if (!normalized) {
    els.aiOutput.innerHTML = "";
    return;
  }

  const headingPattern = /^(总论|用神与世应|旬空月破日冲|六合六冲|动爻变爻|动爻与变卦|伏神|建议|需谨慎处|谨慎处|结论|分析|提醒|补充)(?:[:：\s]*)?(.*)$/;
  const sections = [];
  let current = null;

  normalized.split("\n").forEach((rawLine) => {
    const line = cleanMarkdownLine(rawLine);
    if (!line) return;

    const heading = line.match(headingPattern);
    if (heading) {
      const title = normalizeAiHeading(heading[1]);
      current = { title, id: aiHeadingId(title, sections.length), lines: [] };
      sections.push(current);
      if (heading[2]) current.lines.push(heading[2]);
      return;
    }

    if (!current) {
      current = { title: "AI 解读", id: aiHeadingId("AI 解读", sections.length), lines: [] };
      sections.push(current);
    }
    current.lines.push(line);
  });

  const toc = sections.length > 1 ? `
    <nav class="ai-toc" aria-label="AI 解读目录">
      ${sections.map((section) => `<a href="#${section.id}">${escapeHtml(section.title)}</a>`).join("")}
    </nav>
  ` : "";

  els.aiOutput.innerHTML = toc + sections
    .map((section, index) => `
      <article class="ai-section ${index === 0 ? "is-primary" : ""}" id="${section.id}">
        <div class="ai-section-kicker">${String(index + 1).padStart(2, "0")}</div>
        <h3>${escapeHtml(section.title)}</h3>
        ${renderAiSectionLines(section.lines)}
      </article>
    `)
    .join("") + (streaming ? `<div class="ai-stream-cursor" aria-hidden="true"></div>` : "");
}

function normalizeAiHeading(value) {
  if (value === "谨慎处") return "需谨慎处";
  if (value === "动爻与变卦") return "动爻变爻";
  return value;
}

function aiHeadingId(title, index) {
  return `ai-${index + 1}-${title.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]+/g, "-")}`;
}

function cleanMarkdownLine(value) {
  return String(value)
    .trim()
    .replace(/^#{1,6}\s*/, "")
    .replace(/^>\s*/, "")
    .replace(/^(?:\d+|[一二三四五六七八九十]+)[.、]\s*(?=(总论|用神与世应|旬空月破日冲|六合六冲|动爻变爻|动爻与变卦|伏神|建议|需谨慎处|谨慎处|结论|分析|提醒|补充))/u, "")
    .replace(/^\*\*(.+?)\*\*([：:].*)?$/, (_, title, rest = "") => `${title}${rest}`)
    .replace(/^__(.+?)__([：:].*)?$/, (_, title, rest = "") => `${title}${rest}`)
    .replace(/^\*\*(.+?)\*\*$/, "$1")
    .replace(/^__(.+?)__$/, "$1")
    .replace(/\s+$/g, "");
}

function renderAiSectionLines(lines) {
  const parts = [];
  let listItems = [];

  const flushList = () => {
    if (!listItems.length) return;
    parts.push(`<ul>${listItems.map((item) => `<li>${inlineFormat(item)}</li>`).join("")}</ul>`);
    listItems = [];
  };

  lines.forEach((line) => {
    const listMatch = line.match(/^[-*•]\s*(.+)$/) || line.match(/^\d+[.、)]\s*(.+)$/);
    if (listMatch) {
      listItems.push(listMatch[1]);
      return;
    }

    flushList();
    const colonMatch = line.match(/^\*\*?([^：:*]{2,12})\*\*?[：:]\s*(.+)$/) || line.match(/^([^：:]{2,12})[：:]\s*(.+)$/);
    if (colonMatch) {
      parts.push(`<p><strong>${escapeHtml(colonMatch[1])}</strong><span>${inlineFormat(colonMatch[2])}</span></p>`);
      return;
    }
    parts.push(`<p>${inlineFormat(line)}</p>`);
  });

  flushList();
  return parts.join("");
}

function buildAiPrompt({ base, changed, details, changedDetails, info, diagnostics }) {
  const userName = els.userName.value.trim() || "未填写";
  const gender = els.gender.options[els.gender.selectedIndex].textContent || "未填写";
  const question = els.question.value.trim() || "未填写";
  const moving = details.filter((item) => item.moving).map((item) => item.position).join("、") || "无";
  const rows = details
    .map((item, index) => {
      const changedItem = changedDetails[index];
      const flyText = item.hidden?.fly ? `，飞神${item.hidden.fly.relative}${item.hidden.fly.branch}${item.hidden.fly.element}` : "";
      const hiddenText = item.hidden ? `，伏藏${item.hidden.relative}${item.hidden.branch}${item.hidden.element}${flyText}` : "";
      const noteText = item.notes?.length ? `，提示：${item.notes.map((note) => `${note.label}${note.text ? `(${note.text})` : ""}`).join("、")}` : "";
      return `${item.position}：${item.god}，${item.relative}${item.branch}${item.element}${hiddenText}，${item.tags.join("") || "无世应"}，${item.moving ? `${item.value}${lineName(item.value)}动，化${changedItem.relative}${changedItem.branch}${changedItem.element}` : `${item.value}${lineName(item.value)}静`}${noteText}`;
    })
    .reverse()
    .join("\n");
  const structuredRows = details.slice().reverse().map((item) => ({
    position: item.position,
    god: item.god,
    base: `${item.relative}${item.branch}${item.element}`,
    tags: item.tags,
    moving: item.moving,
    hidden: item.hidden ? `伏${item.hidden.relative}${item.hidden.branch}${item.hidden.element}${item.hidden.fly ? `，飞${item.hidden.fly.relative}${item.hidden.fly.branch}${item.hidden.fly.element}` : ""}` : "",
    changed: item.moving ? `${changedDetails[details.indexOf(item)]?.relative || ""}${changedDetails[details.indexOf(item)]?.branch || ""}${changedDetails[details.indexOf(item)]?.element || ""}` : "",
    notes: (item.notes || []).map((note) => `${note.label}：${note.text}`),
  }));
  const diagnosticText = Object.values(diagnostics || {})
    .map((item) => `${item.title}：${item.value}；${item.detail}`)
    .join("\n");

  return `你是一名熟悉传统六爻纳甲体系的解卦助手。请基于下列排盘做分析，语言务实，不要玄虚夸大，不要给绝对结论。

输出格式必须严格使用以下标题，每个标题独占一行：
总论
用神与世应
旬空月破日冲
六合六冲
动爻变爻
伏神
建议
需谨慎处

判读要求：
1. 优先解释用神、世应、动爻、伏神、变爻，再看旬空、月破、日冲、六合六冲。
2. 每节用 2-4 条短句，不要输出原始 JSON，不要使用代码块。
3. 对“旬空、月破、日冲、六合、六冲”只按排盘提示解释作用，不要自行重算。
4. 对动爻说明本爻、化爻及回生/回克/本爻生克变爻。
5. 对伏神说明伏神是什么、伏在哪一爻、飞神是什么，以及它对所问事项的影响。

姓名：${userName}
性别：${gender}
所问事项：${question}
事项类型：${els.topic.options[els.topic.selectedIndex].textContent}
公历：${info.dateText}
四柱：${info.year}年 ${info.month}月 ${info.day}日 ${info.hour}时
月建：${info.monthBuild}
日空：${info.voids}
本卦：${base.name}（${base.upper.name}上${base.lower.name}下）
变卦：${changed.name}（${changed.upper.name}上${changed.lower.name}下）
动爻：${moving}
用神参考：${topicSpirit[els.topic.value].spirit}

重点提示：
${diagnosticText || "无特殊提示"}

六爻装表（自上而下）：
${rows}

结构化排盘：
${JSON.stringify(structuredRows, null, 2)}`;
}

function extractResponseText(data) {
  if (data.output_text) return data.output_text;
  if (data.choices?.[0]?.message?.content) return data.choices[0].message.content;
  return data.output
    ?.flatMap((item) => item.content || [])
    .map((part) => part.text || "")
    .filter(Boolean)
    .join("\n");
}

function throwOnce() {
  if (els.method.value !== "coins") {
    els.method.value = "coins";
    els.coinCaster.hidden = false;
    els.coinBtn.hidden = false;
    els.lineEditor.hidden = true;
  }

  if (currentLines.length >= 6) {
    renderProgress();
    els.aiStatus.textContent = "六爻已成。如需重新摇卦，请先点击重置。";
    return;
  }

  const toss = tossCoins();
  const label = lineLabels[nextTossIndex];
  currentLines[nextTossIndex] = toss.value;
  tossLog.push(`${label}：${toss.text}，得 ${toss.value}（${lineName(toss.value)}）`);
  nextTossIndex += 1;
  renderCoins(toss);
  syncEditor();
  updateCoinLog();
  renderProgress();
  cast({ autoAnalyze: currentLines.length >= 6 });
}

els.coinBtn.addEventListener("click", throwOnce);
els.coins.forEach((coin) => coin.addEventListener("click", throwOnce));
els.resetBtn.addEventListener("click", reset);
els.method.addEventListener("change", () => {
  if (els.method.value === "manual") {
    els.lineEditor.hidden = false;
    els.coinCaster.hidden = true;
    els.coinBtn.hidden = true;
    currentLines = [...els.lineEditor.querySelectorAll("select")].map((select) => Number(select.value));
    cast();
  } else {
    els.lineEditor.hidden = true;
    els.coinCaster.hidden = false;
    els.coinBtn.hidden = false;
    currentLines = [];
    tossLog = [];
    nextTossIndex = 0;
    renderCoins();
    updateCoinLog();
    cast();
  }
});

initLineEditor();
els.lineEditor.hidden = true;
els.coinCaster.hidden = false;
els.coinBtn.hidden = false;
renderCoins();
renderProgress();
cast();
