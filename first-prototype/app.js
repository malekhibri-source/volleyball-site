(function () {
  const STORAGE_KEY = "volleyball-sessions";

  const form = document.getElementById("session-form");
  const servePercentEl = document.getElementById("serve-percent-value");
  const acePercentEl = document.getElementById("ace-percent-value");
  const spikePercentEl = document.getElementById("spike-percent-value");
  const passPercentEl = document.getElementById("pass-percent-value");
  const totalsEl = document.getElementById("totals-value");
  const historyListEl = document.getElementById("session-history-list");
  const chartCanvas = document.getElementById("performance-chart");

  const serveTypeA = document.getElementById("serve-type-a");
  const serveTypeB = document.getElementById("serve-type-b");
  const attemptsA = document.querySelectorAll("#serve-a .attempt-btn");
  const attemptsB = document.querySelectorAll("#serve-b .attempt-btn");
  const scoreAEl = document.getElementById("score-a");
  const scoreBEl = document.getElementById("score-b");
  const compareResult = document.getElementById("compare-result");

  let sessions = loadSessions();

  clearOldData();
  render();

  function clearOldData() {
    window.localStorage.removeItem(STORAGE_KEY);
  }

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
      acesCount: Number(formData.get("acesCount") || 0),
      passesReceived: Number(formData.get("passesReceived") || 0),
      passesWell: Number(formData.get("passesWell") || 0),
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

    if (session.passesWell > session.passesReceived) {
      window.alert("Passes well cannot be greater than passes received.");
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
        acc.acesCount += current.acesCount;
        acc.passesReceived += current.passesReceived;
        acc.passesWell += current.passesWell;
        return acc;
      },
      { serveAttempts: 0, serveMade: 0, spikeAttempts: 0, spikeMade: 0, acesCount: 0, passesReceived: 0, passesWell: 0 }
    );

    servePercentEl.textContent = formatPercent(totals.serveMade, totals.serveAttempts);
    acePercentEl.textContent = formatPercent(totals.acesCount, totals.serveAttempts);
    spikePercentEl.textContent = formatPercent(totals.spikeMade, totals.spikeAttempts);
    passPercentEl.textContent = formatPercent(totals.passesWell, totals.passesReceived);
    totalsEl.textContent = sessions.length + " sessions";

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
        const ace = formatPercent(session.acesCount, session.serveAttempts);
        const spike = formatPercent(session.spikeMade, session.spikeAttempts);
        const pass = formatPercent(session.passesWell, session.passesReceived);

        item.innerHTML = `
          <span><strong>${session.date}</strong></span>
          <span style="color: var(--text-muted); font-size: 0.85rem;">
            Serve: ${session.serveMade}/${session.serveAttempts} (${serve}) | 
            Ace: ${session.acesCount} (${ace}) | 
            Spike: ${session.spikeMade}/${session.spikeAttempts} (${spike}) | 
            Pass: ${session.passesWell}/${session.passesReceived} (${pass})
          </span>
        `;
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
      ctx.fillStyle = "#9CA3AF";
      ctx.font = "14px Segoe UI";
      ctx.fillText("Add sessions to see chart data.", 12, 24);
      return;
    }

    const padding = { top: 18, right: 16, bottom: 26, left: 36 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 1;
    ctx.strokeRect(padding.left, padding.top, chartW, chartH);

    drawGridLines(ctx, padding, chartW, chartH);

    const serveSeries = sessions.map(function (session) {
      return toPercent(session.serveMade, session.serveAttempts);
    });
    const spikeSeries = sessions.map(function (session) {
      return toPercent(session.spikeMade, session.spikeAttempts);
    });
    const passSeries = sessions.map(function (session) {
      return toPercent(session.passesWell, session.passesReceived);
    });

    drawSeries(ctx, serveSeries, padding, chartW, chartH, "#1E90FF");
    drawSeries(ctx, spikeSeries, padding, chartW, chartH, "#10B981");
    drawSeries(ctx, passSeries, padding, chartW, chartH, "#00E5FF");

    ctx.fillStyle = "#1E90FF";
    ctx.fillRect(width - 180, 12, 10, 10);
    ctx.fillStyle = "#EAEAEA";
    ctx.font = "12px Segoe UI";
    ctx.fillText("Serve %", width - 165, 21);

    ctx.fillStyle = "#10B981";
    ctx.fillRect(width - 110, 12, 10, 10);
    ctx.fillStyle = "#EAEAEA";
    ctx.fillText("Spike %", width - 95, 21);

    ctx.fillStyle = "#00E5FF";
    ctx.fillRect(width - 40, 12, 10, 10);
    ctx.fillStyle = "#EAEAEA";
    ctx.fillText("Pass %", width - 25, 21);
  }

  function drawGridLines(ctx, padding, chartW, chartH) {
    const marks = [0, 25, 50, 75, 100];

    ctx.strokeStyle = "#374151";
    ctx.fillStyle = "#9CA3AF";
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

  const serveAData = Array(10).fill(0);
  const serveBData = Array(10).fill(0);

  function updateAttempt(btn, dataArray, displayEl) {
    const index = parseInt(btn.dataset.index, 10);
    const states = [
      { score: 0, label: "-", cls: "" },
      { score: 0, label: "IN", cls: "in" },
      { score: -1, label: "OUT", cls: "out" },
      { score: 1, label: "ACE", cls: "ace" }
    ];
    
    dataArray[index] = (dataArray[index] + 1) % 4;
    const state = states[dataArray[index]];
    btn.textContent = state.label;
    btn.className = "attempt-btn " + state.cls;
    
    const score = dataArray.reduce(function (a, b) { 
      const s = states[a] || { score: 0 };
      return s.score + (states[b] ? 0 : 0);
    }, 0);
    
    const totalScore = dataArray.reduce(function (acc, val) {
      return acc + states[val].score;
    }, 0);
    
    displayEl.querySelector(".score").textContent = totalScore;
    
    if (totalScore > 0) {
      displayEl.className = "serve-score-display positive";
    } else if (totalScore < 0) {
      displayEl.className = "serve-score-display negative";
    } else {
      displayEl.className = "serve-score-display neutral";
    }
    
    updateCompareResult();
  }

  attemptsA.forEach(function (btn) {
    btn.addEventListener("click", function () {
      updateAttempt(btn, serveAData, scoreAEl);
    });
  });

  attemptsB.forEach(function (btn) {
    btn.addEventListener("click", function () {
      updateAttempt(btn, serveBData, scoreBEl);
    });
  });

  function updateCompareResult() {
    const typeA = serveTypeA.value;
    const typeB = serveTypeB.value;
    
    if (!typeA || !typeB) {
      compareResult.style.display = "none";
      return;
    }
    
    const states = [
      { score: 0, label: "-", cls: "" },
      { score: 0, label: "IN", cls: "in" },
      { score: -1, label: "OUT", cls: "out" },
      { score: 1, label: "ACE", cls: "ace" }
    ];
    
    const scoreA = serveAData.reduce(function (acc, val) {
      return acc + states[val].score;
    }, 0);
    
    const scoreB = serveBData.reduce(function (acc, val) {
      return acc + states[val].score;
    }, 0);
    
    compareResult.style.display = "block";
    
    if (scoreA > scoreB) {
      document.getElementById("winner-text").textContent = "🏆 Recommended: " + formatServeType(typeA);
      document.getElementById("score-diff").textContent = "Score: " + scoreA + " vs " + scoreB;
    } else if (scoreB > scoreA) {
      document.getElementById("winner-text").textContent = "🏆 Recommended: " + formatServeType(typeB);
      document.getElementById("score-diff").textContent = "Score: " + scoreA + " vs " + scoreB;
    } else {
      document.getElementById("winner-text").textContent = "🤝 It's a tie! Both serves scored " + scoreA;
      document.getElementById("score-diff").textContent = "";
    }
  }

  function formatServeType(type) {
    const types = {
      "underhand": "Underhand",
      "overhand": "Overhand",
      "float": "Float",
      "jump-float": "Jump Float",
      "jump-topspin": "Jump Topspin"
    };
    return types[type] || type;
  }

  serveTypeA.addEventListener("change", updateCompareResult);
  serveTypeB.addEventListener("change", updateCompareResult);

  const serveVideos = {
    "underhand": "https://www.youtube.com/watch?v=xBNNxQiR2VI",
    "overhand": "https://www.youtube.com/watch?v=bXEDuPePTCs",
    "float": "https://www.youtube.com/watch?v=eg0Yx8VI-ek&t=431s",
    "jump-float": "https://www.youtube.com/watch?v=TX8a7nWlbiw",
    "jump-topspin": "https://www.youtube.com/watch?v=fGSgD2k-NEU&t=137s"
  };

  function updateServeVideoLink(dropdown, containerId) {
    const container = document.getElementById(containerId);
    const videoBtn = container.querySelector(".serve-video-btn");
    if (!videoBtn) return;
    const serveType = dropdown.value;
    if (serveType && serveVideos[serveType]) {
      videoBtn.href = serveVideos[serveType];
      videoBtn.style.display = "inline-flex";
    } else {
      videoBtn.style.display = "none";
    }
  }

  serveTypeA.addEventListener("change", function () {
    updateServeVideoLink(serveTypeA, "serve-a");
    updateCompareResult();
  });

  serveTypeB.addEventListener("change", function () {
    updateServeVideoLink(serveTypeB, "serve-b");
    updateCompareResult();
  });

  window.addEventListener("resize", drawChart);
})();