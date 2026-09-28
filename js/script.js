/**
 * ECOQUEST - MASTER JAVASCRIPT
 * 100% Vanilla JavaScript, Browser & LocalStorage Powered
 * Static website architecture for college assignment and production deployment
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. STATE & STORAGE HELPERS
  // --------------------------------------------------------------------------
  const STORAGE_KEYS = {
    THEME: 'ecoquest-theme',
    POINTS: 'ecoquest-points',
    CHALLENGES: 'ecoquest-challenges-completed',
    QUIZ_HIGHSCORE: 'ecoquest-quiz-score',
    CALC_SCORE: 'ecoquest-calculator-score',
    ENERGY_CHECKLIST: 'ecoquest-energy-checked',
    USERNAME: 'ecoquest-username',
    BOOKMARKED_TIPS: 'ecoquest-bookmarked-tips'
  };

  function getStored(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data !== null ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function setStored(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  // Current Eco Points state
  let currentPoints = parseInt(getStored(STORAGE_KEYS.POINTS, 120), 10);
  if (isNaN(currentPoints)) currentPoints = 120;

  // --------------------------------------------------------------------------
  // 2. TOAST NOTIFICATION SYSTEM
  // --------------------------------------------------------------------------
  function createToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  function showToast(message, icon = '🌱') {
    const container = createToastContainer();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span style="font-size: 1.25rem;">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  // --------------------------------------------------------------------------
  // 3. ECO POINTS SYSTEM
  // --------------------------------------------------------------------------
  function updatePointsUI() {
    const badges = document.querySelectorAll('.eco-points-value');
    badges.forEach(el => {
      el.textContent = currentPoints;
    });

    const badgeContainers = document.querySelectorAll('.eco-points-badge');
    badgeContainers.forEach(container => {
      container.classList.remove('bump');
      // trigger reflow
      void container.offsetWidth;
      container.classList.add('bump');
    });
  }

  function addEcoPoints(amount, actionName) {
    currentPoints += amount;
    setStored(STORAGE_KEYS.POINTS, currentPoints);
    updatePointsUI();
    showToast(`+${amount} Eco Points! ${actionName}`, '🌟');

    // Trigger custom event for other pages or components
    window.dispatchEvent(new CustomEvent('ecopoints-updated', { detail: { points: currentPoints } }));
  }

  function deductEcoPoints(amount, actionName) {
    currentPoints = Math.max(0, currentPoints - amount);
    setStored(STORAGE_KEYS.POINTS, currentPoints);
    updatePointsUI();
    showToast(`-${amount} Eco Points: ${actionName}`, '♻️');
    window.dispatchEvent(new CustomEvent('ecopoints-updated', { detail: { points: currentPoints } }));
  }

  // --------------------------------------------------------------------------
  // 4. THEME (DARK / LIGHT MODE)
  // --------------------------------------------------------------------------
  function initTheme() {
    const savedTheme = getStored(STORAGE_KEYS.THEME, 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeToggleIcons(savedTheme);

    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const nextTheme = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        setStored(STORAGE_KEYS.THEME, nextTheme);
        updateThemeToggleIcons(nextTheme);
        showToast(nextTheme === 'dark' ? 'Night Mode Activated' : 'Day Mode Activated', nextTheme === 'dark' ? '🌙' : '☀️');
      });
    });
  }

  function updateThemeToggleIcons(theme) {
    const icons = document.querySelectorAll('.theme-icon-slot');
    icons.forEach(el => {
      el.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
  }

  // --------------------------------------------------------------------------
  // 5. NAVIGATION & ACTIVE PAGE HIGHLIGHTER
  // --------------------------------------------------------------------------
  function initNavigation() {
    // Current file detection
    const path = window.location.pathname;
    let page = path.split('/').pop() || 'index.html';
    if (!page.endsWith('.html')) page = 'index.html';

    const links = document.querySelectorAll('.nav-link, .nav-dropdown-item, .mobile-nav-item');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === page || (page === 'index.html' && (href === './' || href === '/')))) {
        link.classList.add('active');
      }
    });

    // Mobile Hamburger Drawer
    const mobileBtn = document.querySelector('.mobile-nav-toggle');
    const drawer = document.querySelector('.mobile-menu-drawer');
    if (mobileBtn && drawer) {
      mobileBtn.addEventListener('click', () => {
        const isOpen = drawer.classList.toggle('open');
        mobileBtn.classList.toggle('open', isOpen);
        mobileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      // Close drawer when a link is clicked
      drawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          drawer.classList.remove('open');
          mobileBtn.classList.remove('open');
          mobileBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Header Eco Points Click opens Leaderboard
    const pointBadges = document.querySelectorAll('.eco-points-badge');
    pointBadges.forEach(badge => {
      badge.addEventListener('click', () => {
        if (!window.location.pathname.includes('leaderboard.html')) {
          window.location.href = 'leaderboard.html';
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. SCROLL TO TOP BUTTON
  // --------------------------------------------------------------------------
  function initScrollTop() {
    const btn = document.querySelector('.scroll-top-btn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 7. ECO CHALLENGES INTERACTIVITY
  // --------------------------------------------------------------------------
  function initChallenges() {
    const challengeGrid = document.querySelector('.challenges-container');
    if (!challengeGrid) return;

    let completedList = getStored(STORAGE_KEYS.CHALLENGES, []);

    function updateChallengeStats() {
      const countEl = document.getElementById('completed-challenges-count');
      if (countEl) countEl.textContent = completedList.length;

      const progressEl = document.getElementById('challenges-progress-bar');
      if (progressEl) {
        const total = document.querySelectorAll('.challenge-card').length || 10;
        const pct = Math.min(100, Math.round((completedList.length / total) * 100));
        progressEl.style.width = `${pct}%`;
      }
    }

    const cards = challengeGrid.querySelectorAll('.challenge-card');
    cards.forEach(card => {
      const challengeId = card.getAttribute('data-id');
      const points = parseInt(card.getAttribute('data-points') || '20', 10);
      const title = card.querySelector('.challenge-title')?.textContent || 'Eco Challenge';
      const btn = card.querySelector('.challenge-btn');

      if (!btn) return;

      const isDone = completedList.includes(challengeId);
      if (isDone) {
        card.classList.add('completed');
        btn.classList.add('is-completed');
        btn.innerHTML = 'Completed ✓';
      }

      btn.addEventListener('click', () => {
        const currentlyDone = completedList.includes(challengeId);
        if (!currentlyDone) {
          completedList.push(challengeId);
          setStored(STORAGE_KEYS.CHALLENGES, completedList);
          card.classList.add('completed');
          btn.classList.add('is-completed');
          btn.innerHTML = 'Completed ✓';
          addEcoPoints(points, `Completed: ${title}`);
        } else {
          // Allow toggling back for user freedom
          completedList = completedList.filter(id => id !== challengeId);
          setStored(STORAGE_KEYS.CHALLENGES, completedList);
          card.classList.remove('completed');
          btn.classList.remove('is-completed');
          btn.innerHTML = 'Complete Challenge';
          deductEcoPoints(points, `Reopened: ${title}`);
        }
        updateChallengeStats();
      });
    });

    updateChallengeStats();
  }

  // --------------------------------------------------------------------------
  // 8. ECO TIPS PAGE (FILTERING & SEARCH & BOOKMARK)
  // --------------------------------------------------------------------------
  function initEcoTips() {
    const container = document.querySelector('.tips-grid');
    if (!container) return;

    const filterBtns = document.querySelectorAll('.tip-filter-btn');
    const searchInput = document.getElementById('tip-search-input');
    let bookmarked = getStored(STORAGE_KEYS.BOOKMARKED_TIPS, []);

    function applyFilters() {
      const activeBtn = document.querySelector('.tip-filter-btn.active');
      const category = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
      const term = (searchInput?.value || '').toLowerCase().trim();

      const tipCards = container.querySelectorAll('.tip-card');
      let visibleCount = 0;

      tipCards.forEach(card => {
        const cardCat = card.getAttribute('data-category') || '';
        const cardText = card.textContent.toLowerCase();
        const matchesCat = category === 'all' || cardCat === category;
        const matchesSearch = term === '' || cardText.includes(term);

        if (matchesCat && matchesSearch) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      const emptyNotice = document.getElementById('tips-empty-notice');
      if (emptyNotice) {
        emptyNotice.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilters();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }

    // Bookmark tip interaction
    container.querySelectorAll('.bookmark-tip-btn').forEach(btn => {
      const tipId = btn.getAttribute('data-tip-id');
      if (bookmarked.includes(tipId)) {
        btn.classList.add('active');
        btn.textContent = '★ Saved';
      }

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (bookmarked.includes(tipId)) {
          bookmarked = bookmarked.filter(id => id !== tipId);
          btn.classList.remove('active');
          btn.textContent = '☆ Save Tip';
          showToast('Tip removed from saved', '📑');
        } else {
          bookmarked.push(tipId);
          btn.classList.add('active');
          btn.textContent = '★ Saved';
          showToast('Tip saved to your notebook!', '📌');
        }
        setStored(STORAGE_KEYS.BOOKMARKED_TIPS, bookmarked);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 9. WASTE SORTING GAME ("WHERE SHOULD THIS WASTE GO?")
  // --------------------------------------------------------------------------
  function initWasteSorting() {
    const arena = document.getElementById('waste-sorting-game');
    if (!arena) return;

    const wasteItems = [
      { name: 'Plastic Beverage Bottle', icon: '🧴', category: 'recycle', hint: 'Made of PET plastic. Rinse and place here for recycling.' },
      { name: 'Banana Peel', icon: '🍌', category: 'bio', hint: 'Organic food scrap that breaks down naturally into nutrient-rich compost.' },
      { name: 'Old Smartphone', icon: '📱', category: 'ewaste', hint: 'Contains precious metals & toxic circuitry. Needs dedicated e-waste recycling.' },
      { name: 'Rechargeable AA Battery', icon: '🔋', category: 'hazard', hint: 'Contains heavy metals and corrosive chemicals. Never toss in trash.' },
      { name: 'Cardboard Delivery Box', icon: '📦', category: 'recycle', hint: 'Clean corrugated cardboard can be pulped and remade into new packaging.' },
      { name: 'Apple Core', icon: '🍎', category: 'bio', hint: 'Biodegradable fruit matter ideal for vermicomposting.' },
      { name: 'Burned Out Fluorescent Tube', icon: '💡', category: 'hazard', hint: 'Contains mercury vapor that poses serious health and environmental hazards.' },
      { name: 'Aluminum Soda Can', icon: '🥫', category: 'recycle', hint: 'Infinitely recyclable with 95% less energy than making new aluminum.' },
      { name: 'Broken Computer Keyboard', icon: '⌨️', category: 'ewaste', hint: 'Electronic component with plastic and copper circuit boards.' },
      { name: 'Dry Fallen Leaves', icon: '🍂', category: 'bio', hint: 'Brown organic matter essential for healthy garden compost carbon balance.' }
    ];

    let currentIndex = 0;
    let score = 0;
    let streak = 0;

    const iconEl = arena.querySelector('.waste-item-icon');
    const nameEl = arena.querySelector('.waste-item-name');
    const hintEl = arena.querySelector('.waste-item-hint');
    const feedbackBox = arena.querySelector('.waste-feedback-box');
    const scoreVal = document.getElementById('waste-score-val');
    const streakVal = document.getElementById('waste-streak-val');
    const progressText = document.getElementById('waste-progress-counter');

    function loadItem(index) {
      if (index >= wasteItems.length) {
        // Game complete
        arena.querySelector('.waste-item-display').innerHTML = `
          <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">🎉</div>
          <h3 style="font-size: 1.5rem; color: var(--forest-green); margin-bottom: 0.5rem;">Sorting Master!</h3>
          <p style="margin-bottom: 1rem;">You completed all items with a score of <strong>${score}/${wasteItems.length}</strong>.</p>
          <button id="restart-waste-btn" class="btn btn-primary btn-sm">Sort Again</button>
        `;
        addEcoPoints(30, 'Completed Waste Sorting Challenge');
        document.getElementById('restart-waste-btn')?.addEventListener('click', () => {
          location.reload();
        });
        feedbackBox.style.display = 'none';
        return;
      }

      const item = wasteItems[index];
      iconEl.textContent = item.icon;
      nameEl.textContent = item.name;
      hintEl.textContent = 'Select the appropriate bin below.';
      feedbackBox.className = 'waste-feedback-box';
      feedbackBox.style.display = 'none';

      if (progressText) progressText.textContent = `Item ${index + 1} of ${wasteItems.length}`;
      if (scoreVal) scoreVal.textContent = score;
      if (streakVal) streakVal.textContent = streak;
    }

    arena.querySelectorAll('.waste-bin-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentIndex >= wasteItems.length) return;

        const chosenBin = btn.getAttribute('data-bin');
        const currentItem = wasteItems[currentIndex];

        if (chosenBin === currentItem.category) {
          score++;
          streak++;
          feedbackBox.className = 'waste-feedback-box correct';
          feedbackBox.innerHTML = `✓ <strong>Correct!</strong> ${currentItem.hint}`;
          addEcoPoints(5, `Correctly sorted ${currentItem.name}`);
        } else {
          streak = 0;
          feedbackBox.className = 'waste-feedback-box incorrect';
          feedbackBox.innerHTML = `✗ <strong>Not quite!</strong> ${currentItem.name} belongs in the <strong>${getCategoryName(currentItem.category)}</strong> bin. ${currentItem.hint}`;
        }

        currentIndex++;
        setTimeout(() => {
          loadItem(currentIndex);
        }, 1800);
      });
    });

    function getCategoryName(cat) {
      switch (cat) {
        case 'bio': return 'Biodegradable (Green)';
        case 'recycle': return 'Recyclable (Blue)';
        case 'ewaste': return 'E-Waste (Yellow)';
        case 'hazard': return 'Hazardous Waste (Red)';
        default: return cat;
      }
    }

    loadItem(0);
  }

  // --------------------------------------------------------------------------
  // 10. WATER CONSERVATION CALCULATOR
  // --------------------------------------------------------------------------
  function initWaterCalculator() {
    const form = document.getElementById('water-calc-form');
    if (!form) return;

    const peopleInput = document.getElementById('water-people');
    const resultDaily = document.getElementById('water-saved-daily');
    const resultMonthly = document.getElementById('water-saved-monthly');
    const resultAnnual = document.getElementById('water-saved-annual');

    function calculateWater() {
      const people = Math.max(1, parseInt(peopleInput?.value || '1', 10));
      let litersPerPersonPerDay = 0;

      form.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
        litersPerPersonPerDay += parseInt(cb.getAttribute('data-liters') || '0', 10);
      });

      const totalDaily = people * litersPerPersonPerDay;
      const totalMonthly = totalDaily * 30;
      const totalAnnual = totalDaily * 365;

      if (resultDaily) resultDaily.textContent = totalDaily.toLocaleString();
      if (resultMonthly) resultMonthly.textContent = totalMonthly.toLocaleString();
      if (resultAnnual) resultAnnual.textContent = totalAnnual.toLocaleString();
    }

    form.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', calculateWater);
      input.addEventListener('change', calculateWater);
    });

    calculateWater();
  }

  // --------------------------------------------------------------------------
  // 11. ENERGY HABIT CHECKLIST & PROGRESS BAR
  // --------------------------------------------------------------------------
  function initEnergyChecklist() {
    const listContainer = document.getElementById('energy-checklist-container');
    if (!listContainer) return;

    let checkedItems = getStored(STORAGE_KEYS.ENERGY_CHECKLIST, []);
    const items = listContainer.querySelectorAll('.checklist-item');
    const progressFill = document.getElementById('energy-progress-fill');
    const progressText = document.getElementById('energy-progress-text');

    function updateEnergyProgress() {
      const total = items.length;
      const checked = checkedItems.length;
      const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;

      if (progressFill) progressFill.style.width = `${percentage}%`;
      if (progressText) progressText.textContent = `${percentage}%`;

      if (percentage === 100) {
        showToast('🏆 100% Green Energy Habits! You earned +50 points!', '⚡');
        addEcoPoints(50, 'Completed Energy Checklist');
      }
    }

    items.forEach(item => {
      const id = item.getAttribute('data-item-id');
      const checkbox = item.querySelector('input[type="checkbox"]');

      if (checkedItems.includes(id)) {
        if (checkbox) checkbox.checked = true;
        item.classList.add('checked');
      }

      item.addEventListener('click', (e) => {
        if (e.target !== checkbox && checkbox) {
          checkbox.checked = !checkbox.checked;
        }

        if (checkbox?.checked) {
          if (!checkedItems.includes(id)) checkedItems.push(id);
          item.classList.add('checked');
          addEcoPoints(5, 'Energy habit checked');
        } else {
          checkedItems = checkedItems.filter(x => x !== id);
          item.classList.remove('checked');
        }

        setStored(STORAGE_KEYS.ENERGY_CHECKLIST, checkedItems);
        updateEnergyProgress();
      });
    });

    updateEnergyProgress();
  }

  // --------------------------------------------------------------------------
  // 12. SUSTAINABLE TRAVEL COMPARISON CALCULATOR
  // --------------------------------------------------------------------------
  function initTravelCalculator() {
    const calc = document.getElementById('travel-calculator-arena');
    if (!calc) return;

    const distInput = document.getElementById('travel-distance');
    const modeSelect = document.getElementById('travel-mode');
    const impactRating = document.getElementById('travel-impact-rating');
    const barWalk = document.getElementById('bar-walk');
    const barBike = document.getElementById('bar-bike');
    const barTrain = document.getElementById('bar-train');
    const barBus = document.getElementById('bar-bus');
    const barEV = document.getElementById('bar-ev');
    const barCar = document.getElementById('bar-car');

    const EMISSION_FACTORS = {
      walk: 0,
      bike: 0,
      train: 35,
      bus: 68,
      ev: 50,
      car: 170
    };

    function recalculate() {
      const distance = parseFloat(distInput?.value || '10');
      const selected = modeSelect?.value || 'walk';

      // Predefined educational relative impact
      if (selected === 'walk' || selected === 'bike') {
        if (impactRating) {
          impactRating.textContent = 'Lower Impact (Zero Direct Emissions)';
          impactRating.className = 'calc-result-number impact-low';
        }
      } else if (selected === 'train' || selected === 'bus' || selected === 'ev') {
        if (impactRating) {
          impactRating.textContent = 'Moderate Impact (Clean Shared Mobility)';
          impactRating.className = 'calc-result-number impact-mid';
        }
      } else {
        if (impactRating) {
          impactRating.textContent = 'Higher Impact (High Fossil Intensity)';
          impactRating.className = 'calc-result-number impact-high';
        }
      }

      // Bar graph widths proportional to relative emission
      const maxCar = distance * EMISSION_FACTORS.car;
      if (barWalk) barWalk.style.width = '2%';
      if (barBike) barBike.style.width = '2%';
      if (barTrain) barTrain.style.width = `${Math.max(8, Math.round(((distance * EMISSION_FACTORS.train) / maxCar) * 100))}%`;
      if (barBus) barBus.style.width = `${Math.max(12, Math.round(((distance * EMISSION_FACTORS.bus) / maxCar) * 100))}%`;
      if (barEV) barEV.style.width = `${Math.max(10, Math.round(((distance * EMISSION_FACTORS.ev) / maxCar) * 100))}%`;
      if (barCar) barCar.style.width = '100%';
    }

    distInput?.addEventListener('input', recalculate);
    modeSelect?.addEventListener('change', recalculate);
    recalculate();
  }

  // --------------------------------------------------------------------------
  // 13. UPCYCLING GALLERY & MODAL
  // --------------------------------------------------------------------------
  function initUpcycling() {
    const container = document.querySelector('.upcycling-grid');
    const modal = document.getElementById('upcycling-modal');
    if (!container || !modal) return;

    // Filter Buttons
    const filterBtns = document.querySelectorAll('.upcycle-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        container.querySelectorAll('.upcycling-card').forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Modal Details Data
    const projectDetails = {
      'bottle-planter': {
        title: 'Self-Watering Plastic Bottle Planter',
        materials: ['Empty 2-liter PET soda bottle', 'Cotton cord or strip of old cloth', 'Potting soil & seeds/herbs', 'Craft scissors or utility blade'],
        steps: [
          'Carefully cut the plastic bottle in half horizontally about 4 inches below the neck.',
          'Poke a small hole in the bottle cap and thread the cotton cord through, leaving a wick trailing into the base.',
          'Invert the top half into the bottom half like a funnel.',
          'Fill the base with water (about 1-2 inches) so the wick is submerged.',
          'Fill the funnel with soil and plant basil, mint, or pothos seedlings. The wick draws moisture upwards automatically!'
        ],
        difficulty: 'Easy',
        time: '15 Minutes',
        reward: '+15 Eco Points'
      },
      'jar-organizer': {
        title: 'Kitchen Spice & Desk Glass Jar Organizer',
        materials: ['Clean empty glass jars with lids (jam, pasta sauce)', 'Chalkboard paint or paper labels', 'Twine or hemp string for rustic trim', 'Chalk or waterproof pen'],
        steps: [
          'Soak jars in warm soapy water with a spoonful of baking soda to strip adhesive labels completely.',
          'Dry thoroughly and paint a neat rectangular label window on the front using chalkboard paint.',
          'Wrap natural twine neatly around the neck for an earthy aesthetic.',
          'Fill with dried oregano, lentils, paper clips, or paint brushes and write the contents in chalk.'
        ],
        difficulty: 'Easy',
        time: '20 Minutes',
        reward: '+15 Eco Points'
      },
      'tshirt-bag': {
        title: 'No-Sew T-Shirt Produce & Grocery Bag',
        materials: ['Old 100% cotton crew-neck T-shirt', 'Fabric shears or sharp scissors', 'Ruler or measuring tape'],
        steps: [
          'Lay the T-shirt flat on a table and smooth out any wrinkles.',
          'Cut off the neck collar in a scoop shape (this creates the bag opening).',
          'Cut off both sleeves (these become your durable tote handles).',
          'Turn shirt inside out and cut 1-inch wide vertical fringe strips along the entire bottom hem (approx 3 inches deep).',
          'Tie matching pairs of front and back fringe securely into tight double knots. Flip right-side out and test your ultra-strong bag!'
        ],
        difficulty: 'Medium',
        time: '25 Minutes',
        reward: '+25 Eco Points'
      },
      'cardboard-organizer': {
        title: 'Cardboard Desk Cable & Stationery Caddy',
        materials: ['Empty shoe box or delivery carton', 'Toilet paper or paper towel rolls (4-6)', 'Old gift wrap or craft paper', 'Glue stick or non-toxic white glue'],
        steps: [
          'Trim down the shoe box height to approximately 4 inches.',
          'Cover the exterior neatly with recycled decorative paper or paint with leftover water-based colors.',
          'Arrange toilet roll tubes standing vertically inside the box like cellular compartments.',
          'Glue tubes together and against the box walls.',
          'Roll up USB chargers, earbuds, pens, and scissors into individual tubes to banish desk clutter forever.'
        ],
        difficulty: 'Easy',
        time: '20 Minutes',
        reward: '+15 Eco Points'
      },
      'newspaper-seedlings': {
        title: 'Biodegradable Newspaper Seedling Pots',
        materials: ['Old newspapers (black & white non-glossy sheets)', 'Small drinking glass or can as a cylindrical mold', 'Vegetable or wildflower seeds', 'Potting mix'],
        steps: [
          'Fold a double sheet of newspaper into a long strip about 5 inches wide.',
          'Roll the strip snugly around the glass cylinder, leaving 2 inches extending past the bottom.',
          'Fold the extending paper down tightly against the base of the glass to form a flat cup bottom.',
          'Slide the glass out and press the bottom flat inside.',
          'Fill with moist soil, press in seeds, and plant the ENTIRE biodegradable pot straight into the garden bed once sprouts develop!'
        ],
        difficulty: 'Easy',
        time: '10 Minutes',
        reward: '+10 Eco Points'
      }
    };

    const modalTitle = document.getElementById('modal-project-title');
    const modalDiff = document.getElementById('modal-project-difficulty');
    const modalTime = document.getElementById('modal-project-time');
    const modalMaterials = document.getElementById('modal-project-materials');
    const modalSteps = document.getElementById('modal-project-steps');
    const closeBtn = modal.querySelector('.modal-close-btn');

    container.querySelectorAll('.upcycling-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-project-id');
        const proj = projectDetails[id];
        if (!proj) return;

        if (modalTitle) modalTitle.textContent = proj.title;
        if (modalDiff) modalDiff.textContent = proj.difficulty;
        if (modalTime) modalTime.textContent = proj.time;

        if (modalMaterials) {
          modalMaterials.innerHTML = proj.materials.map(m => `<li>${m}</li>`).join('');
        }
        if (modalSteps) {
          modalSteps.innerHTML = proj.steps.map(s => `<li>${s}</li>`).join('');
        }

        modal.classList.add('open');
      });
    });

    closeBtn?.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') modal.classList.remove('open');
    });
  }

  // --------------------------------------------------------------------------
  // 14. ECO IMPACT CALCULATOR (0 - 100 SCORE)
  // --------------------------------------------------------------------------
  function initEcoCalculator() {
    const calcForm = document.getElementById('eco-impact-form');
    if (!calcForm) return;

    const resultBox = document.getElementById('calc-results-section');
    const scoreNumber = document.getElementById('calc-score-display');
    const scoreTier = document.getElementById('calc-score-tier');
    const scoreDesc = document.getElementById('calc-score-desc');
    const circleRing = document.getElementById('calc-circle-fill');

    calcForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let totalScore = 0;
      const questions = ['q_travel', 'q_public', 'q_reusable', 'q_recycle', 'q_food'];

      questions.forEach(q => {
        const selected = calcForm.querySelector(`input[name="${q}"]:checked`);
        if (selected) {
          totalScore += parseInt(selected.value, 10);
        }
      });

      // Total possible points is 100 (5 questions * 20 points max each)
      totalScore = Math.min(100, Math.max(0, totalScore));
      setStored(STORAGE_KEYS.CALC_SCORE, totalScore);

      if (scoreNumber) scoreNumber.textContent = totalScore;

      let tier = '';
      let desc = '';

      if (totalScore <= 30) {
        tier = 'Start Your Green Journey';
        desc = 'You are taking your first steps toward eco-consciousness. Focus on carrying a reusable water bottle and turning off appliances when leaving the room.';
      } else if (totalScore <= 60) {
        tier = 'Growing Green Habits';
        desc = 'Great progress! You practice several mindful habits. Try stepping up by adopting a meatless weekday or starting home food waste composting.';
      } else if (totalScore <= 80) {
        tier = 'Eco Conscious';
        desc = 'Impressive sustainability mindset! Your daily actions significantly reduce your environmental footprint. Keep inspiring classmates and friends!';
      } else {
        tier = 'Green Lifestyle Champion';
        desc = 'Outstanding dedication to the planet! You live with profound ecological care across commuting, zero-waste habits, and conscious consumption.';
      }

      if (scoreTier) scoreTier.textContent = tier;
      if (scoreDesc) scoreDesc.textContent = desc;

      if (circleRing) {
        const radius = 54;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (totalScore / 100) * circumference;
        circleRing.style.strokeDashoffset = offset;
      }

      if (resultBox) {
        resultBox.style.display = 'block';
        resultBox.scrollIntoView({ behavior: 'smooth' });
      }

      addEcoPoints(25, 'Completed Eco Impact Evaluation');
    });
  }

  // --------------------------------------------------------------------------
  // 15. ECO QUIZ (10 QUESTIONS)
  // --------------------------------------------------------------------------
  function initEcoQuiz() {
    const quizWrapper = document.getElementById('eco-quiz-wrapper');
    if (!quizWrapper) return;

    const questions = [
      {
        q: 'What is the first and most impactful step in the 3R waste hierarchy?',
        options: ['Recycle', 'Reduce', 'Replace', 'Remove'],
        answer: 1,
        explanation: 'Reducing consumption at the source prevents waste from ever being manufactured, transported, or discarded in the first place.'
      },
      {
        q: 'Approximately what percentage of the Earth’s surface water is fresh and accessible for human use?',
        options: ['Less than 1%', 'About 10%', 'Around 25%', 'Over 50%'],
        answer: 0,
        explanation: 'While water covers 71% of Earth, 97% is saline ocean water and over 2% is locked in glaciers. Less than 1% is accessible freshwater.'
      },
      {
        q: 'Which daily household action typically saves the highest volume of clean tap water?',
        options: ['Washing dishes by hand with running tap', 'Taking a 5-minute shower instead of a full tub bath', 'Watering lawns at noon in full sun', 'Rinsing vegetables with the tap on full blast'],
        answer: 1,
        explanation: 'A full bathtub requires 150–200 liters, whereas a 5-minute aerated shower uses only 40–50 liters, conserving over 100 liters every single wash!'
      },
      {
        q: 'What is "Phantom Load" or "Vampire Power" in electricity conservation?',
        options: ['Electricity stolen by broken meters', 'Power consumed by devices on standby while plugged in', 'Static electricity built up during dry weather', 'Solar panels discharging power during the night'],
        answer: 1,
        explanation: 'Appliances, phone chargers, and televisions left plugged in draw standby power 24/7, accounting for up to 10% of household electric bills.'
      },
      {
        q: 'Which mode of passenger transportation produces the least carbon emissions per kilometer?',
        options: ['Single-passenger petrol car', 'Commercial domestic flight', 'Bicycle or walking', 'Diesel city bus'],
        answer: 2,
        explanation: 'Active mobility like walking and cycling generates zero direct tailpipe emissions and promotes personal physical health!'
      },
      {
        q: 'Why is composting food waste significantly better than sending it to an ordinary landfill?',
        options: ['It makes landfills look cleaner', 'In landfills, organic waste decomposes anaerobically and produces potent methane gas', 'Composting eliminates all soil insects', 'Landfills cannot physically hold banana peels'],
        answer: 1,
        explanation: 'Without oxygen in buried landfills, organic food decomposes into methane—a greenhouse gas 28 times more potent than carbon dioxide.'
      },
      {
        q: 'How long can a single-use plastic water bottle take to decompose in nature?',
        options: ['5 to 10 years', '20 to 30 years', 'Up to 450 years or longer', '1,000 days'],
        answer: 2,
        explanation: 'PET petroleum plastics never truly biodegrade naturally; they slowly fragment into microscopic plastic particles over 400+ years.'
      },
      {
        q: 'What is an important benefit of choosing locally grown and seasonal food?',
        options: ['It has zero nutritional value', 'It minimizes "food miles" and refrigerated long-haul transport fuel', 'It guarantees food is made of plastic', 'It increases import customs taxes'],
        answer: 1,
        explanation: 'Local seasonal food avoids energy-intensive air freight and cross-continent cold chain refrigeration, supporting local farmers.'
      },
      {
        q: 'What constitutes E-Waste (Electronic Waste)?',
        options: ['Only desktop computers', 'Any discarded electrical equipment, cables, phones, batteries, and appliances', 'Organic fruit scraps', 'Old paper notebooks'],
        answer: 1,
        explanation: 'E-waste encompasses all discarded electronics containing circuit boards, chips, toxic heavy metals (lead, cadmium) and recoverable gold.'
      },
      {
        q: 'What is the primary objective of "Upcycling"?',
        options: ['Burning trash for fuel', 'Transforming unwanted materials into new products of higher quality or artistic value', 'Burying waste deeper in soil', 'Selling raw plastic at wholesale'],
        answer: 1,
        explanation: 'Upcycling (creative reuse) gives old items renewed utility and aesthetic value without consuming energy to melt or pulp them down.'
      }
    ];

    let currentQ = 0;
    let selectedAnswers = new Array(questions.length).fill(null);

    const questionText = document.getElementById('quiz-q-text');
    const optionsContainer = document.getElementById('quiz-options-box');
    const counterText = document.getElementById('quiz-counter');
    const progressBar = document.getElementById('quiz-progress-bar');
    const prevBtn = document.getElementById('quiz-prev-btn');
    const nextBtn = document.getElementById('quiz-next-btn');
    const resultsContainer = document.getElementById('quiz-results-container');
    const quizCard = document.getElementById('quiz-active-card');

    function renderQuestion() {
      const qData = questions[currentQ];
      if (counterText) counterText.textContent = `Question ${currentQ + 1} of ${questions.length}`;
      if (progressBar) progressBar.style.width = `${((currentQ + 1) / questions.length) * 100}%`;
      if (questionText) questionText.textContent = qData.q;

      if (optionsContainer) {
        optionsContainer.innerHTML = '';
        qData.options.forEach((opt, idx) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'quiz-option-btn';
          if (selectedAnswers[currentQ] === idx) {
            btn.classList.add('selected');
          }

          const letter = String.fromCharCode(65 + idx);
          btn.innerHTML = `<span class="quiz-option-indicator">${letter}</span> <span>${opt}</span>`;

          btn.addEventListener('click', () => {
            selectedAnswers[currentQ] = idx;
            optionsContainer.querySelectorAll('.quiz-option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            if (nextBtn) nextBtn.disabled = false;
          });

          optionsContainer.appendChild(btn);
        });
      }

      if (prevBtn) prevBtn.disabled = currentQ === 0;
      if (nextBtn) {
        nextBtn.textContent = currentQ === questions.length - 1 ? 'Finish Quiz' : 'Next Question →';
      }
    }

    prevBtn?.addEventListener('click', () => {
      if (currentQ > 0) {
        currentQ--;
        renderQuestion();
      }
    });

    nextBtn?.addEventListener('click', () => {
      if (selectedAnswers[currentQ] === null) {
        showToast('Please pick an answer to proceed!', '⚠️');
        return;
      }

      if (currentQ < questions.length - 1) {
        currentQ++;
        renderQuestion();
      } else {
        finishQuiz();
      }
    });

    function finishQuiz() {
      let score = 0;
      questions.forEach((q, i) => {
        if (selectedAnswers[i] === q.answer) score++;
      });

      setStored(STORAGE_KEYS.QUIZ_HIGHSCORE, score);

      if (quizCard) quizCard.style.display = 'none';
      if (resultsContainer) {
        resultsContainer.style.display = 'block';
        const scoreVal = document.getElementById('final-quiz-score');
        const feedback = document.getElementById('quiz-feedback-text');
        if (scoreVal) scoreVal.textContent = `${score} / ${questions.length}`;

        let message = '';
        if (score >= 9) message = '🌟 Outstanding! You possess encyclopedic environmental knowledge.';
        else if (score >= 6) message = '🌿 Great job! You have strong sustainability awareness.';
        else message = '🌱 Good effort! Review our Eco Tips to boost your green habits.';

        if (feedback) feedback.textContent = message;

        addEcoPoints(score * 5, `Completed Eco Quiz (${score}/10)`);
      }
    }

    document.getElementById('restart-quiz-btn')?.addEventListener('click', () => {
      currentQ = 0;
      selectedAnswers = new Array(questions.length).fill(null);
      if (resultsContainer) resultsContainer.style.display = 'none';
      if (quizCard) quizCard.style.display = 'block';
      renderQuestion();
    });

    renderQuestion();
  }

  // --------------------------------------------------------------------------
  // 16. LEADERBOARD SYSTEM (INTEGRATING USER POINTS & BADGES)
  // --------------------------------------------------------------------------
  function initLeaderboard() {
    const tableBody = document.getElementById('leaderboard-tbody');
    if (!tableBody) return;

    let username = getStored(STORAGE_KEYS.USERNAME, 'Eco Explorer (You)');
    const nameInput = document.getElementById('user-nickname-input');
    const saveNameBtn = document.getElementById('save-nickname-btn');

    if (nameInput) nameInput.value = username;

    saveNameBtn?.addEventListener('click', () => {
      const val = nameInput.value.trim();
      if (val) {
        username = val;
        setStored(STORAGE_KEYS.USERNAME, username);
        renderLeaderboardRows();
        showToast('Nickname updated!', '🌱');
      }
    });

    const staticCommunity = [
      { name: 'Aria Chen', points: 980, badge: 'Green Warrior', avatar: '🌿' },
      { name: 'Marcus Miller', points: 850, badge: 'Eco Explorer', avatar: '💧' },
      { name: 'Sofia Rodriguez', points: 760, badge: 'Planet Protector', avatar: '🚲' },
      { name: 'Kiran Patel', points: 680, badge: 'Nature Hero', avatar: '⚡' },
      { name: 'Liam Davies', points: 520, badge: 'Green Starter', avatar: '🍃' },
      { name: 'Chloe Dubois', points: 410, badge: 'Habit Builder', avatar: '🌻' }
    ];

    function renderLeaderboardRows() {
      // Merge current user dynamically
      const userItem = {
        name: `${username}`,
        points: currentPoints,
        badge: getEarnedBadge(currentPoints),
        avatar: '🌱',
        isUser: true
      };

      const fullList = [...staticCommunity, userItem].sort((a, b) => b.points - a.points);

      tableBody.innerHTML = '';
      fullList.forEach((entry, idx) => {
        const row = document.createElement('div');
        row.className = `leaderboard-row ${entry.isUser ? 'current-user-row' : ''}`;
        row.innerHTML = `
          <div class="leader-rank">${idx + 1}</div>
          <div class="leader-avatar">${entry.avatar}</div>
          <div class="leader-info">
            <div class="leader-name">${entry.name} ${entry.isUser ? '<span style="font-size:0.75rem; color:var(--leaf-green); font-weight:700;">(You)</span>' : ''}</div>
            <div class="leader-badge-pill">${entry.badge}</div>
          </div>
          <div class="leader-points">${entry.points} pts</div>
        `;
        tableBody.appendChild(row);
      });
    }

    function getEarnedBadge(pts) {
      if (pts >= 900) return 'Legendary Earth Guardian';
      if (pts >= 600) return 'Green Lifestyle Champion';
      if (pts >= 350) return 'Eco Conscious Habit Maker';
      if (pts >= 150) return 'Active Planet Protector';
      return 'Green Habit Starter';
    }

    renderLeaderboardRows();
  }

  // --------------------------------------------------------------------------
  // 17. CONTACT FORM VALIDATION
  // --------------------------------------------------------------------------
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const successBanner = document.getElementById('contact-success-msg');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let valid = true;
      const name = document.getElementById('contact-name');
      const email = document.getElementById('contact-email');
      const subject = document.getElementById('contact-subject');
      const message = document.getElementById('contact-message');

      [name, email, subject, message].forEach(field => {
        if (!field) return;
        if (!field.value.trim()) {
          field.classList.add('invalid');
          valid = false;
        } else {
          field.classList.remove('invalid');
        }
      });

      // Email format check
      if (email && email.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
          email.classList.add('invalid');
          valid = false;
        }
      }

      if (valid) {
        if (successBanner) {
          successBanner.style.display = 'block';
          successBanner.scrollIntoView({ behavior: 'smooth' });
        }
        form.reset();
        showToast('Message sent successfully!', '✉️');
        addEcoPoints(10, 'Contacted EcoQuest team');
      }
    });

    // Remove red borders as user types
    form.querySelectorAll('.form-control').forEach(ctrl => {
      ctrl.addEventListener('input', () => ctrl.classList.remove('invalid'));
    });
  }

  // --------------------------------------------------------------------------
  // 18. INITIALIZE EVERYTHING ON DOM READY
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updatePointsUI();
    initNavigation();
    initScrollTop();
    initChallenges();
    initEcoTips();
    initWasteSorting();
    initWaterCalculator();
    initEnergyChecklist();
    initTravelCalculator();
    initUpcycling();
    initEcoCalculator();
    initEcoQuiz();
    initLeaderboard();
    initContactForm();
  });

})();
