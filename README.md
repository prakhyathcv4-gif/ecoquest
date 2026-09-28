# ECOQUEST – Turn Everyday Actions into Green Habits 🌱

> A modern, interactive, and responsive static environmental awareness web platform built for students and young people to cultivate everyday sustainable habits.

---

## 📌 Project Objective

EcoQuest bridges the gap between passive environmental awareness and actionable daily habits. Traditional sustainability education often feels abstract or guilt-inducing; EcoQuest gamifies positive micro-actions—such as carrying a reusable water bottle, opting for active transit, fixing leaky taps, and sorting trash properly.

By rewarding students with browser-persisted **Eco Points**, real-time milestone badges, educational impact calculators, and creative upcycling guides, EcoQuest proves that small everyday choices add up to monumental collective change.

---

## ⚡ 100% Static Website Architecture

This project was engineered specifically to meet college assignment and production requirements for a **pure static website**:

* **Core Stack**: HTML5, CSS3, Vanilla JavaScript.
* **No Server Backend**: Zero Node.js/Express APIs, zero Python, zero PHP.
* **No External Database**: Zero MySQL, MongoDB, Firebase, or Supabase.
* **No Paid APIs / External Tokens**: 100% self-contained client-side execution.
* **Data Persistence**: Native browser `localStorage` stores:
  * User Eco Points and earned badges
  * Completed daily challenges
  * Quiz high scores and review history
  * Energy conservation checklist progress
  * Custom user green nickname
  * Bookmarked eco tips
  * Custom theme preferences (Dark / Light mode)

---

## 🌟 Key Features

1. **Global Navigation & Theming**:
   * Sticky glassmorphism header with real-time Eco Points counter.
   * Dark Mode / Light Mode toggle with `localStorage` persistence.
   * Fully responsive mobile hamburger slide-out drawer.
   * Automatic active navigation highlighting across all pages.
2. **Interactive Eco Challenges (`eco-challenges.html`)**:
   * Complete micro-challenges (Plastic-Free Day, Green Commute, Save Water, etc.).
   * Dynamic "+Points" animation and live completion progress bar.
   * Ability to complete and toggle challenges with persistent state.
3. **Curated Eco Tips with Live Filter (`eco-tips.html`)**:
   * Instant category filtering (Home, College, Travel, Food, Shopping, Tech).
   * Real-time search filter by keywords.
   * "Save Tip" bookmarking system saved to local storage.
4. **Interactive Waste Sorting Arena (`waste-management.html`)**:
   * "Where should this waste go?" educational game.
   * Sort items into 4 distinct bins: Biodegradable (🟢), Recyclables (🔵), E-Waste (🟡), Hazardous Waste (🔴).
   * Live streak counter, instant educational explanations, and bonus points.
5. **Water Conservation Calculator (`water-saving.html`)**:
   * Household member input + daily action toggles (5-min shower, faucet aerators, teeth brushing).
   * Instant calculation of daily, monthly, and annual liters saved.
   * Visual 4-step Rainwater Harvesting closed-loop infographic.
6. **Energy Saving Habit Tracker (`energy-saving.html`)**:
   * Interactive checklist tracking standby power, AC thermostat regulation, and LED usage.
   * Live progress bar updating from 0% to 100% with bonus points celebration.
   * Four renewable power pillar cards (Solar, Wind, Hydro, Biomass).
7. **Sustainable Food "Better Choice" Swaps (`green-food.html`)**:
   * Side-by-side comparison cards (packaging, seasonality, portion planning).
   * Dorm and home food waste reduction audit checklist.
8. **Transportation Footprint Visualizer (`green-travel.html`)**:
   * Kilometers input and multi-modal transit selector.
   * Educational relative impact ratings (Lower, Moderate, Higher).
   * Comparative proportional visual bar charts.
9. **Reuse & Upcycling Project Studio (`upcycling.html`)**:
   * Category filter (Plastic, Glass, Clothing, Paper, Home).
   * Interactive modal popups with Materials Required, step-by-step guides, difficulty, and time estimates.
10. **Eco Impact Calculator (`eco-calculator.html`)**:
    * 5-factor lifestyle habit evaluation.
    * Animated SVG circular gauge displaying a 0–100 Eco Score.
    * Tiered habit advice and improvement suggestions.
11. **Eco Awareness Quiz (`eco-quiz.html`)**:
    * 10 multiple-choice questions displayed one at a time.
    * Live progress tracker, Previous/Next navigation, and instant score review.
    * Restart quiz option and automatic reward points.
12. **Community Leaderboard (`leaderboard.html`)**:
    * Real-time integration of the current user's actual `localStorage` points.
    * Customizable user nickname with live re-sorting against demonstration leaders.
    * Milestones and badges gallery (Green Starter, Water Warden, Earth Guardian).
13. **Contact & Validation (`contact.html`)**:
    * Full client-side input validation for Name, Email, Subject, and Message.
    * Friendly confirmation banner with zero server dependencies.

---

## 📂 Project Structure

```
EcoQuest/
├── index.html               # Home Page & Hero Section
├── about.html               # Mission, Vision, 4R Principles & Timeline
├── eco-challenges.html      # Gamified Challenges with Point Rewards
├── eco-tips.html            # Category-Filtered Tips & Search
├── waste-management.html    # Interactive Waste Sorting Game & 4 Bins Guide
├── water-saving.html        # Water Savings Calculator & Rainwater Harvesting
├── energy-saving.html       # Energy Checklist & Renewable Energy Guide
├── green-food.html          # Sustainable Food Swaps & Food Waste Checklist
├── green-travel.html        # Commute Impact Visualizer & Transit Hierarchy
├── upcycling.html           # Creative DIY Guides & Step-by-Step Modals
├── eco-calculator.html      # 0–100 Eco Habit Score with SVG Gauge
├── eco-quiz.html            # 10-Question Eco Awareness Quiz
├── leaderboard.html         # Friendly Campus Leaderboard & Badges
├── contact.html             # Validated Client-Side Contact Form
│
├── css/
│   └── style.css            # Nature-Inspired Theme, Variables & Responsive Grid
│
├── js/
│   └── script.js            # Modular Vanilla JavaScript & LocalStorage Engine
│
└── README.md                # Project Documentation & Architecture
```

---

## 🚀 How to Run the Project Locally

Because EcoQuest is a pure static website, you can run it in multiple ways:

### Option A: Direct Browser Opening (Zero Tools Required)
Simply double-click `index.html` (or right-click and choose **Open With > Google Chrome / Safari / Firefox / Edge**). All pages, styles, and scripts will load immediately.

### Option B: Local Development Server (Vite / Node)
If developing with the included Vite bundler:
```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to Vercel

EcoQuest is 100% prepared for seamless Vercel deployment with zero configuration errors:

1. Push this repository to **GitHub / GitLab / Bitbucket**.
2. Go to your [Vercel Dashboard](https://vercel.com) and click **"Add New Project"**.
3. Import your EcoQuest repository.
4. **Build & Output Settings**:
   * **Framework Preset**: Vite (or Other)
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
5. Click **Deploy**. Vercel will bundle and host all 14 HTML pages, CSS, and JS globally on high-speed CDNs with free HTTPS!

---

## 📄 License & Attribution

Designed and built for the **College Static Web Development Assignment** © 2026 EcoQuest. All rights reserved. Free for educational and open-source learning use.
