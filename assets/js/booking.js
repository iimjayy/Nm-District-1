(() => {
  if (!window.NM_UTILS) {
    return;
  }

  const { events, formatCurrency, formatDateTime } = window.NM_UTILS;

  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id") || events[0].id;
  const eventItem = events.find((item) => item.id === eventId) || events[0];

  const refs = {
    steps: Array.from(document.querySelectorAll("[data-step]")),
    stages: Array.from(document.querySelectorAll("[data-stage]")),
    eventTitle: document.getElementById("bookingEventTitle"),
    eventMeta: document.getElementById("bookingEventMeta"),
    ticketOptions: document.getElementById("bookingTicketOptions"),
    smartSuggestions: document.getElementById("smartSuggestions"),
    qtyMinus: document.getElementById("bookingQtyMinus"),
    qtyPlus: document.getElementById("bookingQtyPlus"),
    qtyDisplay: document.getElementById("bookingQtyDisplay"),
    subtotal: document.getElementById("bookingSubtotal"),
    toDetails: document.getElementById("toDetailsBtn"),
    toPayment: document.getElementById("toPaymentBtn"),
    backToPass: document.getElementById("backToPassBtn"),
    backToDetails: document.getElementById("backToDetailsBtn"),
    payNow: document.getElementById("payNowBtn"),
    studentForm: document.getElementById("studentForm"),
    referralInput: document.getElementById("refCode"),
    referralRewardNote: document.getElementById("refRewardNote"),
    paymentMethods: Array.from(document.querySelectorAll("[data-payment]")),
    paymentConfidence: document.getElementById("paymentConfidence"),
    summaryEvent: document.getElementById("summaryEvent"),
    summaryPass: document.getElementById("summaryPass"),
    summaryQty: document.getElementById("summaryQty"),
    summaryStudent: document.getElementById("summaryStudent"),
    summaryBase: document.getElementById("summaryBase"),
    summaryFee: document.getElementById("summaryFee"),
    summaryDiscount: document.getElementById("summaryDiscount"),
    summaryPayable: document.getElementById("summaryPayable"),
    ticketEventTitle: document.getElementById("ticketEventTitle"),
    ticketHolder: document.getElementById("ticketHolder"),
    ticketSeatInfo: document.getElementById("ticketSeatInfo"),
    ticketTimeInfo: document.getElementById("ticketTimeInfo"),
    ticketCode: document.getElementById("ticketCode"),
    ticketCard: document.getElementById("ticketCard"),
    qrCode: document.getElementById("qrCode"),
    confettiZone: document.getElementById("confettiZone"),
    successPane: document.getElementById("bookingSuccessPane"),
    downloadTicket: document.getElementById("downloadTicketBtn"),
    addCalendar: document.getElementById("addCalendarBtn"),
    shareTicket: document.getElementById("shareTicketBtn")
  };

  const state = {
    step: 1,
    selectedTicketIndex: 0,
    quantity: Number(params.get("qty") || "1"),
    payment: "UPI",
    bookingCode: "",
    finalAmount: 0
  };

  const ticketParam = params.get("ticket");
  if (ticketParam) {
    const ticketIndex = eventItem.tickets.findIndex((ticket) => ticket.name === ticketParam);
    if (ticketIndex >= 0) {
      state.selectedTicketIndex = ticketIndex;
    }
  }

  const getSelectedTicket = () => eventItem.tickets[state.selectedTicketIndex] || eventItem.tickets[0];

  const escapeICS = (input) => input.replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");

  const setStep = (step) => {
    const previousStep = state.step;
    state.step = step;
    refs.steps.forEach((stepElement) => {
      stepElement.classList.toggle("active", Number(stepElement.dataset.step) === step);
    });
    refs.stages.forEach((stageElement) => {
      const isActive = Number(stageElement.dataset.stage) === step;
      stageElement.classList.toggle("active", isActive);
      stageElement.classList.remove("slide-forward", "slide-backward");
      if (isActive && previousStep !== step) {
        stageElement.classList.add(step > previousStep ? "slide-forward" : "slide-backward");
      }
    });

    if (refs.successPane) {
      refs.successPane.classList.toggle("is-revealed", step === 4);
    }

    if (refs.ticketCard) {
      refs.ticketCard.classList.remove("ticket-reveal");
      if (step === 4) {
        requestAnimationFrame(() => {
          refs.ticketCard?.classList.add("ticket-reveal");
        });
      }
    }

    window.NM_MOTION?.rehydrateDynamicContent(document);
  };

  const updateSubtotal = () => {
    const selectedTicket = getSelectedTicket();
    const maxQty = Math.min(selectedTicket.seats, 8);
    if (state.quantity > maxQty) {
      state.quantity = maxQty;
    }
    state.quantity = Math.max(1, state.quantity);

    refs.qtyDisplay.textContent = String(state.quantity);
    refs.subtotal.textContent = formatCurrency(selectedTicket.price * state.quantity);
  };

  const renderPassOptions = (animateSelection = false) => {
    refs.ticketOptions.innerHTML = eventItem.tickets
      .map(
        (ticket, index) => `
          <article class="ticket-option ${index === state.selectedTicketIndex ? "active" : ""}" data-ticket-index="${index}">
            <div class="ticket-title">
              <span>${ticket.name}</span>
              <span>${formatCurrency(ticket.price)}</span>
            </div>
            <div class="ticket-meta">${ticket.seats} seats remaining</div>
          </article>
        `
      )
      .join("");

    if (animateSelection) {
      const activeOption = refs.ticketOptions.querySelector(`[data-ticket-index="${state.selectedTicketIndex}"]`);
      if (activeOption) {
        activeOption.classList.add("is-select-pop");
      }
    }

    updateSubtotal();
    window.NM_MOTION?.rehydrateDynamicContent(refs.ticketOptions);
  };

  const renderSmartSuggestions = () => {
    if (!refs.smartSuggestions) {
      return;
    }

    const suggestions = events
      .filter((item) => item.id !== eventItem.id)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 3);

    refs.smartSuggestions.innerHTML = suggestions
      .map(
        (item) => `
          <article class="suggestion-card" data-suggestion-id="${item.id}">
            <img src="${item.image}" alt="${item.title}" />
            <div>
              <h4>${item.title}</h4>
              <p>${item.category} · ${formatCurrency(item.price)} onwards</p>
            </div>
          </article>
        `
      )
      .join("");

    window.NM_MOTION?.rehydrateDynamicContent(refs.smartSuggestions);
  };

  const updateReferralRewardNote = () => {
    if (!refs.referralRewardNote || !refs.referralInput) {
      return;
    }

    const value = refs.referralInput.value.trim();
    if (value.length >= 3) {
      refs.referralRewardNote.textContent = `Referral preview applied: you can save up to ${formatCurrency(220)}.`;
      refs.referralRewardNote.classList.add("active");
      return;
    }

    refs.referralRewardNote.textContent = "Add a referral code to unlock up to ₹220 discount.";
    refs.referralRewardNote.classList.remove("active");
  };

  const gatherStudentData = () => {
    const values = {
      name: document.getElementById("studentName").value.trim(),
      email: document.getElementById("studentEmail").value.trim(),
      phone: document.getElementById("studentPhone").value.trim(),
      year: document.getElementById("studentYear").value,
      studentId: document.getElementById("studentId").value.trim(),
      referral: document.getElementById("refCode").value.trim(),
      notes: document.getElementById("notes").value.trim()
    };
    return values;
  };

  const calculatePricing = (studentDetails) => {
    const selectedTicket = getSelectedTicket();
    const base = selectedTicket.price * state.quantity;
    const platformFee = Math.round(base * 0.04);
    const discount = studentDetails.referral ? Math.min(Math.round(base * 0.1), 220) : 0;
    const payable = Math.max(0, base + platformFee - discount);

    return {
      base,
      platformFee,
      discount,
      payable
    };
  };

  const updateSummary = () => {
    const studentDetails = gatherStudentData();
    const pricing = calculatePricing(studentDetails);

    refs.summaryEvent.textContent = eventItem.title;
    refs.summaryPass.textContent = getSelectedTicket().name;
    refs.summaryQty.textContent = String(state.quantity);
    refs.summaryStudent.textContent = studentDetails.name || "-";
    refs.summaryBase.textContent = formatCurrency(pricing.base);
    refs.summaryFee.textContent = formatCurrency(pricing.platformFee);
    refs.summaryDiscount.textContent = `-${formatCurrency(pricing.discount)}`;
    refs.summaryPayable.textContent = formatCurrency(pricing.payable);

    state.finalAmount = pricing.payable;
  };

  const updatePaymentConfidence = () => {
    if (!refs.paymentConfidence) {
      return;
    }

    const byMethod = {
      UPI: ["Fast intent verification", "Bank-grade encryption", "Average success in < 6s"],
      Card: ["3D Secure protected", "PCI-compliant tokenization", "Supports all major banks"],
      Wallet: ["One-tap authentication", "Instant debit confirmation", "Auto-generated transaction receipt"]
    };

    const lines = byMethod[state.payment] || byMethod.UPI;
    refs.paymentConfidence.innerHTML = lines.map((line) => `<span>${line}</span>`).join("");
  };

  const launchConfetti = () => {
    refs.confettiZone.innerHTML = "";
    const colors = ["#62e5c3", "#4ba8ff", "#f3cb83", "#9957ff", "#ffffff"];

    for (let i = 0; i < 46; i += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = `${Math.random() * 0.8}s`;
      piece.style.transform = `rotate(${Math.random() * 180}deg)`;
      refs.confettiZone.appendChild(piece);
    }
  };

  const generateQRCode = (textValue) => {
    refs.qrCode.innerHTML = "";
    if (window.QRCode) {
      new window.QRCode(refs.qrCode, {
        text: textValue,
        width: 112,
        height: 112,
        colorDark: "#111111",
        colorLight: "#ffffff"
      });
      return;
    }
    refs.qrCode.textContent = "QR unavailable";
  };

  const saveBookingRecord = (studentDetails) => {
    const bookingItem = {
      bookingCode: state.bookingCode,
      eventId: eventItem.id,
      eventTitle: eventItem.title,
      eventDate: eventItem.date,
      eventTime: eventItem.time,
      venue: eventItem.venue,
      passName: getSelectedTicket().name,
      quantity: state.quantity,
      amount: state.finalAmount,
      studentName: studentDetails.name,
      studentId: studentDetails.studentId,
      paymentMethod: state.payment,
      bookedAt: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem("nm-bookings") || "[]");
    existing.unshift(bookingItem);
    localStorage.setItem("nm-bookings", JSON.stringify(existing.slice(0, 80)));
  };

  const renderSuccessTicket = () => {
    const studentDetails = gatherStudentData();
    state.bookingCode = `NM-${Math.floor(100000 + Math.random() * 900000)}`;

    refs.ticketEventTitle.textContent = eventItem.title;
    refs.ticketHolder.textContent = studentDetails.name || "NM Student";
    refs.ticketSeatInfo.textContent = `${getSelectedTicket().name} · Qty ${state.quantity}`;
    refs.ticketTimeInfo.textContent = `${formatDateTime(eventItem.date, eventItem.time)} · ${eventItem.venue}`;
    refs.ticketCode.textContent = state.bookingCode;

    generateQRCode(
      JSON.stringify({
        bookingCode: state.bookingCode,
        eventId: eventItem.id,
        student: studentDetails.name,
        pass: getSelectedTicket().name,
        quantity: state.quantity
      })
    );

    saveBookingRecord(studentDetails);
    launchConfetti();
    refs.successPane?.classList.add("is-revealed");
    refs.ticketCard?.classList.add("ticket-reveal");
  };

  const downloadTicketFile = () => {
    const details = [
      `NM DISTRICT TICKET`,
      `Booking Code: ${state.bookingCode}`,
      `Event: ${eventItem.title}`,
      `Date: ${eventItem.date}`,
      `Time: ${eventItem.time}`,
      `Venue: ${eventItem.venue}`,
      `Pass: ${getSelectedTicket().name}`,
      `Quantity: ${state.quantity}`,
      `Amount Paid: ${formatCurrency(state.finalAmount)}`,
      `Issued: ${new Date().toLocaleString("en-IN")}`
    ].join("\n");

    const blob = new Blob([details], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${state.bookingCode || "NM-Ticket"}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const addToCalendar = () => {
    const date = eventItem.date.replace(/-/g, "");
    const startStamp = `${date}T120000`;
    const endStamp = `${date}T150000`;
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `UID:${state.bookingCode || eventItem.id}@nmdistrict`,
      `DTSTAMP:${date}T000000Z`,
      `DTSTART:${startStamp}`,
      `DTEND:${endStamp}`,
      `SUMMARY:${escapeICS(eventItem.title)}`,
      `DESCRIPTION:${escapeICS(`Booking ${state.bookingCode || "NM-District"}`)}`,
      `LOCATION:${escapeICS(eventItem.venue)}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ];

    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${state.bookingCode || eventItem.id}.ics`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const shareBooking = async () => {
    const shareMessage = `I just booked ${eventItem.title} on NM District. Booking code: ${state.bookingCode}`;
    const payload = {
      title: `${eventItem.title} · NM District`,
      text: shareMessage,
      url: `${window.location.origin}/dashboard.html`
    };

    if (navigator.share) {
      try {
        await navigator.share(payload);
        return true;
      } catch (error) {
        // Continue to clipboard fallback.
      }
    }

    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(`${shareMessage}\n${window.location.href}`);
      return true;
    }

    return false;
  };

  const initMeta = () => {
    refs.eventTitle.textContent = eventItem.title;
    refs.eventMeta.textContent = `${formatDateTime(eventItem.date, eventItem.time)} · ${eventItem.venue}`;
    updateReferralRewardNote();
    updatePaymentConfidence();
  };

  const bindEvents = () => {
    refs.ticketOptions.addEventListener("click", (event) => {
      const ticket = event.target.closest("[data-ticket-index]");
      if (!ticket) {
        return;
      }
      state.selectedTicketIndex = Number(ticket.dataset.ticketIndex);
      renderPassOptions(true);
    });

    refs.qtyMinus.addEventListener("click", () => {
      state.quantity = Math.max(1, state.quantity - 1);
      updateSubtotal();
    });

    refs.qtyPlus.addEventListener("click", () => {
      const maxQty = Math.min(getSelectedTicket().seats, 8);
      state.quantity = Math.min(maxQty, state.quantity + 1);
      updateSubtotal();
    });

    refs.toDetails.addEventListener("click", () => {
      setStep(2);
    });

    refs.backToPass.addEventListener("click", () => {
      setStep(1);
    });

    refs.toPayment.addEventListener("click", () => {
      if (!refs.studentForm.reportValidity()) {
        return;
      }
      updateSummary();
      setStep(3);
    });

    refs.backToDetails.addEventListener("click", () => {
      setStep(2);
    });

    refs.paymentMethods.forEach((button) => {
      button.addEventListener("click", () => {
        refs.paymentMethods.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        button.classList.remove("is-select-pop");
        void button.offsetWidth;
        button.classList.add("is-select-pop");
        state.payment = button.dataset.payment;
        updatePaymentConfidence();
      });
    });

    refs.payNow.addEventListener("click", () => {
      refs.payNow.disabled = true;
      refs.payNow.textContent = "Validating details...";

      window.setTimeout(() => {
        refs.payNow.textContent = "Securing payment...";
      }, 420);

      window.setTimeout(() => {
        refs.payNow.disabled = false;
        refs.payNow.textContent = "Pay & Confirm";
        renderSuccessTicket();
        setStep(4);
      }, 1100);
    });

    if (refs.referralInput) {
      refs.referralInput.addEventListener("input", () => {
        updateReferralRewardNote();
        if (state.step >= 3) {
          updateSummary();
        }
      });
    }

    if (refs.smartSuggestions) {
      refs.smartSuggestions.addEventListener("click", (event) => {
        const card = event.target.closest("[data-suggestion-id]");
        if (!card) {
          return;
        }
        window.location.href = `event.html?id=${card.dataset.suggestionId}`;
      });
    }

    refs.downloadTicket.addEventListener("click", downloadTicketFile);

    if (refs.addCalendar) {
      refs.addCalendar.addEventListener("click", addToCalendar);
    }

    if (refs.shareTicket) {
      refs.shareTicket.addEventListener("click", async () => {
        const didShare = await shareBooking();
        if (!didShare) {
          return;
        }
        refs.shareTicket.textContent = "Copied";
        window.setTimeout(() => {
          refs.shareTicket.textContent = "Share Ticket";
        }, 1200);
      });
    }
  };

  initMeta();
  renderPassOptions();
  renderSmartSuggestions();
  setStep(1);
  bindEvents();
})();
