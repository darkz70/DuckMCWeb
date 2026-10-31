// DuckMC — новости Minecraft (загружаются из data/news.json)
// Новости сортируются по дате (новые первыми)

const CATEGORY_LABELS = {
  java: "Java",
  snapshot: "Снимок",
  bedrock: "Бедрок",
};

const CATEGORY_CLASSES = {
  java: "java",
  snapshot: "snapshot",
  bedrock: "bedrock",
};

// Сортировка по дате: новые записи сначала
function sortNewsByDate(news) {
  return [...news].sort((a, b) => new Date(b.date) - new Date(a.date));
}

async function loadNews() {
  try {
    const res = await fetch("data/news.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("Не удалось загрузить новости");
    const news = await res.json();
    const sorted = sortNewsByDate(news);
    renderNews(sorted);
    renderHomeNews(sorted);
  } catch (err) {
    console.error(err);
    const grid = document.getElementById("newsGrid");
    if (grid) {
      grid.innerHTML =
        '<p style="color:#94a3b8; grid-column: 1 / -1;">Не удалось загрузить новости. Попробуйте позже.</p>';
    }
  }
}

function renderNews(news) {
  const grid = document.getElementById("newsGrid");
  if (!grid) return;

  const btns = document.querySelectorAll(".filter-btn");

  function render(filter) {
    grid.innerHTML = "";
    const filtered =
      filter === "all"
        ? news
        : news.filter((item) => item.category === filter);

    if (filtered.length === 0) {
      grid.innerHTML =
        '<p style="color:#94a3b8; grid-column: 1 / -1;">Новостей не найдено.</p>';
      return;
    }

    filtered.forEach((item) => {
      const card = document.createElement("article");
      card.className = "news-card";
      card.innerHTML = `
        <div class="news-meta">
          <time>${item.date}</time>
          <span class="news-badge ${CATEGORY_CLASSES[item.category] || ""}">${CATEGORY_LABELS[item.category] || item.category}</span>
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.excerpt)}</p>
        <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener" class="read-more">Читать на minecraft.net →</a>
      `;
      grid.appendChild(card);
    });
  }

  render("all");

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      render(btn.dataset.filter);
    });
  });
}

function renderHomeNews(news) {
  const grid = document.getElementById("homeNews");
  if (!grid) return;

  const latest = news.slice(0, 3);
  grid.innerHTML = "";
  latest.forEach((item) => {
    const card = document.createElement("article");
    card.className = "news-card";
    card.innerHTML = `
      <div class="news-meta">
        <time>${item.date}</time>
        <span class="news-badge ${CATEGORY_CLASSES[item.category] || ""}">${CATEGORY_LABELS[item.category] || item.category}</span>
      </div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.excerpt)}</p>
      <a href="news.html" class="read-more">Читать →</a>
    `;
    grid.appendChild(card);
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

if (document.getElementById("newsGrid") || document.getElementById("homeNews")) {
  loadNews();
}
