(() => {
  const data = window.NM_DATA;
  if (!data) {
    return;
  }

  const SAVE_KEY = "nm-saved-events";
  const CAMPUS_KEY = "nm-selected-campus";
  const CAMPUS_RECENT_KEY = "nm-recent-campuses";

  const getSavedEvents = () => {
    try {
      return JSON.parse(localStorage.getItem(SAVE_KEY) || "[]");
    } catch (error) {
      return [];
    }
  };

  const setSavedEvents = (items) => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("nm:saved-events-updated", { detail: items }));
  };

  const isSavedEvent = (eventId) => getSavedEvents().includes(eventId);

  const toggleSavedEvent = (eventId) => {
    const saved = new Set(getSavedEvents());
    if (saved.has(eventId)) {
      saved.delete(eventId);
    } else {
      saved.add(eventId);
    }
    setSavedEvents(Array.from(saved));
  };

  const formatDate = (dateValue, opts = {}) => {
    const baseOptions = {
      month: "short",
      day: "numeric"
    };
    if (opts.withWeekday) {
      baseOptions.weekday = "short";
    }
    return new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-IN", baseOptions);
  };

  const formatDateTime = (dateValue, time) => `${formatDate(dateValue, { withWeekday: true })} · ${time}`;

  const resolveAssetPath = (path) => {
    if (!path) {
      return "";
    }
    if (/^(https?:|data:|blob:|\/)/i.test(path)) {
      return path;
    }
    const base = window.location.pathname.replace(/[^/]*$/, "");
    return `${base}${path.replace(/^\.?\//, "")}`;
  };

  const buildImageCandidates = (path) => {
    if (!path) {
      return [];
    }
    const normalized = path.replace(/^\.?\//, "");
    const base = window.location.pathname.replace(/[^/]*$/, "");
    return Array.from(
      new Set([
        path,
        `./${normalized}`,
        `${base}${normalized}`,
        `/${normalized}`
      ])
    );
  };

  const setImageFromCandidates = (imgElement, candidates) => {
    if (!imgElement || !candidates.length) {
      return;
    }
    let index = 0;
    const tryNext = () => {
      if (index >= candidates.length) {
        return;
      }
      const candidate = candidates[index];
      index += 1;
      imgElement.onerror = tryNext;
      imgElement.src = candidate;
    };
    tryNext();
  };

  const createEventCardHTML = (event, options = {}) => {
    const showLive = options.showLive ?? false;
    const showType = options.showType ?? true;
    const cardMode = options.mode || "grid";

    const topBadge = showLive && event.isLive ? '<span class="pill pill-live">Live Now</span>' : `<span class="pill">${event.category}</span>`;
    const saveActive = isSavedEvent(event.id) ? "active" : "";
    const urgencyPool = ["Limited Seats", "Selling Fast", "Closing Tonight", "Invite Only"];
    const urgency = urgencyPool[event.popularity % urgencyPool.length];
    const clubTag = (event.club || "NM").split(" ").map((word) => word[0]).join("").slice(0, 3).toUpperCase();
    const attendees = 180 + Math.floor(event.popularity * 2.4);
    const seatsLeft = event.tickets?.reduce((sum, item) => sum + item.seats, 0) || 120;
    const closesIn = Math.max(1, Math.ceil((new Date(event.registrationsClose).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
    const premiumTag = event.price > 500 ? "Premium Passes" : event.price === 0 ? "Free Entry" : "Trending";

    return `
      <article class="event-card ${cardMode === "list" ? "list" : ""}">
        <a class="event-media" href="event.html?id=${event.id}">
          <span class="urgency-label">${urgency}</span>
          <span class="premium-tag">${premiumTag}</span>
          <img src="${resolveAssetPath(event.image)}" alt="${event.title}">
        </a>
        <div class="event-body">
          <div class="item-head">
            ${topBadge}
            <button class="icon-btn save-toggle ${saveActive}" data-save-event="${event.id}" aria-label="Save event">
              ${isSavedEvent(event.id) ? "♥" : "♡"}
            </button>
          </div>
          <h3 class="event-title">${event.title}</h3>
          <div class="event-organizer">By ${event.organizer}</div>
          <div class="event-meta">
            <span>${formatDateTime(event.date, event.time)}</span>
            <span>${event.venue} · ${event.mode}</span>
            ${showType ? `<span>${event.type}</span>` : ""}
          </div>
          <div class="event-footer">
            <span class="price-tag">${data.formatCurrency(event.price)}</span>
            <div class="card-actions">
              <span class="club-mini-logo">${clubTag}</span>
              <button class="icon-btn card-share" data-share-event="${event.id}" aria-label="Share event">↗</button>
              <button class="icon-btn card-preview" data-preview-event="${event.id}" aria-label="Quick preview">◍</button>
              <a class="btn-inline" href="event.html?id=${event.id}">View</a>
              <a class="btn-inline" href="booking.html?id=${event.id}">Quick Book</a>
            </div>
          </div>
          <div class="attendee-row">
            <span class="attendee-avatars"><span></span><span></span><span></span><span></span></span>
            <span>${attendees.toLocaleString("en-IN")} attending</span>
          </div>
          <div class="mini-stat-row">
            <span>${seatsLeft} seats left</span>
            <span>Closing in ${closesIn}d</span>
          </div>
        </div>
      </article>
    `;
  };

  const initNavUtilities = () => {
    document.querySelectorAll(".nav-actions").forEach((container) => {
      if (container.querySelector(".nav-utility")) {
        return;
      }

      const utilityGroup = document.createElement("div");
      utilityGroup.className = "nav-utility";
      utilityGroup.innerHTML = `
        <button class="campus-switcher" type="button" data-campus-trigger aria-label="Choose NM campus location">
          <span class="campus-switcher-title">NM Campus</span>
          <span class="campus-switcher-label">Main Campus</span>
        </button>
        <a class="icon-btn" href="explore.html" aria-label="Search events">⌕</a>
        <a class="icon-btn" href="dashboard.html" aria-label="Wishlist">♥</a>
        <button class="profile-chip" type="button" aria-label="Student profile">
          <img class="nav-avatar" alt="Profile avatar" src="assets/images/385a26a34f594dbaa1d6890e70664f81.jpg" />
          <span>Rhea M.</span>
        </button>
      `;
      container.appendChild(utilityGroup);
    });
  };

  const markActiveNav = () => {
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("[data-nav-link]").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === path || (href === "index.html" && path === "")) {
        link.classList.add("active");
      }
    });
  };

  const initTheme = () => {
    const root = document.documentElement;
    const toggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("nm-theme") || "dark";

    root.setAttribute("data-theme", savedTheme);

    const applyIcon = () => {
      if (!toggle) {
        return;
      }
      const currentTheme = root.getAttribute("data-theme") || "dark";
      toggle.textContent = currentTheme === "light" ? "☼" : "◐";
      toggle.setAttribute("aria-label", currentTheme === "light" ? "Switch to dark mode" : "Switch to light mode");
    };

    applyIcon();

    if (toggle) {
      toggle.addEventListener("click", () => {
        const currentTheme = root.getAttribute("data-theme") || "dark";
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", nextTheme);
        localStorage.setItem("nm-theme", nextTheme);
        applyIcon();
      });
    }
  };

  const initFloatingNav = () => {
    const nav = document.getElementById("floatingNav");
    if (!nav) {
      return;
    }

    const sync = () => {
      nav.classList.toggle("scrolled", window.scrollY > 8);
    };

    sync();
    window.addEventListener("scroll", sync);
  };

  const initCursorGlow = () => {
    const glow = document.getElementById("cursorGlow");
    if (!glow) {
      return;
    }

    window.addEventListener("mousemove", (event) => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    });

    document.addEventListener("mouseleave", () => {
      glow.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
      glow.style.opacity = "0.7";
    });
  };

  const initRevealAnimations = () => {
    const targets = document.querySelectorAll(".reveal");
    if (!targets.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -80px 0px"
      }
    );

    targets.forEach((item) => observer.observe(item));
  };

  const initCounters = () => {
    const counterItems = document.querySelectorAll("[data-counter]");
    if (!counterItems.length) {
      return;
    }

    const animateCounter = (counter) => {
      const targetValue = Number(counter.dataset.counter || "0");
      const suffix = counter.dataset.suffix || "";
      const duration = 1300;
      const start = performance.now();

      const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = `${Math.floor(targetValue * eased).toLocaleString("en-IN")}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterItems.forEach((item) => observer.observe(item));
  };

  const syncSaveButtonStates = () => {
    const saved = new Set(getSavedEvents());
    document.querySelectorAll("[data-save-event]").forEach((button) => {
      const id = button.getAttribute("data-save-event");
      const active = saved.has(id);
      button.classList.toggle("active", active);
      button.textContent = active ? "♥" : "♡";
    });
  };

  const getSelectedCampus = () => localStorage.getItem(CAMPUS_KEY) || "Main Campus";

  const getRecentCampuses = () => {
    try {
      return JSON.parse(localStorage.getItem(CAMPUS_RECENT_KEY) || "[]");
    } catch (error) {
      return [];
    }
  };

  const setRecentCampuses = (items) => {
    localStorage.setItem(CAMPUS_RECENT_KEY, JSON.stringify(items.slice(0, 5)));
  };

  const syncCampusLabels = () => {
    const selectedCampus = getSelectedCampus();
    document.querySelectorAll(".campus-switcher-label").forEach((item) => {
      item.textContent = selectedCampus;
    });
  };

  const initCampusSelector = () => {
    const modal = document.getElementById("campusModal");
    const closeBtn = document.getElementById("campusModalClose");
    const searchInput = document.getElementById("campusSearchInput");
    const cardGrid = document.getElementById("campusCardGrid");
    const recentRoot = document.getElementById("recentCampusList");
    const popularRoot = document.getElementById("popularCampusList");
    const useCurrentBtn = document.getElementById("useCurrentCampus");

    const campuses = [
      { name: "Main Campus", icon: "⌂", note: "Core NM academic and event spaces" },
      { name: "NM Auditorium", icon: "◌", note: "Guest lectures and flagship showcases" },
      { name: "Sports Ground", icon: "◎", note: "Leagues, tournaments, and open play" },
      { name: "Seminar Hall", icon: "▣", note: "Case competitions and workshops" },
      { name: "Classroom Wing", icon: "□", note: "Small-format sessions and club events" },
      { name: "Cultural Hall", icon: "♫", note: "Open mics, theatre, and dance events" },
      { name: "Off-Campus Venues", icon: "↗", note: "Partner spaces and external nights" }
    ];

    const openModal = () => {
      if (!modal) {
        return;
      }
      modal.hidden = false;
      modal.classList.add("open");
      searchInput?.focus();
      renderCampusCards(searchInput?.value.trim().toLowerCase() || "");
      renderCampusQuickLists();
    };

    const closeModal = () => {
      if (!modal) {
        return;
      }
      modal.classList.remove("open");
      window.setTimeout(() => {
        modal.hidden = true;
      }, 140);
    };

    const selectCampus = (campusName) => {
      localStorage.setItem(CAMPUS_KEY, campusName);
      const existing = getRecentCampuses();
      const next = [campusName, ...existing.filter((item) => item !== campusName)];
      setRecentCampuses(next);
      syncCampusLabels();
      closeModal();
    };

    const renderCampusCards = (searchText) => {
      if (!cardGrid) {
        return;
      }

      const filtered = campuses.filter((campus) => campus.name.toLowerCase().includes(searchText));
      cardGrid.innerHTML = filtered
        .map(
          (campus) => `
            <button class="campus-card" type="button" data-campus-choice="${campus.name}">
              <span class="campus-icon">${campus.icon}</span>
              <span class="campus-name">${campus.name}</span>
              <small>${campus.note}</small>
            </button>
          `
        )
        .join("");
    };

    const renderCampusQuickLists = () => {
      if (recentRoot) {
        const recent = getRecentCampuses();
        recentRoot.innerHTML = recent.length
          ? recent.map((item) => `<button class="campus-pill" type="button" data-campus-choice="${item}">${item}</button>`).join("")
          : '<span class="muted">No recent locations yet</span>';
      }

      if (popularRoot) {
        const popular = ["Main Campus", "NM Auditorium", "Seminar Hall", "Sports Ground"];
        popularRoot.innerHTML = popular
          .map((item) => `<button class="campus-pill" type="button" data-campus-choice="${item}">${item}</button>`)
          .join("");
      }
    };

    document.querySelectorAll("[data-campus-trigger]").forEach((trigger) => {
      trigger.addEventListener("click", openModal);
    });

    closeBtn?.addEventListener("click", closeModal);

    modal?.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
      const choice = event.target.closest("[data-campus-choice]");
      if (choice) {
        selectCampus(choice.getAttribute("data-campus-choice"));
      }
    });

    searchInput?.addEventListener("input", () => {
      renderCampusCards(searchInput.value.trim().toLowerCase());
    });

    useCurrentBtn?.addEventListener("click", () => {
      selectCampus("Main Campus");
    });

    syncCampusLabels();
  };

  const openEventPreview = (eventId) => {
    const modal = document.getElementById("eventPreviewModal");
    const eventItem = data.events.find((item) => item.id === eventId);
    if (!eventItem) {
      return;
    }

    if (!modal) {
      window.location.href = `event.html?id=${eventId}`;
      return;
    }

    const image = document.getElementById("previewImage");
    const title = document.getElementById("previewTitle");
    const meta = document.getElementById("previewMeta");
    const about = document.getElementById("previewAbout");
    const viewLink = document.getElementById("previewViewLink");
    const bookLink = document.getElementById("previewBookLink");

    if (image) {
      image.src = eventItem.image;
      image.alt = eventItem.title;
    }
    if (title) {
      title.textContent = eventItem.title;
    }
    if (meta) {
      meta.textContent = `${eventItem.category} · ${formatDateTime(eventItem.date, eventItem.time)} · ${eventItem.venue}`;
    }
    if (about) {
      about.textContent = eventItem.about;
    }
    if (viewLink) {
      viewLink.href = `event.html?id=${eventItem.id}`;
    }
    if (bookLink) {
      bookLink.href = `booking.html?id=${eventItem.id}`;
    }

    modal.hidden = false;
    modal.classList.add("open");
  };

  const closeEventPreview = () => {
    const modal = document.getElementById("eventPreviewModal");
    if (!modal) {
      return;
    }
    modal.classList.remove("open");
    window.setTimeout(() => {
      modal.hidden = true;
    }, 130);
  };

  const initSaveButtons = () => {
    document.addEventListener("click", (event) => {
      const previewBtn = event.target.closest("[data-preview-event]");
      if (previewBtn) {
        openEventPreview(previewBtn.getAttribute("data-preview-event"));
        return;
      }

      const saveBtn = event.target.closest("[data-save-event]");
      if (saveBtn) {
        const eventId = saveBtn.getAttribute("data-save-event");
        toggleSavedEvent(eventId);
        syncSaveButtonStates();
        return;
      }

      const shareBtn = event.target.closest("[data-share-event]");
      if (!shareBtn) {
        return;
      }

      const eventId = shareBtn.getAttribute("data-share-event");
      const eventItem = data.events.find((item) => item.id === eventId);
      const shareUrl = `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, "")}event.html?id=${eventId}`;

      const fallback = async () => {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
          await navigator.clipboard.writeText(shareUrl);
          shareBtn.textContent = "✓";
          window.setTimeout(() => {
            shareBtn.textContent = "↗";
          }, 1000);
        }
      };

      if (navigator.share) {
        navigator
          .share({
            title: eventItem?.title || "NM Event",
            text: `Check out ${eventItem?.title || "this event"} on NM District`,
            url: shareUrl
          })
          .catch(() => fallback());
      } else {
        fallback();
      }
    });

    document.getElementById("previewClose")?.addEventListener("click", closeEventPreview);
    document.getElementById("eventPreviewModal")?.addEventListener("click", (event) => {
      if (event.target.id === "eventPreviewModal") {
        closeEventPreview();
      }
    });

    window.addEventListener("nm:saved-events-updated", syncSaveButtonStates);
    syncSaveButtonStates();
  };

  const initHeroSearch = () => {
    const form = document.getElementById("heroSearch");
    if (!form) {
      return;
    }
    const input = form.querySelector("input");
    const suggestionRoot = document.getElementById("heroSearchSuggestions");
    const recentRoot = document.getElementById("recentSearches");
    const quickAccess = document.getElementById("heroQuickAccess");
    const heroWord = document.getElementById("heroWord");

    const RECENT_KEY = "nm-recent-searches";

    const getRecentSearches = () => {
      try {
        return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
      } catch (error) {
        return [];
      }
    };

    const setRecentSearches = (items) => {
      localStorage.setItem(RECENT_KEY, JSON.stringify(items.slice(0, 6)));
    };

    const renderRecentSearches = () => {
      if (!recentRoot) {
        return;
      }
      const recents = getRecentSearches();
      if (!recents.length) {
        recentRoot.innerHTML = "";
        return;
      }
      recentRoot.innerHTML = recents
        .map((term) => `<button class=\"trend-chip\" type=\"button\" data-recent-term=\"${term}\">${term}</button>`)
        .join("");
    };

    const placeholders = [
      "Search Velocity passes, workshops, and after-hours sessions...",
      "Try: finance competitions this week",
      "Find networking events and guest lectures..."
    ];

    let cursor = 0;
    const rotatePlaceholder = () => {
      if (!input) {
        return;
      }
      input.setAttribute("placeholder", placeholders[cursor % placeholders.length]);
      cursor += 1;
    };

    rotatePlaceholder();
    window.setInterval(rotatePlaceholder, 3200);

    const words = ["Fests", "Workshops", "Competitions", "Concerts", "Networking"];
    if (heroWord) {
      let wordIndex = 0;
      window.setInterval(() => {
        wordIndex = (wordIndex + 1) % words.length;
        heroWord.textContent = words[wordIndex];
      }, 1700);
    }

    if (input && suggestionRoot) {
      input.addEventListener("input", () => {
        const value = input.value.trim().toLowerCase();
        if (!value) {
          suggestionRoot.hidden = true;
          suggestionRoot.innerHTML = "";
          return;
        }

        const matched = data.events
          .filter((eventItem) => `${eventItem.title} ${eventItem.club} ${eventItem.category}`.toLowerCase().includes(value))
          .slice(0, 4);

        if (!matched.length) {
          suggestionRoot.hidden = true;
          suggestionRoot.innerHTML = "";
          return;
        }

        suggestionRoot.innerHTML = matched
          .map(
            (eventItem) =>
              `<div class=\"suggestion-item\" data-suggest=\"${eventItem.title}\"><strong>AI pick:</strong> ${eventItem.title}</div>`
          )
          .join("");
        suggestionRoot.hidden = false;
      });

      suggestionRoot.addEventListener("click", (event) => {
        const target = event.target.closest("[data-suggest]");
        if (!target) {
          return;
        }
        input.value = target.dataset.suggest;
        suggestionRoot.hidden = true;
      });
    }

    recentRoot?.addEventListener("click", (event) => {
      const target = event.target.closest("[data-recent-term]");
      if (!target || !input) {
        return;
      }
      input.value = target.dataset.recentTerm;
      form.dispatchEvent(new Event("submit", { cancelable: true }));
    });

    const trendingRow = document.getElementById("trendingChips");
    if (input && trendingRow) {
      trendingRow.addEventListener("click", (event) => {
        const chip = event.target.closest(".trend-chip");
        if (!chip) {
          return;
        }
        input.value = chip.textContent?.trim() || "";
        form.dispatchEvent(new Event("submit", { cancelable: true }));
      });
    }

    quickAccess?.addEventListener("click", (event) => {
      const chip = event.target.closest(".quick-access-chip");
      if (!chip || !input) {
        return;
      }
      const text = chip.textContent?.trim() || "";
      input.value = text;
      form.dispatchEvent(new Event("submit", { cancelable: true }));
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = form.querySelector("input")?.value.trim() || "";
      if (value) {
        const recents = getRecentSearches();
        const next = [value, ...recents.filter((item) => item.toLowerCase() !== value.toLowerCase())];
        setRecentSearches(next);
        renderRecentSearches();
      }
      const params = new URLSearchParams();
      if (value) {
        params.set("q", value);
      }
      window.location.href = `explore.html${params.toString() ? `?${params.toString()}` : ""}`;
    });

    renderRecentSearches();
  };

  const initHeroParallax = () => {
    const hero = document.getElementById("heroSpotlight");
    if (!hero) {
      return;
    }
    const mouseGlow = document.getElementById("heroMouseGlow");
    const sideCards = Array.from(hero.querySelectorAll(".hero-preview-card"));

    const update = () => {
      const rect = hero.getBoundingClientRect();
      const shift = Math.max(-26, Math.min(26, -rect.top * 0.08));
      hero.style.setProperty("--hero-shift", `${shift}px`);
    };

    hero.addEventListener("mousemove", (event) => {
      const rect = hero.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const xPercent = x / rect.width - 0.5;
      const yPercent = y / rect.height - 0.5;

      if (mouseGlow) {
        mouseGlow.style.left = `${x}px`;
        mouseGlow.style.top = `${y}px`;
      }

      sideCards.forEach((card, index) => {
        const strength = (index + 1) * 2.2;
        card.style.transform = `translate3d(${xPercent * -strength}px, ${yPercent * -strength}px, 0)`;
      });
    });

    update();
    window.addEventListener("scroll", update);
  };

  const initFeaturedCarousel = () => {
    const track = document.getElementById("featuredTrack");
    if (!track) {
      return;
    }
    const prev = document.getElementById("featuredPrev");
    const next = document.getElementById("featuredNext");
    const progress = document.getElementById("featuredProgress");

    const syncActive = () => {
      const cards = Array.from(track.querySelectorAll(".event-card"));
      if (!cards.length) {
        return;
      }
      const center = track.scrollLeft + track.clientWidth / 2;
      let activeIndex = 0;
      let minDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const distance = Math.abs(center - cardCenter);
        if (distance < minDistance) {
          minDistance = distance;
          activeIndex = index;
        }
      });

      cards.forEach((card, index) => card.classList.toggle("carousel-active", index === activeIndex));
      if (progress) {
        const progressValue = ((activeIndex + 1) / cards.length) * 100;
        progress.style.setProperty("--carousel-progress", `${progressValue}%`);
      }
    };

    const moveByCard = (direction) => {
      const card = track.querySelector(".event-card");
      if (!card) {
        return;
      }
      track.scrollBy({ left: card.clientWidth * direction, behavior: "smooth" });
    };

    prev?.addEventListener("click", () => moveByCard(-1));
    next?.addEventListener("click", () => moveByCard(1));
    track.addEventListener("scroll", syncActive, { passive: true });
    syncActive();
  };

  const initTestimonialCarousel = () => {
    const track = document.getElementById("testimonialGrid");
    if (!track) {
      return;
    }
    const prev = document.getElementById("testimonialPrev");
    const next = document.getElementById("testimonialNext");

    const move = (direction) => {
      const card = track.querySelector(".testimonial-card");
      if (!card) {
        return;
      }
      track.scrollBy({ left: card.clientWidth * direction, behavior: "smooth" });
    };

    prev?.addEventListener("click", () => move(-1));
    next?.addEventListener("click", () => move(1));
  };

  const initHomepage = () => {
    const heroImage = document.getElementById("heroSlideImage");
    const heroTitle = document.getElementById("heroSlideTitle");
    const heroType = document.getElementById("heroSlideType");
    const heroSummary = document.getElementById("heroSlideSummary");
    const heroMeta = document.getElementById("heroSlideMeta");
    const heroPrimaryCta = document.getElementById("heroPrimaryCta");
    const heroSecondaryCta = document.getElementById("heroSecondaryCta");
    const heroDots = document.getElementById("heroDots");
    const heroGlowPalette = document.getElementById("heroGlowPalette");
    const heroPrev = document.getElementById("heroPrev");
    const heroNext = document.getElementById("heroNext");

    const categoryRail = document.getElementById("premiumCategoryRail");
    const featuredPeopleRow = document.getElementById("featuredPeopleRow");
    const eventGrid = document.getElementById("districtEventGrid");

    if (!heroImage && !categoryRail && !featuredPeopleRow && !eventGrid) {
      return;
    }

    const featuredEvents = [...data.events].sort((a, b) => b.popularity - a.popularity).slice(0, 6);
    const glowByCategory = {
      Fests: "radial-gradient(circle at 15% 35%, rgba(151, 107, 255, 0.5), transparent 50%), radial-gradient(circle at 80% 20%, rgba(243, 203, 131, 0.32), transparent 48%)",
      Workshops: "radial-gradient(circle at 15% 35%, rgba(75, 168, 255, 0.5), transparent 50%), radial-gradient(circle at 80% 20%, rgba(98, 229, 195, 0.3), transparent 48%)",
      Networking: "radial-gradient(circle at 15% 35%, rgba(100, 205, 255, 0.48), transparent 50%), radial-gradient(circle at 80% 20%, rgba(113, 138, 255, 0.3), transparent 48%)",
      Sports: "radial-gradient(circle at 15% 35%, rgba(98, 229, 195, 0.5), transparent 50%), radial-gradient(circle at 80% 20%, rgba(75, 168, 255, 0.28), transparent 48%)"
    };

    if (heroImage && featuredEvents.length) {
      let heroIndex = 0;
      let heroTimer = null;

      const renderHeroDots = () => {
        if (!heroDots) {
          return;
        }
        heroDots.innerHTML = featuredEvents
          .map((_, index) => `<button class="hero-dot ${index === heroIndex ? "active" : ""}" type="button" data-hero-dot="${index}" aria-label="Slide ${index + 1}"></button>`)
          .join("");
      };

      const renderHeroSlide = () => {
        const item = featuredEvents[heroIndex];
        if (!item) {
          return;
        }

        heroImage.classList.remove("fade-in");
        void heroImage.offsetWidth;
        heroImage.classList.add("fade-in");
        const fallbackHero = "assets/images/4f7b4ae0986f4a7502e84ba08890af84.jpg";
        const imageCandidates = [
          ...buildImageCandidates(item.image),
          ...buildImageCandidates(fallbackHero)
        ];
        setImageFromCandidates(heroImage, imageCandidates);
        heroImage.alt = item.title;

        if (heroType) {
          heroType.textContent = `${item.category} · ${item.type}`;
        }
        if (heroTitle) {
          heroTitle.textContent = item.title;
        }
        if (heroSummary) {
          heroSummary.textContent = item.about;
        }
        if (heroMeta) {
          heroMeta.innerHTML = `
            <span class="meta-pill">${formatDateTime(item.date, item.time)}</span>
            <span class="meta-pill">${item.venue}</span>
            <span class="meta-pill">${data.formatCurrency(item.price)}</span>
          `;
        }
        if (heroPrimaryCta) {
          heroPrimaryCta.href = `booking.html?id=${item.id}`;
        }
        if (heroSecondaryCta) {
          heroSecondaryCta.href = `event.html?id=${item.id}`;
        }
        if (heroGlowPalette) {
          heroGlowPalette.style.background = glowByCategory[item.category] || glowByCategory.Workshops;
        }
        renderHeroDots();
      };

      const moveHero = (direction) => {
        heroIndex = (heroIndex + direction + featuredEvents.length) % featuredEvents.length;
        renderHeroSlide();
      };

      const startHeroAuto = () => {
        if (heroTimer) {
          window.clearInterval(heroTimer);
        }
        heroTimer = window.setInterval(() => moveHero(1), 5200);
      };

      heroPrev?.addEventListener("click", () => {
        moveHero(-1);
        startHeroAuto();
      });

      heroNext?.addEventListener("click", () => {
        moveHero(1);
        startHeroAuto();
      });

      heroDots?.addEventListener("click", (event) => {
        const dot = event.target.closest("[data-hero-dot]");
        if (!dot) {
          return;
        }
        heroIndex = Number(dot.getAttribute("data-hero-dot"));
        renderHeroSlide();
        startHeroAuto();
      });

      renderHeroSlide();
      startHeroAuto();
    }

    if (categoryRail) {
      const districtCategories = [
        { name: "Music", targetType: "Cultural Events", icon: "♫", vibe: "Electric nights and live sessions", tone: "tone-a" },
        { name: "Workshops", targetType: "Workshops", icon: "◌", vibe: "Hands-on learning formats", tone: "tone-b" },
        { name: "Competitions", targetType: "Competitions", icon: "⚡", vibe: "Case battles and challenge rounds", tone: "tone-c" },
        { name: "Sports", targetType: "Sports", icon: "◎", vibe: "Leagues and campus tournaments", tone: "tone-d" },
        { name: "Guest Lectures", targetType: "Guest Lectures", icon: "▣", vibe: "Leaders and industry voices", tone: "tone-e" },
        { name: "Fests", targetType: "Fests", icon: "✦", vibe: "Signature NM celebrations", tone: "tone-f" },
        { name: "Open Mics", targetType: "Cultural Events", icon: "◍", vibe: "Poetry, music, and expression", tone: "tone-g" },
        { name: "Networking", targetType: "Networking", icon: "↗", vibe: "Founders and peer circles", tone: "tone-h" },
        { name: "Committee Events", targetType: "Committees", icon: "□", vibe: "Campus leadership moments", tone: "tone-i" },
        { name: "Cultural Events", targetType: "Cultural Events", icon: "◈", vibe: "Performances and showcases", tone: "tone-j" }
      ];

      categoryRail.innerHTML = districtCategories
        .map(
          (category) => `
            <a class="rail-category-card ${category.tone}" href="explore.html?type=${encodeURIComponent(category.targetType)}">
              <span class="rail-category-icon">${category.icon}</span>
              <h3>${category.name}</h3>
              <p>${category.vibe}</p>
            </a>
          `
        )
        .join("");
    }

    if (featuredPeopleRow) {
      const peopleSeed = data.events
        .flatMap((item) => (item.speakers || []).map((speaker) => ({ ...speaker, event: item.title })))
        .filter((item, index, list) => list.findIndex((candidate) => candidate.name === item.name) === index)
        .slice(0, 8);

      featuredPeopleRow.innerHTML = peopleSeed
        .map(
          (person) => `
            <article class="featured-person-card">
              <img src="${resolveAssetPath(person.image)}" alt="${person.name}" />
              <h4>${person.name}</h4>
              <p>${person.role}</p>
            </article>
          `
        )
        .join("");
    }

    if (eventGrid) {
      const filterPills = Array.from(document.querySelectorAll("[data-discovery-pill]"));
      const moreFiltersBtn = document.getElementById("discoveryMoreFiltersBtn");
      const moreFiltersPanel = document.getElementById("discoveryMoreFiltersPanel");
      const badgesRoot = document.getElementById("discoveryActiveBadges");
      const emptyState = document.getElementById("districtEmptyState");

      const venueSelect = document.getElementById("discoveryVenue");
      const committeeSelect = document.getElementById("discoveryCommittee");
      const priceSelect = document.getElementById("discoveryPrice");
      const modeSelect = document.getElementById("discoveryMode");
      const dateStart = document.getElementById("discoveryDateStart");
      const dateEnd = document.getElementById("discoveryDateEnd");
      const applyBtn = document.getElementById("discoveryApplyFilters");
      const resetBtn = document.getElementById("discoveryResetFilters");

      const uniqueVenues = [...new Set(data.events.map((item) => item.venue))].sort();
      const uniqueCommittees = [...new Set(data.events.map((item) => item.club))].sort();

      if (venueSelect) {
        venueSelect.innerHTML = [`<option value="all">All venues</option>`, ...uniqueVenues.map((value) => `<option value="${value}">${value}</option>`)].join("");
      }
      if (committeeSelect) {
        committeeSelect.innerHTML = [`<option value="all">All committees</option>`, ...uniqueCommittees.map((value) => `<option value="${value}">${value}</option>`)].join("");
      }

      const state = {
        pill: "all",
        dateStart: "",
        dateEnd: "",
        venue: "all",
        committee: "all",
        price: "all",
        mode: "all"
      };

      const categoryAliases = {
        Music: ["Cultural Events", "Fests"],
        Cultural: ["Cultural Events", "Fests"]
      };

      const getDateOnly = (value) => new Date(`${value}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const weekLimit = new Date(today);
      weekLimit.setDate(today.getDate() + 7);

      const matchesPill = (eventItem) => {
        if (state.pill === "all") {
          return true;
        }
        const eventDate = getDateOnly(eventItem.date);

        if (state.pill === "today") {
          return eventDate.getTime() === today.getTime();
        }
        if (state.pill === "tomorrow") {
          return eventDate.getTime() === tomorrow.getTime();
        }
        if (state.pill === "thisweek") {
          return eventDate >= today && eventDate <= weekLimit;
        }
        if (state.pill === "free") {
          return eventItem.price === 0;
        }
        if (state.pill === "paid") {
          return eventItem.price > 0;
        }

        const aliases = categoryAliases[state.pill] || [state.pill];
        return aliases.includes(eventItem.category);
      };

      const matchesAdvanced = (eventItem) => {
        const eventDate = getDateOnly(eventItem.date);
        const startOk = !state.dateStart || eventDate >= getDateOnly(state.dateStart);
        const endOk = !state.dateEnd || eventDate <= getDateOnly(state.dateEnd);
        const venueOk = state.venue === "all" || eventItem.venue === state.venue;
        const committeeOk = state.committee === "all" || eventItem.club === state.committee;
        const priceOk = state.price === "all" || (state.price === "free" ? eventItem.price === 0 : eventItem.price > 0);
        const modeOk = state.mode === "all" || eventItem.mode === state.mode;

        return startOk && endOk && venueOk && committeeOk && priceOk && modeOk;
      };

      const renderActiveBadges = () => {
        if (!badgesRoot) {
          return;
        }
        const badges = [];
        if (state.pill !== "all") badges.push(state.pill);
        if (state.dateStart) badges.push(`From ${state.dateStart}`);
        if (state.dateEnd) badges.push(`Until ${state.dateEnd}`);
        if (state.venue !== "all") badges.push(state.venue);
        if (state.committee !== "all") badges.push(state.committee);
        if (state.price !== "all") badges.push(state.price === "free" ? "Free" : "Paid");
        if (state.mode !== "all") badges.push(state.mode);

        badgesRoot.innerHTML = badges
          .map((badge) => `<span class="filter-chip">${badge}</span>`)
          .join("");
      };

      const renderEventGrid = () => {
        const filtered = data.events
          .filter((eventItem) => matchesPill(eventItem) && matchesAdvanced(eventItem))
          .sort((a, b) => b.popularity - a.popularity);

        eventGrid.innerHTML = filtered.map((eventItem) => createEventCardHTML(eventItem, { showLive: true })).join("");
        if (emptyState) {
          emptyState.hidden = filtered.length > 0;
        }
        renderActiveBadges();
      };

      filterPills.forEach((button) => {
        button.addEventListener("click", () => {
          filterPills.forEach((item) => item.classList.remove("active"));
          button.classList.add("active");
          state.pill = button.getAttribute("data-discovery-pill") || "all";
          renderEventGrid();
        });
      });

      moreFiltersBtn?.addEventListener("click", () => {
        const hidden = moreFiltersPanel?.hidden;
        if (moreFiltersPanel) {
          moreFiltersPanel.hidden = !hidden;
        }
      });

      applyBtn?.addEventListener("click", () => {
        state.dateStart = dateStart?.value || "";
        state.dateEnd = dateEnd?.value || "";
        state.venue = venueSelect?.value || "all";
        state.committee = committeeSelect?.value || "all";
        state.price = priceSelect?.value || "all";
        state.mode = modeSelect?.value || "all";
        renderEventGrid();
      });

      resetBtn?.addEventListener("click", () => {
        state.pill = "all";
        state.dateStart = "";
        state.dateEnd = "";
        state.venue = "all";
        state.committee = "all";
        state.price = "all";
        state.mode = "all";

        if (dateStart) dateStart.value = "";
        if (dateEnd) dateEnd.value = "";
        if (venueSelect) venueSelect.value = "all";
        if (committeeSelect) committeeSelect.value = "all";
        if (priceSelect) priceSelect.value = "all";
        if (modeSelect) modeSelect.value = "all";

        filterPills.forEach((item) => item.classList.remove("active"));
        document.querySelector('[data-discovery-pill="all"]')?.classList.add("active");
        renderEventGrid();
      });

      renderEventGrid();
    }
  };

  const renderGrid = (elementId, events, options = {}) => {
    const root = document.getElementById(elementId);
    if (!root) {
      return;
    }
    root.innerHTML = events.map((eventItem) => createEventCardHTML(eventItem, options)).join("");
  };

  const autoScrollTrack = (track) => {
    let direction = 1;
    const speed = 1.6;

    const tick = () => {
      if (!document.body.contains(track)) {
        return;
      }

      track.scrollLeft += speed * direction;
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 2) {
        direction = -1;
      }
      if (track.scrollLeft <= 0) {
        direction = 1;
      }
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const initNewsletterForm = () => {
    const form = document.getElementById("newsletterForm");
    if (!form) {
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = form.querySelector("input")?.value.trim();
      if (!email) {
        return;
      }
      const message = document.getElementById("newsletterFeedback");
      if (message) {
        message.textContent = "Subscribed. You will receive NM premium event drops first.";
      }
      form.reset();
    });
  };

  const initRippleButtons = () => {
    document.addEventListener("click", (event) => {
      const button = event.target.closest(".btn, .btn-primary, .btn-secondary, .btn-inline");
      if (!button) {
        return;
      }
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      button.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 520);
    });
  };

  const initMagneticCTAs = () => {
    const targets = document.querySelectorAll(".btn-primary, .btn-secondary");
    targets.forEach((target) => {
      target.addEventListener("mousemove", (event) => {
        const rect = target.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
        target.style.transform = `translate(${x * 7}px, ${y * 6}px)`;
      });
      target.addEventListener("mouseleave", () => {
        target.style.transform = "translate(0, 0)";
      });
    });
  };

  const initTiltCards = () => {
    const cards = document.querySelectorAll(".event-card, .hero-preview-card, .organizer-card");
    cards.forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateX(${y * -5}deg) rotateY(${x * 6}deg) translateY(-3px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  };

  window.NM_UTILS = {
    ...window.NM_UTILS,
    events: data.events,
    clubs: data.clubs,
    categories: data.categories,
    getSavedEvents,
    setSavedEvents,
    isSavedEvent,
    toggleSavedEvent,
    formatDate,
    formatDateTime,
    formatCurrency: data.formatCurrency,
    createEventCardHTML
  };

  markActiveNav();
  initNavUtilities();
  initCampusSelector();
  initTheme();
  initFloatingNav();
  initCursorGlow();
  initRevealAnimations();
  initCounters();
  initSaveButtons();
  initHeroSearch();
  initHeroParallax();
  initHomepage();
  initFeaturedCarousel();
  initTestimonialCarousel();
  initNewsletterForm();
  initRippleButtons();
  initMagneticCTAs();
  initTiltCards();

  window.requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });
})();
