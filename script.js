// The five science moments: the arrows step through them.
const moments = [
  ["A song that gave you chills.", "Dopamine and endogenous opioid release"],
  ["A melody that brought back a forgotten memory.", "Prefrontal–hippocampal memory circuits"],
  ["A voice that made you feel safe.", "Oxytocin and vagal regulation"],
  ["A chord that moved you to tears.", "Endogenous opioid release"],
  ["A rhythm that changed your mood in seconds.", "Dopamine and noradrenaline release"],
];

const moment = document.getElementById("moment");
const mechanism = document.getElementById("mechanism");
const count = document.getElementById("count");
const dashes = document.querySelectorAll(".progress__dashes span");
let current = 0;

const card = document.querySelector(".deck .card");
const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function show(i) {
  current = (i + moments.length) % moments.length;
  moment.textContent = moments[current][0];
  if (calm || !card) {
    mechanism.textContent = moments[current][1];
  } else {
    // the card slips away and the next one arrives with the new element
    card.classList.add("is-changing");
    setTimeout(() => { mechanism.textContent = moments[current][1]; card.classList.remove("is-changing"); }, 250);
  }
  count.textContent = String(current + 1).padStart(2, "0") + " / 05";
  dashes.forEach((d, k) => d.classList.toggle("is-on", k === current));
}

if (moment) {
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

// The arrows beside the quotes move them left and right.
const row = document.getElementById("voices");
const more = document.getElementById("voices-next");
const back = document.getElementById("voices-prev");
if (row && more && back) {
  const section = row.closest(".voices");
  const step = () => (row.querySelector(".quote")?.offsetWidth || 360) + 24;
  const update = () => {
    const atStart = row.scrollLeft <= 4;
    const atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4;
    back.disabled = atStart; more.disabled = atEnd;
    section.classList.toggle("is-scrolled", !atStart);
  };
  more.addEventListener("click", () => row.scrollBy({ left: step(), behavior: "smooth" }));
  back.addEventListener("click", () => row.scrollBy({ left: -step(), behavior: "smooth" }));
  row.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
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
