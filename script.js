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

// Ripples on the water behind the whole page. A click on the water starts one slow,
// natural ripple: a few rings that bend the light as they spread and fade.
(function () {
  const canvas = document.getElementById("ripple");
  if (!canvas) return;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gl = canvas.getContext("webgl", { antialias: false });
  if (!gl || still) { canvas.remove(); return; }

  const MAX = 6, LIFE = 4.5;
  const vs = `attribute vec2 p; varying vec2 v; void main(){ v = p*0.5+0.5; gl_Position = vec4(p,0.,1.); }`;
  const fs = `precision highp float;
    varying vec2 v; uniform sampler2D img; uniform vec2 res; uniform vec2 imgSize; uniform float now; uniform float dpr;
    uniform vec4 rip[${MAX}];
    void main(){
      vec2 px = vec2(v.x, 1.0 - v.y) * res;
      vec2 grad = vec2(0.0);
      for (int i = 0; i < ${MAX}; i++) {
        vec4 r = rip[i]; if (r.w <= 0.0) continue;
        float age = now - r.z; if (age < 0.0 || age > ${LIFE.toFixed(1)}) continue;
        vec2 d = px - r.xy; float dist = max(length(d), 0.001);
        float speed = 150.0 * dpr, lambda = 34.0 * dpr;
        float front = age * speed;
        float band = dist - front;
        // a short train of rings just behind the front, fading with age and distance
        float env = smoothstep(lambda * 0.2, 0.0, band) * exp(band / (lambda * 2.4)) * smoothstep(-front, -front + lambda, -dist);
        float fade = (1.0 - age / ${LIFE.toFixed(1)}); fade *= fade;
        float slope = cos(band / lambda * 6.2831) * env * fade * r.w;
        grad += d / dist * slope;
      }
      float s = max(res.x / imgSize.x, res.y / imgSize.y);
      vec2 size = imgSize * s; vec2 start = (res - size) * 0.5;
      vec2 uv = (px + grad * 7.0 * dpr - start) / size;
      vec3 c = texture2D(img, clamp(uv, 0.001, 0.999)).rgb;
      // light from the upper left catches the side of each ring facing it
      float shine = dot(grad, normalize(vec2(-0.6, -0.8)));
      c += vec3(0.42, 0.72, 0.82) * max(shine, 0.0) * 0.20 - vec3(0.02, 0.04, 0.05) * max(-shine, 0.0) * 0.6;
      gl_FragColor = vec4(c, 1.0);
    }`;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.remove(); return; }
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n) => gl.getUniformLocation(prog, n);
  const uRes = U("res"), uImg = U("imgSize"), uNow = U("now"), uRip = U("rip"), uDpr = U("dpr");

  const ripples = new Float32Array(MAX * 4); let next = 0, ready = false, running = false, dpr = 1;
  const t0 = performance.now(); const now = () => (performance.now() - t0) / 1000;
  const active = () => { const t = now(); for (let i = 0; i < MAX; i++) if (ripples[i*4+3] > 0 && t - ripples[i*4+2] < 4.6) return true; return false; };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(innerWidth * dpr); canvas.height = Math.round(innerHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height); gl.uniform2f(uRes, canvas.width, canvas.height); gl.uniform1f(uDpr, dpr);
    if (ready) frame();
  }
  function frame() { gl.uniform1f(uNow, now()); gl.uniform4fv(uRip, ripples); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); }
  function loop() { frame(); if (active()) requestAnimationFrame(loop); else { running = false; frame(); } }
  function add(x, y, strength) {
    ripples.set([x * dpr, y * dpr, now(), strength], next * 4); next = (next + 1) % MAX;
    if (!running) { running = true; requestAnimationFrame(loop); }
  }

  const img = new Image();
  img.onload = () => {
    const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    gl.uniform2f(uImg, img.width, img.height);
    ready = true; resize();
    setTimeout(() => add(innerWidth * 0.3, innerHeight * 0.62, 0.7), 1200);
  };
  img.src = "images/water.jpg?v=3";
  addEventListener("resize", resize);

  // only clicks on the water itself: not on text, buttons, pictures, cards or forms
  const solid = "a, button, img, input, textarea, label, summary, dialog, p, h1, h2, h3, cite, .card, .quote, .step__card, .step__picture, .doses, .about__card, .photos, .nav, .banner, .footer, .hero__phones";
  document.addEventListener("pointerdown", (e) => {
    if (!ready || e.button > 0 || e.target.closest(solid)) return;
    add(e.clientX, e.clientY, 1.0);
  });
})();
