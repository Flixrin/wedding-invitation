document.addEventListener("DOMContentLoaded", () => {

  const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbyCVouSyNva17C_ca16nx2rJp3FQBM64LQSgGpMhrbLoZIZ2MXCNbhbFk6V_IUPlcdH/exec";

  const EVENT_DETAILS = {
    title: "Mariska & Kevin Church Blessing",
    dateText: "Saturday, 17 July 2027",
    timeText: "12:00 PM",
    venue: "Saint Peter Cathedral Bandung",
    address: "Jl. Merdeka No.14, Babakan Ciamis, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40117, Indonesia",
    startsAt: "2027-07-17T12:00:00+07:00",
    endsAt: "2027-07-17T13:30:00+07:00",
    timeZone: "Asia/Jakarta",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Saint%20Peter%20Cathedral%20Bandung"
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
  const scrollIndicator = document.getElementById("scrollIndicator");

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
  button.innerText = "Loading Invitation";

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
      "PRODID:-//Mariska Kevin Invitation//EN",
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
      `UID:${Date.now()}@mariska-kevin-invitation`,
      `DTSTAMP:${formatCalendarTimestamp(new Date().toISOString())}`,
      `DTSTART;TZID=${EVENT_DETAILS.timeZone}:${formatCalendarWallTime(EVENT_DETAILS.startsAt)}`,
      `DTEND;TZID=${EVENT_DETAILS.timeZone}:${formatCalendarWallTime(EVENT_DETAILS.endsAt)}`,
      `SUMMARY:${EVENT_DETAILS.title}`,
      `LOCATION:${EVENT_DETAILS.venue}, ${EVENT_DETAILS.address}`,
      "DESCRIPTION:Church blessing begins at 12:00 PM Bandung time (WIB).",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const link =
      document.createElement("a");

    link.href =
      URL.createObjectURL(new Blob([calendarContent], { type: "text/calendar" }));

    link.download =
      "mariska-kevin-church-blessing.ics";

    link.click();

    URL.revokeObjectURL(link.href);
  }

  applyEventDetails();

  document
    .getElementById("calendarBtn")
    .addEventListener("click", downloadCalendarInvite);

  function showGuestCountError() {

    guestSelect.classList.add("field-error");
    guestSelect.setAttribute("aria-invalid", "true");

    rsvpMessage.innerText =
      "Please choose the number of guests attending.";

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
      "Please choose whether you will attend or are unable to attend.";

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

    guestName.innerText =
      "Invitation link not recognized";

    coupleName.hidden = true;
    heroTagline.innerText =
      "Please contact the host for the correct invitation link.";

    button.hidden = true;
    scrollIndicator.hidden = true;

    rsvpForm.hidden = true;
    invalidInviteCard.hidden = false;
  }

  function showValidInvite() {

    isValidGuest = true;

    coupleName.hidden = false;
    heroTagline.innerText =
      "Together with love, family, and cherished friends";

    button.hidden = false;
    scrollIndicator.hidden = false;

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

        reject(new Error("Unable to load RSVP record."));
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
      "Checking for your previous RSVP...";

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
        "Your previous RSVP is shown below. Submit again to update it.";

    } catch (error) {

      console.log("Previous RSVP unavailable:", error);

      rsvpMessage.innerText =
        "";
    }

  }

  function buildGuestOptions(maxGuests = 5) {

    guestSelect.innerHTML =
      `<option value="">Select Number of Guests</option>`;

    for (let i = 1; i <= maxGuests; i++) {

      const option =
        document.createElement("option");

      option.value = i;

      option.textContent =
        `${i} Guest${i > 1 ? 's' : ''}`;

      guestSelect.appendChild(option);
    }

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
        params.get("guest");

      if (guestKey && guests[guestKey]) {

        const guestData =
          guests[guestKey];

        currentGuestKey = guestKey;
        currentGuestName = guestData.name;
        showValidInvite();

        guestName.innerText =
          `Dear ${guestData.name}`;

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
      button.innerText = "Open Invitation";
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

    button.innerText = "Welcome";

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
        "This invitation link is not recognized. Please contact the host.";

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
        "RSVP form is ready. Add your Google Apps Script URL in script.js to start collecting responses.";

      return;
    }

    rsvpMessage.innerText =
      "Submitting your RSVP...";

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
          "Thank you! Your RSVP has been updated as unable to attend.";

      } else {

        rsvpMessage.innerText =
          `Thank you! RSVP updated for ${submittedGuestCount} guest${submittedGuestCount > 1 ? 's' : ''}.`;
      }

    } catch (error) {

      console.log("RSVP submission failed:", error);

      rsvpMessage.innerText =
        "Sorry, your RSVP could not be submitted. Please try again.";
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
