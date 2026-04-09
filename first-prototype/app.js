(function () {
  const STORAGE_KEY = "volleyball-sessions";

  const form = document.getElementById("session-form");
  const servePercentEl = document.getElementById("serve-percent-value");
  const spikePercentEl = document.getElementById("spike-percent-value");
  const totalsEl = document.getElementById("totals-value");
  const historyListEl = document.getElementById("session-history-list");
  const chartCanvas = document.getElementById("performance-chart");

  let sessions = loadSessions();

  render();

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const session = {
      id: Date.now(),
      date: String(formData.get("date") || ""),
      serveAttempts: Number(formData.get("serveAttempts") || 0),
      serveMade: Number(formData.get("serveMade") || 0),
      spikeAttempts: Number(formData.get("spikeAttempts") || 0),
      spikeMade: Number(formData.get("spikeMade") || 0),
      serveType: String(formData.get("serveType") || ""),
      wasAce: formData.get("wasAce") === "on",
      setsGiven: Number(formData.get("setsGiven") || 0),
      setsTipped: Number(formData.get("setsTipped") || 0),
      setsHit: Number(formData.get("setsHit") || 0),
      pointsWon: Number(formData.get("pointsWon") || 0),
    };

    if (!session.date) {
      return;
    }

    if (session.serveMade > session.serveAttempts || session.spikeMade > session.spikeAttempts) {
      window.alert("Made values cannot be greater than attempts.");
      return;
    }

    sessions.push(session);
    sessions.sort(function (a, b) {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    persistSessions();
    render();
    form.reset();
  });

  function loadSessions() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function persistSessions() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }

  function render() {
    const totals = sessions.reduce(
      function (acc, current) {
        acc.serveAttempts += current.serveAttempts;
        acc.serveMade += current.serveMade;
        acc.spikeAttempts += current.spikeAttempts;
        acc.spikeMade += current.spikeMade;
        return acc;
      },
      { serveAttempts: 0, serveMade: 0, spikeAttempts: 0, spikeMade: 0 }
    );

    servePercentEl.textContent = formatPercent(totals.serveMade, totals.serveAttempts);
    spikePercentEl.textContent = formatPercent(totals.spikeMade, totals.spikeAttempts);
    totalsEl.textContent = [
      sessions.length + " sessions",
      "Serve " + totals.serveMade + "/" + totals.serveAttempts,
      "Spike " + totals.spikeMade + "/" + totals.spikeAttempts,
    ].join(" | ");

    renderHistory();
    drawChart();
  }

  function renderHistory() {
    historyListEl.innerHTML = "";

    if (sessions.length === 0) {
      const emptyItem = document.createElement("li");
      emptyItem.className = "history-empty";
      emptyItem.textContent = "No sessions recorded yet.";
      historyListEl.appendChild(emptyItem);
      return;
    }

    sessions
      .slice()
      .reverse()
      .forEach(function (session) {
        const item = document.createElement("li");
        const serve = formatPercent(session.serveMade, session.serveAttempts);
        const spike = formatPercent(session.spikeMade, session.spikeAttempts);

        item.textContent =
          session.date +
          " - Serve " +
          session.serveMade +
          "/" +
          session.serveAttempts +
          " (" +
          serve +
          "), Spike " +
          session.spikeMade +
          "/" +
          session.spikeAttempts +
          " (" +
          spike +
          ")";
        historyListEl.appendChild(item);
      });
  }

  function drawChart() {
    if (!chartCanvas) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const width = chartCanvas.clientWidth || 600;
    const height = 280;

    chartCanvas.width = Math.floor(width * dpr);
    chartCanvas.height = Math.floor(height * dpr);

    const ctx = chartCanvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    if (sessions.length === 0) {
      ctx.fillStyle = "#6b7280";
      ctx.font = "14px Segoe UI";
      ctx.fillText("Add sessions to see chart data.", 12, 24);
      return;
    }

    const padding = { top: 18, right: 16, bottom: 26, left: 36 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.strokeRect(padding.left, padding.top, chartW, chartH);

    drawGridLines(ctx, padding, chartW, chartH);

    const serveSeries = sessions.map(function (session) {
      return toPercent(session.serveMade, session.serveAttempts);
    });
    const spikeSeries = sessions.map(function (session) {
      return toPercent(session.spikeMade, session.spikeAttempts);
    });

    drawSeries(ctx, serveSeries, padding, chartW, chartH, "#2563eb");
    drawSeries(ctx, spikeSeries, padding, chartW, chartH, "#dc2626");

    ctx.fillStyle = "#2563eb";
    ctx.fillRect(width - 160, 12, 10, 10);
    ctx.fillStyle = "#111827";
    ctx.font = "12px Segoe UI";
    ctx.fillText("Serve %", width - 145, 21);

    ctx.fillStyle = "#dc2626";
    ctx.fillRect(width - 90, 12, 10, 10);
    ctx.fillStyle = "#111827";
    ctx.fillText("Spike %", width - 75, 21);
  }

  function drawGridLines(ctx, padding, chartW, chartH) {
    const marks = [0, 25, 50, 75, 100];

    ctx.strokeStyle = "#eef2f7";
    ctx.fillStyle = "#6b7280";
    ctx.font = "11px Segoe UI";

    marks.forEach(function (mark) {
      const y = padding.top + chartH - (mark / 100) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartW, y);
      ctx.stroke();
      ctx.fillText(String(mark), 8, y + 4);
    });
  }

  function drawSeries(ctx, values, padding, chartW, chartH, color) {
    const count = values.length;
    const stepX = count > 1 ? chartW / (count - 1) : 0;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    values.forEach(function (value, index) {
      const x = padding.left + index * stepX;
      const y = padding.top + chartH - (value / 100) * chartH;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    values.forEach(function (value, index) {
      const x = padding.left + index * stepX;
      const y = padding.top + chartH - (value / 100) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function toPercent(made, attempts) {
    if (attempts <= 0) {
      return 0;
    }
    return (made / attempts) * 100;
  }

  function formatPercent(made, attempts) {
    const value = toPercent(made, attempts);
    return value.toFixed(1) + "%";
  }

  window.addEventListener("resize", drawChart);
})();
