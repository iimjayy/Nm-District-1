(() => {
  if (!window.NM_UTILS) {
    return;
  }

  const root = document.getElementById("clubsDirectory");
  if (!root) {
    return;
  }

  const { clubs } = window.NM_UTILS;

  const refs = {
    search: document.getElementById("clubSearch"),
    sort: document.getElementById("clubSort"),
    count: document.getElementById("clubCount")
  };

  const state = {
    query: "",
    sort: "followers"
  };

  const getSorted = (items) => {
    const list = [...items];
    if (state.sort === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
      return list;
    }
    if (state.sort === "events") {
      list.sort((a, b) => b.eventCount - a.eventCount);
      return list;
    }
    list.sort((a, b) => b.followers - a.followers);
    return list;
  };

  const render = () => {
    const query = state.query.trim().toLowerCase();
    const filtered = clubs.filter((club) => {
      const searchable = `${club.name} ${club.tagline} ${club.description}`.toLowerCase();
      return !query || searchable.includes(query);
    });

    const sorted = getSorted(filtered);
    refs.count.textContent = `${sorted.length} club${sorted.length === 1 ? "" : "s"}`;

    if (!sorted.length) {
      root.innerHTML = '<div class="empty-state">No clubs match that search query.</div>';
      return;
    }

    root.innerHTML = sorted
      .map(
        (club) => `
          <article class="club-card reveal fade-in">
            <div class="club-cover">
              <img src="${club.coverImage}" alt="${club.name}">
              <div class="club-logo">${club.logo}</div>
            </div>
            <div class="club-body">
              <h3>${club.name}</h3>
              <div class="club-meta">${club.followers.toLocaleString("en-IN")} followers · ${club.eventCount} events</div>
              <p class="muted">${club.tagline}</p>
              <p class="muted">${club.description}</p>
              <a class="btn-inline" href="club.html?id=${club.id}">Open Profile</a>
            </div>
          </article>
        `
      )
      .join("");

      window.NM_MOTION?.rehydrateDynamicContent(root);
  };

  refs.search.addEventListener("input", (event) => {
    state.query = event.target.value;
    render();
  });

  refs.sort.addEventListener("change", (event) => {
    state.sort = event.target.value;
    render();
  });

  render();
})();
