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

## Session History

### 2026-04-09: Bug Fix - Sessions Not Appearing in Dashboard

**Problem:** When saving an entry, it wasn't appearing in the performance dashboard.

**Root Cause:** Multiple encoding issues:
1. `app.js` was corrupted binary (couldn't be parsed as JavaScript)
2. `script.js` had UTF-16LE encoding (spaces between characters)
3. `index.html` had UTF-16LE with BOM encoding
4. HTML files referenced corrupted `app.js` instead of working `script.js`
5. `script.js` only saved 5 fields, missing 7 additional form fields

**Fix Applied:**
- Deleted corrupted `app.js` and 3 duplicate HTML files (`untitled-4.html`, `Untitled-5.html`, `session.html`)
- Converted `script.js` from UTF-16LE to UTF-8
- Extended data model to save all 12 form fields
- Renamed `script.js` → `app.js`
- Rewrote `index.html` with clean UTF-8 encoding

**Commands for future encoding fixes:**
```powershell
# Check encoding (UTF-16LE starts with 28 00 66 00...)
Format-Hex filename | Select-Object -First 4

# Convert UTF-16LE to UTF-8
$content = Get-Content "file" -Encoding Unicode -Raw
[System.IO.File]::WriteAllText("file", $content)

# Convert UTF-16LE to UTF-8 (alternative)
$content = [System.IO.File]::ReadAllText("file", [System.Text.Encoding]::Unicode)
[System.IO.File]::WriteAllText("file", $content, [System.Text.Encoding]::UTF8)
```

**Next Steps (not implemented yet):**
- Display extra fields (`serveType`, `wasAce`, `setsGiven`, `setsTipped`, `setsHit`, `pointsWon`) in dashboard
- Add session editing/deletion functionality
