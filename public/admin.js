const els = {
  totalCount: document.querySelector("#totalCount"),
  successCount: document.querySelector("#successCount"),
  errorCount: document.querySelector("#errorCount"),
  searchInput: document.querySelector("#searchInput"),
  refreshBtn: document.querySelector("#refreshBtn"),
  logoutBtn: document.querySelector("#logoutBtn"),
  recordList: document.querySelector("#recordList"),
  recordDetail: document.querySelector("#recordDetail"),
};

let records = [];
let selectedId = null;

init();

function init() {
  els.refreshBtn.addEventListener("click", loadRecords);
  els.logoutBtn.addEventListener("click", logout);
  els.searchInput.addEventListener("input", renderList);
  checkSession().then((authenticated) => {
    if (authenticated) loadRecords();
  });
}

async function checkSession() {
  const response = await fetch("/api/admin/session");
  const data = await response.json();
  if (!data.authenticated) {
    location.href = "/admin-login.html";
    return false;
  }
  return true;
}

async function logout() {
  await fetch("/api/admin/logout", { method: "POST" });
  location.href = "/admin-login.html";
}

async function loadRecords() {
  els.recordList.innerHTML = `<div class="loading">正在读取记录...</div>`;
  try {
    const response = await fetch("/api/records");
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        location.href = "/admin-login.html";
        return;
      }
      throw new Error(data.error || "读取记录失败。");
    }

    records = data.records || [];
    renderStats();
    renderList();
  } catch (error) {
    els.recordList.innerHTML = `<div class="error">${escapeHtml(error.message)}</div>`;
  }
}

function renderStats() {
  els.totalCount.textContent = records.length;
  els.successCount.textContent = records.filter((record) => record.status === "success").length;
  els.errorCount.textContent = records.filter((record) => record.status === "error").length;
}

function renderList() {
  const keyword = els.searchInput.value.trim().toLowerCase();
  const filtered = records.filter((record) => {
    const text = [
      record.userName,
      record.gender,
      record.question,
      record.topic,
      record.baseName,
      record.changedName,
      record.movingLines,
      record.createdAt,
    ].join(" ").toLowerCase();
    return !keyword || text.includes(keyword);
  });

  if (!filtered.length) {
    els.recordList.innerHTML = `<div class="empty-inline">没有匹配记录。</div>`;
    return;
  }

  els.recordList.innerHTML = filtered.map((record) => `
    <button class="record-item ${record.id === selectedId ? "is-active" : ""}" type="button" data-id="${record.id}">
      <span class="record-time">${escapeHtml(record.createdAt || "")}</span>
      <strong>${escapeHtml(record.question || "未填写事项")}</strong>
      <span>${escapeHtml(record.baseName || "-")} → ${escapeHtml(record.changedName || "-")}</span>
      <span class="record-meta">
        <em class="${record.status === "error" ? "is-error" : "is-success"}">${record.status === "error" ? "失败" : "成功"}</em>
        ${escapeHtml(record.userName || "匿名")} · ${escapeHtml(record.topic || "-")}
      </span>
    </button>
  `).join("");

  els.recordList.querySelectorAll(".record-item").forEach((item) => {
    item.addEventListener("click", () => loadRecord(Number(item.dataset.id)));
  });
}

async function loadRecord(id) {
  selectedId = id;
  renderList();
  els.recordDetail.innerHTML = `<div class="loading">正在读取详情...</div>`;

  try {
    const response = await fetch(`/api/records/${id}`);
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        location.href = "/admin-login.html";
        return;
      }
      throw new Error(data.error || "读取详情失败。");
    }

    renderDetail(data.record);
  } catch (error) {
    els.recordDetail.innerHTML = `<div class="error">${escapeHtml(error.message)}</div>`;
  }
}

function renderDetail(record) {
  const details = Array.isArray(record.castData?.details) ? record.castData.details : [];
  const changedDetails = Array.isArray(record.castData?.changedDetails) ? record.castData.changedDetails : [];

  els.recordDetail.innerHTML = `
    <article class="detail-head">
      <div>
        <p class="eyebrow">#${record.id} · ${escapeHtml(record.createdAt || "")}</p>
        <h2>${escapeHtml(record.question || "未填写事项")}</h2>
      </div>
      <span class="status ${record.status === "error" ? "is-error" : "is-success"}">${record.status === "error" ? "失败" : "成功"}</span>
    </article>

    <section class="detail-grid">
      ${detailItem("姓名", record.userName || "匿名")}
      ${detailItem("性别", record.gender || "-")}
      ${detailItem("类型", record.topic || "-")}
      ${detailItem("模型", record.model || "-")}
      ${detailItem("本卦", record.baseName || "-")}
      ${detailItem("变卦", record.changedName || "-")}
      ${detailItem("动爻", record.movingLines || "无")}
      ${detailItem("六爻", Array.isArray(record.lines) ? record.lines.join(" / ") : "-")}
    </section>

    ${record.error ? `<section class="detail-section is-error-block"><h3>错误信息</h3><p>${escapeHtml(record.error)}</p></section>` : ""}

    <section class="detail-section">
      <h3>AI 解读</h3>
      <div class="ai-text">${escapeHtml(record.aiText || "无 AI 内容。")}</div>
    </section>

    <section class="detail-section">
      <h3>六爻装表</h3>
      <div class="yao-admin-table">
        ${renderYaoRows(details, changedDetails)}
      </div>
    </section>

    <details class="detail-section">
      <summary>提示词</summary>
      <pre>${escapeHtml(record.prompt || "")}</pre>
    </details>

    <details class="detail-section">
      <summary>完整 JSON</summary>
      <pre>${escapeHtml(JSON.stringify(record.castData || {}, null, 2))}</pre>
    </details>
  `;
}

function detailItem(label, value) {
  return `
    <div class="detail-item">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function renderYaoRows(details, changedDetails) {
  if (!details.length) {
    return `<div class="empty-inline">无排盘明细。</div>`;
  }

  return details.slice().reverse().map((item) => {
    const index = details.indexOf(item);
    const changed = changedDetails[index] || {};
    return `
      <div class="yao-admin-row">
        <strong>${escapeHtml(item.position || "-")}</strong>
        <span>${escapeHtml(item.god || "-")}</span>
        <span>${escapeHtml(`${item.relative || ""}${item.branch || ""}${item.element || ""}`)}</span>
        <span>${escapeHtml((item.tags || []).join(" / ") || "-")}</span>
        <span>${item.moving ? "动" : "静"}</span>
        <span>${escapeHtml(changed.relative ? `化${changed.relative}${changed.branch}${changed.element}` : "-")}</span>
      </div>
    `;
  }).join("");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
