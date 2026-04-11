(function () {
  const SESSIONS_KEY = "volleyball-sessions";
  const TRAINING_LOG_KEY = "volleyball-training-log";

  let sessions = loadSessions();
  let trainingLogs = loadTrainingLogs();
  let currentDrills = [];
  let chart = null;

  const serveAData = Array(10).fill(0);
  const serveBData = Array(10).fill(0);

  const drillsDB = [
    { name: "Wall Passing", skill: "passing", difficulty: "beginner", tools: ["ball", "wall"] },
    { name: "Partner Passing", skill: "passing", difficulty: "beginner", tools: ["ball", "partner"] },
    { name: "Serve Receive Drills", skill: "passing", difficulty: "intermediate", tools: ["ball", "net", "partner"] },
    { name: "X-Ball Serving", skill: "serving", difficulty: "beginner", tools: ["ball", "net"] },
    { name: "Float Serve Practice", skill: "serving", difficulty: "beginner", tools: ["ball", "wall"] },
    { name: "Jump Serve Approach", skill: "serving", difficulty: "advanced", tools: ["ball", "net"] },
    { name: "Wall Setting", skill: "setting", difficulty: "beginner", tools: ["ball", "wall"] },
    { name: "Partner Setting", skill: "setting", difficulty: "beginner", tools: ["ball", "partner"] },
    { name: "Setting Gates", skill: "setting", difficulty: "intermediate", tools: ["ball", "net"] },
    { name: "Approach & Hit", skill: "spiking", difficulty: "beginner", tools: ["ball", "wall"] },
    { name: "Tooling Drills", skill: "spiking", difficulty: "intermediate", tools: ["ball", "net", "partner"] },
    { name: "1-on-1 Blocking", skill: "spiking", difficulty: "advanced", tools: ["ball", "net", "partner"] },
    { name: "Tip & Roll", skill: "spiking", difficulty: "intermediate", tools: ["ball", "net", "partner"] }
  ];

  const videosDB = [
    { title: "Wall Passing Drills", url: "https://www.youtube.com/shorts/6livtunhlOc", skill: "passing", creator: "Kristy Tekavec" },
    { title: "Passing Fundamentals", url: "https://www.youtube.com/watch?v=gOgfoEGUDCA", skill: "passing", creator: "Elevate Yourself" },
    { title: "Advanced Passing", url: "https://www.youtube.com/watch?v=Ymx-bj5WbK4", skill: "passing", creator: "Elevate Yourself" },
    { title: "Setting Drills", url: "https://www.youtube.com/shorts/6cTmSAgP5ho", skill: "setting", creator: "Elevate Yourself" },
    { title: "Setting Drills (Adv)", url: "https://www.youtube.com/watch?v=RfoAU5uMro8", skill: "setting", creator: "DavidSeybering95" },
    { title: "Setting Fundamentals", url: "https://www.youtube.com/watch?v=ZK4lqv5NxXA", skill: "setting", creator: "Natke Volleyball" },
    { title: "Spiking Drills", url: "https://www.youtube.com/shorts/NyR4cJ2pYa8", skill: "spiking", creator: "Kristy Tekavec" },
    { title: "Spiking (Partner)", url: "https://www.youtube.com/watch?v=ZK4lqv5NxXA", skill: "spiking", creator: "Wicked Volleyball" },
    { title: "Spike Approach", url: "https://www.youtube.com/watch?v=EpmR0edNOgo", skill: "spiking", creator: "Coach Chijo" },
    { title: "Spiking Footwork", url: "https://www.youtube.com/watch?v=B7vbjJ2wQQQ", skill: "spiking", creator: "Elevate Yourself" },
    { title: "Serve Drills", url: "https://www.youtube.com/shorts/xJfOgw1dMWM", skill: "serving", creator: "Coach Chijo" },
    { title: "Jump Serve Drills", url: "https://www.youtube.com/watch?v=rKoCO5tIPg8", skill: "serving", creator: "Elevate Yourself" },
    { title: "Float Serve", url: "https://www.youtube.com/watch?v=eg0Yx8VI-ek&t=431s", skill: "serving", creator: "Elevate Yourself" },
    { title: "Jump Float Serve", url: "https://www.youtube.com/watch?v=TX8a7nWlbiw", skill: "serving", creator: "Elevate Yourself" },
    { title: "Jump Topspin Serve", url: "https://www.youtube.com/watch?v=fGSgD2k-NEU&t=137s", skill: "serving", creator: "Elevate Yourself" }
  ];

  const serveVideos = {
    "float": "https://www.youtube.com/watch?v=eg0Yx8VI-ek&t=431s",
    "jump-float": "https://www.youtube.com/watch?v=TX8a7nWlbiw",
    "jump-topspin": "https://www.youtube.com/watch?v=fGSgD2k-NEU&t=137s",
    "underhand": "https://www.youtube.com/watch?v=xBNNxQiR2VI",
    "overhand": "https://www.youtube.com/watch?v=bXEDuPePTCs"
  };

  const focusTips = {
    serving: "Focus on contacting the ball at the highest point and following through toward your target",
    spiking: "Contact the ball in front of your body and snap your wrist at contact for more power",
    passing: "Keep your platform steady and angle your arms to pass to the setter's target",
    setting: "Use your legs, not just your arms. Get low and push through the ball"
  };

  const quickVideosDB = {
    serving: [
      { title: "Float Serve", url: "https://www.youtube.com/watch?v=eg0Yx8VI-ek&t=431s" },
      { title: "Jump Serve", url: "https://www.youtube.com/watch?v=TX8a7nWlbiw" },
      { title: "Jump Topspin", url: "https://www.youtube.com/watch?v=fGSgD2k-NEU&t=137s" }
    ],
    spiking: [
      { title: "Spiking Drills", url: "https://www.youtube.com/shorts/NyR4cJ2pYa8" },
      { title: "Spike Approach", url: "https://www.youtube.com/watch?v=EpmR0edNOgo" },
      { title: "Arm Swing", url: "https://www.youtube.com/watch?v=bWVWKnB04ho" }
    ],
    passing: [
      { title: "Wall Passing", url: "https://www.youtube.com/shorts/6livtunhlOc" },
      { title: "Passing Fundamentals", url: "https://www.youtube.com/watch?v=gOgfoEGUDCA" }
    ],
    setting: [
      { title: "Setting Drills", url: "https://www.youtube.com/shorts/6cTmSAgP5ho" },
      { title: "Setting Fundamentals", url: "https://www.youtube.com/watch?v=ZK4lqv5NxXA" }
    ]
  };

  init();

  function init() {
    loadPositionSettings();
    setDefaultDate();
    renderDashboard();
    renderDrillsBySkill();
    renderVideosBySkill();
    renderSessionHistory();
    renderTrainingHistory();
    setupEventListeners();
  }

  function loadPositionSettings() {
    try {
      const settings = JSON.parse(localStorage.getItem("volleyball-position") || "null");
      if (settings) {
        document.getElementById("pos-serving").checked = settings.serving !== false;
        document.getElementById("pos-spiking").checked = settings.spiking !== false;
        document.getElementById("pos-passing").checked = settings.passing !== false;
        document.getElementById("pos-setting").checked = settings.setting !== false;
      }
    } catch (e) {}
  }

  function savePositionSettings() {
    const settings = {
      serving: document.getElementById("pos-serving").checked,
      spiking: document.getElementById("pos-spiking").checked,
      passing: document.getElementById("pos-passing").checked,
      setting: document.getElementById("pos-setting").checked
    };
    localStorage.setItem("volleyball-position", JSON.stringify(settings));
  }

  function getActiveSkills() {
    return {
      serving: document.getElementById("pos-serving").checked,
      spiking: document.getElementById("pos-spiking").checked,
      passing: document.getElementById("pos-passing").checked,
      setting: document.getElementById("pos-setting").checked
    };
  }

  function setDefaultDate() {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("session-date").value = today;
    document.getElementById("training-date").value = today;
  }

  function loadSessions() {
    try {
      const raw = localStorage.getItem(SESSIONS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function loadTrainingLogs() {
    try {
      const raw = localStorage.getItem(TRAINING_LOG_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveSessions() {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }

  function saveTrainingLogs() {
    localStorage.setItem(TRAINING_LOG_KEY, JSON.stringify(trainingLogs));
  }

  function getStats() {
    if (sessions.length === 0) {
      return {
        servePercent: 0,
        serveErrorPercent: 0,
        acePercent: 0,
        aceCount: 0,
        spikePercent: 0,
        spikeErrorPercent: 0,
        passPercent: 0,
        totalSessions: 0
      };
    }

    let serveAttempts = 0, serveMade = 0, serveErrors = 0, acesCount = 0;
    let spikeAttempts = 0, spikeMade = 0, spikeErrors = 0;
    let passesReceived = 0, passesWell = 0;

    sessions.forEach(s => {
      serveAttempts += s.serveAttempts || 0;
      serveMade += s.serveMade || 0;
      serveErrors += s.serveErrors || 0;
      acesCount += s.acesCount || 0;
      spikeAttempts += s.spikeAttempts || 0;
      spikeMade += s.spikeMade || 0;
      spikeErrors += s.spikeErrors || 0;
      passesReceived += s.passesReceived || 0;
      passesWell += s.passesWell || 0;
    });

    return {
      servePercent: serveAttempts > 0 ? (serveMade / serveAttempts) * 100 : 0,
      serveErrorPercent: serveAttempts > 0 ? (serveErrors / serveAttempts) * 100 : 0,
      acePercent: serveAttempts > 0 ? (acesCount / serveAttempts) * 100 : 0,
      aceCount: acesCount,
      spikePercent: spikeAttempts > 0 ? (spikeMade / spikeAttempts) * 100 : 0,
      spikeErrorPercent: spikeAttempts > 0 ? (spikeErrors / spikeAttempts) * 100 : 0,
      passPercent: passesReceived > 0 ? (passesWell / passesReceived) * 100 : 0,
      totalSessions: sessions.length
    };
  }

  function detectWeakness(stats) {
    const activeSkills = getActiveSkills();
    const skills = [];
    
    if (activeSkills.serving && stats.servePercent > 0) skills.push({ name: "serving", rate: stats.servePercent });
    if (activeSkills.spiking && stats.spikePercent > 0) skills.push({ name: "spiking", rate: stats.spikePercent });
    if (activeSkills.passing && stats.passPercent > 0) skills.push({ name: "passing", rate: stats.passPercent });

    if (skills.length === 0) return null;
    
    skills.sort((a, b) => a.rate - b.rate);
    return skills[0];
  }

  function renderDashboard() {
    const stats = getStats();
    const weakness = detectWeakness(stats);

    document.getElementById("serve-percent-value").textContent = stats.servePercent.toFixed(1) + "%";
    document.getElementById("serve-errors").textContent = stats.serveErrorPercent.toFixed(1) + "% error";

    document.getElementById("ace-percent-value").textContent = stats.acePercent.toFixed(1) + "%";
    document.getElementById("ace-count").textContent = stats.aceCount + " aces";

    document.getElementById("spike-percent-value").textContent = stats.spikePercent.toFixed(1) + "%";
    document.getElementById("spike-errors").textContent = stats.spikeErrorPercent.toFixed(1) + "% error";

    document.getElementById("pass-percent-value").textContent = stats.passPercent.toFixed(1) + "%";

    document.getElementById("totals-value").textContent = sessions.length + " sessions";

    renderFocus(stats, weakness);
    renderWeaknessAlert(weakness);
    renderChart();
  }

  function renderFocus(stats, weakness) {
    const focusSkillEl = document.getElementById("focus-skill");
    const focusTipEl = document.getElementById("focus-tip");
    const quickVideosEl = document.getElementById("quick-videos-list");

    if (!weakness || sessions.length < 3) {
      focusSkillEl.textContent = sessions.length < 3 
        ? "Keep tracking (" + sessions.length + "/3 sessions)" 
        : "Add more variety to get focus";
      focusTipEl.textContent = sessions.length < 3
        ? "Log at least 3 sessions to unlock personalized focus"
        : "Log sessions for different skills to get a focus";
      quickVideosEl.innerHTML = "<p class='text-muted'>Add sessions to see quick videos</p>";
      return;
    }

    focusSkillEl.textContent = capitalizeFirst(weakness.name);
    focusTipEl.textContent = focusTips[weakness.name] || "Practice consistently to improve";

    const focusVideos = quickVideosDB[weakness.name] || [];
    quickVideosEl.innerHTML = focusVideos.map(v => 
      "<a href='" + v.url + "' target='_blank' class='quick-video-link'>▶ " + v.title + "</a>"
    ).join("");
  }

  function renderWeaknessAlert(weakness) {
    const alert = document.getElementById("weakness-alert");
    const msg = document.getElementById("weakness-message");

    if (!weakness || sessions.length < 3) {
      alert.style.display = "none";
      return;
    }

    alert.style.display = "flex";
    msg.textContent = "Your weakest skill: " + capitalizeFirst(weakness.name) + " (" + weakness.rate.toFixed(1) + "% success rate)";
  }

  function renderDrillsBySkill() {
    const skills = ["passing", "serving", "spiking", "setting"];
    
    skills.forEach(skill => {
      const container = document.getElementById("drills-" + skill);
      if (!container) return;
      
      const skillDrills = drillsDB.filter(d => d.skill === skill);
      container.innerHTML = skillDrills.map(drill => `
        <li>
          <span class="drill-name">${drill.name}</span>
          <span class="drill-meta">
            <span class="drill-difficulty ${drill.difficulty}">${drill.difficulty}</span>
            <span class="drill-tools">${drill.tools.join(", ")}</span>
          </span>
        </li>
      `).join("");
    });
  }

  function renderVideosBySkill() {
    const skills = ["passing", "serving", "spiking", "setting"];
    
    skills.forEach(skill => {
      const container = document.getElementById("videos-" + skill);
      if (!container) return;
      
      const skillVideos = videosDB.filter(v => v.skill === skill);
      container.innerHTML = skillVideos.map(video => `
        <li>
          <a href="${video.url}" target="_blank">
            <span class="play-icon">▶</span> ${video.title}
          </a>
        </li>
      `).join("");
    });
  }

  function renderChart() {
    const ctx = document.getElementById("trends-chart");
    if (!ctx) return;

    if (chart) chart.destroy();

    const recentSessions = sessions.slice(-10);
    if (recentSessions.length === 0) return;

    const labels = recentSessions.map(s => s.date.slice(5));
    const serveData = recentSessions.map(s => s.serveAttempts > 0 ? (s.serveMade / s.serveAttempts) * 100 : null);
    const spikeData = recentSessions.map(s => s.spikeAttempts > 0 ? (s.spikeMade / s.spikeAttempts) * 100 : null);
    const passData = recentSessions.map(s => s.passesReceived > 0 ? (s.passesWell / s.passesReceived) * 100 : null);

    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          { label: "Serve %", data: serveData, borderColor: "#1E90FF", backgroundColor: "#1E90FF", tension: 0.3 },
          { label: "Spike %", data: spikeData, borderColor: "#10B981", backgroundColor: "#10B981", tension: 0.3 },
          { label: "Pass %", data: passData, borderColor: "#00E5FF", backgroundColor: "#00E5FF", tension: 0.3 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { min: 0, max: 100, grid: { color: "#374151" } },
          x: { grid: { color: "#374151" } }
        },
        plugins: {
          legend: { labels: { color: "#EAEAEA" } }
        }
      }
    });
  }

  function setupEventListeners() {
    document.getElementById("session-form").addEventListener("submit", handleSessionSubmit);
    document.getElementById("training-form").addEventListener("submit", handleTrainingSubmit);
    document.getElementById("add-drill-btn").addEventListener("click", handleAddDrill);

    document.getElementById("pos-serving").addEventListener("change", () => { savePositionSettings(); renderDashboard(); });
    document.getElementById("pos-spiking").addEventListener("change", () => { savePositionSettings(); renderDashboard(); });
    document.getElementById("pos-passing").addEventListener("change", () => { savePositionSettings(); renderDashboard(); });
    document.getElementById("pos-setting").addEventListener("change", () => { savePositionSettings(); renderDashboard(); });

    document.getElementById("serve-type").addEventListener("change", function() {
      const link = document.getElementById("serve-type-link");
      if (this.value && serveVideos[this.value]) {
        link.href = serveVideos[this.value];
        link.style.display = "inline-flex";
      } else {
        link.style.display = "none";
      }
    });

    setupServeComparison();
  }

  function handleSessionSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const session = {
      id: Date.now(),
      date: formData.get("date"),
      serveAttempts: parseInt(formData.get("serveAttempts")) || 0,
      serveMade: parseInt(formData.get("serveMade")) || 0,
      serveErrors: 0,
      acesCount: parseInt(formData.get("acesCount")) || 0,
      spikeAttempts: parseInt(formData.get("spikeAttempts")) || 0,
      spikeMade: parseInt(formData.get("spikeMade")) || 0,
      spikeErrors: parseInt(formData.get("spikeErrors")) || 0,
      passesReceived: parseInt(formData.get("passesReceived")) || 0,
      passesWell: parseInt(formData.get("passesWell")) || 0,
      setsGiven: parseInt(formData.get("setsGiven")) || 0,
      setsTipped: parseInt(formData.get("setsTipped")) || 0,
      setsHit: parseInt(formData.get("setsHit")) || 0
    };

    if (!session.date) return;

    sessions.push(session);
    sessions.sort((a, b) => new Date(a.date) - new Date(b.date));
    saveSessions();
    
    form.reset();
    setDefaultDate();
    renderDashboard();
    renderSessionHistory();
  }

  function handleTrainingSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const log = {
      id: Date.now(),
      date: formData.get("date"),
      focusSkill: formData.get("focusSkill"),
      drillsCompleted: currentDrills,
      feedback: {
        wentWell: formData.get("feedbackWell"),
        feltOff: formData.get("feedbackOff")
      }
    };

    if (!log.date || !log.focusSkill) return;

    trainingLogs.push(log);
    trainingLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    saveTrainingLogs();

    currentDrills = [];
    form.reset();
    setDefaultDate();
    document.getElementById("drills-list").innerHTML = "";
    renderTrainingHistory();
  }

  function handleAddDrill() {
    const name = document.getElementById("drill-name").value.trim();
    const reps = parseInt(document.getElementById("drill-reps").value) || 0;
    const notes = document.getElementById("drill-notes").value.trim();

    if (!name) return;

    currentDrills.push({ name, reps, notes });
    
    const list = document.getElementById("drills-list");
    const item = document.createElement("li");
    item.innerHTML = "<span>" + name + "</span><span>" + reps + " reps</span><span>" + (notes || "-") + "</span>";
    list.appendChild(item);

    document.getElementById("drill-name").value = "";
    document.getElementById("drill-reps").value = "0";
    document.getElementById("drill-notes").value = "";
  }

  function setupServeComparison() {
    const attemptsA = document.querySelectorAll("#serve-a .attempt-btn");
    const attemptsB = document.querySelectorAll("#serve-b .attempt-btn");
    const serveTypeA = document.getElementById("serve-type-a");
    const serveTypeB = document.getElementById("serve-type-b");
    const scoreAEl = document.getElementById("score-a");
    const scoreBEl = document.getElementById("score-b");

    attemptsA.forEach(btn => btn.addEventListener("click", () => updateAttempt(btn, serveAData, scoreAEl)));
    attemptsB.forEach(btn => btn.addEventListener("click", () => updateAttempt(btn, serveBData, scoreBEl)));

    serveTypeA.addEventListener("change", () => updateServeVideoLink(serveTypeA, "serve-a"));
    serveTypeB.addEventListener("change", () => updateServeVideoLink(serveTypeB, "serve-b"));
  }

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
    
    const totalScore = dataArray.reduce((acc, val) => acc + states[val].score, 0);
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

  function updateCompareResult() {
    const typeA = document.getElementById("serve-type-a").value;
    const typeB = document.getElementById("serve-type-b").value;
    const compareResult = document.getElementById("compare-result");
    
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
    
    const scoreA = serveAData.reduce((acc, val) => acc + states[val].score, 0);
    const scoreB = serveBData.reduce((acc, val) => acc + states[val].score, 0);
    
    compareResult.style.display = "block";
    
    if (scoreA > scoreB) {
      document.getElementById("winner-text").textContent = "In a game, use " + formatServeType(typeA) + " - your most confident serve";
      document.getElementById("score-diff").textContent = "Score: " + scoreA + " vs " + scoreB;
    } else if (scoreB > scoreA) {
      document.getElementById("winner-text").textContent = "In a game, use " + formatServeType(typeB) + " - your most confident serve";
      document.getElementById("score-diff").textContent = "Score: " + scoreA + " vs " + scoreB;
    } else {
      document.getElementById("winner-text").textContent = "It's a tie! Both serves scored " + scoreA;
      document.getElementById("score-diff").textContent = "";
    }
  }

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

  function renderSessionHistory() {
    const list = document.getElementById("session-history-list");
    
    if (sessions.length === 0) {
      list.innerHTML = "<li class='history-empty'>No sessions recorded yet.</li>";
      return;
    }

    list.innerHTML = sessions.slice().reverse().map(s => {
      const serve = s.serveAttempts > 0 ? (s.serveMade / s.serveAttempts * 100).toFixed(1) + "%" : "0%";
      const spike = s.spikeAttempts > 0 ? (s.spikeMade / s.spikeAttempts * 100).toFixed(1) + "%" : "0%";
      const pass = s.passesReceived > 0 ? (s.passesWell / s.passesReceived * 100).toFixed(1) + "%" : "0%";
      const aces = s.acesCount || 0;
      
      return `
        <li>
          <span><strong>${s.date}</strong></span>
          <span style="color: var(--text-muted); font-size: 0.85rem;">
            Serve: ${serve} | Ace: ${aces} | Spike: ${spike} | Pass: ${pass}
          </span>
        </li>
      `;
    }).join("");
  }

  function renderTrainingHistory() {
    const list = document.getElementById("training-history-list");
    
    if (trainingLogs.length === 0) {
      list.innerHTML = "<li>No training logs yet</li>";
      return;
    }

    list.innerHTML = trainingLogs.slice(0, 5).map(log => {
      const drills = log.drillsCompleted.map(d => d.name + " (" + d.reps + ")").join(", ") || "No drills";
      return `
        <li>
          <span class="history-date">${log.date}</span>
          <span class="history-focus">Focus: ${capitalizeFirst(log.focusSkill)}</span>
          <span class="history-drills">${drills}</span>
          ${log.feedback.wentWell ? "<span class='history-feedback'>✓ " + log.feedback.wentWell + "</span>" : ""}
        </li>
      `;
    }).join("");
  }

  function capitalizeFirst(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  }

  function formatServeType(type) {
    const types = {
      "float": "Float",
      "jump-float": "Jump Float",
      "jump-topspin": "Jump Topspin",
      "underhand": "Underhand",
      "overhand": "Overhand"
    };
    return types[type] || type;
  }
})();