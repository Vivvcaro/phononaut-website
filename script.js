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

function show(i) {
  current = (i + moments.length) % moments.length;
  moment.textContent = moments[current][0];
  mechanism.textContent = moments[current][1];
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

// The arrow beside the quotes scrolls to the next ones.
const row = document.getElementById("voices");
const more = document.getElementById("voices-next");
if (row && more) {
  more.addEventListener("click", () => {
    const atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4;
    row.scrollBy({ left: atEnd ? -row.scrollWidth : 384, behavior: "smooth" });
  });
}
