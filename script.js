document.addEventListener("DOMContentLoaded", () => {

  const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbyCVouSyNva17C_ca16nx2rJp3FQBM64LQSgGpMhrbLoZIZ2MXCNbhbFk6V_IUPlcdH/exec";

  const EVENT_DETAILS = {
    title: "Pemberkatan Nikah Kevin & Mariska",
    dateText: "Sabtu, 17 Juli 2027",
    timeText: "10.00 - 11.30 WIB",
    venue: "Gereja Mahasiswa Bandung",
    address: "Jln Sultan Agung No.4, Bandung, Indonesia",
    startsAt: "2027-07-17T10:00:00+07:00",
    endsAt: "2027-07-17T11:30:00+07:00",
    timeZone: "Asia/Jakarta",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Gereja%20Mahasiswa%20Bandung%20Jln%20Sultan%20Agung%20No.4"
  };

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  window.scrollTo(0, 0);
  document.body.style.overflowY = "hidden";
  document.body.style.height = "100vh";

  const button = document.getElementById("openBtn");
  const guestName = document.getElementById("guestName");
  const coupleName = document.getElementById("coupleName");
  const heroTagline = document.getElementById("heroTagline");
  const music = document.getElementById("bgMusic");

  const rsvpForm =
    document.getElementById("rsvpForm");

  const invalidInviteCard =
    document.getElementById("invalidInviteCard");

  const guestSelect =
    document.getElementById("guestSelect");

  const attendanceGroup =
    document.getElementById("attendanceGroup");

  const guestCountGroup =
    document.getElementById("guestCountGroup");

  const rsvpMessage =
    document.getElementById("rsvpMessage");

  const guestNotes =
    document.getElementById("guestNotes");

  const guestKeyInput =
    document.getElementById("guestKey");

  const guestDisplayNameInput =
    document.getElementById("guestDisplayName");

  let currentGuestKey = "guest";
  let currentGuestName = "Guest";
  let invitationOpened = false;
  let isValidGuest = false;
  window.invitationOpened = false;

  button.disabled = true;
  button.innerText = "Memuat Undangan";

  function applyEventDetails() {

    document.getElementById("eventDateText").innerText =
      EVENT_DETAILS.dateText;

    document.getElementById("eventTimeText").innerText =
      EVENT_DETAILS.timeText;

    document.getElementById("eventVenueText").innerText =
      EVENT_DETAILS.venue;

    document.getElementById("eventAddressText").innerText =
      EVENT_DETAILS.address;

    const mapBtn =
      document.getElementById("mapBtn");

    const calendarBtn =
      document.getElementById("calendarBtn");

    if (EVENT_DETAILS.mapUrl) {

      mapBtn.href = EVENT_DETAILS.mapUrl;

    } else {

      mapBtn.removeAttribute("href");
      mapBtn.setAttribute("aria-disabled", "true");
    }

    calendarBtn.disabled =
      !EVENT_DETAILS.startsAt || !EVENT_DETAILS.endsAt;
  }

  function updateEventCountdown() {

    const countdownDays =
      document.getElementById("countdownDays");

    const countdownHours =
      document.getElementById("countdownHours");

    const countdownMinutes =
      document.getElementById("countdownMinutes");

    const countdownMessage =
      document.getElementById("countdownMessage");

    const eventStart =
      new Date(EVENT_DETAILS.startsAt).getTime();

    const eventEnd =
      new Date(EVENT_DETAILS.endsAt).getTime();

    const now =
      Date.now();

    if (!Number.isFinite(eventStart)) {

      document.getElementById("eventCountdown").hidden = true;
      countdownMessage.innerText = "";

      return;
    }

    if (now >= eventStart) {

      countdownDays.innerText = "000";
      countdownHours.innerText = "00";
      countdownMinutes.innerText = "00";
      countdownMessage.innerText =
        now <= eventEnd
          ? "Hari ini adalah hari pemberkatan nikah kami."
          : "Terima kasih telah merayakan hari istimewa ini bersama kami.";

      return;
    }

    const totalMinutes =
      Math.floor((eventStart - now) / 60000);

    const days =
      Math.floor(totalMinutes / 1440);

    const hours =
      Math.floor((totalMinutes % 1440) / 60);

    const minutes =
      totalMinutes % 60;

    countdownDays.innerText =
      String(days).padStart(3, "0");

    countdownHours.innerText =
      String(hours).padStart(2, "0");

    countdownMinutes.innerText =
      String(minutes).padStart(2, "0");

    countdownMessage.innerText =
      "Menuju hari bahagia kami di Bandung";
  }

  function formatCalendarWallTime(value) {

    return value
      .slice(0, 19)
      .replace(/[-:]/g, "");
  }

  function formatCalendarTimestamp(value) {

    return new Date(value)
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  }

  function downloadCalendarInvite() {

    if (!EVENT_DETAILS.startsAt || !EVENT_DETAILS.endsAt) {

      return;
    }

    const calendarContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Kevin Mariska Invitation//EN",
      "BEGIN:VTIMEZONE",
      `TZID:${EVENT_DETAILS.timeZone}`,
      "BEGIN:STANDARD",
      "TZOFFSETFROM:+0700",
      "TZOFFSETTO:+0700",
      "TZNAME:WIB",
      "DTSTART:19700101T000000",
      "END:STANDARD",
      "END:VTIMEZONE",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@kevin-mariska-invitation`,
      `DTSTAMP:${formatCalendarTimestamp(new Date().toISOString())}`,
      `DTSTART;TZID=${EVENT_DETAILS.timeZone}:${formatCalendarWallTime(EVENT_DETAILS.startsAt)}`,
      `DTEND;TZID=${EVENT_DETAILS.timeZone}:${formatCalendarWallTime(EVENT_DETAILS.endsAt)}`,
      `SUMMARY:${EVENT_DETAILS.title}`,
      `LOCATION:${EVENT_DETAILS.venue}, ${EVENT_DETAILS.address}`,
      "DESCRIPTION:Pemberkatan nikah dimulai pukul 10.00 WIB di Bandung.",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const link =
      document.createElement("a");

    link.href =
      URL.createObjectURL(new Blob([calendarContent], { type: "text/calendar" }));

    link.download =
      "kevin-mariska-church-blessing.ics";

    link.click();

    URL.revokeObjectURL(link.href);
  }

  applyEventDetails();
  updateEventCountdown();

  window.setInterval(updateEventCountdown, 60000);

  document
    .getElementById("calendarBtn")
    .addEventListener("click", downloadCalendarInvite);

  /* =========================
     Couple Photo Carousel
  ========================= */

  const carousel =
    document.getElementById("coupleCarousel");

  const carouselSlides =
    Array.from(carousel.querySelectorAll(".carousel-slide"));

  const carouselDots =
    Array.from(carousel.querySelectorAll(".carousel-dot"));

  const carouselPrevious =
    carousel.querySelector(".carousel-previous");

  const carouselNext =
    carousel.querySelector(".carousel-next");

  let activeCarouselSlide = 0;
  let carouselTimer;

  function showCarouselSlide(index) {

    activeCarouselSlide =
      (index + carouselSlides.length) % carouselSlides.length;

    carouselSlides.forEach((slide, slideIndex) => {

      const isActive =
        slideIndex === activeCarouselSlide;

      slide.classList.toggle("is-active", isActive);
      carouselDots[slideIndex].classList.toggle("is-active", isActive);
      carouselDots[slideIndex].setAttribute(
        "aria-current",
        isActive ? "true" : "false"
      );
    });
  }

  function startCarousel() {

    window.clearInterval(carouselTimer);

    carouselTimer = window.setInterval(() => {

      showCarouselSlide(activeCarouselSlide + 1);

    }, 3500);
  }

  carouselPrevious.addEventListener("click", () => {

    showCarouselSlide(activeCarouselSlide - 1);
    startCarousel();
  });

  carouselNext.addEventListener("click", () => {

    showCarouselSlide(activeCarouselSlide + 1);
    startCarousel();
  });

  carouselDots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

      showCarouselSlide(index);
      startCarousel();
    });
  });

  carousel.addEventListener("mouseenter", () => {
    window.clearInterval(carouselTimer);
  });

  carousel.addEventListener("mouseleave", startCarousel);
  carousel.addEventListener("focusin", () => {
    window.clearInterval(carouselTimer);
  });
  carousel.addEventListener("focusout", startCarousel);

  startCarousel();

  function showGuestCountError() {

    guestSelect.classList.add("field-error");
    guestSelect.setAttribute("aria-invalid", "true");

    rsvpMessage.innerText =
      "Mohon pilih jumlah tamu yang akan hadir.";

    guestSelect.focus();
  }

  function clearGuestCountError() {

    guestSelect.classList.remove("field-error");
    guestSelect.removeAttribute("aria-invalid");
  }

  function getAttendanceStatus() {

    const selected =
      rsvpForm.querySelector("input[name='attendanceStatus']:checked");

    return selected ? selected.value : "";
  }

  function setAttendanceStatus(status) {

    const input =
      rsvpForm.querySelector(`input[name='attendanceStatus'][value='${status}']`);

    if (input) {

      input.checked = true;
    }

    updateAttendanceView();
  }

  function showAttendanceError() {

    attendanceGroup.classList.add("field-error");

    rsvpMessage.innerText =
      "Mohon pilih apakah Anda akan hadir atau tidak dapat hadir.";

    attendanceGroup.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function clearAttendanceError() {

    attendanceGroup.classList.remove("field-error");
  }

  function updateAttendanceView() {

    const status =
      getAttendanceStatus();

    guestCountGroup.hidden =
      status !== "attending";

    if (status !== "attending") {

      clearGuestCountError();
      guestSelect.value = "";
    }

    if (status) {

      clearAttendanceError();
    }

  }

  function showInvalidInvite() {

    isValidGuest = false;

    document.body.classList.add("invalid-invite");

    guestName.innerText =
      "Tautan undangan tidak dikenal";

    coupleName.hidden = true;
    heroTagline.innerText =
      "Silakan hubungi keluarga pengundang untuk mendapatkan tautan yang benar.";

    button.hidden = true;
    rsvpForm.hidden = true;
    invalidInviteCard.hidden = false;
  }

  function showValidInvite() {

    isValidGuest = true;

    document.body.classList.remove("invalid-invite");

    coupleName.hidden = false;
    heroTagline.innerText =
      "Kepada Yth:";

    button.hidden = false;
    rsvpForm.hidden = false;
    invalidInviteCard.hidden = true;
  }

  function fetchJsonp(url) {

    return new Promise((resolve, reject) => {

      const callbackName =
        `rsvpCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`;

      const script =
        document.createElement("script");

      const separator =
        url.includes("?") ? "&" : "?";

      window[callbackName] = (data) => {

        resolve(data);
        script.remove();
        delete window[callbackName];
      };

      script.onerror = () => {

        reject(new Error("Data RSVP tidak dapat dimuat."));
        script.remove();
        delete window[callbackName];
      };

      script.src =
        `${url}${separator}callback=${callbackName}&cacheBust=${Date.now()}`;

      document.body.appendChild(script);
    });

  }

  async function loadExistingRsvp() {

    if (!RSVP_ENDPOINT || !currentGuestKey || currentGuestKey === "guest") {

      return;
    }

    rsvpMessage.innerText =
      "Memeriksa RSVP Anda sebelumnya...";

    try {

      const response =
        await fetchJsonp(`${RSVP_ENDPOINT}?guestKey=${encodeURIComponent(currentGuestKey)}`);

      if (!response.rsvp) {

        rsvpMessage.innerText =
          "";

        return;
      }

      guestSelect.value =
        response.rsvp.guestCount;

      setAttendanceStatus(response.rsvp.guestCount === "0" ? "unable" : "attending");

      guestNotes.value =
        response.rsvp.notes || "";

      rsvpMessage.innerText =
        "RSVP Anda sebelumnya ditampilkan di bawah ini. Kirim kembali untuk memperbarui.";

    } catch (error) {

      console.log("Previous RSVP unavailable:", error);

      rsvpMessage.innerText =
        "";
    }

  }

  function buildGuestOptions(maxGuests = 5) {

    guestSelect.innerHTML =
      `<option value="">Pilih Jumlah Tamu</option>`;

    for (let i = 1; i <= maxGuests; i++) {

      const option =
        document.createElement("option");

      option.value = i;

      option.textContent =
        `${i} Tamu`;

      guestSelect.appendChild(option);
    }

  }

  function normalizeGuestKey(value) {

    return (value || "")
      .trim()
      .toLowerCase()
      .replace(/[.,;:!?]+$/, "");
  }

  /* =========================
     Guest Database
  ========================= */

  async function loadGuest() {

    buildGuestOptions();

    try {

      const response =
        await fetch("guests.json");

      const guests =
        await response.json();

      const params =
        new URLSearchParams(window.location.search);

      const guestKey =
        normalizeGuestKey(params.get("guest"));

      if (guestKey && guests[guestKey]) {

        const guestData =
          guests[guestKey];

        currentGuestKey = guestKey;
        currentGuestName = guestData.name;
        showValidInvite();

        guestName.innerText =
          guestData.name;

        guestKeyInput.value = currentGuestKey;
        guestDisplayNameInput.value = currentGuestName;

        buildGuestOptions(guestData.maxGuests);
        await loadExistingRsvp();

      } else {

        showInvalidInvite();
      }

    } catch (error) {

      console.log("Guest list unavailable:", error);

      showInvalidInvite();
    } finally {

      button.disabled = false;
      button.innerText = "Buka Undangan";
    }

  }

  loadGuest();

  guestSelect.addEventListener("change", () => {

    if (guestSelect.value) {

      clearGuestCountError();
    }

  });

  rsvpForm
    .querySelectorAll("input[name='attendanceStatus']")
    .forEach((input) => {

      input.addEventListener("change", updateAttendanceView);
    });

  /* =========================
     Open Invitation
  ========================= */

  button.addEventListener("click", () => {

    if (!isValidGuest) {

      return;
    }

    invitationOpened = true;
    window.invitationOpened = true;

    /* Unlock scrolling */

    document.body.style.overflowY = "auto";
    document.body.style.height = "auto";

    /* Smooth scroll */

    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth"
    });

    /* Start music */

    music.volume = 0.35;

    music.play().catch((error) => {
      console.log("Autoplay prevented:", error);
    });

    button.innerText = "Selamat Datang";

  });

  /* =========================
     Reveal Sections
  ========================= */

  const hiddenSections =
    document.querySelectorAll(".hidden-section");

  const observer =
    new IntersectionObserver((entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add("show-section");
        }

      });

    }, {
      threshold: 0.2
    });

  hiddenSections.forEach((section) => {

    observer.observe(section);

  });

  /* =========================
     RSVP Button
  ========================= */

  rsvpForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const selectedGuests =
      guestSelect.value;

    if (!isValidGuest) {

      rsvpMessage.innerText =
        "Tautan undangan ini tidak dikenal. Silakan hubungi keluarga pengundang.";

      return;
    }

    const attendanceStatus =
      getAttendanceStatus();

    const submittedNotes =
      guestNotes.value;

    if (!attendanceStatus) {

      showAttendanceError();

      return;
    }

    if (attendanceStatus === "attending" && !selectedGuests) {

      showGuestCountError();

      return;
    }

    const submittedGuestCount =
      attendanceStatus === "unable" ? "0" : selectedGuests;

    clearAttendanceError();
    clearGuestCountError();

    if (!RSVP_ENDPOINT) {

      rsvpMessage.innerText =
        "Form RSVP sudah siap. Tambahkan URL Google Apps Script di script.js untuk mulai mengumpulkan jawaban.";

      return;
    }

    rsvpMessage.innerText =
      "Mengirim RSVP Anda...";

    const formData =
      new FormData(rsvpForm);

    formData.set("guestCount", submittedGuestCount);
    formData.append("submittedAt", new Date().toISOString());

    try {

      await fetch(RSVP_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        body: formData
      });

      guestKeyInput.value = currentGuestKey;
      guestDisplayNameInput.value = currentGuestName;
      guestSelect.value = selectedGuests;
      guestNotes.value = submittedNotes;

      if (submittedGuestCount === "0") {

        rsvpMessage.innerText =
          "Terima kasih. RSVP Anda telah diperbarui sebagai tidak dapat hadir.";

      } else {

        rsvpMessage.innerText =
          `Terima kasih. RSVP diperbarui untuk ${submittedGuestCount} tamu.`;
      }

    } catch (error) {

      console.log("RSVP submission failed:", error);

      rsvpMessage.innerText =
        "Maaf, RSVP Anda belum dapat dikirim. Silakan coba lagi.";
    }

  });

});

window.addEventListener("pageshow", () => {

  if (window.invitationOpened) {
    return;
  }

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  window.scrollTo(0, 0);
  document.body.style.overflowY = "hidden";
  document.body.style.height = "100vh";
});
