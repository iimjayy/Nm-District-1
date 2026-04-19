(() => {
  if (!window.NM_UTILS) {
    return;
  }

  const { clubs, events, createEventCardHTML } = window.NM_UTILS;

  const params = new URLSearchParams(window.location.search);
  const clubId = params.get("id") || clubs[0].id;
  const club = clubs.find((item) => item.id === clubId) || clubs[0];

  const refs = {
    cover: document.getElementById("clubCoverImage"),
    eyebrow: document.getElementById("clubEyebrow"),
    name: document.getElementById("clubName"),
    tagline: document.getElementById("clubTagline"),
    description: document.getElementById("clubDescription"),
    team: document.getElementById("clubTeam"),
    upcoming: document.getElementById("clubUpcoming"),
    past: document.getElementById("clubPast"),
    gallery: document.getElementById("clubGallery"),
    followers: document.getElementById("clubFollowers"),
    eventCount: document.getElementById("clubEventsCount"),
    social: document.getElementById("clubSocial"),
    cta: document.getElementById("clubPrimaryCTA")
  };

  const matchesClub = (eventItem) => {
    const normalizedClubName = club.name.toLowerCase();
    const normalizedEventClub = eventItem.club.toLowerCase();
    return normalizedEventClub.includes(normalizedClubName) || normalizedClubName.includes(normalizedEventClub);
  };

  const clubEvents = events.filter(matchesClub);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = clubEvents
    .filter((eventItem) => new Date(`${eventItem.date}T00:00:00`) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const pastEvents = clubEvents
    .filter((eventItem) => new Date(`${eventItem.date}T00:00:00`) < today)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  refs.cover.src = club.coverImage;
  refs.cover.alt = `${club.name} cover`;
  refs.eyebrow.textContent = `NM Club Profile · ${club.logo}`;
  refs.name.textContent = club.name;
  refs.tagline.textContent = club.tagline;
  refs.description.textContent = club.description;
  refs.followers.textContent = club.followers.toLocaleString("en-IN");
  refs.eventCount.textContent = String(club.eventCount);
  refs.cta.href = `explore.html?q=${encodeURIComponent(club.name)}`;

  refs.team.innerHTML = club.team.map((item) => `<div class="rules-item">• ${item}</div>`).join("");

  refs.upcoming.innerHTML = upcomingEvents.length
    ? upcomingEvents.slice(0, 4).map((eventItem) => createEventCardHTML(eventItem)).join("")
    : '<div class="empty-state">No upcoming events listed for this club yet.</div>';

  refs.past.innerHTML = pastEvents.length
    ? pastEvents.slice(0, 4).map((eventItem) => createEventCardHTML(eventItem)).join("")
    : '<div class="empty-state">No past events archived yet.</div>';

  const galleryImages = [club.coverImage, ...clubEvents.map((eventItem) => eventItem.image)].slice(0, 6);
  refs.gallery.innerHTML = galleryImages
    .map(
      (image) => `
        <article class="gallery-card">
          <img src="${image}" alt="${club.name} gallery" />
          <div class="gallery-caption">${club.name}</div>
        </article>
      `
    )
    .join("");

  refs.social.innerHTML = Object.entries(club.socials)
    .map(
      ([key, value]) => `
        <article class="list-item">
          <div class="item-head">
            <h3 class="item-title">${key}</h3>
          </div>
          <div class="item-meta">${value}</div>
        </article>
      `
    )
    .join("");
})();
