(() => {
  if (!window.NM_UTILS) {
    return;
  }

  const { events, getSavedEvents, formatDateTime, formatCurrency } = window.NM_UTILS;

  const refs = {
    upcomingCount: document.getElementById("upcomingCount"),
    savedCount: document.getElementById("savedCount"),
    rewardCount: document.getElementById("rewardCount"),
    profileCompletionValue: document.getElementById("profileCompletionValue"),
    profileCompletionText: document.getElementById("profileCompletionText"),
    profileProgressFill: document.getElementById("profileProgressFill"),
    eventList: document.getElementById("dashboardEventList"),
    savedEventsList: document.getElementById("savedEventsList"),
    notificationList: document.getElementById("notificationList"),
    paymentHistoryBody: document.getElementById("paymentHistoryBody"),
    downloadTicketsList: document.getElementById("downloadTicketsList"),
    rewardBalance: document.getElementById("rewardBalance"),
    referralCount: document.getElementById("referralCount"),
    eventTabs: Array.from(document.querySelectorAll("[data-tab]"))
  };

  const getBookings = () => {
    try {
      return JSON.parse(localStorage.getItem("nm-bookings") || "[]");
    } catch (error) {
      return [];
    }
  };

  const state = {
    tab: "upcoming",
    bookings: getBookings(),
    savedEvents: getSavedEvents()
  };

  const getEventById = (eventId) => events.find((eventItem) => eventItem.id === eventId);

  const isUpcoming = (dateValue) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(`${dateValue}T00:00:00`) >= today;
  };

  const getDisplayBookings = () => {
    if (state.bookings.length) {
      return state.bookings;
    }

    return events.slice(0, 4).map((eventItem, index) => ({
      bookingCode: `PREVIEW-${index + 1}`,
      eventId: eventItem.id,
      eventTitle: eventItem.title,
      eventDate: eventItem.date,
      eventTime: eventItem.time,
      venue: eventItem.venue,
      passName: eventItem.tickets[0]?.name || "General",
      quantity: 1,
      amount: eventItem.tickets[0]?.price || 0,
      studentName: "NM Student",
      paymentMethod: "UPI",
      bookedAt: new Date().toISOString(),
      preview: true
    }));
  };

  const renderMetrics = () => {
    const bookings = getDisplayBookings();
    const upcomingItems = bookings.filter((item) => isUpcoming(item.eventDate));

    const referralCount = Math.max(1, Math.floor(bookings.length / 2));
    const reward = referralCount * 125;

    const completion = Math.min(97, 72 + (state.savedEvents.length > 0 ? 8 : 0) + (state.bookings.length > 0 ? 13 : 0));

    refs.upcomingCount.textContent = String(upcomingItems.length);
    refs.savedCount.textContent = String(state.savedEvents.length);
    refs.rewardCount.textContent = formatCurrency(reward);
    refs.profileCompletionValue.textContent = `${completion}%`;
    refs.profileCompletionText.textContent = `${completion}%`;
    refs.profileProgressFill.style.width = `${completion}%`;
    refs.rewardBalance.textContent = formatCurrency(reward);
    refs.referralCount.textContent = String(referralCount);
  };

  const renderEventList = () => {
    const bookings = getDisplayBookings();
    const filtered = bookings.filter((booking) =>
      state.tab === "upcoming" ? isUpcoming(booking.eventDate) : !isUpcoming(booking.eventDate)
    );

    if (!filtered.length) {
      refs.eventList.innerHTML =
        '<div class="empty-state">No events in this section yet. Book one from Explore to see it here.</div>';
      return;
    }

    refs.eventList.innerHTML = filtered
      .map(
        (item) => `
          <article class="list-item">
            <div class="item-head">
              <h3 class="item-title">${item.eventTitle}</h3>
              <span class="pill">${item.passName}</span>
            </div>
            <div class="item-meta">${formatDateTime(item.eventDate, item.eventTime)} · ${item.venue}</div>
            <div class="item-meta">Booking: ${item.bookingCode}</div>
          </article>
        `
      )
      .join("");
  };

  const renderSavedEvents = () => {
    const matched = state.savedEvents
      .map((id) => getEventById(id))
      .filter(Boolean)
      .slice(0, 5);

    if (!matched.length) {
      refs.savedEventsList.innerHTML =
        '<div class="empty-state">No saved events yet. Tap the heart icon while exploring events.</div>';
      return;
    }

    refs.savedEventsList.innerHTML = matched
      .map(
        (item) => `
          <article class="list-item">
            <div class="item-head">
              <h3 class="item-title">${item.title}</h3>
              <a class="btn-inline" href="event.html?id=${item.id}">Open</a>
            </div>
            <div class="item-meta">${formatDateTime(item.date, item.time)} · ${item.venue}</div>
          </article>
        `
      )
      .join("");
  };

  const renderNotifications = () => {
    const upcoming = events
      .filter((eventItem) => isUpcoming(eventItem.date))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);

    const notifications = [
      ...upcoming.map((item) => `${item.title} closes registration soon.`),
      "Referral rewards updated after your latest booking.",
      "New premium workshop drop in the Explore tab."
    ];

    refs.notificationList.innerHTML = notifications
      .map((message) => `<article class="list-item">${message}</article>`)
      .join("");
  };

  const renderPayments = () => {
    const bookings = getDisplayBookings();

    refs.paymentHistoryBody.innerHTML = bookings
      .slice(0, 8)
      .map(
        (item) => `
          <tr>
            <td>${item.bookingCode}</td>
            <td>${item.eventTitle}</td>
            <td>${formatCurrency(item.amount)}</td>
            <td>${item.paymentMethod}</td>
            <td>${new Date(item.bookedAt).toLocaleDateString("en-IN")}</td>
          </tr>
        `
      )
      .join("");
  };

  const renderDownloadTickets = () => {
    const bookings = getDisplayBookings().filter((booking) => isUpcoming(booking.eventDate));

    if (!bookings.length) {
      refs.downloadTicketsList.innerHTML = '<div class="empty-state">No active tickets available for download.</div>';
      return;
    }

    refs.downloadTicketsList.innerHTML = bookings
      .map(
        (item) => `
          <article class="list-item">
            <div class="item-head">
              <h3 class="item-title">${item.eventTitle}</h3>
              <button class="btn-inline" type="button" data-download="${item.bookingCode}">Download</button>
            </div>
            <div class="item-meta">${item.passName} · Qty ${item.quantity} · ${item.bookingCode}</div>
          </article>
        `
      )
      .join("");
  };

  const downloadTicket = (bookingCode) => {
    const booking = getDisplayBookings().find((item) => item.bookingCode === bookingCode);
    if (!booking) {
      return;
    }

    const details = [
      "NM DISTRICT · TICKET EXPORT",
      `Booking: ${booking.bookingCode}`,
      `Event: ${booking.eventTitle}`,
      `Date: ${booking.eventDate}`,
      `Time: ${booking.eventTime}`,
      `Venue: ${booking.venue}`,
      `Pass: ${booking.passName}`,
      `Quantity: ${booking.quantity}`,
      `Amount: ${formatCurrency(booking.amount)}`
    ].join("\n");

    const blob = new Blob([details], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${booking.bookingCode}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const bindEvents = () => {
    refs.eventTabs.forEach((button) => {
      button.addEventListener("click", () => {
        refs.eventTabs.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        state.tab = button.dataset.tab;
        renderEventList();
      });
    });

    refs.downloadTicketsList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-download]");
      if (!button) {
        return;
      }
      downloadTicket(button.dataset.download);
    });

    window.addEventListener("nm:saved-events-updated", () => {
      state.savedEvents = getSavedEvents();
      renderSavedEvents();
      renderMetrics();
    });
  };

  renderMetrics();
  renderEventList();
  renderSavedEvents();
  renderNotifications();
  renderPayments();
  renderDownloadTickets();
  bindEvents();
  window.NM_MOTION?.rehydrateDynamicContent(document);
})();
