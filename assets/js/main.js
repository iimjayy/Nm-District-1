/* ═══════════════════════════════════════════════════════════════
   NM DISTRICT v3.0 — WORLD-CLASS INTERACTION ENGINE
   ═══════════════════════════════════════════════════════════════ */

(() => {
  const data = window.NMData;
  if (!data) {
    console.error('NMData not found — data.js not loaded');
    return;
  }

  /* ─── STORAGE KEYS ─── */
  const THEME_KEY     = 'nm-theme-v3';
  const SAVED_KEY     = 'nm-saved-v3';
  const RECENT_KEY    = 'nm-recent-v3';
  const USER_KEY      = 'nm-user-v3';
  const BOOKINGS_KEY  = 'nm-bookings-v3';

  /* ─── STATE ─── */
  let lenis       = null;
  let cursorDot   = null;
  let cursorRing  = null;
  let toastQueue  = [];
  let toastActive = false;
  let scrollY     = 0;

  /* ═══════════════════════════════════════
     UTILITY: SAFE DATA ACCESS (NO NaN/Invalid Date)
     ═══════════════════════════════════════ */

  const isValidDate = (d) => d && !isNaN(new Date(d).getTime());
  const isValidNum  = (n) => n !== undefined && n !== null && !isNaN(Number(n));

  const safeFormatDate = (dateStr, opts = {}) => {
    if (!isValidDate(dateStr)) return 'TBA';
    const options = { day: 'numeric', month: 'short', year: 'numeric', ...opts };
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', options);
    } catch {
      return 'TBA';
    }
  };

  const safeFormatDateTime = (dateStr, opts = {}) => {
    if (!isValidDate(dateStr)) return 'TBA';
    const options = {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', ...opts
    };
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', options);
    } catch {
      return 'TBA';
    }
  };

  const safeFormatCurrency = (amount) => {
    if (!isValidNum(amount)) return 'Free';
    const n = Number(amount);
    if (n === 0) return 'Free';
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', minimumFractionDigits: 0
      }).format(n);
    } catch {
      return '₹' + n;
    }
  };

  const safeGetPrice = (event) => {
    if (!event?.tiers || !Array.isArray(event.tiers) || event.tiers.length === 0) {
      return 'Free';
    }
    const first = event.tiers[0];
    if (!first || !isValidNum(first.price)) return 'Free';
    return safeFormatCurrency(first.price);
  };

  const getEventTag = (event) => {
    const now = new Date();
    const eventDate = new Date(event?.date);
    if (!isValidDate(event?.date)) return '';
    
    // Check if event is today
    const isToday = eventDate.toDateString() === now.toDateString();
    if (isToday) return `<span class="tag tag--live">Live Now</span>`;
    
    // Check if almost full
    const totalSeats = event.tiers?.reduce((sum, t) => sum + (t.seats || 0), 0) || 0;
    const remaining = event.tiers?.reduce((sum, t) => sum + (t.seatsLeft || 0), 0) || 0;
    if (totalSeats > 0 && remaining / totalSeats < 0.2) {
      return `<span class="tag tag--almost-full">Almost Full</span>`;
    }
    
    // Check if hot (high interest)
    if (event.interested > 1000) {
      return `<span class="tag tag--hot">🔥 Trending</span>`;
    }
    
    // Check if free
    const price = event.tiers?.[0]?.price;
    if (price === 0 || price === undefined) {
      return `<span class="tag tag--free">Free Entry</span>`;
    }
    
    return '';
  };

  /* ═══════════════════════════════════════
     PERSONALIZATION ENGINE
     ═══════════════════════════════════════ */

  const getUserProfile = () => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || '{}');
    } catch { return {}; }
  };

  const getRecentEvents = () => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    } catch { return []; }
  };

  const addRecentEvent = (eventId) => {
    const recent = getRecentEvents();
    const updated = [eventId, ...recent.filter(id => id !== eventId)].slice(0, 20);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const getRecommendedEvents = () => {
    const recent = getRecentEvents();
    const saved = getSavedEvents();
    const recentCategories = recent
      .map(id => data.events.find(e => e.id === id)?.category)
      .filter(Boolean);
    
    // Score events by relevance
    return data.events
      .map(event => {
        let score = 0;
        if (saved.includes(event.id)) score -= 100; // Don't recommend saved
        if (recent.includes(event.id)) score -= 50;
        
        // Boost by category match
        if (recentCategories.includes(event.category)) score += 10;
        
        // Boost by trending
        score += (event.interested || 0) / 100;
        
        // Boost featured
        if (event.featured) score += 5;
        
        return { event, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(e => e.event);
  };

  const getSmartGreeting = () => {
    const hour = new Date().getHours();
    const user = getUserProfile();
    const name = user.name || 'there';
    
    if (hour < 6)  return `Still up, ${name}? 🌙`;
    if (hour < 12) return `Good morning, ${name} ☀️`;
    if (hour < 17) return `Good afternoon, ${name} 👋`;
    if (hour < 21) return `Good evening, ${name} 🌆`;
    return `Night owl, ${name}? 🦉`;
  };

  /* ═══════════════════════════════════════
     SAVED EVENTS
     ═══════════════════════════════════════ */

  const getSavedEvents = () => {
    try {
      return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
    } catch { return []; }
  };

  const setSavedEvents = (events) => {
    localStorage.setItem(SAVED_KEY, JSON.stringify(events));
    window.dispatchEvent(new CustomEvent('nm:saved-updated', { detail: events }));
  };

  const isSaved = (eventId) => getSavedEvents().includes(eventId);

  const toggleSaved = (eventId) => {
    const saved = new Set(getSavedEvents());
    const wasSaved = saved.has(eventId);
    
    if (wasSaved) {
      saved.delete(eventId);
      pushToast('Event removed from saved', 'neutral');
    } else {
      saved.add(eventId);
      pushToast('Event saved! 💜', 'success');
    }
    
    setSavedEvents(Array.from(saved));
    return !wasSaved;
  };

  /* ═══════════════════════════════════════
     TOAST SYSTEM — PREMIUM
     ═══════════════════════════════════════ */

  const pushToast = (message, type = 'neutral', duration = 3000) => {
    toastQueue.push({ message, type, duration });
    if (!toastActive) showNextToast();
  };

  const showNextToast = () => {
    if (toastQueue.length === 0) {
      toastActive = false;
      return;
    }
    
    toastActive = true;
    const { message, type, duration } = toastQueue.shift();
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const icons = {
      success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
      error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
      neutral: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
    };
    
    const iconClass = type === 'success' ? 'toast__icon--success' : type === 'error' ? 'toast__icon--error' : '';
    
    toast.innerHTML = `
      <div class="toast__icon ${iconClass}">${icons[type] || icons.neutral}</div>
      <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => toast.classList.add('show'));
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
        showNextToast();
      }, 400);
    }, duration);
  };

  /* ═══════════════════════════════════════
     CURSOR — REFINED WITH HOVER STATES
     ═══════════════════════════════════════ */

  const initCursor = () => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    cursorDot = document.getElementById('cursor-dot');
    cursorRing = document.getElementById('cursor-ring');
    if (!cursorDot || !cursorRing) return;
    
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });
    
    // Detect hover on interactive elements
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('a, button, .event-card, [data-tilt]');
      if (target) {
        cursorRing.classList.add('hovering');
        cursorRing.style.width = '48px';
        cursorRing.style.height = '48px';
      }
    }, { passive: true });
    
    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('a, button, .event-card, [data-tilt]');
      if (target) {
        cursorRing.classList.remove('hovering');
        cursorRing.style.width = '32px';
        cursorRing.style.height = '32px';
      }
    }, { passive: true });
    
    const animate = () => {
      dotX += (mouseX - dotX - 3) * 0.15;
      dotY += (mouseY - dotY - 3) * 0.15;
      ringX += (mouseX - ringX) * 0.08;
      ringY += (mouseY - ringY) * 0.08;
      
      cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
      cursorRing.style.transform = `translate3d(${ringX - (parseInt(cursorRing.style.width) || 32)/2}px, ${ringY - (parseInt(cursorRing.style.height) || 32)/2}px, 0)`;
      
      requestAnimationFrame(animate);
    };
    
    animate();
  };

  /* ═══════════════════════════════════════
     NAVBAR — SCROLL EFFECTS
     ═══════════════════════════════════════ */

  const initNavbar = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          navbar.classList.toggle('scrolled', y > 50);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  };

  /* ═══════════════════════════════════════
     THEME — WITH TRANSITION
     ═══════════════════════════════════════ */

  const initTheme = () => {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;
    
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
    
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      
      document.documentElement.style.transition = 'none';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(THEME_KEY, next);
      updateThemeIcon(next);
      
      // Re-apply transition after a tick
      requestAnimationFrame(() => {
        document.documentElement.style.transition = '';
      });
    });
  };

  const updateThemeIcon = (theme) => {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;
    
    const sun = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
    const moon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    
    toggle.innerHTML = theme === 'dark' ? sun : moon;
  };

  /* ═══════════════════════════════════════
     NAVIGATION ACTIVE STATE
     ═══════════════════════════════════════ */

  const initNavigation = () => {
    const links = document.querySelectorAll('[data-nav-link]');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && currentPage.includes(href.replace('./', ''))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  /* ═══════════════════════════════════════
     SCROLL REVEAL — INTERSECTION OBSERVER
     ═══════════════════════════════════════ */

  const initRevealAnimations = () => {
    const reveals = document.querySelectorAll('[data-reveal], [data-stagger]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Trigger counter animations if any
          entry.target.querySelectorAll('[data-counter]').forEach(triggerCounter);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -50px 0px'
    });
    
    reveals.forEach(el => observer.observe(el));
  };

  /* ═══════════════════════════════════════
     RIPPLE EFFECT
     ═══════════════════════════════════════ */

  const initRipples = () => {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-ripple');
      if (!btn) return;
      
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple__effect';
      
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  };

  /* ═══════════════════════════════════════
     COUNTER ANIMATION
     ═══════════════════════════════════════ */

  const triggerCounter = (el) => {
    if (el.dataset.counted) return;
    el.dataset.counted = 'true';
    
    const target = parseInt(el.dataset.counter, 10);
    const suffix = el.dataset.suffix || '';
    if (!isValidNum(target)) return;
    
    let current = 0;
    const duration = 1500;
    const startTime = performance.now();
    
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    
    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOut(progress);
      
      current = Math.floor(eased * target);
      el.textContent = current.toLocaleString() + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    };
    
    requestAnimationFrame(update);
  };

  /* ═══════════════════════════════════════
     COMMAND PALETTE
     ═══════════════════════════════════════ */

  const initCommandPalette = () => {
    const palette = document.getElementById('cmd-palette');
    const input = document.getElementById('cmd-input');
    const results = document.getElementById('cmd-results');
    const trigger = document.querySelector('.cmd-trigger');
    
    if (!palette || !input) return;
    
    const openPalette = () => {
      palette.classList.add('active');
      input.focus();
      renderResults('');
    };
    
    const closePalette = () => {
      palette.classList.remove('active');
      input.value = '';
    };
    
    // Open on click
    trigger?.addEventListener('click', openPalette);
    
    // Open on Cmd+K / Ctrl+K
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openPalette();
      }
      if (e.key === 'Escape' && palette.classList.contains('active')) {
        closePalette();
      }
    });
    
    // Close on backdrop click
    palette.addEventListener('click', (e) => {
      if (e.target === palette) closePalette();
    });
    
    // Search
    input.addEventListener('input', (e) => renderResults(e.target.value));
    
    function renderResults(query) {
      const q = query.toLowerCase().trim();
      
      const items = [
        { type: 'page', title: 'Home', subtitle: 'Discover events and clubs', icon: '🏠', url: 'index.html' },
        { type: 'page', title: 'Explore Events', subtitle: 'Browse all campus events', icon: '🔍', url: 'explore.html' },
        { type: 'page', title: 'My Dashboard', subtitle: 'Tickets, saved events, rewards', icon: '📊', url: 'dashboard.html' },
        { type: 'page', title: 'Clubs Directory', subtitle: 'Explore student clubs', icon: '🏛️', url: 'clubs.html' },
        ...data.events.slice(0, 6).map(e => ({
          type: 'event',
          title: e.title,
          subtitle: `${e.category} • ${safeFormatDate(e.date)}`,
          icon: '🎫',
          url: `event.html?id=${e.id}`
        })),
        ...data.clubs.slice(0, 4).map(c => ({
          type: 'club',
          title: c.name,
          subtitle: `${c.category} • ${c.members?.toLocaleString() || 0} members`,
          icon: '🏛️',
          url: `club.html?id=${c.id}`
        }))
      ];
      
      const filtered = q
        ? items.filter(item => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q))
        : items;
      
      const sections = {
        page: filtered.filter(i => i.type === 'page'),
        event: filtered.filter(i => i.type === 'event'),
        club: filtered.filter(i => i.type === 'club')
      };
      
      const sectionNames = { page: 'Pages', event: 'Events', club: 'Clubs' };
      
      results.innerHTML = Object.entries(sections)
        .filter(([_, items]) => items.length > 0)
        .map(([type, items]) => `
          <div class="cmd-palette__section">
            <div class="cmd-palette__section-title">${sectionNames[type]}</div>
            ${items.map(item => `
              <a class="cmd-palette__item" href="${item.url}" data-cmd-item>
                <div class="cmd-palette__item-icon">${item.icon}</div>
                <div class="cmd-palette__item-text">
                  <div class="cmd-palette__item-title">${highlightMatch(item.title, q)}</div>
                  <div class="cmd-palette__item-subtitle">${item.subtitle}</div>
                </div>
              </a>
            `).join('')}
          </div>
        `).join('');
      
      // Navigate with Enter on first result
      if (q && results.querySelector('.cmd-palette__item')) {
        results.querySelector('.cmd-palette__item').classList.add('active');
      }
    }
    
    function highlightMatch(text, query) {
      if (!query) return text;
      const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
      return text.replace(regex, '<mark style="background: var(--violet-500); color: white; border-radius: 2px; padding: 0 2px;">$1</mark>');
    }
    
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    // Keyboard navigation
    input.addEventListener('keydown', (e) => {
      const items = results.querySelectorAll('.cmd-palette__item');
      const active = results.querySelector('.cmd-palette__item.active');
      let index = active ? Array.from(items).indexOf(active) : -1;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        index = (index + 1) % items.length;
        items.forEach(i => i.classList.remove('active'));
        items[index]?.classList.add('active');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        index = index <= 0 ? items.length - 1 : index - 1;
        items.forEach(i => i.classList.remove('active'));
        items[index]?.classList.add('active');
      } else if (e.key === 'Enter') {
        const active = results.querySelector('.cmd-palette__item.active');
        if (active) {
          active.click();
          closePalette();
        }
      }
    });
    
    // Click on results
    results.addEventListener('click', (e) => {
      const item = e.target.closest('[data-cmd-item]');
      if (item) closePalette();
    });
  };

  /* ═══════════════════════════════════════
     SKELETON LOADER
     ═══════════════════════════════════════ */

  const showSkeleton = (container, count = 3) => {
    container.innerHTML = Array.from({ length: count }, () => `
      <div class="skeleton-card">
        <div class="skeleton skeleton-card__image"></div>
        <div class="skeleton-card__content">
          <div class="skeleton skeleton-card__title"></div>
          <div class="skeleton skeleton-card__meta" style="width: 60%"></div>
        </div>
      </div>
    `).join('');
  };

  /* ═══════════════════════════════════════
     EVENT CARD CREATION — PREMIUM
     ═══════════════════════════════════════ */

  const createEventCard = (event) => {
    const saved = isSaved(event.id);
    const price = safeGetPrice(event);
    const tag = getEventTag(event);
    
    return `
      <div class="event-card" data-event-id="${event.id}" data-tilt>
        <div class="event-card__image-wrap">
          <img src="${event.image}" alt="${event.title}" loading="lazy" onerror="this.parentElement.style.background='linear-gradient(135deg, var(--surface-2), var(--surface-3))'; this.style.display='none';">
          ${tag ? `<div style="position: absolute; top: 12px; left: 12px; z-index: 2;">${tag}</div>` : ''}
          <button class="event-card__save ${saved ? 'saved' : ''}" data-save-event="${event.id}" aria-label="${saved ? 'Remove from saved' : 'Save event'}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${saved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>
        <div class="event-card__content">
          <div class="event-card__category">${event.category}</div>
          <h3 class="event-card__title">${event.title}</h3>
          <p class="event-card__date">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: text-bottom; margin-right: 4px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${safeFormatDate(event.date)}
          </p>
          <p class="event-card__venue">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: text-bottom; margin-right: 4px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${event.venue || 'TBA'}
          </p>
          <div class="event-card__footer">
            <span class="event-card__price">${price}</span>
            <span class="event-card__interested">${(event.interested || 0).toLocaleString()} interested</span>
          </div>
        </div>
        <a href="event.html?id=${event.id}" class="event-card__link" aria-label="View ${event.title}"></a>
      </div>
    `;
  };

  /* ═══════════════════════════════════════
     HOMEPAGE POPULATION
     ═══════════════════════════════════════ */

  const populateHomepage = () => {
    // Featured events
    const eventGrid = document.querySelector('.event-grid');
    if (eventGrid) {
      const featured = data.events
        .filter(e => e.featured)
        .slice(0, 6);
      
      if (featured.length > 0) {
        eventGrid.innerHTML = featured.map(createEventCard).join('');
      }
    }
    
    // Recommended for you (if user has history)
    const recommendedGrid = document.querySelector('.recommended-grid');
    if (recommendedGrid) {
      const recommended = getRecommendedEvents();
      if (recommended.length > 0) {
        recommendedGrid.innerHTML = recommended.map(createEventCard).join('');
        const section = recommendedGrid.closest('[data-section="recommended"]');
        if (section) section.classList.remove('hidden');
      }
    }
    
    // Categories
    const categoryGrid = document.querySelector('.category-grid');
    if (categoryGrid) {
      const categories = [
        { icon: '🎵', title: 'Music', desc: 'Concerts, DJ nights, acoustic sessions', color: 'var(--violet-400)' },
        { icon: '🎭', title: 'Cultural', desc: 'Festivals, drama, art exhibitions', color: 'var(--gold)' },
        { icon: '🏆', title: 'Sports', desc: 'Tournaments, matches, fitness', color: 'var(--success)' },
        { icon: '💼', title: 'Workshop', desc: 'Skill building, career dev', color: 'var(--indigo-400)' },
        { icon: '🤖', title: 'Tech', desc: 'Hackathons, coding, AI/ML', color: '#3b82f6' },
        { icon: '🎨', title: 'Arts', desc: 'Creative workshops, showcases', color: '#ec4899' }
      ];
      
      categoryGrid.innerHTML = categories.map(cat => `
        <a href="explore.html?category=${encodeURIComponent(cat.title)}" class="category-card" style="--cat-color: ${cat.color}">
          <div class="category-card__icon">${cat.icon}</div>
          <h3 class="category-card__title">${cat.title}</h3>
          <p class="category-card__description">${cat.desc}</p>
        </a>
      `).join('');
    }
    
    // Featured clubs
    const clubGrid = document.querySelector('.club-grid');
    if (clubGrid) {
      const featuredClubs = data.clubs.slice(0, 4);
      clubGrid.innerHTML = featuredClubs.map(club => `
        <a href="club.html?id=${club.id}" class="club-card">
          <div class="club-card__banner">
            <img src="${club.banner}" alt="${club.name}" loading="lazy">
          </div>
          <div class="club-card__body">
            <div class="club-card__logo">
              <img src="${club.logo}" alt="">
            </div>
            <h3 class="club-card__name">${club.name}</h3>
            <p class="club-card__category">${club.category}</p>
            <div class="club-card__stats">
              <span>${club.members?.toLocaleString() || 0} members</span>
              <span>•</span>
              <span>Est. ${club.founded || 'N/A'}</span>
            </div>
          </div>
        </a>
      `).join('');
    }
    
    // Smart greeting — show if user has profile or activity
    const greetingSection = document.querySelector('[data-section="greeting"]');
    const greetingEl = document.querySelector('[data-greeting]');
    if (greetingEl && greetingSection) {
      const hasActivity = getRecentEvents().length > 0 || getSavedEvents().length > 0;
      const hasProfile = Object.keys(getUserProfile()).length > 0;
      
      if (hasActivity || hasProfile) {
        greetingSection.classList.remove('hidden');
        greetingEl.textContent = getSmartGreeting();
      }
    }
    
    // Counters
    document.querySelectorAll('[data-counter]').forEach(el => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            triggerCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      observer.observe(el);
    });
    
    // Init tilt effects after cards are rendered
    initTiltEffects();
  };

  /* ═══════════════════════════════════════
     3D TILT EFFECT
     ═══════════════════════════════════════ */

  const initTiltEffects = () => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      }, { passive: true });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      }, { passive: true });
    });
  };

  /* ═══════════════════════════════════════
     SAVE BUTTON HANDLER
     ═══════════════════════════════════════ */

  const initSaveButtons = () => {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-save-event]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      
      const eventId = btn.dataset.saveEvent;
      const nowSaved = toggleSaved(eventId);
      
      // Animate
      btn.classList.toggle('saved', nowSaved);
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="${nowSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
      
      // Pop animation
      btn.style.transform = 'scale(1.3)';
      setTimeout(() => btn.style.transform = '', 200);
    });
  };

  /* ═══════════════════════════════════════
     SMOOTH SCROLL (LENIS)
     ═══════════════════════════════════════ */

  const initSmoothScroll = () => {
    if (typeof Lenis === 'undefined') return;
    
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    
    // Connect to GSAP ScrollTrigger if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  };

  /* ═══════════════════════════════════════
     INIT ALL SYSTEMS
     ═══════════════════════════════════════ */

  const init = () => {
    initTheme();
    initNavbar();
    initNavigation();
    initCursor();
    initCommandPalette();
    initRipples();
    initSaveButtons();
    initRevealAnimations();
    initSmoothScroll();
    populateHomepage();
    
    // Global APIs
    window.NMToast = pushToast;
    window.NMFormat = {
      date: safeFormatDate,
      dateTime: safeFormatDateTime,
      currency: safeFormatCurrency,
      getPrice: safeGetPrice
    };
    window.NMUtils = {
      getSavedEvents,
      setSavedEvents,
      isSaved,
      toggleSaved,
      createEventCard,
      getRecommendedEvents,
      getSmartGreeting,
      showSkeleton,
      addRecentEvent
    };
    
    // Page load complete
    document.body.classList.add('is-loaded');
  };

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
