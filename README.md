<div align="center">

# USPSA Scoring App

Access the app [here](https://eddiecwh.github.io/uspsa_scoring/)

![Version](https://img.shields.io/badge/version-2.1-orange.svg)

**A modern, mobile-friendly USPSA scoring application**

*Created by Eddie Chan | Last Updated: October 21, 2025*

[Features](#-features) • [Tutorial](#-tutorial) • [Changelog](#-changelog)

</div>

---

## Features

- **Mobile-First Design** - Optimized for phones and tablets
- **Stage Management** - Create, edit, and save multiple stage configurations
- **Real-Time Scoring** - Instant hit factor calculations
- **Analytics Dashboard** - Track performance across sessions
- **Local Storage** - No data loss on page refresh
- **CSV Export** - Export results for external analysis

---

## Tutorial

### Creating a Stage

<table>
<tr>
<td width="50%">

<img src="https://github.com/user-attachments/assets/c447bfad-589e-440c-874a-8f805b3e1a26" alt="Dashboard" width="100%"/>

**Step 1: Navigate to Stage Setup**

Click on "New Stage" from the dashboard to begin creating your stage configuration.

</td>
<td width="50%">

<img src="https://github.com/user-attachments/assets/ce8759fa-2627-4d12-814a-801a8161ee9d" alt="Stage Setup" width="100%"/>

**Step 2: Configure Stage**

- Set number of **paper targets** (-)
- Set number of **steel targets** (+)
- Enter a **stage name** (required)
- Add optional **description**

</td>
</tr>
</table>

#### Important Notes:
> **⚠️ Current Limitation:** Stages support 2 hits per target. For drills like Bill Drill (6 rounds on 1 target), configure as 3 paper targets with 2 hits each.

**After Setup:**
1. Click **"Save Stage"** to add to your library
2. Click **"Start Scoring"** to begin immediately

---

### Scoring Process

<table>
<tr>
<td width="33%">

<img src="https://github.com/user-attachments/assets/68cabda1-7b01-4d8c-8123-4940994a22a3" alt="Stage Library" width="100%"/>

**Step 1: Select Stage**

Navigate to **Stage Library** and choose your stage. You can also:
- **Edit** stage settings
- **Copy** existing stages
- **Delete** unused stages

</td>
<td width="33%">

<img src="https://github.com/user-attachments/assets/c44a8cf2-7b0b-4c9f-8915-6826eee0d92a" alt="Scoring Screen" width="100%"/>

**Step 2: Enter Details**

1. Input **Shooter Name**
2. Enter **Time** in seconds
3. Score each target:
   - **Tap** to add score
   - **Long press** to reset
   - Cycle through 0→1→2→0

</td>
<td width="33%">

<img src="https://github.com/user-attachments/assets/3bca9163-6f3d-410c-94b9-36f4dd663c42" alt="Review Screen" width="100%"/>

**Step 3: Review & Save**

Review the complete breakdown:
- Total hits by zone (A, C, D)
- Misses and penalties
- **Hit Factor** calculation
- Click **"Save Score"** to record

</td>
</tr>
</table>

---

### 🔄 Between Shooters

<img src="https://github.com/user-attachments/assets/a43eba44-f22c-4403-9e24-738682df6af5" alt="Clear" width="300"/>

Click **"Clear"** to reset the scoring screen for the next shooter. All saved scores remain in the Results section.

---

## 📊 Results & Analytics

View comprehensive statistics:
- **Best Hit Factor**
- **Average Hit Factor**
- **Best/Average Time**
- **Per-Stage Breakdowns**
- **CSV Export** for spreadsheet analysis

Filter by stage or view all results together!

---

## 📝 Changelog

### v2.1 - October 21, 2025
#### Major Updates
- **Complete UI Revamp**
- **Stage Library System** - Save and manage multiple stage configurations
- **Results Dashboard** - Comprehensive analytics and metrics
  - High/Average Hit Factor
  - Best/Average Time
  - Per-stage filtering
- **Sticky Input Fields** - Shooter name and time scroll with page

#### Bug Fixes
- **Fixed Noshoot Scoring** - Now correctly applies -10pt penalty regardless of other hits
- **Improved Calculation Logic** - More accurate hit factor computation

---

### v1.2 - August 15, 2025
-  **Local Storage Support** - Data persists through page refreshes
-  **Timestamps** - Automatic logging on exported files
-  **PDF Improvements** - Bold headers in generated PDFs

---

### v1.1 - May 8, 2025
-  **Noshoot Penalties** - Added -10pt penalty system
-  **PDF Export** - Generate hard-copy score sheets
-  **UI Fix** - Removed horizontal scrolling

---

<div align="center">

**Made with ❤️ for the USPSA community**

⭐ Star this repo if you find it helpful!

</div>

