const form = document.querySelector("#loginForm");
const passwordInput = document.querySelector("#passwordInput");
const loginStatus = document.querySelector("#loginStatus");

checkSession();

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginStatus.textContent = "正在登录...";

  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: passwordInput.value }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "登录失败。");
    }

    location.href = "/admin.html";
  } catch (error) {
    loginStatus.textContent = error.message;
  }
});

async function checkSession() {
  try {
    const response = await fetch("/api/admin/session");
    const data = await response.json();
    if (data.authenticated) {
      location.href = "/admin.html";
      return;
    }

    if (!data.configured) {
      loginStatus.textContent = "请先在环境变量中配置 ADMIN_PASSWORD。";
    }
  } catch {
    loginStatus.textContent = "无法检查后台登录状态。";
  }
}
