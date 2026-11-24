// The five science moments: the arrows step through them.
const moments = [
  ["A song that gave you chills.", "Dopamine and endogenous opioid release",
   "Salimpoor et al. (2011). Anatomically distinct dopamine release during anticipation and experience of peak emotion to music. Nature Neuroscience.", "https://doi.org/10.1038/nn.2726"],
  ["A melody that brought back a forgotten memory.", "Prefrontal–hippocampal memory circuits",
   "Janata (2009). The neural architecture of music-evoked autobiographical memories. Cerebral Cortex.", "https://doi.org/10.1093/cercor/bhp008"],
  ["A voice that made you feel safe.", "Oxytocin and vagal regulation",
   "Seltzer, Ziegler & Pollak (2010). Social vocalizations can release oxytocin in humans. Proceedings of the Royal Society B.", "https://doi.org/10.1098/rspb.2010.0567"],
  ["A chord that moved you to tears.", "Endogenous opioid release",
   "Blood & Zatorre (2001). Intensely pleasurable responses to music correlate with activity in brain regions implicated in reward and emotion. PNAS.", "https://doi.org/10.1073/pnas.191355898"],
  ["A rhythm that changed your mood in seconds.", "Dopamine and noradrenaline release",
   "Chanda & Levitin (2013). The neurochemistry of music. Trends in Cognitive Sciences.", "https://doi.org/10.1016/j.tics.2013.02.007"],
];

const moment = document.getElementById("moment");
const mechanism = document.getElementById("mechanism");
const count = document.getElementById("count");
const dashes = document.querySelectorAll(".progress__dashes span");
let current = 0;

const card = document.querySelector(".deck .card");
const paper = document.getElementById("paper");
function setPaper(i) { if (paper) { paper.textContent = moments[i][2]; paper.href = moments[i][3]; } }
const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function show(i) {
  current = (i + moments.length) % moments.length;
  moment.textContent = moments[current][0];
  if (calm || !card) {
    mechanism.textContent = moments[current][1]; setPaper(current);
  } else {
    // the card slips away and the next one arrives with the new element
    card.classList.add("is-changing");
    setTimeout(() => { mechanism.textContent = moments[current][1]; setPaper(current); card.classList.remove("is-changing"); }, 250);
  }
  count.textContent = String(current + 1).padStart(2, "0") + " / 05";
  dashes.forEach((d, k) => d.classList.toggle("is-on", k === current));
}

// Keep the science section the same height for every moment, so the arrows never move under the mouse.
function steadyScience() {
  if (!moment || !card) return;
  const felt = document.querySelector(".science__felt");
  card.style.minHeight = ""; moment.style.minHeight = "";
  const keep = [moment.textContent, mechanism.textContent, paper && paper.textContent];
  let tallCard = 0, tallMoment = 0;
  moments.forEach((m) => {
    moment.textContent = m[0]; mechanism.textContent = m[1]; if (paper) paper.textContent = m[2];
    tallCard = Math.max(tallCard, card.offsetHeight); tallMoment = Math.max(tallMoment, moment.offsetHeight);
  });
  moment.textContent = keep[0]; mechanism.textContent = keep[1]; if (paper) paper.textContent = keep[2];
  card.style.minHeight = tallCard + "px"; moment.style.minHeight = tallMoment + "px";
}
if (moment) {
  steadyScience();
  window.addEventListener("resize", steadyScience);
  if (document.fonts) document.fonts.ready.then(steadyScience);
  document.getElementById("prev").addEventListener("click", () => show(current - 1));
  document.getElementById("next").addEventListener("click", () => show(current + 1));
}

// The sound wave on the science card.
const wave = document.getElementById("wave");
if (wave) {
  for (let i = 0; i < 66; i++) {
    const bar = document.createElement("span");
    const t = i / 65;
    const h = 8 + 70 * Math.pow(Math.sin(Math.PI * t), 2) * (0.6 + 0.4 * Math.abs(Math.sin(i * 1.7)));
    bar.style.height = h + "%";
    wave.appendChild(bar);
  }
}

