(() => {
  if (!window.NM_UTILS) {
    return;
  }

  const {
    events,
    formatCurrency,
    formatDate,
    formatDateTime,
    createEventCardHTML,
    isSavedEvent,
    toggleSavedEvent
  } = window.NM_UTILS;

  const params = new URLSearchParams(window.location.search);
  const selectedId = params.get("id") || events[0].id;

  const currentEvent = events.find((item) => item.id === selectedId) || events[0];

  const refs = {
    heroMedia: document.getElementById("eventHeroMedia"),
    eyebrow: document.getElementById("eventEyebrow"),
    badges: document.getElementById("eventBadges"),
    title: document.getElementById("eventTitle"),
    subline: document.getElementById("eventSubline"),
    datePill: document.getElementById("eventDatePill"),
    venuePill: document.getElementById("eventVenuePill"),
    modePill: document.getElementById("eventModePill"),
    about: document.getElementById("aboutText"),
    agenda: document.getElementById("agendaGrid"),
    people: document.getElementById("peopleGrid"),
    attending: document.getElementById("attendingRow"),
    faq: document.getElementById("faqList"),
    rules: document.getElementById("rulesList"),
    gallery: document.getElementById("galleryGrid"),
    galleryPrev: document.getElementById("galleryPrev"),
    galleryNext: document.getElementById("galleryNext"),
    venueMap: document.getElementById("venueMap"),
    reviews: document.getElementById("reviewGrid"),
    similar: document.getElementById("similarEvents"),
    availability: document.getElementById("availabilityStatus"),
    urgencyClose: document.getElementById("urgencyClose"),
    urgencySeats: document.getElementById("urgencySeats"),
    urgencyInterested: document.getElementById("urgencyInterested"),
    ticketOptions: document.getElementById("ticketOptions"),
    qtyMinus: document.getElementById("qtyMinus"),
    qtyPlus: document.getElementById("qtyPlus"),
    qtyDisplay: document.getElementById("qtyDisplay"),
    total: document.getElementById("ticketTotal"),
    countdown: document.getElementById("regCountdown"),
    wishlist: document.getElementById("wishlistBtn"),
    share: document.getElementById("shareBtn"),
    calendar: document.getElementById("calendarBtn"),
    bookNow: document.getElementById("bookNowBtn"),
    mobileActionBar: document.getElementById("mobileActionBar"),
    mobileSave: document.getElementById("mobileSave"),
    mobileShare: document.getElementById("mobileShare"),
    mobileBook: document.getElementById("mobileBook"),
    bookingPanel: document.getElementById("eventBookingPanel")
  };

  const state = {
    ticketIndex: 0,
    quantity: 1,
    countdownTimer: null
  };

  const escapeICS = (input) => input.replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");

  const getCloseDate = () => new Date(currentEvent.registrationsClose);

  const getHoursUntilClose = () => {
    const closeDate = getCloseDate();
    if (Number.isNaN(closeDate.getTime())) {
      return null;
    }
    const diff = closeDate.getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60)));
  };

  const getInterestCount = () => Math.max(350, Math.round(currentEvent.popularity * 24.5));

  const getSelectedTicket = () => currentEvent.tickets[state.ticketIndex] || currentEvent.tickets[0];

  const updateBookingSummary = () => {
    const ticket = getSelectedTicket();
    const maxQty = Math.min(ticket.seats, 8);
    if (state.quantity > maxQty) {
      state.quantity = maxQty;
    }

    refs.qtyDisplay.textContent = String(state.quantity);
    refs.total.textContent = formatCurrency(ticket.price * state.quantity);

    const query = new URLSearchParams({
      id: currentEvent.id,
      ticket: ticket.name,
      qty: String(state.quantity)
    });
    refs.bookNow.href = `booking.html?${query.toString()}`;

    if (refs.mobileBook) {
      refs.mobileBook.href = refs.bookNow.href;
    }
  };

  const renderTickets = () => {
    refs.ticketOptions.innerHTML = currentEvent.tickets
      .map(
        (ticket, index) => `
          <article class="ticket-option ${index === state.ticketIndex ? "active" : ""}" data-ticket-index="${index}">
            <div class="ticket-title">
              <span>${ticket.name}</span>
              <span>${formatCurrency(ticket.price)}</span>
            </div>
            <div class="ticket-meta">${ticket.seats} seats remaining</div>
          </article>
        `
      )
      .join("");

    const seatsLeft = currentEvent.tickets.reduce((sum, item) => sum + item.seats, 0);
    refs.availability.textContent = seatsLeft > 0 ? `${seatsLeft} seats left across all pass types` : "Sold out";

    if (refs.urgencySeats) {
      refs.urgencySeats.textContent = seatsLeft > 0 ? `${seatsLeft} seats left` : "Sold out";
    }

    if (refs.urgencyInterested) {
      refs.urgencyInterested.textContent = `${getInterestCount().toLocaleString()} students interested`;
    }

    updateBookingSummary();
  };

  const renderHero = () => {
    if (currentEvent.heroVideo) {
      refs.heroMedia.innerHTML = `
        <video autoplay muted loop playsinline poster="${currentEvent.image}">
          <source src="${currentEvent.heroVideo}" type="video/mp4" />
        </video>
      `;
    } else {
      refs.heroMedia.innerHTML = `<img src="${currentEvent.image}" alt="${currentEvent.title}" />`;
    }

    refs.eyebrow.textContent = `${currentEvent.category} · ${currentEvent.organizer}`;
    refs.title.textContent = currentEvent.title;
    refs.subline.textContent = `Hosted by ${currentEvent.club} · ${currentEvent.type} · Premium NM experience`;
    refs.datePill.textContent = formatDateTime(currentEvent.date, currentEvent.time);
    refs.venuePill.textContent = currentEvent.venue;
    refs.modePill.textContent = currentEvent.mode.toUpperCase();

    if (refs.badges) {
      const badges = [
        currentEvent.isLive ? "Live Now" : null,
        currentEvent.isTrending ? "Trending" : null,
        currentEvent.price === 0 ? "Free Entry" : `From ${formatCurrency(currentEvent.price)}`,
        currentEvent.mode === "hybrid" ? "Hybrid Access" : "On-Campus"
      ].filter(Boolean);

      refs.badges.innerHTML = badges.map((badge) => `<span class="event-badge">${badge}</span>`).join("");
    }
  };

  const renderContentBlocks = () => {
    const attendeePool = [
      "Aisha", "Rohan", "Mitali", "Neel", "Karan", "Sana", "Vivaan", "Trisha", "Yash", "Anaya"
    ];
    const attendeeCount = 5 + (currentEvent.popularity % 5);

    refs.about.textContent = currentEvent.about;

    refs.agenda.innerHTML = currentEvent.agenda
      .map(
        (item) => `
          <article class="agenda-item">
            <div class="timeline-time">${item.time}</div>
            <div>${item.title}</div>
          </article>
        `
      )
      .join("");

    refs.people.innerHTML = currentEvent.speakers
      .map(
        (person) => `
          <article class="person-card">
            <img class="avatar" src="${person.image}" alt="${person.name}" />
            <div>
              <div><strong>${person.name}</strong></div>
              <div class="muted">${person.role}</div>
            </div>
          </article>
        `
      )
      .join("");

    if (refs.attending) {
      refs.attending.innerHTML = `
        <div class="attending-avatars">
          ${attendeePool
            .slice(0, attendeeCount)
            .map(
              (name, index) => `
                <div class="attending-avatar" style="z-index:${30 - index};">${name.slice(0, 1)}</div>
              `
            )
            .join("")}
        </div>
        <div class="attending-copy">
          <strong>${getInterestCount().toLocaleString()} going</strong>
          <p class="muted">${attendeePool.slice(0, 3).join(", ")} and ${attendeeCount} mutuals joined this event</p>
        </div>
      `;
    }

    refs.faq.innerHTML = currentEvent.faq
      .map(
        (item) => `
          <details class="faq-item">
            <summary>${item.q}</summary>
            <p>${item.a}</p>
          </details>
        `
      )
      .join("");

    refs.rules.innerHTML = currentEvent.rules.map((rule) => `<div class="rules-item">• ${rule}</div>`).join("");

    refs.gallery.innerHTML = currentEvent.gallery
      .map(
        (img) => `
          <article class="gallery-card">
            <img src="${img}" alt="${currentEvent.title} gallery" />
            <div class="gallery-caption">${currentEvent.title}</div>
          </article>
        `
      )
      .join("");

    if (refs.venueMap) {
      refs.venueMap.innerHTML = `
        <div class="map-canvas">
          <div class="map-grid-lines"></div>
          <div class="map-pin">${currentEvent.venue}</div>
          <div class="map-label">${currentEvent.mode === "hybrid" ? "Hybrid check-in + streaming hub" : "Gate opens 45 mins earlier"}</div>
        </div>
      `;
    }

    refs.reviews.innerHTML = currentEvent.reviews
      .map(
        (review) => `
          <article class="review-card">
            <div>${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</div>
            <p>${review.text}</p>
            <div class="muted">${review.name}</div>
          </article>
        `
      )
      .join("");

    const similar = events
      .filter((eventItem) => eventItem.id !== currentEvent.id && eventItem.category === currentEvent.category)
      .slice(0, 4);

    refs.similar.innerHTML = similar
      .map((eventItem) => createEventCardHTML(eventItem, { showType: false }))
      .join("");

    window.NM_MOTION?.rehydrateDynamicContent(document);
  };

  const initDetailMotion = () => {
    if (refs.bookingPanel) {
      requestAnimationFrame(() => {
        refs.bookingPanel.classList.add("panel-visible");
      });
    }

    [refs.agenda, refs.people, refs.reviews, refs.similar].forEach((group) => {
      if (!group) {
        return;
      }
      Array.from(group.children).forEach((item, index) => {
        item.classList.add("cinematic-reveal");
        if (!item.dataset.motionDelay) {
          item.style.setProperty("--reveal-delay", `${(Math.min(index, 8) * 0.08).toFixed(2)}s`);
          item.dataset.motionDelay = "1";
        }
      });
    });
  };

  const startCountdown = () => {
    const closeDate = getCloseDate();
    if (Number.isNaN(closeDate.getTime())) {
      refs.countdown.textContent = "Registration window active";
      if (refs.urgencyClose) {
        refs.urgencyClose.textContent = "Registration window active";
      }
      return;
    }

    const tick = () => {
      const now = new Date();
      const remaining = closeDate.getTime() - now.getTime();
      if (remaining <= 0) {
        refs.countdown.textContent = "Registrations closed";
        if (refs.urgencyClose) {
          refs.urgencyClose.textContent = "Registrations closed";
        }
        if (state.countdownTimer) {
          clearInterval(state.countdownTimer);
        }
        return;
      }

      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((remaining / (1000 * 60)) % 60);
      refs.countdown.textContent = `Registration closes in ${days}d ${hours}h ${minutes}m`;

      if (refs.urgencyClose) {
        const hoursLeft = getHoursUntilClose();
        refs.urgencyClose.textContent =
          typeof hoursLeft === "number" && hoursLeft <= 24
            ? `Closes in ${hoursLeft}h`
            : `Registration closes in ${days}d ${hours}h`;
      }
    };

    tick();
    state.countdownTimer = setInterval(tick, 60 * 1000);
  };

  const syncWishlistButton = () => {
    refs.wishlist.textContent = isSavedEvent(currentEvent.id) ? "Saved ♥" : "Save";
    if (refs.mobileSave) {
      refs.mobileSave.textContent = refs.wishlist.textContent;
    }
  };

  const shareEvent = async () => {
    const sharePayload = {
      title: currentEvent.title,
      text: `Join me at ${currentEvent.title} on NM District`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(sharePayload);
        return true;
      } catch (error) {
        // Continue to clipboard fallback.
      }
    }

    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(window.location.href);
      return true;
    }

    return false;
  };

  const downloadCalendarFile = () => {
    const date = currentEvent.date.replace(/-/g, "");
    const startStamp = `${date}T120000`;
    const endStamp = `${date}T150000`;
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `UID:${currentEvent.id}@nmdistrict`,
      `DTSTAMP:${date}T000000Z`,
      `DTSTART:${startStamp}`,
      `DTEND:${endStamp}`,
      `SUMMARY:${escapeICS(currentEvent.title)}`,
      `DESCRIPTION:${escapeICS(currentEvent.about)}`,
      `LOCATION:${escapeICS(currentEvent.venue)}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ];

    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentEvent.id}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const bindInteractions = () => {
    refs.ticketOptions.addEventListener("click", (event) => {
      const option = event.target.closest("[data-ticket-index]");
      if (!option) {
        return;
      }
      state.ticketIndex = Number(option.dataset.ticketIndex);
      renderTickets();
    });

    refs.qtyMinus.addEventListener("click", () => {
      state.quantity = Math.max(1, state.quantity - 1);
      updateBookingSummary();
    });

    refs.qtyPlus.addEventListener("click", () => {
      const ticket = getSelectedTicket();
      state.quantity = Math.min(Math.max(1, ticket.seats), state.quantity + 1);
      updateBookingSummary();
    });

    refs.wishlist.addEventListener("click", () => {
      toggleSavedEvent(currentEvent.id);
      syncWishlistButton();
    });

    refs.share.addEventListener("click", async () => {
      const didShare = await shareEvent();
      if (!didShare) {
        return;
      }

      refs.share.textContent = "Copied";
      if (refs.mobileShare) {
        refs.mobileShare.textContent = "Copied";
      }

      window.setTimeout(() => {
        refs.share.textContent = "Share";
        if (refs.mobileShare) {
          refs.mobileShare.textContent = "Share";
        }
      }, 1200);
    });

    refs.calendar.addEventListener("click", downloadCalendarFile);

    if (refs.mobileSave) {
      refs.mobileSave.addEventListener("click", () => {
        toggleSavedEvent(currentEvent.id);
        syncWishlistButton();
      });
    }

    if (refs.mobileShare) {
      refs.mobileShare.addEventListener("click", async () => {
        const didShare = await shareEvent();
        if (!didShare) {
          return;
        }
        refs.mobileShare.textContent = "Copied";
        window.setTimeout(() => {
          refs.mobileShare.textContent = "Share";
        }, 1200);
      });
    }

    if (refs.galleryPrev && refs.gallery) {
      refs.galleryPrev.addEventListener("click", () => {
        refs.gallery.scrollBy({ left: -360, behavior: "smooth" });
      });
    }

    if (refs.galleryNext && refs.gallery) {
      refs.galleryNext.addEventListener("click", () => {
        refs.gallery.scrollBy({ left: 360, behavior: "smooth" });
      });
    }

    window.addEventListener("nm:saved-events-updated", syncWishlistButton);
  };

  const ticketParam = params.get("ticket");
  if (ticketParam) {
    const index = currentEvent.tickets.findIndex((ticket) => ticket.name === ticketParam);
    if (index >= 0) {
      state.ticketIndex = index;
    }
  }

  renderHero();
  renderContentBlocks();
  renderTickets();
  syncWishlistButton();
  startCountdown();
  initDetailMotion();
  bindInteractions();
})();
