# Volleyball Site

Vanilla HTML/CSS/JS volleyball session tracker prototype.

## Structure

```
first-prototype/
├── index.html    # Entry point
├── app.js        # JavaScript (data persistence, rendering, charts)
├── volley.css    # Main styles (dark theme)
└── styles.css    # Backup styles (corrupted/legacy)
```

Plus SVG assets:
- `vb-ball.svg`, `vb-net.svg`, `vb-serve.svg`, `vb-spike.svg`

## Tech Stack

- Pure HTML5, CSS3, vanilla JavaScript
- No build tools, no frameworks, no package manager
- localStorage for data persistence

## Current Version (v2)

### Color Scheme (Dark Theme)
- Background: #0B0F1A (deep navy/black)
- Primary: #1E90FF (electric blue)
- Accent: #00E5FF (cyan)
- Text: #EAEAEA (off-white)
- Secondary: #1F2937 (dark gray panels)

### Form Fields
- `date` - Session date
- `serveAttempts` - Total serves attempted
- `serveType` - Serve type (underhand, overhand, float, jump-float, jump-topspin)
- `acesCount` - Number of aces achieved
- `serveMade` - Serves that went IN
- `spikeAttempts` - Spike attempts
- `spikeMade` - Successful spikes
- `passesReceived` - Total passes received
- `passesWell` - Passes rated Good/Perfect
- `setsGiven` - Sets given to teammates
- `setsTipped` - Sets that were blocked
- `setsHit` - Sets that resulted in kills
- `pointsWon` - Total points won in session

### Dashboard Elements
- `#serve-percent-value` - Serve percentage
- `#ace-percent-value` - Ace percentage (aces / serveAttempts)
- `#spike-percent-value` - Spike percentage
- `#pass-percent-value` - Pass percentage (passesWell / passesReceived)
- `#totals-value` - Total sessions count
- `#session-history-list` - List of all sessions
- `#performance-chart` - Canvas chart with Serve%, Spike%, Pass% lines

### Session Schema
```javascript
{
  id, date, serveAttempts, serveMade, spikeAttempts, spikeMade,
  serveType, acesCount, passesReceived, passesWell,
  setsGiven, setsTipped, setsHit, pointsWon
}
```

### Find Your Game Serve Feature
Located in `#serve-compare-section`:
- Two dropdowns to select serve types to compare
- 10 clickable buttons per serve (cycles: `-` → `IN` → `OUT` → `ACE`)
- Scoring: IN=0, OUT=-1, ACE=+1
- Shows recommendation based on higher score
- Resets on page refresh

## History of Changes

### 2026-04-09: Initial Setup
- Created prototype with basic session tracking
- Fixed encoding issues (UTF-16LE → UTF-8)

### 2026-04-09: Aesthetic Enhancement v1
- Added blue/yellow color scheme
- Added volleyball SVG gallery in header
- Changed "Was it an ace?" checkbox to Aces number input
- Added Ace % to summary cards

### 2026-04-09: Dark Theme + New Features v2
- Changed to dark color scheme (#0B0F1A background)
- Added Passes Received and Passes Well fields
- Added Pass % to summary
- Added "Find Your Game Serve" comparison tool
- Fixed serve calculator: changed cycle to `-` → `IN` → `OUT` → `ACE`
- Clear old localStorage data on load (schema change)

### Fixes Applied
1. Serve calculator scoring bug - labels now match actual scores
2. Changed cycle from 3 states to 4: `-` (0) → `IN` (0) → `OUT` (-1) → `ACE` (+1)

### 2026-04-10: Video Tutorials & Learn Rotations

#### Video Tutorial Links Feature
- Added 📺 video icon links to form fields:
  - Serve Type → underhand serve tutorial
  - Spike Attempts → spiking footwork tutorial
  - Passes Received → passing fundamentals tutorial
- Fixed href bug in "Find Your Game Serve" section: changed `href="#"` to `href="javascript:void(0)"`

#### Improvement Area (new section)
- **Passing**: 2 videos (Elevate Yourself)
- **Serving**: 5 videos - all serve types
  - Underhand: Sarah Pavan Volleyball
  - Overhand: Volleyball University
  - Float/Jump serves: Elevate Yourself
- **Spiking**: 4 videos (Elevate Yourself)
- **Tipping**: 1 video (Elevate Yourself)
- **Setting**: 1 video (Elevate Yourself)

#### Learn Rotations (new section)
- 5-1 Varsity Rotation (by Set explained)
- 6-2 Varsity Rotation (by SD Volleyball)
- 4-2 Varsity Rotation (by Coach Steve)

#### Creator Credits
All videos credited to their respective creators:
- Sarah Pavan Volleyball (underhand serve)
- Volleyball University (overhand serve)
- Elevate Yourself (float/jump serves, passing, spiking, tipping, setting)
- Set explained, SD Volleyball, Coach Steve (rotations)

## Files and Encoding

- All files must be UTF-8 (no BOM)
- Check encoding with: `Format-Hex filename | Select-Object -First 4`
- UTF-8 starts with normal ASCII (e.g., `3A 72 6F 6F` = `:root`)
- UTF-16LE has spaces between chars (e.g., `28 00 66 00...`)

## How to Test

Open `first-prototype/index.html` directly in a browser (no server required).

## Future Improvements (Not Implemented)

- Add real volleyball images to form fields (pending user upload)
- Session editing/deletion
- Export data functionality
- Beach court images (skipped for now)