// Testimonies drift on their own; the side arrows jump one card forwards or back.
const track = document.getElementById("voices-track");
if (track) {
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const originals = [...track.children];
  originals.forEach((q) => { const c = q.cloneNode(true); c.setAttribute("aria-hidden", "true"); track.appendChild(c); });
  track.style.animation = "none";
  let x = 0, paused = false, last = performance.now(), target = null;
  const half = () => track.scrollWidth / 2;
  const step = () => (originals[0].offsetWidth || 360) + 24;
  const speed = 18; // pixels per second
  function frame(now) {
    const dt = Math.min(64, now - last) / 1000; last = now;
    if (target !== null) {
      const d = target - x; x += d * Math.min(1, dt * 7);
      if (Math.abs(d) < 0.5) { x = target; target = null; }
    } else if (!paused && !still) { x += speed * dt; }
    const h = half(); if (h) { if (x >= h) { x -= h; if (target !== null) target -= h; } if (x < 0) { x += h; if (target !== null) target += h; } }
    track.style.transform = "translateX(" + (-x) + "px)";
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  const row = document.getElementById("voices");
  // pause only while the pointer is over a card itself
  track.addEventListener("mouseover", (e) => { paused = !!e.target.closest(".quote"); });
  track.addEventListener("mouseleave", () => (paused = false));
  document.getElementById("voices-next").addEventListener("click", () => { target = (target ?? x) + step(); });
  document.getElementById("voices-prev").addEventListener("click", () => { target = (target ?? x) - step(); });
}

// Join the waitlist and Subscribe open the same small form, sent to Formspree.
const signup = document.getElementById("signup");
if (signup) {
  const form = document.getElementById("signup-form");
  const email = document.getElementById("signup-email");
  const error = document.getElementById("signup-error");
  const done = document.getElementById("signup-done");
  const submit = document.getElementById("signup-submit");
  const copy = {
    waitlist: { eyebrow: "Private beta", title: "Join the waitlist", lead: "Leave your email and we’ll let you know when there is a place for you.", button: "Join the waitlist", list: "Waitlist", subject: "New Phononaut waitlist sign-up", done: "Thank you, you’re on the list." },
    subscribe: { eyebrow: "News", title: "Subscribe", lead: "Leave your email to hear about Phononaut, new journeys and live sessions.", button: "Subscribe", list: "Newsletter", subject: "New Phononaut newsletter subscriber", done: "Thank you for subscribing." },
  };
  let current = copy.waitlist;

  function open(kind) {
    current = copy[kind] || copy.waitlist;
    document.getElementById("signup-eyebrow").textContent = current.eyebrow;
    document.getElementById("signup-title").textContent = current.title;
    document.getElementById("signup-lead").textContent = current.lead;
    document.getElementById("signup-list").value = current.list;
    document.getElementById("signup-subject").value = current.subject;
    submit.textContent = current.button;
    form.querySelectorAll(".signup__label, .signup__input, .signup__submit, .signup__error, #signup-eyebrow, #signup-title, #signup-lead").forEach((el) => (el.hidden = false));
    done.hidden = true; error.textContent = ""; email.removeAttribute("aria-invalid"); email.value = "";
    signup.showModal();
    email.focus();
  }

  document.querySelectorAll("[data-signup]").forEach((b) => b.addEventListener("click", () => open(b.dataset.signup)));
  document.getElementById("signup-close").addEventListener("click", () => signup.close());
  signup.addEventListener("click", (e) => { if (e.target === signup) signup.close(); });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    error.textContent = "";
    if (!email.checkValidity()) {
      email.setAttribute("aria-invalid", "true");
      error.textContent = "Please enter a valid email address.";
      email.focus();
      return;
    }
    email.removeAttribute("aria-invalid");
    submit.disabled = true;
    const label = submit.textContent; submit.textContent = "Sending…";
    try {
      const res = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("not ok");
      form.querySelectorAll(".signup__label, .signup__input, .signup__submit, .signup__error, #signup-eyebrow, #signup-title, #signup-lead").forEach((el) => (el.hidden = true));
      done.textContent = current.done; done.hidden = false;
    } catch (err) {
      error.textContent = "Something went wrong. Please try again, or write to hello@phononaut.com.";
    } finally {
      submit.disabled = false; submit.textContent = label;
    }
  });
}

// Apply as a collaborator: a fuller form, with social links, a message and a music sample.
const collab = document.getElementById("collab");
if (collab) {
  const form = document.getElementById("collab-form");
  const fields = form.querySelector(".collab__fields");
  const error = document.getElementById("collab-error");
  const done = document.getElementById("collab-done");
  const submit = document.getElementById("collab-submit");
  const file = document.getElementById("collab-file");
  const fileName = document.getElementById("collab-file-name");
  const MAX = 25 * 1024 * 1024;

  document.getElementById("collab-open").addEventListener("click", () => {
    fields.hidden = false; done.hidden = true; error.textContent = "";
    collab.showModal(); document.getElementById("collab-name").focus();
  });
  document.getElementById("collab-close").addEventListener("click", () => collab.close());
  collab.addEventListener("click", (e) => { if (e.target === collab) collab.close(); });
  file.addEventListener("change", () => { fileName.textContent = file.files[0] ? file.files[0].name : "No file chosen"; });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    error.textContent = "";
    form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
    for (const id of ["collab-name", "collab-email", "collab-message", "collab-link"]) {
      const el = document.getElementById(id);
      if (!el.checkValidity()) {
        el.setAttribute("aria-invalid", "true"); el.focus();
        error.textContent = id === "collab-email" ? "Please enter a valid email address."
          : id === "collab-link" ? "Please enter a full link, starting with https://"
          : "Please fill in your " + (id === "collab-name" ? "name." : "message.");
        return;
      }
    }
    const chosen = file.files[0];
    if (!chosen && !document.getElementById("collab-link").value.trim()) {
      error.textContent = "Please add a link to your music or upload a sample."; return;
    }
    if (chosen && chosen.size > MAX) { error.textContent = "That file is over 25 MB. Please share a link instead."; return; }

    submit.disabled = true; const label = submit.textContent; submit.textContent = "Sending…";
    const send = (data) => fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } });
    try {
      let res = await send(new FormData(form));
      if (!res.ok && chosen) {
        // If the upload is refused, send the application without the file so nothing is lost.
        const data = new FormData(form); data.delete("sample");
        data.append("sample_note", "They tried to upload " + chosen.name + " but the upload did not go through.");
        res = await send(data);
        if (res.ok) error.textContent = "";
      }
      if (!res.ok) throw new Error("not ok");
      form.reset(); fileName.textContent = "No file chosen";
      fields.hidden = true; done.hidden = false;
    } catch (err) {
      error.textContent = "Something went wrong. Please try again, or write to hello@phononaut.com.";
    } finally {
      submit.disabled = false; submit.textContent = label;
    }
  });
}
