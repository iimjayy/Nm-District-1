(() => {
  const resultsRoot = document.getElementById("exploreResults");
  if (!resultsRoot || !window.NM_UTILS) {
    return;
  }

  const {
    events,
    createEventCardHTML
  } = window.NM_UTILS;

  const controls = {
    search: document.getElementById("searchFilter"),
    type: document.getElementById("typeFilter"),
    club: document.getElementById("clubFilter"),
    date: document.getElementById("dateFilter"),
    price: document.getElementById("priceFilter"),
    venue: document.getElementById("venueFilter"),
    mode: document.getElementById("modeFilter"),
    popularity: document.getElementById("popularityFilter"),
    popularityValue: document.getElementById("popularityValue"),
    sort: document.getElementById("sortFilter"),
    activeFilters: document.getElementById("activeFilters"),
    resultsCount: document.getElementById("resultsCount"),
    loading: document.getElementById("resultsLoading"),
    clear: document.getElementById("clearFiltersBtn")
  };

  const state = {
    view: "grid",
    loadingTimer: null,
    mapOpen: false,
    renderedEvents: [],
    quickWindow: "all"
  };

  const viewButtons = Array.from(document.querySelectorAll("[data-view]"));
  const quickButtons = Array.from(document.querySelectorAll("[data-quick]"));
  const exploreQuickPills = Array.from(document.querySelectorAll("[data-explore-pill]"));
  const exploreMoreFiltersBtn = document.getElementById("exploreMoreFiltersBtn");
  const quickPillWrap = document.getElementById("quickPillWrap");
  const categoryTabs = document.getElementById("categoryTabs");
  const recentExploreRow = document.getElementById("recentExploreRow");
  const featuredBanner = document.getElementById("featuredExploreBanner");
  const mapToggleBtn = document.getElementById("mapToggleBtn");
  const mapPreview = document.getElementById("mapPreview");
  const recommendedGrid = document.getElementById("recommendedGrid");
  const hoverPreview = document.getElementById("hoverPreview");
  const hoverPreviewImage = document.getElementById("hoverPreviewImage");
  const hoverPreviewTitle = document.getElementById("hoverPreviewTitle");
  const hoverPreviewMeta = document.getElementById("hoverPreviewMeta");

  const RECENT_EXPLORE_KEY = "nm-explore-recent";

  const getRecentExplore = () => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_EXPLORE_KEY) || "[]");
    } catch (error) {
      return [];
    }
  };

  const setRecentExplore = (items) => {
    localStorage.setItem(RECENT_EXPLORE_KEY, JSON.stringify(items.slice(0, 7)));
  };

  const setActiveExploreQuickPill = (value) => {
    exploreQuickPills.forEach((item) => {
      item.classList.toggle("active", item.dataset.explorePill === value);
    });
  };

  const setSelectOptions = (selectElement, values, placeholder = "All") => {
    if (!selectElement) {
      return;
    }
    const options = [`<option value="all">${placeholder}</option>`].concat(
      values.map((value) => `<option value="${value}">${value}</option>`)
    );
    selectElement.innerHTML = options.join("");
  };

  const initFilters = () => {
    const categories = [...new Set(events.map((eventItem) => eventItem.category))].sort();
    const clubs = [...new Set(events.map((eventItem) => eventItem.club))].sort();
    const venues = [...new Set(events.map((eventItem) => eventItem.venue))].sort();

    setSelectOptions(controls.type, categories, "All categories");
    setSelectOptions(controls.club, clubs, "All clubs");
    setSelectOptions(controls.venue, venues, "All venues");

    const params = new URLSearchParams(window.location.search);
    const query = params.get("q") || "";
    const typeFromQuery = params.get("type") || "";
    const typeAliasMap = {
      Music: "Cultural Events",
      "Open Mics": "Cultural Events",
      "Committee Events": "Committees",
      Cultural: "Cultural Events"
    };

    const normalizedType = categories.find((value) => value.toLowerCase() === typeFromQuery.toLowerCase());
    const mappedType = typeAliasMap[typeFromQuery] || normalizedType;

    if (mappedType && categories.includes(mappedType)) {
      controls.type.value = mappedType;
    }

    if (query) {
      controls.search.value = query;
    }

    renderCategoryTabs(categories);
    renderRecentExploreRow();
  };

  const renderCategoryTabs = (categories) => {
    if (!categoryTabs) {
      return;
    }

    const chips = ["all", ...categories];
    categoryTabs.innerHTML = chips
      .map(
        (chip) => `
          <button class="category-tab-chip ${chip === "all" ? "active" : ""}" type="button" data-category-tab="${chip}">
            ${chip === "all" ? "All" : chip}
          </button>
        `
      )
      .join("");
  };

  const syncCategoryTabs = (activeCategory) => {
    if (!categoryTabs) {
      return;
    }
    categoryTabs.querySelectorAll("[data-category-tab]").forEach((button) => {
      button.classList.toggle("active", button.dataset.categoryTab === activeCategory);
    });
  };

  const renderRecentExploreRow = () => {
    if (!recentExploreRow) {
      return;
    }

    const recent = getRecentExplore();
    if (!recent.length) {
      recentExploreRow.innerHTML = "";
      return;
    }

    recentExploreRow.innerHTML = `
      <span class="muted">Recent:</span>
      ${recent
        .map(
          (item) => `<button class="recent-explore-chip" type="button" data-recent-explore="${item}">${item}</button>`
        )
        .join("")}
    `;
  };

  const pushRecentExplore = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }

    const existing = getRecentExplore();
    const next = [trimmed, ...existing.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())];
    setRecentExplore(next);
    renderRecentExploreRow();
  };

  const readFilters = () => ({
    search: controls.search.value.trim().toLowerCase(),
    type: controls.type.value,
    club: controls.club.value,
    date: controls.date.value,
    price: controls.price.value,
    venue: controls.venue.value,
    mode: controls.mode.value,
    popularity: Number(controls.popularity.value || "0"),
    sort: controls.sort.value,
    quickWindow: state.quickWindow
  });

  const applyFilters = (items, filters) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const weekLimit = new Date(today);
    weekLimit.setDate(today.getDate() + 7);

    return items.filter((eventItem) => {
      const haystack = `${eventItem.title} ${eventItem.organizer} ${eventItem.venue} ${eventItem.category} ${eventItem.club} ${eventItem.type}`.toLowerCase();
      const matchesSearch = !filters.search || haystack.includes(filters.search);
      const matchesType = filters.type === "all" || eventItem.category === filters.type;
      const matchesClub = filters.club === "all" || eventItem.club === filters.club;
      const matchesDate = !filters.date || eventItem.date === filters.date;
      const matchesPrice =
        filters.price === "all" ||
        (filters.price === "free" && eventItem.price === 0) ||
        (filters.price === "paid" && eventItem.price > 0);
      const matchesVenue = filters.venue === "all" || eventItem.venue === filters.venue;
      const matchesMode = filters.mode === "all" || eventItem.mode === filters.mode;
      const matchesPopularity = eventItem.popularity >= filters.popularity;
      const eventDate = new Date(`${eventItem.date}T00:00:00`);

      let matchesQuickWindow = true;
      if (filters.quickWindow === "today") {
        matchesQuickWindow = eventDate.getTime() === today.getTime();
      } else if (filters.quickWindow === "tomorrow") {
        matchesQuickWindow = eventDate.getTime() === tomorrow.getTime();
      } else if (filters.quickWindow === "thisweek") {
        matchesQuickWindow = eventDate >= today && eventDate <= weekLimit;
      }

      return (
        matchesSearch &&
        matchesType &&
        matchesClub &&
        matchesDate &&
        matchesPrice &&
        matchesVenue &&
        matchesMode &&
        matchesPopularity &&
        matchesQuickWindow
      );
    });
  };

  const sortEvents = (items, mode) => {
    const sorted = [...items];
    if (mode === "closest") {
      sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      return sorted;
    }
    if (mode === "newest") {
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      return sorted;
    }
    if (mode === "trending") {
      sorted.sort((a, b) => Number(b.isTrending) - Number(a.isTrending) || b.popularity - a.popularity);
      return sorted;
    }
    sorted.sort((a, b) => b.popularity - a.popularity);
    return sorted;
  };

  const renderChips = (filters) => {
    const chips = [];
    if (filters.search) chips.push({ key: "search", label: `Search: ${filters.search}` });
    if (filters.quickWindow !== "all") {
      const quickWindowLabel =
        filters.quickWindow === "thisweek"
          ? "This Week"
          : filters.quickWindow === "today"
            ? "Today"
            : "Tomorrow";
      chips.push({ key: "quickWindow", label: quickWindowLabel });
    }
    if (filters.type !== "all") chips.push({ key: "type", label: filters.type });
    if (filters.club !== "all") chips.push({ key: "club", label: filters.club });
    if (filters.date) chips.push({ key: "date", label: filters.date });
    if (filters.price !== "all") chips.push({ key: "price", label: filters.price });
    if (filters.venue !== "all") chips.push({ key: "venue", label: filters.venue });
    if (filters.mode !== "all") chips.push({ key: "mode", label: filters.mode });
    if (filters.popularity > 0) chips.push({ key: "popularity", label: `${filters.popularity}+ popularity` });

    controls.activeFilters.innerHTML = chips
      .map((chip) => `<button class="filter-chip" type="button" data-chip="${chip.key}">${chip.label} ✕</button>`)
      .join("");

    if (quickPillWrap) {
      quickPillWrap.innerHTML = chips.length
        ? chips.map((chip) => `<button class="quick-cat-chip active" type="button" data-chip="${chip.key}">${chip.label}</button>`).join("")
        : '<span class="muted">No quick filters applied</span>';
    }
  };

  const clearSingleFilter = (key) => {
    if (key === "search") controls.search.value = "";
    if (key === "type") controls.type.value = "all";
    if (key === "club") controls.club.value = "all";
    if (key === "date") {
      controls.date.value = "";
      state.quickWindow = "all";
      setActiveExploreQuickPill("all");
    }
    if (key === "price") controls.price.value = "all";
    if (key === "venue") controls.venue.value = "all";
    if (key === "mode") controls.mode.value = "all";
    if (key === "popularity") controls.popularity.value = "0";
    if (key === "quickWindow") {
      state.quickWindow = "all";
      controls.date.value = "";
      setActiveExploreQuickPill("all");
    }
    controls.popularityValue.textContent = `${controls.popularity.value}+`;
  };

  const renderResults = () => {
    const filters = readFilters();
    controls.popularityValue.textContent = `${filters.popularity}+`;

    const filtered = applyFilters(events, filters);
    const sorted = sortEvents(filtered, filters.sort);

    controls.resultsCount.textContent = `${sorted.length} event${sorted.length === 1 ? "" : "s"}`;

    if (!sorted.length) {
      resultsRoot.innerHTML = '<div class="empty-state">No events match these filters. Try broadening your search.</div>';
    } else {
      resultsRoot.innerHTML = sorted
        .map((eventItem) => createEventCardHTML(eventItem, { mode: state.view, showLive: true }))
        .join("");
    }

    window.NM_MOTION?.rehydrateDynamicContent(resultsRoot);

    state.renderedEvents = sorted;
    Array.from(resultsRoot.querySelectorAll(".event-card")).forEach((card, index) => {
      const eventItem = sorted[index];
      if (!eventItem) {
        return;
      }
      card.dataset.previewTitle = eventItem.title;
      card.dataset.previewImage = eventItem.image;
      card.dataset.previewMeta = `${eventItem.category} · ${eventItem.venue} · ${eventItem.time}`;
    });

    resultsRoot.className = `events-view ${state.view}`;
    renderChips(filters);
    syncCategoryTabs(filters.type);

    if (filters.search) {
      pushRecentExplore(filters.search);
    } else if (filters.type !== "all") {
      pushRecentExplore(filters.type);
    }

    if (recommendedGrid) {
      const recommended = [...events]
        .filter((eventItem) => eventItem.isTrending || eventItem.popularity > 90)
        .slice(0, 3);
      recommendedGrid.innerHTML = recommended
        .map((eventItem) => createEventCardHTML(eventItem, { showLive: true }))
        .join("");
      window.NM_MOTION?.rehydrateDynamicContent(recommendedGrid);
    }
  };

  const renderFeaturedBanner = () => {
    if (!featuredBanner) {
      return;
    }
    const spotlight = [...events].sort((a, b) => b.popularity - a.popularity)[0];
    featuredBanner.style.backgroundImage = `url('${spotlight.image}')`;
    featuredBanner.innerHTML = `
      <div class="featured-banner-content">
        <p class="eyebrow">Featured Tonight</p>
        <h2 class="section-title" style="font-size: clamp(1.5rem, 4vw, 2.3rem)">${spotlight.title}</h2>
        <p class="section-copy">${spotlight.about}</p>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.8rem;">
          <span class="pill">${spotlight.category}</span>
          <span class="pill">${spotlight.venue}</span>
          <a class="btn-inline" href="event.html?id=${spotlight.id}">View Event</a>
        </div>
      </div>
    `;

    window.NM_MOTION?.rehydrateDynamicContent(featuredBanner);
  };

  const toggleMapPreview = () => {
    if (!mapPreview || !mapToggleBtn) {
      return;
    }
    state.mapOpen = !state.mapOpen;
    mapPreview.hidden = !state.mapOpen;
    mapToggleBtn.textContent = state.mapOpen ? "Hide Map" : "Map Preview";
  };

  const updateHoverPreview = (card) => {
    if (!hoverPreview || !hoverPreviewTitle || !hoverPreviewMeta || !hoverPreviewImage) {
      return;
    }

    if (!card) {
      hoverPreview.hidden = true;
      return;
    }

    hoverPreviewTitle.textContent = card.dataset.previewTitle || "Event";
    hoverPreviewMeta.textContent = card.dataset.previewMeta || "";
    hoverPreviewImage.src = card.dataset.previewImage || "";
    hoverPreview.hidden = false;
  };

  const scheduleRender = () => {
    controls.loading.hidden = false;
    resultsRoot.style.display = "none";

    if (state.loadingTimer) {
      window.clearTimeout(state.loadingTimer);
    }

    state.loadingTimer = window.setTimeout(() => {
      controls.loading.hidden = true;
      resultsRoot.style.display = "grid";
      renderResults();
      state.loadingTimer = null;
    }, 260);
  };

  const resetFilters = () => {
    controls.search.value = "";
    controls.type.value = "all";
    controls.club.value = "all";
    controls.date.value = "";
    controls.price.value = "all";
    controls.venue.value = "all";
    controls.mode.value = "all";
    controls.popularity.value = "0";
    controls.sort.value = "popular";
    controls.popularityValue.textContent = "0+";
    state.quickWindow = "all";
    setActiveExploreQuickPill("all");
    scheduleRender();
  };

  const bindEvents = () => {
    [
      controls.search,
      controls.type,
      controls.club,
      controls.date,
      controls.price,
      controls.venue,
      controls.mode,
      controls.popularity,
      controls.sort
    ].forEach((control) => {
      control.addEventListener("input", () => {
        if (control === controls.date) {
          state.quickWindow = "all";
          setActiveExploreQuickPill("all");
        }
        scheduleRender();
      });
      control.addEventListener("change", scheduleRender);
    });

    controls.clear.addEventListener("click", resetFilters);

    viewButtons.forEach((button) => {
      button.addEventListener("click", () => {
        viewButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        state.view = button.dataset.view;
        renderResults();
      });
    });

    controls.activeFilters.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-chip]");
      if (!chip) {
        return;
      }
      clearSingleFilter(chip.dataset.chip);
      scheduleRender();
    });

    quickButtons.forEach((button) => {
      button.addEventListener("click", () => {
        quickButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        const value = button.dataset.quick;
        if (value === "Free") {
          controls.price.value = "free";
          controls.type.value = "all";
        } else {
          controls.type.value = value;
          controls.price.value = "all";
        }
        scheduleRender();
      });
    });

    exploreQuickPills.forEach((button) => {
      button.addEventListener("click", () => {
        setActiveExploreQuickPill(button.dataset.explorePill || "all");

        const value = button.dataset.explorePill;
        state.quickWindow = "all";

        if (value === "all") {
          controls.price.value = "all";
          controls.type.value = "all";
          controls.date.value = "";
        } else if (value === "today") {
          const today = new Date();
          controls.date.value = today.toISOString().slice(0, 10);
          state.quickWindow = "today";
        } else if (value === "tomorrow") {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          controls.date.value = tomorrow.toISOString().slice(0, 10);
          state.quickWindow = "tomorrow";
        } else if (value === "thisweek") {
          controls.date.value = "";
          state.quickWindow = "thisweek";
        } else if (value === "free") {
          controls.price.value = "free";
          controls.type.value = "all";
          controls.date.value = "";
        } else if (value === "paid") {
          controls.price.value = "paid";
          controls.type.value = "all";
          controls.date.value = "";
        } else if (value === "Music") {
          controls.type.value = "Cultural Events";
          controls.price.value = "all";
          controls.date.value = "";
        } else {
          controls.type.value = value;
          controls.price.value = "all";
          controls.date.value = "";
        }

        scheduleRender();
      });
    });

    categoryTabs?.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-category-tab]");
      if (!chip) {
        return;
      }
      controls.type.value = chip.dataset.categoryTab;
      scheduleRender();
    });

    recentExploreRow?.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-recent-explore]");
      if (!chip) {
        return;
      }
      controls.search.value = chip.dataset.recentExplore;
      scheduleRender();
    });

    quickPillWrap?.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-chip]");
      if (!chip) {
        return;
      }
      clearSingleFilter(chip.dataset.chip);
      scheduleRender();
    });

    mapToggleBtn?.addEventListener("click", toggleMapPreview);

    exploreMoreFiltersBtn?.addEventListener("click", () => {
      controls.search.scrollIntoView({ behavior: "smooth", block: "center" });
      controls.search.focus();
    });

    resultsRoot.addEventListener("mouseover", (event) => {
      const card = event.target.closest(".event-card");
      if (!card) {
        return;
      }
      updateHoverPreview(card);
    });

    resultsRoot.addEventListener("mouseleave", () => {
      updateHoverPreview(null);
    });
  };

  renderFeaturedBanner();
  initFilters();
  bindEvents();
  scheduleRender();
})();
