(() => {
  const data = window.NM_DATA;
  if (!data) {
    return;
  }

  const SAVE_KEY = "nm-saved-events";
  const CAMPUS_KEY = "nm-selected-campus";
  const CAMPUS_RECENT_KEY = "nm-recent-campuses";
  const SHARED_EVENT_TRANSITION_KEY = "nm-shared-event-transition";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let pushToast = () => {};

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

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
    const cardMode = options.mode || "grid";

    const topBadge = showLive && event.isLive ? "Live" : event.category;
    const saveActive = isSavedEvent(event.id) ? "active" : "";
    const eventDate = formatDate(event.date, { withWeekday: true });
    const location = event.venue.length > 26 ? `${event.venue.slice(0, 25)}...` : event.venue;
    const categorySlug = encodeURIComponent(event.category || "all");

    return `
      <article class="event-card motion-card ${cardMode === "list" ? "list" : ""}" data-event-id="${event.id}">
        <a class="event-media" data-event-link="${event.id}" href="event.html?id=${event.id}">
          <img src="${resolveAssetPath(event.image)}" alt="${event.title}" loading="lazy">
        </a>
        <div class="event-body">
          <div class="event-topline">
            <span class="event-kind">${topBadge}</span>
            <button class="icon-btn save-toggle ${saveActive}" data-save-event="${event.id}" aria-label="Save event">
              ${isSavedEvent(event.id) ? "♥" : "♡"}
            </button>
          </div>
          <h3 class="event-title">${event.title}</h3>
          <div class="event-meta-row">
            <span>${eventDate}</span>
            <span>${data.formatCurrency(event.price)}</span>
          </div>
          <div class="event-meta-subtle">${location}</div>
          <div class="event-actions-minimal">
            <a class="btn-inline" data-event-link="${event.id}" href="event.html?id=${event.id}">View Event</a>
            <a class="btn-inline" href="explore.html?type=${categorySlug}">More ${event.category}</a>
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
          <span class="campus-switcher-label">Main Campus</span>
        </button>
        <button class="profile-chip" type="button" aria-label="Student profile">Rhea M.</button>
        <a class="icon-btn nav-discovery-shortcut" href="explore.html" aria-label="Jump to explore">
          ⌕
        </a>
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
      const scroll = window.scrollY;
      const progress = clamp(scroll / 260, 0, 1);
      nav.classList.toggle("scrolled", scroll > 8);
      nav.style.setProperty("--nav-scale", `${(1 - progress * 0.035).toFixed(4)}`);
      nav.style.setProperty("--nav-opacity", `${(0.58 + progress * 0.22).toFixed(3)}`);
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
  };

  const initCursorGlow = () => {
    const glow = document.getElementById("cursorGlow");
    if (!glow) {
      return;
    }

    const interactiveSelector = "a, button, input, select, textarea, .event-card, .filter-pill, .quick-cat-chip, .category-tab-chip";

    window.addEventListener("mousemove", (event) => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    });

    document.addEventListener("mouseover", (event) => {
      const target = event.target;
      if (target instanceof Element && target.closest(interactiveSelector)) {
        glow.classList.add("interactive");
      }
    });

    document.addEventListener("mouseout", (event) => {
      const target = event.target;
      if (target instanceof Element && target.closest(interactiveSelector)) {
        glow.classList.remove("interactive");
      }
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

    if (prefersReducedMotion) {
      targets.forEach((item) => {
        item.classList.add("visible", "is-cinematic-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible", "is-cinematic-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.08
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
        const isSaved = isSavedEvent(eventId);
        pushToast(isSaved ? "Added to your saved events" : "Removed from your saved events");
        saveBtn.classList.add("heart-pop");
        window.setTimeout(() => {
          saveBtn.classList.remove("heart-pop");
        }, 360);
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
          pushToast("Event link copied to clipboard");
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

      rehydrateDynamicContent(categoryRail);
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

      rehydrateDynamicContent(featuredPeopleRow);
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
        rehydrateDynamicContent(eventGrid);
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
    rehydrateDynamicContent(root);
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
      pushToast("You are on the priority drop list");
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

  const collectElements = (scope, selector) => {
    if (!(scope instanceof Element || scope instanceof Document)) {
      return [];
    }
    const collected = Array.from(scope.querySelectorAll(selector));
    if (scope instanceof Element && scope.matches(selector)) {
      collected.unshift(scope);
    }
    return collected;
  };

  let observeNarrativeTargets = () => {};

  const registerCinematicNodes = (scope = document) => {
    const cinematicTargets = collectElements(
      scope,
      ".reveal, .event-card, .club-card, .featured-person-card, .floating-cta-card, .agenda-item, .person-card, .review-card, .ticket-option, .list-item, .analytics-tile, .metric-tile, .gallery-card, .suggestion-card, .rail-category-card"
    );

    cinematicTargets.forEach((item) => {
      item.classList.add("cinematic-reveal");
      if (!item.style.getPropertyValue("--reveal-delay")) {
        item.style.setProperty("--reveal-delay", "0s");
      }
    });

    collectElements(scope, ".section-head").forEach((head) => {
      Array.from(head.children).forEach((child, index) => {
        child.classList.add("cinematic-reveal");
        if (!child.dataset.motionDelay) {
          child.style.setProperty("--reveal-delay", `${(index * 0.08).toFixed(2)}s`);
          child.dataset.motionDelay = "1";
        }
      });
    });

    const staggerGroups = collectElements(
      scope,
      ".district-event-grid, .events-view, .club-grid, .similar-grid, .people-grid, .agenda-grid, .review-grid, .featured-people-row, .floating-cta-row, .category-rail, .list-stack, .analytics-grid, .metric-grid, .ticket-option-list, .smart-suggestions, .clubs-directory-grid, .gallery-grid, .gallery-slider-track, .campus-card-grid"
    );

    staggerGroups.forEach((group) => {
      const children = Array.from(
        group.querySelectorAll(
          ":scope > .event-card, :scope > .club-card, :scope > .featured-person-card, :scope > .floating-cta-card, :scope > .rail-category-card, :scope > .agenda-item, :scope > .person-card, :scope > .review-card, :scope > .ticket-option, :scope > .list-item, :scope > .analytics-tile, :scope > .metric-tile, :scope > .gallery-card, :scope > .suggestion-card, :scope > .campus-card"
        )
      );

      children.forEach((item, index) => {
        item.classList.add("cinematic-reveal");
        if (!item.dataset.motionDelay) {
          item.style.setProperty("--reveal-delay", `${(Math.min(index, 12) * 0.075).toFixed(3)}s`);
          item.dataset.motionDelay = "1";
        }
      });
    });
  };

  const initNarrativeMotion = () => {
    registerCinematicNodes(document);

    if (prefersReducedMotion) {
      collectElements(document, ".cinematic-reveal").forEach((item) => {
        item.classList.add("is-cinematic-visible", "visible");
      });
      observeNarrativeTargets = (scope = document) => {
        registerCinematicNodes(scope);
        collectElements(scope, ".cinematic-reveal").forEach((item) => {
          item.classList.add("is-cinematic-visible", "visible");
        });
      };
      return;
    }

    const seen = new WeakSet();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add("is-cinematic-visible", "visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.16
      }
    );

    observeNarrativeTargets = (scope = document) => {
      registerCinematicNodes(scope);
      collectElements(scope, ".cinematic-reveal").forEach((item) => {
        if (seen.has(item)) {
          return;
        }
        seen.add(item);
        observer.observe(item);
      });
    };

    observeNarrativeTargets(document);
  };

  const initLazyMedia = (scope = document) => {
    const images = collectElements(scope, "img");
    images.forEach((img) => {
      if (!(img instanceof HTMLImageElement) || img.dataset.mediaEnhanced) {
        return;
      }

      img.dataset.mediaEnhanced = "1";

      const isHeroCritical = Boolean(img.closest(".district-hero-media, .hero-slide-image-wrap, .hero-media, #eventHeroMedia"));
      if (!isHeroCritical && !img.getAttribute("loading")) {
        img.setAttribute("loading", "lazy");
      }

      const shell = img.closest(".event-media, .gallery-card, .featured-person-card, .club-cover, .hero-slide-image-wrap, .suggestion-card, .preview-modal");
      shell?.classList.add("media-shell");

      const markLoaded = () => {
        img.classList.remove("media-pending");
        img.classList.add("media-loaded");
        shell?.classList.add("media-ready");
      };

      if (img.complete && img.naturalWidth > 0) {
        markLoaded();
        return;
      }

      img.classList.add("media-pending");
      img.addEventListener("load", markLoaded, { once: true });
      img.addEventListener("error", markLoaded, { once: true });
    });
  };

  const bindMagneticTargets = (scope = document) => {
    if (prefersReducedMotion) {
      return;
    }

    const targets = collectElements(scope, ".btn-primary, .btn-secondary, [data-magnetic]");
    targets.forEach((target) => {
      if (!(target instanceof HTMLElement) || target.dataset.magneticBound) {
        return;
      }
      target.dataset.magneticBound = "1";

      const strength = target.hasAttribute("data-magnetic") ? 12 : 8;

      target.addEventListener("mousemove", (event) => {
        const rect = target.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
        target.style.transform = `translate3d(${(x * strength).toFixed(2)}px, ${(y * (strength * 0.85)).toFixed(2)}px, 0)`;
      });

      target.addEventListener("mouseleave", () => {
        target.style.transform = "";
      });
    });
  };

  const initMagneticCTAs = () => {
    bindMagneticTargets(document);
  };

  const bindTiltToCards = (scope = document) => {
    if (prefersReducedMotion) {
      return;
    }

    const cards = collectElements(scope, ".event-card, .hero-preview-card, .organizer-card, .rail-category-card");
    cards.forEach((card) => {
      if (!(card instanceof HTMLElement) || card.dataset.tiltBound) {
        return;
      }
      card.dataset.tiltBound = "1";

      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateX(${(y * -4.8).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  };

  const initTiltCards = () => {
    bindTiltToCards(document);
  };

  const rehydrateDynamicContent = (scope = document) => {
    registerCinematicNodes(scope);
    observeNarrativeTargets(scope);
    initLazyMedia(scope);
    bindMagneticTargets(scope);
    bindTiltToCards(scope);
  };

  const initDynamicMotionObserver = () => {
    if (!("MutationObserver" in window)) {
      return;
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) {
            return;
          }
          rehydrateDynamicContent(node);
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };

  const initHomeStorySnap = () => {
    const storyMain = document.querySelector("main.story-main");
    if (!storyMain) {
      return;
    }

    document.documentElement.classList.add("home-story-scroll");
    storyMain.querySelectorAll(":scope > section").forEach((section) => {
      section.classList.add("story-snap-section");
    });
  };

  const initSectionStoryState = () => {
    const sections = Array.from(document.querySelectorAll("main > section"));
    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-story-active", entry.isIntersecting);
        });
      },
      {
        threshold: 0.4
      }
    );

    sections.forEach((section) => observer.observe(section));
  };

  const initDistrictHeroCinematics = () => {
    const hero = document.getElementById("districtHero");
    if (!hero || !hero.classList.contains("apple-event-hero")) {
      return;
    }

    const entryItems = Array.from(hero.querySelectorAll(".hero-entry-item"));
    const subtext = document.getElementById("heroStorySubtext");
    const primaryCta = document.getElementById("heroPrimaryCta");
    const coreStage = document.getElementById("eventCoreStage");
    const lineNodes = Array.from(hero.querySelectorAll("[data-core-line]"));
    const iconNodes = Array.from(hero.querySelectorAll("[data-core-node]"));
    const floatingLayer = document.getElementById("heroFloatingElements");

    if (!coreStage || !floatingLayer) {
      return;
    }

    hero.classList.remove("phase-entry", "phase-build", "phase-still", "phase-burst", "phase-floating", "is-bursting");
    entryItems.forEach((item) => item.classList.remove("is-visible"));
    lineNodes.forEach((line) => line.classList.remove("is-built"));
    iconNodes.forEach((node) => node.classList.remove("is-built"));
    coreStage.classList.remove("is-visible", "is-pulse", "is-burst");

    const featuredEvent = [...data.events].sort((a, b) => b.popularity - a.popularity)[0];
    if (featuredEvent && primaryCta instanceof HTMLAnchorElement) {
      primaryCta.href = `explore.html?q=${encodeURIComponent(featuredEvent.category)}`;
    }

    if (subtext) {
      subtext.textContent =
        "From college festivals and music events to networking, competitions, and workshops, discover every scene as one fluid campus story.";
    }

    const ICON_MARKUP = {
      note:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 4v10.8a4.2 4.2 0 1 1-2-3.6V7.2L7.4 9v8.2a4.2 4.2 0 1 1-2-3.6V7.4L16 4z"/></svg>',
      mic:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a4 4 0 0 1 4 4v5a4 4 0 0 1-8 0V7a4 4 0 0 1 4-4zM6 11a6 6 0 1 0 12 0M12 17v4M8 21h8"/></svg>',
      trophy:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10v3a5 5 0 0 1-10 0zM9 13h6M10 17h4M5 5H3a3 3 0 0 0 3 3M19 5h2a3 3 0 0 1-3 3"/></svg>',
      people:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 9a2.8 2.8 0 1 0 0.1 0M16.8 9.7a2.2 2.2 0 1 0 0.1 0M3.8 18c0.8-2.8 2.8-4.4 5.2-4.4 2.5 0 4.5 1.6 5.3 4.4M13.7 18c0.6-2 2.1-3.2 3.9-3.2 1.5 0 2.8 0.8 3.5 2.2"/></svg>',
      ticket:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 7.8h17a1.8 1.8 0 0 1 1.8 1.8v1a2.7 2.7 0 0 0 0 5.3v1a1.8 1.8 0 0 1-1.8 1.8h-17a1.8 1.8 0 0 1-1.8-1.8v-1a2.7 2.7 0 0 0 0-5.3v-1a1.8 1.8 0 0 1 1.8-1.8zM10.7 7.8v10.8"/></svg>',
      spark:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.6a5.7 5.7 0 0 1 3.2 10.4v2.1H8.8V14A5.7 5.7 0 0 1 12 3.6zM9.3 19h5.4M10.1 21h3.8"/></svg>',
      light:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v3M6.8 5.2l1.8 2.1M17.2 5.2l-1.8 2.1M4 11h3M17 11h3M7.3 17.8l1.8-2.1M16.7 17.8l-1.8-2.1M12 18v3"/></svg>'
    };

    const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);
    const cubicBezierPoint = (t, p0, p1, p2, p3) => {
      const inv = 1 - t;
      return (
        inv * inv * inv * p0 +
        3 * inv * inv * t * p1 +
        3 * inv * t * t * p2 +
        t * t * t * p3
      );
    };

    const iconKeys = Object.keys(ICON_MARKUP);
    const floatingItems = [];
    let animationId = 0;
    let resizeTimer = 0;
    let mouseCurrentX = 0;
    let mouseCurrentY = 0;
    let mouseTargetX = 0;
    let mouseTargetY = 0;

    const ENTRY_START = 80;
    const ENTRY_STAGGER = 180;
    const CORE_REVEAL = 860;
    const BUILD_START = 1320;
    const LINE_STAGGER = 150;
    const ICON_STAGGER = 170;
    const STILL_START = 3220;
    const PULSE_START = 3740;
    const BURST_START = 4300;
    const FLOAT_START = 5400;

    const sequenceStart = performance.now();
    const timers = [];
    const queue = (callback, delay) => {
      const id = window.setTimeout(callback, delay);
      timers.push(id);
    };

    const createFloatingSystem = () => {
      floatingLayer.innerHTML = "";
      floatingItems.length = 0;

      const isMobile = window.matchMedia("(max-width: 760px)").matches;
      const ringSlots = isMobile ? [8, 8, 9] : [10, 10, 12];
      const ringRadius = isMobile ? [138, 198, 258] : [156, 228, 300];
      const tau = Math.PI * 2;

      ringSlots.forEach((slots, ringIndex) => {
        for (let slot = 0; slot < slots; slot += 1) {
          const baseAngle = (slot / slots) * tau;
          const angle = baseAngle + (Math.random() - 0.5) * (tau / slots) * 0.5;
          const radius = ringRadius[ringIndex] + (Math.random() - 0.5) * 30;
          const tx = Math.cos(angle) * radius;
          const ty = Math.sin(angle) * radius * 0.84;

          const tangentX = -Math.sin(angle);
          const tangentY = Math.cos(angle);
          const curveAmplitude = 34 + Math.random() * 52;
          const c1x = tx * 0.24 + tangentX * curveAmplitude;
          const c1y = ty * 0.2 + tangentY * curveAmplitude - 22;
          const c2x = tx * 0.7 - tangentX * (curveAmplitude * 0.36);
          const c2y = ty * 0.72 - tangentY * (curveAmplitude * 0.22) - 10;

          const depth = ringIndex;
          const size = depth === 0 ? 43 + Math.random() * 8 : depth === 1 ? 34 + Math.random() * 7 : 25 + Math.random() * 6;
          const alpha = depth === 0 ? 0.92 : depth === 1 ? 0.76 : 0.58;
          const scale = depth === 0 ? 1 : depth === 1 ? 0.87 : 0.76;

          const item = document.createElement("span");
          item.className = `hero-floating-item depth-${depth}`;
          item.style.setProperty("--size", `${size.toFixed(2)}px`);
          const icon = iconKeys[(ringIndex * 7 + slot) % iconKeys.length];
          item.innerHTML = ICON_MARKUP[icon];
          floatingLayer.appendChild(item);

          floatingItems.push({
            element: item,
            tx,
            ty,
            c1x,
            c1y,
            c2x,
            c2y,
            alpha,
            scale,
            rotation: (Math.random() - 0.5) * 220,
            spinRange: 5 + Math.random() * 4,
            burstDuration: 860 + Math.random() * 280,
            releaseDelay: ringIndex * 56 + Math.random() * 210,
            driftX: depth === 0 ? 12 + Math.random() * 13 : 9 + Math.random() * 10,
            driftY: depth === 0 ? 10 + Math.random() * 11 : 7 + Math.random() * 9,
            rise: depth === 0 ? 10 + Math.random() * 10 : 7 + Math.random() * 8,
            driftSpeed: 0.34 + Math.random() * 0.45,
            phase: Math.random() * tau,
            sideBias: (Math.random() - 0.5) * 12,
            parallax: depth === 0 ? 1.05 : depth === 1 ? 0.76 : 0.52
          });
        }
      });
    };

    const placeFloatingItem = (item, x, y, rotation, opacity, parallaxX, parallaxY) => {
      item.element.style.opacity = `${opacity.toFixed(3)}`;
      item.element.style.transform = `translate3d(calc(-50% + ${(x + parallaxX).toFixed(2)}px), calc(-50% + ${(y + parallaxY).toFixed(2)}px), 0) rotate(${rotation.toFixed(2)}deg) scale(${item.scale.toFixed(3)})`;
    };

    const syncReducedMotionScroll = () => {
      const heroRect = hero.getBoundingClientRect();
      const scrollProgress = clamp((0 - heroRect.top) / Math.max(heroRect.height * 0.86, 1), 0, 1);
      const scrollFade = clamp(1 - scrollProgress * 1.25, 0, 1);
      hero.style.setProperty("--hero-scroll", scrollProgress.toFixed(4));
      hero.style.setProperty("--hero-float-fade", `${scrollFade.toFixed(3)}`);
    };

    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        createFloatingSystem();
      }, 150);
    };

    const handleHeroMouseMove = (event) => {
      const rect = hero.getBoundingClientRect();
      const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
      const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;
      mouseTargetX = normalizedX * 24;
      mouseTargetY = normalizedY * 20;
      hero.style.setProperty("--hero-pointer-x", `${((normalizedX + 0.5) * 100).toFixed(2)}%`);
      hero.style.setProperty("--hero-pointer-y", `${((normalizedY + 0.5) * 100).toFixed(2)}%`);
    };

    const handleHeroMouseLeave = () => {
      mouseTargetX = 0;
      mouseTargetY = 0;
      hero.style.setProperty("--hero-pointer-x", "50%");
      hero.style.setProperty("--hero-pointer-y", "50%");
    };

    const handleCtaMove = (event) => {
      if (!(primaryCta instanceof HTMLElement)) {
        return;
      }
      const rect = primaryCta.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      primaryCta.style.setProperty("--cta-glow-x", `${x.toFixed(2)}%`);
      primaryCta.style.setProperty("--cta-glow-y", `${y.toFixed(2)}%`);
    };

    const handleCtaLeave = () => {
      if (!(primaryCta instanceof HTMLElement)) {
        return;
      }
      primaryCta.style.setProperty("--cta-glow-x", "50%");
      primaryCta.style.setProperty("--cta-glow-y", "50%");
    };

    const cleanup = () => {
      timers.forEach((id) => window.clearTimeout(id));
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.clearTimeout(resizeTimer);

      hero.removeEventListener("mousemove", handleHeroMouseMove);
      hero.removeEventListener("mouseleave", handleHeroMouseLeave);
      window.removeEventListener("resize", handleResize);

      if (primaryCta instanceof HTMLElement) {
        primaryCta.removeEventListener("mousemove", handleCtaMove);
        primaryCta.removeEventListener("mouseleave", handleCtaLeave);
      }
    };

    createFloatingSystem();

    const makeVisible = () => {
      hero.classList.add("phase-entry");

      entryItems.forEach((item, index) => {
        queue(() => {
          item.classList.add("is-visible");
        }, ENTRY_START + index * ENTRY_STAGGER);
      });

      queue(() => {
        coreStage.classList.add("is-visible");
      }, CORE_REVEAL);

      queue(() => {
        hero.classList.add("phase-build");

        lineNodes.forEach((line, index) => {
          queue(() => {
            line.classList.add("is-built");
          }, index * LINE_STAGGER);
        });

        iconNodes.forEach((node, index) => {
          queue(() => {
            node.classList.add("is-built");
          }, 380 + index * ICON_STAGGER);
        });
      }, BUILD_START);

      queue(() => {
        hero.classList.add("phase-still");
      }, STILL_START);

      queue(() => {
        coreStage.classList.add("is-pulse");
      }, PULSE_START);

      queue(() => {
        hero.classList.remove("phase-still");
        hero.classList.add("is-bursting", "phase-burst");
        coreStage.classList.add("is-burst");
      }, BURST_START);

      queue(() => {
        coreStage.classList.remove("is-pulse");
      }, PULSE_START + 900);

      queue(() => {
        hero.classList.add("phase-floating");
        hero.classList.remove("is-bursting", "phase-burst");
        coreStage.classList.remove("is-burst");
      }, FLOAT_START);
    };

    const renderReducedMotion = () => {
      hero.classList.add("phase-entry", "phase-build", "phase-floating");
      entryItems.forEach((item) => item.classList.add("is-visible"));
      coreStage.classList.add("is-visible");
      lineNodes.forEach((line) => line.classList.add("is-built"));
      iconNodes.forEach((node) => node.classList.add("is-built"));

      floatingItems.forEach((item) => {
        placeFloatingItem(item, item.tx, item.ty, item.rotation, item.alpha, 0, 0);
      });

      syncReducedMotionScroll();
      window.addEventListener("scroll", syncReducedMotionScroll, { passive: true });
      window.addEventListener(
        "pagehide",
        () => {
          window.removeEventListener("scroll", syncReducedMotionScroll);
        },
        { once: true }
      );
    };

    if (prefersReducedMotion) {
      renderReducedMotion();
      return;
    }

    makeVisible();

    hero.addEventListener("mousemove", handleHeroMouseMove);
    hero.addEventListener("mouseleave", handleHeroMouseLeave);
    window.addEventListener("resize", handleResize, { passive: true });

    if (primaryCta instanceof HTMLElement) {
      primaryCta.addEventListener("mousemove", handleCtaMove);
      primaryCta.addEventListener("mouseleave", handleCtaLeave);
    }

    const animate = (now) => {
      const elapsed = now - sequenceStart;
      mouseCurrentX += (mouseTargetX - mouseCurrentX) * 0.1;
      mouseCurrentY += (mouseTargetY - mouseCurrentY) * 0.1;

      const heroRect = hero.getBoundingClientRect();
      const scrollProgress = clamp((0 - heroRect.top) / Math.max(heroRect.height * 0.86, 1), 0, 1);
      const scrollFade = clamp(1 - scrollProgress * 1.28, 0, 1);

      hero.style.setProperty("--hero-scroll", scrollProgress.toFixed(4));
      hero.style.setProperty("--hero-parallax-x", `${(mouseCurrentX * 0.62).toFixed(2)}px`);
      hero.style.setProperty("--hero-parallax-y", `${(mouseCurrentY * 0.62).toFixed(2)}px`);
      hero.style.setProperty("--hero-float-fade", `${scrollFade.toFixed(3)}`);

      floatingItems.forEach((item) => {
        const sinceBurst = elapsed - BURST_START - item.releaseDelay;
        if (sinceBurst <= 0) {
          item.element.style.opacity = "0";
          return;
        }

        const burstProgress = clamp(sinceBurst / item.burstDuration, 0, 1);
        const eased = easeOutCubic(burstProgress);

        let x = cubicBezierPoint(eased, 0, item.c1x, item.c2x, item.tx);
        let y = cubicBezierPoint(eased, 0, item.c1y, item.c2y, item.ty);
        let rotation = item.rotation * eased;

        if (burstProgress >= 1) {
          const ambientTime = (sinceBurst - item.burstDuration) / 1000;
          const driftX = Math.sin(ambientTime * item.driftSpeed + item.phase) * item.driftX;
          const driftY = Math.cos(ambientTime * (item.driftSpeed * 0.82) + item.phase) * item.driftY;
          const rise = Math.sin(ambientTime * 0.2 + item.phase * 0.7) * item.rise - item.rise * 0.35;

          x += driftX + item.sideBias * Math.sin(ambientTime * 0.14 + item.phase);
          y += driftY - rise;
          rotation += Math.sin(ambientTime * 0.66 + item.phase) * item.spinRange;
        }

        const opacityRamp = burstProgress < 0.11 ? burstProgress / 0.11 : 1;
        const opacity = item.alpha * opacityRamp * scrollFade;
        const parallaxX = mouseCurrentX * item.parallax;
        const parallaxY = mouseCurrentY * item.parallax * 0.82;

        placeFloatingItem(item, x, y, rotation, opacity, parallaxX, parallaxY);
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    window.addEventListener("pagehide", cleanup, { once: true });
  };

  const getEventIdFromHref = (href) => {
    try {
      const url = new URL(href, window.location.href);
      return url.searchParams.get("id");
    } catch (error) {
      return null;
    }
  };

  const initCardToEventTransitions = () => {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[href*='event.html']");
      if (!link) {
        return;
      }

      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        link.target === "_blank" ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const href = link.getAttribute("href");
      if (!href || !href.includes("event.html")) {
        return;
      }

      const card = link.closest(".event-card");
      if (!card) {
        return;
      }

      const image = card.querySelector(".event-media img");
      const source = image || card;
      const rect = source.getBoundingClientRect();

      const payload = {
        eventId: getEventIdFromHref(href) || link.getAttribute("data-event-link") || card.getAttribute("data-event-id"),
        image: image?.currentSrc || image?.src || "",
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        radius: parseFloat(window.getComputedStyle(source).borderRadius) || 16,
        timestamp: Date.now()
      };

      sessionStorage.setItem(SHARED_EVENT_TRANSITION_KEY, JSON.stringify(payload));

      if (prefersReducedMotion) {
        return;
      }

      event.preventDefault();
      const curtain = document.createElement("div");
      curtain.className = "page-transition-curtain";
      document.body.appendChild(curtain);
      requestAnimationFrame(() => {
        curtain.classList.add("active");
      });
      document.body.classList.add("page-transition-out");
      window.setTimeout(() => {
        window.location.href = href;
      }, 150);
    });
  };

  const initSharedEventEntranceTransition = () => {
    const path = window.location.pathname.split("/").pop();
    if (path !== "event.html") {
      return;
    }

    const raw = sessionStorage.getItem(SHARED_EVENT_TRANSITION_KEY);
    if (!raw) {
      return;
    }
    sessionStorage.removeItem(SHARED_EVENT_TRANSITION_KEY);

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch (error) {
      return;
    }

    if (!payload || Date.now() - Number(payload.timestamp || 0) > 8000) {
      return;
    }

    const pageEventId = new URLSearchParams(window.location.search).get("id");
    if (payload.eventId && pageEventId && payload.eventId !== pageEventId) {
      return;
    }

    let attempts = 0;

    const tryPlay = () => {
      const mediaTarget = document.querySelector("#eventHeroMedia img, #eventHeroMedia video");
      const heroTarget = document.getElementById("eventHero");
      if (!mediaTarget || !heroTarget) {
        attempts += 1;
        if (attempts < 24) {
          requestAnimationFrame(tryPlay);
        }
        return;
      }

      const targetRect = heroTarget.getBoundingClientRect();
      if (!targetRect.width || !targetRect.height) {
        return;
      }

      const mediaSource =
        mediaTarget instanceof HTMLVideoElement
          ? mediaTarget.poster || ""
          : mediaTarget instanceof HTMLImageElement
            ? mediaTarget.currentSrc || mediaTarget.src
            : "";

      if (!payload.image && !mediaSource) {
        return;
      }

      const dim = document.createElement("div");
      dim.className = "shared-element-dim";

      const flyover = document.createElement("img");
      flyover.className = "shared-element-flyover";
      flyover.src = payload.image || mediaSource;
      flyover.alt = "";
      flyover.style.left = `${payload.x}px`;
      flyover.style.top = `${payload.y}px`;
      flyover.style.width = `${payload.width}px`;
      flyover.style.height = `${payload.height}px`;
      flyover.style.borderRadius = `${payload.radius || 16}px`;

      document.body.appendChild(dim);
      document.body.appendChild(flyover);

      if (prefersReducedMotion) {
        flyover.remove();
        dim.remove();
        return;
      }

      document.body.classList.add("page-transition-in");
      requestAnimationFrame(() => {
        flyover.style.left = `${targetRect.left}px`;
        flyover.style.top = `${targetRect.top}px`;
        flyover.style.width = `${targetRect.width}px`;
        flyover.style.height = `${targetRect.height}px`;
        flyover.style.borderRadius = `${parseFloat(window.getComputedStyle(heroTarget).borderRadius) || 28}px`;
        dim.style.opacity = "0";
      });

      window.setTimeout(() => {
        flyover.remove();
        dim.remove();
        document.body.classList.remove("page-transition-in");
      }, 640);
    };

    requestAnimationFrame(tryPlay);
  };

  const initGlobalParallax = () => {
    if (prefersReducedMotion) {
      return;
    }

    const layers = Array.from(document.querySelectorAll(".featured-banner, .floating-cta-card, .dashboard-hero, .admin-hero, .clubs-hero"));
    if (!layers.length) {
      return;
    }

    const update = () => {
      const viewport = window.innerHeight || 1;
      layers.forEach((layer, index) => {
        const rect = layer.getBoundingClientRect();
        if (rect.bottom < -120 || rect.top > viewport + 120) {
          return;
        }
        const depth = 4 + (index % 3) * 2;
        const centerShift = (rect.top + rect.height / 2 - viewport / 2) / viewport;
        layer.style.setProperty("--parallax-y", `${(centerShift * -depth).toFixed(2)}px`);
      });
    };

    let ticking = false;
    const queueUpdate = () => {
      if (ticking) {
        return;
      }
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    update();
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);
  };

  const initAccessibilityScaffold = () => {
    const main = document.querySelector("main");
    if (main && !main.id) {
      main.id = "mainContent";
    }

    if (main && !document.querySelector(".skip-to-content")) {
      const skip = document.createElement("a");
      skip.className = "skip-to-content";
      skip.href = `#${main.id}`;
      skip.textContent = "Skip to content";
      document.body.prepend(skip);
    }

    const activeLink = document.querySelector("[data-nav-link].active");
    if (activeLink) {
      activeLink.setAttribute("aria-current", "page");
    }
  };

  const initGlobalToastSystem = () => {
    const container = document.createElement("div");
    container.className = "global-toast-stack";
    container.setAttribute("aria-live", "polite");
    container.setAttribute("aria-atomic", "true");
    document.body.appendChild(container);

    pushToast = (message, duration = 2200) => {
      if (!message) {
        return;
      }

      const toast = document.createElement("div");
      toast.className = "global-toast";
      toast.textContent = message;
      container.appendChild(toast);

      requestAnimationFrame(() => {
        toast.classList.add("visible");
      });

      window.setTimeout(() => {
        toast.classList.remove("visible");
        window.setTimeout(() => {
          toast.remove();
        }, 260);
      }, duration);
    };
  };

  const initScrollProgressBar = () => {
    const line = document.createElement("div");
    line.className = "scroll-progress-line";
    document.body.appendChild(line);

    const update = () => {
      const doc = document.documentElement;
      const total = Math.max(1, doc.scrollHeight - doc.clientHeight);
      const progress = clamp(window.scrollY / total, 0, 1);
      line.style.setProperty("--progress", progress.toFixed(4));
    };

    let ticking = false;
    const queue = () => {
      if (ticking) {
        return;
      }
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    update();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
  };

  const initBackToTopControl = () => {
    const button = document.createElement("button");
    button.className = "back-to-top-btn";
    button.type = "button";
    button.textContent = "↑";
    button.setAttribute("aria-label", "Back to top");
    document.body.appendChild(button);

    const update = () => {
      button.classList.toggle("visible", window.scrollY > 540);
    };

    button.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });

    update();
    window.addEventListener("scroll", update, { passive: true });
  };

  const initMobileNavigationDrawer = () => {
    const nav = document.getElementById("floatingNav");
    const navRoot = nav?.querySelector(".nav-links");
    const navActions = nav?.querySelector(".nav-actions");
    if (!navRoot || !navActions) {
      return;
    }

    if (navActions.querySelector(".mobile-menu-toggle")) {
      return;
    }

    const links = Array.from(navRoot.querySelectorAll("a"));
    if (!links.length) {
      return;
    }

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "icon-btn mobile-menu-toggle";
    toggle.setAttribute("aria-label", "Open navigation menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "mobileNavDrawer");
    toggle.innerHTML = "☰";
    navActions.appendChild(toggle);

    const backdrop = document.createElement("div");
    backdrop.className = "mobile-nav-drawer-backdrop";
    backdrop.setAttribute("hidden", "");
    backdrop.innerHTML = `
      <aside class="mobile-nav-drawer" id="mobileNavDrawer" role="dialog" aria-modal="true" aria-label="Mobile navigation">
        <div class="mobile-nav-head">
          <a class="brand" href="index.html" aria-label="NM District home">
            <span class="brand-logo">NM</span>
            <span>NM District</span>
          </a>
          <button class="icon-btn mobile-nav-close" type="button" aria-label="Close navigation">✕</button>
        </div>
        <nav class="mobile-nav-links" aria-label="Mobile main navigation">
          ${links
            .map((link) => {
              const active = link.classList.contains("active") ? "active" : "";
              const href = link.getAttribute("href") || "#";
              return `<a class="mobile-nav-link ${active}" href="${href}">${link.textContent?.trim() || "Link"}</a>`;
            })
            .join("")}
        </nav>
      </aside>
    `;
    document.body.appendChild(backdrop);

    const closeBtn = backdrop.querySelector(".mobile-nav-close");
    const drawer = backdrop.querySelector(".mobile-nav-drawer");

    const open = () => {
      backdrop.hidden = false;
      requestAnimationFrame(() => {
        backdrop.classList.add("open");
      });
      document.body.classList.add("menu-open");
      toggle.setAttribute("aria-expanded", "true");
    };

    const close = () => {
      backdrop.classList.remove("open");
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
      window.setTimeout(() => {
        backdrop.hidden = true;
      }, 180);
    };

    toggle.addEventListener("click", () => {
      if (backdrop.classList.contains("open")) {
        close();
      } else {
        open();
      }
    });

    closeBtn?.addEventListener("click", close);

    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) {
        close();
      }
    });

    drawer?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", close);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && backdrop.classList.contains("open")) {
        close();
      }
    });
  };

  const initMobileBottomDock = () => {
    if (document.querySelector(".mobile-bottom-dock")) {
      return;
    }

    const path = window.location.pathname.split("/").pop() || "index.html";
    const items = [
      { href: "index.html", label: "Home", icon: "⌂" },
      { href: "explore.html", label: "Explore", icon: "⌕" },
      { href: "booking.html", label: "Book", icon: "◈" },
      { href: "dashboard.html", label: "Dashboard", icon: "◎" },
      { href: "clubs.html", label: "Clubs", icon: "◉" }
    ];

    const dock = document.createElement("nav");
    dock.className = "mobile-bottom-dock";
    dock.setAttribute("aria-label", "Quick mobile navigation");
    dock.innerHTML = items
      .map((item) => {
        const active = path === item.href ? "active" : "";
        return `
          <a class="mobile-dock-link ${active}" href="${item.href}">
            <span class="mobile-dock-icon" aria-hidden="true">${item.icon}</span>
            <span>${item.label}</span>
          </a>
        `;
      })
      .join("");

    document.body.appendChild(dock);
    document.body.classList.add("has-mobile-dock");
  };

  const initKeyboardShortcuts = () => {
    const isTypingTarget = (target) => {
      if (!(target instanceof Element)) {
        return false;
      }
      return Boolean(target.closest("input, textarea, [contenteditable='true'], select"));
    };

    document.addEventListener("keydown", (event) => {
      if (event.key !== "/") {
        return;
      }
      if (isTypingTarget(event.target)) {
        return;
      }

      const searchTarget = document.querySelector(
        "#heroFloatingSearchInput, #searchFilter, #clubSearch, #campusSearchInput, input[type='search']"
      );
      if (!(searchTarget instanceof HTMLInputElement)) {
        return;
      }

      event.preventDefault();
      searchTarget.focus();
      searchTarget.select();
      pushToast("Search is focused. Start typing.", 1600);
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

  window.NM_MOTION = {
    rehydrateDynamicContent
  };

  markActiveNav();
  initAccessibilityScaffold();
  initGlobalToastSystem();
  initScrollProgressBar();
  initBackToTopControl();
  initHomeStorySnap();
  initNavUtilities();
  initMobileNavigationDrawer();
  initMobileBottomDock();
  initCampusSelector();
  initTheme();
  initFloatingNav();
  initCursorGlow();
  initRevealAnimations();
  initNarrativeMotion();
  initSectionStoryState();
  initCounters();
  initSaveButtons();
  initCardToEventTransitions();
  initSharedEventEntranceTransition();
  initHeroSearch();
  initHeroParallax();
  initDistrictHeroCinematics();
  initHomepage();
  initFeaturedCarousel();
  initTestimonialCarousel();
  initNewsletterForm();
  initRippleButtons();
  initMagneticCTAs();
  initTiltCards();
  initGlobalParallax();
  initKeyboardShortcuts();
  rehydrateDynamicContent(document);
  initDynamicMotionObserver();

  window.requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });
})();
