(function () {
  const SESSIONS_KEY = "volleyball-sessions";
  const TRAINING_LOG_KEY = "volleyball-training-log";
  const USER_POSITION_KEY = "volleyball-user-position";

  let sessions = loadSessions();
  let trainingLogs = loadTrainingLogs();
  let currentDrills = [];
  let chart = null;

  const serveAData = Array(10).fill(0);
  const serveBData = Array(10).fill(0);

  function loadSessions() {
    try {
      const data = localStorage.getItem(SESSIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveSessions() {
    try {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    } catch (e) {}
  }

  function loadTrainingLogs() {
    try {
      const data = localStorage.getItem(TRAINING_LOG_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveTrainingLogs() {
    try {
      localStorage.setItem(TRAINING_LOG_KEY, JSON.stringify(trainingLogs));
    } catch (e) {}
  }

  const positionTutorialsDB = {
    "outside-hitter": [
      { title: "Outside Hitter Complete Guide", url: "https://www.youtube.com/watch?v=p9Je6eXtcd0", creator: "Jiri Popelka" },
      { title: "Outside Hitter Skills", url: "https://www.youtube.com/watch?v=IGfj8k9QjwI", creator: "Four Athletes" },
      { title: "Outside Hitter Tips", url: "https://www.youtube.com/watch?v=vKsViBLH41I", creator: "Four Athletes" }
    ],
    "opposite-hitter": [
      { title: "Opposite Hitter Complete Guide", url: "https://www.youtube.com/watch?v=lQtswg7S0Nk&t=12s", creator: "Jiri Popelka" },
      { title: "Opposite Hitter Skills", url: "https://www.youtube.com/watch?v=NMs38ZelqK8", creator: "Four Athletes" }
    ],
    "setter": [
      { title: "Setter Complete Guide", url: "https://www.youtube.com/watch?v=-OJPH3TAiA0", creator: "Jiri Popelka" },
      { title: "Setter Fundamentals", url: "https://www.youtube.com/watch?v=a4nrgq3ma3o", creator: "PME Volleyball" }
    ],
    "middle-blocker": [
      { title: "Middle Blocker Complete Guide", url: "https://www.youtube.com/watch?v=MwCyKLSDLLQ&t=196s", creator: "Coach Artie" },
      { title: "Middle Blocker Tips", url: "https://www.youtube.com/watch?v=0Q7dpZZ71X8", creator: "Jiri Popelka" },
      { title: "Middle Blocker Skills", url: "https://www.youtube.com/watch?v=_neqUO4ZbpA", creator: "International Volleyball Academy" }
    ],
    "libero": [
      { title: "Libero Complete Guide", url: "https://www.youtube.com/watch?v=hlK6gC0pgR4", creator: "Coach Artie" },
      { title: "Libero Fundamentals", url: "https://www.youtube.com/watch?v=hbeQfSKKgNQ", creator: "Mitch Sterkenburg" }
    ],
    "undecided": []
  };

  positionTutorialsDB["undecided"] = [
    ...positionTutorialsDB["outside-hitter"],
    ...positionTutorialsDB["opposite-hitter"],
    ...positionTutorialsDB["setter"],
    ...positionTutorialsDB["middle-blocker"],
    ...positionTutorialsDB["libero"]
  ];

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
    { title: "Tip & Roll / Cut Shot", url: "https://www.youtube.com/watch?v=jnEA9sV834s", skill: "spiking", creator: "Elevate Yourself" },
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
    setting: "Use your legs, not just your arms. Get low and push through the ball",
    blocking: "Get high and time your jump with the attacker's. Stack the ball for best results"
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
    ],
    blocking: [
      { title: "Blocking Fundamentals", url: "https://www.youtube.com/watch?v=MwCyKLSDLLQ&t=196s" },
      { title: "Middle Blocker Tips", url: "https://www.youtube.com/watch?v=0Q7dpZZ71X8" }
    ]
  };

  const positionSkillsMap = {
    "outside-hitter": { serving: true, spiking: true, passing: true, setting: false, blocking: true },
    "opposite-hitter": { serving: true, spiking: true, passing: false, setting: false, blocking: true },
    "setter": { serving: true, spiking: false, passing: true, setting: true, blocking: true },
    "middle-blocker": { serving: true, spiking: true, passing: false, setting: false, blocking: true },
    "libero": { serving: false, spiking: false, passing: true, setting: false, blocking: false },
    "undecided": { serving: true, spiking: true, passing: true, setting: true, blocking: true }
  };

  function setDefaultDate() {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("session-date").value = today;
    document.getElementById("training-date").value = today;
  }

  function renderDashboard() {
    const settings = {
      serving: document.getElementById("pos-serving").checked,
      spiking: document.getElementById("pos-spiking").checked,
      passing: document.getElementById("pos-passing").checked,
      setting: document.getElementById("pos-setting").checked,
      blocking: document.getElementById("pos-blocking").checked
    };

    let totalServe = 0, totalServeMade = 0, totalAces = 0;
    let totalSpike = 0, totalSpikeMade = 0;
    let totalPass = 0, totalPassWell = 0;
    let totalSets = 0, totalSetHits = 0;

    sessions.forEach(s => {
      if (settings.serving) {
        totalServe += s.serveAttempts || 0;
        totalServeMade += s.serveMade || 0;
        totalAces += s.acesCount || 0;
      }
      if (settings.spiking) {
        totalSpike += s.spikeAttempts || 0;
        totalSpikeMade += s.spikeMade || 0;
      }
      if (settings.passing) {
        totalPass += s.passesReceived || 0;
        totalPassWell += s.passesWell || 0;
      }
      if (settings.setting) {
        totalSets += s.setsGiven || 0;
        totalSetHits += s.setsHit || 0;
      }
    });

    const stats = {};
    if (settings.serving && totalServe > 0) {
      stats.servePercent = (totalServeMade / totalServe * 100);
      stats.acePercent = (totalAces / totalServe * 100);
    } else {
      stats.servePercent = 0;
      stats.acePercent = 0;
    }
    if (settings.spiking && totalSpike > 0) {
      stats.spikePercent = (totalSpikeMade / totalSpike * 100);
    } else {
      stats.spikePercent = 0;
    }
    if (settings.passing && totalPass > 0) {
      stats.passPercent = (totalPassWell / totalPass * 100);
    } else {
      stats.passPercent = 0;
    }
    stats.aceCount = totalAces;
    stats.sessions = sessions.length;

    document.getElementById("serve-percent-value").textContent = stats.servePercent.toFixed(1) + "%";
    document.getElementById("ace-percent-value").textContent = stats.acePercent.toFixed(1) + "%";
    document.getElementById("spike-percent-value").textContent = stats.spikePercent.toFixed(1) + "%";
    document.getElementById("pass-percent-value").textContent = stats.passPercent.toFixed(1) + "%";
    document.getElementById("ace-count").textContent = stats.aceCount + " aces";
    document.getElementById("totals-value").textContent = stats.sessions + " sessions";

    const alert = document.getElementById("weakness-alert");
    const msg = document.getElementById("weakness-message");
    if (sessions.length > 0) {
      const skills = [];
      if (settings.serving) skills.push({ name: "serving", percent: stats.servePercent });
      if (settings.spiking) skills.push({ name: "spiking", percent: stats.spikePercent });
      if (settings.passing) skills.push({ name: "passing", percent: stats.passPercent });
      if (settings.setting && totalSets > 0) skills.push({ name: "setting", percent: (totalSetHits / totalSets * 100) });
      
      if (skills.length > 0) {
        skills.sort((a, b) => a.percent - b.percent);
        const weakest = skills[0];
        if (weakest.percent < 50) {
          alert.style.display = "flex";
          msg.textContent = "Your weakest skill: " + weakest.name.charAt(0).toUpperCase() + weakest.name.slice(1) + " (" + weakest.percent.toFixed(1) + "%)";
        } else {
          alert.style.display = "none";
        }
      }
    } else {
      alert.style.display = "none";
    }

    renderTrendsChart();
  }

  function renderTrendsChart() {
    const ctx = document.getElementById("trends-chart");
    if (!ctx) return;
    
    const labels = sessions.map(s => s.date);
    const serveData = sessions.map(s => s.serveAttempts > 0 ? (s.serveMade / s.serveAttempts * 100) : null);
    const spikeData = sessions.map(s => s.spikeAttempts > 0 ? (s.spikeMade / s.spikeAttempts * 100) : null);
    const passData = sessions.map(s => s.passesReceived > 0 ? (s.passesWell / s.passesReceived * 100) : null);

    if (chart) chart.destroy();
    
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          { label: "Serve %", data: serveData, borderColor: "#1E90FF", tension: 0.3 },
          { label: "Spike %", data: spikeData, borderColor: "#EF4444", tension: 0.3 },
          { label: "Pass %", data: passData, borderColor: "#10B981", tension: 0.3 }
        ]
      },
      options: {
        responsive: true,
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

  init();

  function init() {
    console.log('[DEBUG] init() called');
    loadUserPosition();
    setDefaultDate();
    renderDashboard();
    renderDrillsBySkill();
    renderVideosBySkill();
    renderPositionTutorials();
    renderSessionHistory();
    renderTrainingHistory();
    updateFormVisibility();
    setupEventListeners();
    console.log('[DEBUG] init() complete');
  }

  function loadUserPosition() {
    console.log('[DEBUG] loadUserPosition() called');
    try {
      const savedPosition = localStorage.getItem(USER_POSITION_KEY);
      console.log('[DEBUG] Saved position:', savedPosition);
      if (savedPosition) {
        document.getElementById("position-select").value = savedPosition;
        console.log('[DEBUG] Set dropdown to:', savedPosition);
        renderPositionTutorials();
        if (savedPosition && savedPosition !== "undecided") {
          applyPositionSkills(savedPosition);
        }
      } else {
        console.log('[DEBUG] No saved position found');
      }
    } catch (e) {
      console.error('[DEBUG] Error loading position:', e);
    }
  }

  function saveUserPosition(position) {
    console.log('[DEBUG] saveUserPosition() called with:', position);
    try {
      localStorage.setItem(USER_POSITION_KEY, position);
    } catch (e) {}
  }

  function renderPositionTutorials() {
    console.log('[DEBUG] renderPositionTutorials() called');
    const select = document.getElementById("position-select");
    const section = document.getElementById("position-tutorials-section");
    const grid = document.getElementById("position-tutorials-grid");
    const credit = document.getElementById("position-tutorials-credit");
    const position = select.value;
    console.log('[DEBUG] Rendering tutorials for position:', position);

    if (!position) {
      section.style.display = "none";
      console.log('[DEBUG] No position, hiding section');
      return;
    }

    section.style.display = "block";
    const videos = positionTutorialsDB[position] || [];
    console.log('[DEBUG] Videos found:', videos.length);
    const creators = [...new Set(videos.map(v => v.creator))];

    grid.innerHTML = videos.map(video => `
      <article class="improvement-card">
        <ul class="video-list">
          <li><a href="${video.url}" target="_blank"><span class="play-icon">▶</span> ${video.title}</a></li>
        </ul>
        <p class="video-creator">By ${video.creator}</p>
      </article>
    `).join("");

    credit.textContent = "Videos: " + creators.join(", ");
  }

  function applyPositionSkills(position) {
    console.log('[DEBUG] applyPositionSkills() called with:', position);
    const skills = positionSkillsMap[position] || positionSkillsMap["undecided"];
    console.log('[DEBUG] Skills to apply:', skills);
    if (!skills) return;
    
    document.getElementById("pos-serving").checked = skills.serving;
    document.getElementById("pos-spiking").checked = skills.spiking;
    document.getElementById("pos-passing").checked = skills.passing;
    document.getElementById("pos-setting").checked = skills.setting;
    document.getElementById("pos-blocking").checked = skills.blocking;
    
    console.log('[DEBUG] Checkboxes updated, now saving...');
    // Delay save to ensure DOM has updated
    setTimeout(() => {
      savePositionSettings();
      renderDashboard();
      updateFormVisibility();
      renderDrillsBySkill();
      renderVideosBySkill();
      console.log('[DEBUG] Finished applyPositionSkills');
    }, 10);
  }

  function updateFormVisibility() {
    const skills = {
      serving: document.getElementById("pos-serving").checked,
      spiking: document.getElementById("pos-spiking").checked,
      passing: document.getElementById("pos-passing").checked,
      setting: document.getElementById("pos-setting").checked,
      blocking: document.getElementById("pos-blocking").checked
    };
    
    const cardMap = {
      serving: "form-card-serving",
      spiking: "form-card-spiking",
      passing: "form-card-passing",
      setting: "form-card-setting",
      blocking: "form-card-blocking"
    };
    
    for (const [skill, cardId] of Object.entries(cardMap)) {
      const card = document.getElementById(cardId);
      if (card) {
        card.style.display = skills[skill] ? "block" : "none";
      }
    }
  }

  function renderDrillsBySkill() {
    const container = document.getElementById("drills-grid");
    if (!container) return;
    
    const settings = {
      passing: document.getElementById("pos-passing").checked,
      serving: document.getElementById("pos-serving").checked,
      spiking: document.getElementById("pos-spiking").checked,
      setting: document.getElementById("pos-setting").checked
    };

    const skillOrder = ["passing", "serving", "spiking", "setting"];
    const skillIcons = {
      passing: "vb-net.svg",
      serving: "vb-serve.svg",
      spiking: "vb-spike.svg",
      setting: "vb-net.svg"
    };
    const skillLabels = {
      passing: "Passing",
      serving: "Serving",
      spiking: "Spiking",
      setting: "Setting"
    };

    let html = "";
    skillOrder.forEach(skill => {
      if (!settings[skill]) return;
      const drills = drillsDB.filter(d => d.skill === skill);
      const content = drills.length === 0 
        ? "<li>No drills available</li>"
        : drills.map(d => `
          <li>
            <span class="drill-name">${d.name}</span>
            <span class="drill-meta">${d.difficulty} | ${d.tools.join(", ")}</span>
          </li>
        `).join("");

      html += `
        <article class="improvement-card">
          <button class="skill-toggle" data-skill="${skill}">
            <img src="${skillIcons[skill]}" alt="${skillLabels[skill]}" class="skill-icon" />
            ${skillLabels[skill]}
            <span class="chevron">▼</span>
          </button>
          <div class="skill-content" id="drills-content-${skill}">
            <ul class="video-list">${content}</ul>
          </div>
        </article>
      `;
    });

    container.innerHTML = html;
    setupSkillAccordion("drills");
  }

  function renderVideosBySkill() {
    const container = document.getElementById("videos-grid");
    if (!container) return;
    
    const settings = {
      passing: document.getElementById("pos-passing").checked,
      serving: document.getElementById("pos-serving").checked,
      spiking: document.getElementById("pos-spiking").checked,
      setting: document.getElementById("pos-setting").checked
    };

    const skillOrder = ["passing", "serving", "spiking", "setting"];
    const skillIcons = {
      passing: "vb-net.svg",
      serving: "vb-serve.svg",
      spiking: "vb-spike.svg",
      setting: "vb-net.svg"
    };
    const skillLabels = {
      passing: "Passing",
      serving: "Serving",
      spiking: "Spiking",
      setting: "Setting"
    };

    let html = "";
    skillOrder.forEach(skill => {
      if (!settings[skill]) return;
      const videos = videosDB.filter(v => v.skill === skill);
      const content = videos.length === 0
        ? "<li>No videos available</li>"
        : videos.map(v => `
          <li><a href="${v.url}" target="_blank"><span class="play-icon">▶</span> ${v.title}</a></li>
        `).join("");

      html += `
        <article class="improvement-card">
          <button class="skill-toggle" data-skill="${skill}">
            <img src="${skillIcons[skill]}" alt="${skillLabels[skill]}" class="skill-icon" />
            ${skillLabels[skill]}
            <span class="chevron">▼</span>
          </button>
          <div class="skill-content" id="videos-content-${skill}">
            <ul class="video-list">${content}</ul>
          </div>
        </article>
      `;
    });

    container.innerHTML = html;
    setupSkillAccordion("videos");
  }

  function setupSkillAccordion(section) {
    const toggles = document.querySelectorAll(`#${section}-grid .skill-toggle`);
    toggles.forEach(toggle => {
      toggle.addEventListener("click", function() {
        const skill = this.dataset.skill;
        const content = document.getElementById(`${section}-content-${skill}`);
        const isActive = this.classList.contains("active");

        document.querySelectorAll(`#${section}-grid .skill-toggle`).forEach(t => {
          t.classList.remove("active");
          document.getElementById(`${section}-content-${t.dataset.skill}`).classList.remove("show");
        });

        if (!isActive) {
          this.classList.add("active");
          content.classList.add("show");
        }
      });
    });
  }

  function setupEventListeners() {
    document.getElementById("session-form").addEventListener("submit", handleSessionSubmit);
    document.getElementById("training-form").addEventListener("submit", handleTrainingSubmit);
    document.getElementById("add-drill-btn").addEventListener("click", handleAddDrill);

    document.getElementById("pos-serving").addEventListener("change", () => { savePositionSettings(); renderDashboard(); updateFormVisibility(); renderDrillsBySkill(); renderVideosBySkill(); });
    document.getElementById("pos-spiking").addEventListener("change", () => { savePositionSettings(); renderDashboard(); updateFormVisibility(); renderDrillsBySkill(); renderVideosBySkill(); });
    document.getElementById("pos-passing").addEventListener("change", () => { savePositionSettings(); renderDashboard(); updateFormVisibility(); renderDrillsBySkill(); renderVideosBySkill(); });
    document.getElementById("pos-setting").addEventListener("change", () => { savePositionSettings(); renderDashboard(); updateFormVisibility(); renderDrillsBySkill(); renderVideosBySkill(); });
    document.getElementById("pos-blocking").addEventListener("change", () => { savePositionSettings(); renderDashboard(); updateFormVisibility(); renderDrillsBySkill(); renderVideosBySkill(); });

    document.getElementById("position-select").addEventListener("change", function() {
      const position = this.value;
      console.log('[DEBUG] Position dropdown changed to:', position);
      saveUserPosition(position);
      renderPositionTutorials();
      // Use setTimeout to allow DOM to fully update before applying skills
      setTimeout(() => applyPositionSkills(position), 10);
    });

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

  function savePositionSettings() {
    const settings = {
      serving: document.getElementById("pos-serving").checked,
      spiking: document.getElementById("pos-spiking").checked,
      passing: document.getElementById("pos-passing").checked,
      setting: document.getElementById("pos-setting").checked,
      blocking: document.getElementById("pos-blocking").checked
    };
    try {
      localStorage.setItem("volleyball-position-settings", JSON.stringify(settings));
    } catch (e) {}
  }

  function loadPositionSettings() {
    try {
      const settings = JSON.parse(localStorage.getItem("volleyball-position-settings") || "null");
      if (settings) {
        document.getElementById("pos-serving").checked = settings.serving !== false;
        document.getElementById("pos-spiking").checked = settings.spiking !== false;
        document.getElementById("pos-passing").checked = settings.passing !== false;
        document.getElementById("pos-setting").checked = settings.setting !== false;
        document.getElementById("pos-blocking").checked = settings.blocking !== false;
      }
    } catch (e) {}
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
      blockAttempts: parseInt(formData.get("blockAttempts")) || 0,
      blockKills: parseInt(formData.get("blockKills")) || 0,
      blockTouches: parseInt(formData.get("blockTouches")) || 0,
      blockErrors: parseInt(formData.get("blockErrors")) || 0,
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