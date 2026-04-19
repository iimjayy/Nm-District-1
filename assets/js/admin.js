(() => {
  if (!window.NM_UTILS) {
    return;
  }

  const { events, clubs, categories, formatCurrency } = window.NM_UTILS;

  const STORAGE_KEYS = {
    customEvents: "nm-admin-events",
    publishState: "nm-admin-publish",
    inventory: "nm-admin-inventory",
    checkedIn: "nm-admin-checked-in"
  };

  const refs = {
    activeEvents: document.getElementById("activeEventsCount"),
    totalRegistrations: document.getElementById("totalRegistrationsCount"),
    totalRevenue: document.getElementById("totalRevenueCount"),
    engagementRate: document.getElementById("engagementRateCount"),
    engagementChart: document.getElementById("engagementChart"),
    categorySelect: document.getElementById("adminEventCategory"),
    clubSelect: document.getElementById("adminEventClub"),
    eventForm: document.getElementById("adminEventForm"),
    eventTitle: document.getElementById("adminEventTitle"),
    eventCategory: document.getElementById("adminEventCategory"),
    eventClub: document.getElementById("adminEventClub"),
    eventDate: document.getElementById("adminEventDate"),
    eventTime: document.getElementById("adminEventTime"),
    eventVenue: document.getElementById("adminEventVenue"),
    eventMode: document.getElementById("adminEventMode"),
    eventPrice: document.getElementById("adminEventPrice"),
    eventSeats: document.getElementById("adminEventSeats"),
    eventBanner: document.getElementById("adminBannerUrl"),
    eventPoster: document.getElementById("adminPosterUrl"),
    eventDesc: document.getElementById("adminEventDesc"),
    saveDraft: document.getElementById("saveDraftBtn"),
    publishStatus: document.getElementById("publishStatus"),
    attendeeTable: document.getElementById("attendeeTableBody"),
    exportAttendees: document.getElementById("exportAttendeesBtn"),
    refreshAttendees: document.getElementById("refreshAttendeesBtn"),
    inventoryList: document.getElementById("inventoryList"),
    scanInput: document.getElementById("scanInput"),
    scanResult: document.getElementById("scanResult"),
    publishList: document.getElementById("publishList")
  };

  const loadJSON = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch (error) {
      return fallback;
    }
  };

  const saveJSON = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getBookings = () => loadJSON("nm-bookings", []);

  const state = {
    customEvents: loadJSON(STORAGE_KEYS.customEvents, []),
    publishState: loadJSON(STORAGE_KEYS.publishState, {}),
    inventory: loadJSON(STORAGE_KEYS.inventory, {}),
    checkedIn: new Set(loadJSON(STORAGE_KEYS.checkedIn, []))
  };

  const getAllEvents = () => [...events, ...state.customEvents];

  const getEventInventory = (eventItem) => {
    const explicit = state.inventory[eventItem.id];
    if (typeof explicit === "number") {
      return explicit;
    }
    return eventItem.tickets?.[0]?.seats || 120;
  };

  const isPublished = (eventId) => state.publishState[eventId] !== false;

  const populateSelects = () => {
    refs.categorySelect.innerHTML = categories
      .map((category) => `<option value="${category.name}">${category.name}</option>`)
      .join("");

    refs.clubSelect.innerHTML = clubs
      .map((club) => `<option value="${club.name}">${club.name}</option>`)
      .join("");
  };

  const renderAnalytics = () => {
    const allEvents = getAllEvents();
    const bookings = getBookings();

    const activeEvents = allEvents.filter((eventItem) => isPublished(eventItem.id)).length;
    const totalRegistrations = bookings.length || 164;
    const totalRevenueValue = bookings.reduce((sum, booking) => sum + (booking.amount || 0), 0) || 126000;
    const engagementRate = Math.min(94, Math.max(62, Math.round(58 + activeEvents * 0.8)));

    refs.activeEvents.textContent = String(activeEvents);
    refs.totalRegistrations.textContent = totalRegistrations.toLocaleString("en-IN");
    refs.totalRevenue.textContent = formatCurrency(totalRevenueValue);
    refs.engagementRate.textContent = `${engagementRate}%`;

    const values = [62, 74, 81, 66, 88, 93, 79];
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    refs.engagementChart.innerHTML = values
      .map(
        (value, index) =>
          `<div class="bar" style="height:${value}%" data-day="${labels[index]}" title="${value}% engagement"></div>`
      )
      .join("");
  };

  const getAttendees = () => {
    const bookings = getBookings();
    if (bookings.length) {
      return bookings;
    }

    return events.slice(0, 6).map((eventItem, index) => ({
      bookingCode: `NM-A${1000 + index}`,
      studentName: `Student ${index + 1}`,
      eventTitle: eventItem.title,
      amount: eventItem.price,
      paymentMethod: "UPI",
      bookedAt: new Date().toISOString(),
      eventId: eventItem.id
    }));
  };

  const renderAttendees = () => {
    const attendees = getAttendees();

    refs.attendeeTable.innerHTML = attendees
      .slice(0, 20)
      .map((attendee) => {
        const checkedStatus = state.checkedIn.has(attendee.bookingCode) ? "Checked-In" : "Pending";
        return `
          <tr>
            <td>${attendee.bookingCode}</td>
            <td>${attendee.studentName || "NM Student"}</td>
            <td>${attendee.eventTitle}</td>
            <td>${checkedStatus}</td>
          </tr>
        `;
      })
      .join("");
  };

  const renderInventory = () => {
    refs.inventoryList.innerHTML = getAllEvents()
      .slice(0, 6)
      .map((eventItem) => `
        <article class="list-item">
          <div class="item-head">
            <h3 class="item-title">${eventItem.title}</h3>
            <span class="pill">${eventItem.category}</span>
          </div>
          <div class="item-meta">Seats Remaining: ${getEventInventory(eventItem)}</div>
          <input class="form-input" type="number" min="0" value="${getEventInventory(eventItem)}" data-inventory-input="${eventItem.id}" />
        </article>
      `)
      .join("");
  };

  const renderPublishList = () => {
    refs.publishList.innerHTML = getAllEvents()
      .slice(0, 9)
      .map((eventItem) => {
        const published = isPublished(eventItem.id);
        return `
          <article class="list-item">
            <div class="item-head">
              <h3 class="item-title">${eventItem.title}</h3>
              <span class="status-pill">${published ? "Published" : "Hidden"}</span>
            </div>
            <div class="item-meta">Organizer: ${eventItem.organizer || eventItem.club}</div>
            <button class="btn-inline" type="button" data-publish-toggle="${eventItem.id}">
              ${published ? "Unpublish" : "Publish"}
            </button>
          </article>
        `;
      })
      .join("");
  };

  const buildCustomEvent = () => {
    const title = refs.eventTitle.value.trim();
    const category = refs.eventCategory.value;
    const club = refs.eventClub.value;
    const date = refs.eventDate.value;
    const time = refs.eventTime.value.trim();
    const venue = refs.eventVenue.value.trim();
    const mode = refs.eventMode.value;
    const price = Number(refs.eventPrice.value || "0");
    const seats = Number(refs.eventSeats.value || "100");
    const banner = refs.eventBanner.value.trim();
    const poster = refs.eventPoster.value.trim();
    const description = refs.eventDesc.value.trim();

    return {
      id: `custom-${Date.now()}`,
      title,
      organizer: club,
      club,
      category,
      type: "Organizer Event",
      date,
      time,
      venue,
      mode,
      price,
      popularity: 50,
      isTrending: false,
      isLive: false,
      image:
        banner ||
        poster ||
        "assets/images/643821c3346d3269220af319cbc7a70b.jpg",
      about: description,
      registrationsClose: `${date}T20:00:00`,
      tickets: [
        {
          name: "General Access",
          price,
          seats
        }
      ],
      agenda: [
        { time: "18:00", title: "Session Start" },
        { time: "20:00", title: "Session End" }
      ],
      speakers: [],
      faq: [{ q: "Will passes be transferable?", a: "Pass transfers are disabled after check-in." }],
      rules: ["Follow NM campus code of conduct."],
      gallery: [
        banner ||
          poster ||
          "assets/images/7229b3b9bee41bf3b83f3fb5bff91bf8.jpg"
      ],
      reviews: []
    };
  };

  const resetForm = () => {
    refs.eventForm.reset();
    refs.eventMode.value = "offline";
    refs.eventPrice.value = "0";
    refs.eventSeats.value = "200";
  };

  const updateStatus = (message) => {
    refs.publishStatus.textContent = message;
  };

  const exportCSV = () => {
    const attendees = getAttendees();
    const headers = ["bookingCode", "studentName", "eventTitle", "paymentMethod", "status"];
    const rows = attendees.map((item) => [
      item.bookingCode,
      item.studentName || "NM Student",
      item.eventTitle,
      item.paymentMethod || "UPI",
      state.checkedIn.has(item.bookingCode) ? "Checked-In" : "Pending"
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nm-attendees.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  };

  const handleScan = () => {
    const code = refs.scanInput.value.trim();
    if (!code) {
      refs.scanResult.textContent = "Awaiting booking code...";
      return;
    }

    const attendee = getAttendees().find((item) => item.bookingCode === code);
    if (!attendee) {
      refs.scanResult.textContent = "Code not found. Check input or sync attendees.";
      return;
    }

    state.checkedIn.add(code);
    saveJSON(STORAGE_KEYS.checkedIn, Array.from(state.checkedIn));
    refs.scanResult.textContent = `Check-in successful: ${attendee.studentName || "NM Student"} for ${attendee.eventTitle}`;
    renderAttendees();
  };

  const bindEvents = () => {
    refs.saveDraft.addEventListener("click", () => {
      if (!refs.eventForm.reportValidity()) {
        return;
      }
      updateStatus("Draft saved locally. Publish when ready.");
    });

    refs.eventForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!refs.eventForm.reportValidity()) {
        return;
      }

      const customEvent = buildCustomEvent();
      state.customEvents.unshift(customEvent);
      state.publishState[customEvent.id] = true;
      state.inventory[customEvent.id] = customEvent.tickets[0].seats;

      saveJSON(STORAGE_KEYS.customEvents, state.customEvents);
      saveJSON(STORAGE_KEYS.publishState, state.publishState);
      saveJSON(STORAGE_KEYS.inventory, state.inventory);

      updateStatus(`Published: ${customEvent.title}`);
      resetForm();
      renderAnalytics();
      renderInventory();
      renderPublishList();
    });

    refs.exportAttendees.addEventListener("click", exportCSV);
    refs.refreshAttendees.addEventListener("click", renderAttendees);

    refs.inventoryList.addEventListener("input", (event) => {
      const input = event.target.closest("[data-inventory-input]");
      if (!input) {
        return;
      }
      const value = Math.max(0, Number(input.value || "0"));
      state.inventory[input.dataset.inventoryInput] = value;
      saveJSON(STORAGE_KEYS.inventory, state.inventory);
    });

    refs.publishList.addEventListener("click", (event) => {
      const toggleButton = event.target.closest("[data-publish-toggle]");
      if (!toggleButton) {
        return;
      }
      const eventId = toggleButton.dataset.publishToggle;
      const currentlyPublished = isPublished(eventId);
      state.publishState[eventId] = !currentlyPublished;
      saveJSON(STORAGE_KEYS.publishState, state.publishState);
      renderPublishList();
      renderAnalytics();
    });

    refs.scanInput.addEventListener("change", handleScan);
    refs.scanInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleScan();
      }
    });
  };

  populateSelects();
  renderAnalytics();
  renderAttendees();
  renderInventory();
  renderPublishList();
  bindEvents();
})();
