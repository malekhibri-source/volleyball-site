# Volleyball Site

Vanilla HTML/CSS/JS volleyball session tracker prototype.

## Structure

```
first-prototype/
├── index.html    # Entry point
├── app.js        # JavaScript (data persistence, rendering, charts)
├── styles.css    # Main styles
└── volley.css    # Additional styles
```

## Tech Stack

- Pure HTML5, CSS3, vanilla JavaScript
- No build tools, no frameworks, no package manager
- localStorage for data persistence

## Key Implementation Details

### Data Persistence
- localStorage key: `"volleyball-sessions"`
- Data format: JSON array of session objects
- Session schema: `{ id, date, serveAttempts, serveMade, spikeAttempts, spikeMade, serveType, wasAce, setsGiven, setsTipped, setsHit, pointsWon }`

### Files and Encoding
- All files must be UTF-8 (no BOM)
- Previous issues were caused by UTF-16LE encoding - verify with `Format-Hex` or check first bytes

### How to Test
Open `first-prototype/index.html` directly in a browser (no server required).

### Form Fields
- `date`, `serveAttempts`, `serveType`, `wasAce`, `serveMade`
- `spikeAttempts`, `spikeMade`
- `setsGiven`, `setsTipped`, `setsHit`, `pointsWon`

### Dashboard Elements
- `#serve-percent-value`, `#spike-percent-value`, `#totals-value`
- `#session-history-list`, `#performance-chart` (canvas)
