/**
 * app.js — My Gym Diet
 * Splash loader fade · Live clock · Active card highlighting · Quote API
 */

document.addEventListener("DOMContentLoaded", () => {
  const clockEl = document.getElementById("clock");
  const cards = document.querySelectorAll(".card");
  const quoteText = document.getElementById("quote-text");
  const quoteAuth = document.getElementById("quote-author");
  const newQuote = document.getElementById("new-quote");

  /* ── Curated fallback quotes ────────────────────────── */
  const QUOTES = [
    {
      q: "Discipline is choosing between what you want now and what you want most.",
      a: "Abraham Lincoln",
    },
    { q: "The body achieves what the mind believes.", a: "Napoleon Hill" },
    {
      q: "Success isn't always about greatness. It's about consistency.",
      a: "Dwayne Johnson",
    },
    {
      q: "Push yourself because no one else is going to do it for you.",
      a: "Unknown",
    },
    {
      q: "Don't limit your challenges. Challenge your limits.",
      a: "Jerry Dunn",
    },
    { q: "The only bad workout is the one that didn't happen.", a: "Unknown" },
    { q: "You don't have to be extreme, just consistent.", a: "Unknown" },
    {
      q: "Take care of your body. It's the only place you have to live.",
      a: "Jim Rohn",
    },
    { q: "Action is the foundational key to all success.", a: "Pablo Picasso" },
    { q: "What hurts today makes you stronger tomorrow.", a: "Jay Cutler" },
    {
      q: "Your body can stand almost anything. It's your mind you have to convince.",
      a: "Unknown",
    },
    {
      q: "Strength does not come from the body. It comes from the will.",
      a: "Unknown",
    },
    {
      q: "Rome wasn't built in a day, but they worked on it every single day.",
      a: "Unknown",
    },
  ];

  /* ── 1. Live clock ──────────────────────────────────── */
  function tick() {
    const now = new Date();
    let h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, "0");
    const ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    if (clockEl) clockEl.textContent = `${h}:${m} ${ap}`;

    highlight(now.getHours(), now.getMinutes());
  }

  /* ── 2. Card highlighting ───────────────────────────── */
  function highlight(hour, min) {
    const now = hour * 60 + min;
    let found = false;

    cards.forEach((c) => {
      const s = c.dataset.start;
      const e = c.dataset.end;
      if (!s || !e) return;

      const [sh, sm] = s.split(":").map(Number);
      const [eh, em] = e.split(":").map(Number);
      const start = sh * 60 + sm;
      const end = eh * 60 + em;

      c.classList.remove("now", "passed");

      if (now >= end) {
        c.classList.add("passed");
      } else if (!found && now >= start && now < end) {
        c.classList.add("now");
        found = true;
      }
    });

    // If nothing matched, highlight next upcoming
    if (!found) {
      for (const c of cards) {
        const s = c.dataset.start;
        if (!s) continue;
        const [sh, sm] = s.split(":").map(Number);
        if (sh * 60 + sm > now) {
          c.classList.add("now");
          break;
        }
      }
    }
  }

  /* ── 3. Quote fetching ──────────────────────────────── */
  let lastQuoteIndex = -1;

  function showFallback() {
    let idx;
    do {
      idx = Math.floor(Math.random() * QUOTES.length);
    } while (idx === lastQuoteIndex && QUOTES.length > 1);
    lastQuoteIndex = idx;
    const pick = QUOTES[idx];
    if (quoteText) quoteText.textContent = `"${pick.q}"`;
    if (quoteAuth) quoteAuth.textContent = `— ${pick.a}`;
  }

  async function fetchQuote() {
    if (!quoteText || !quoteAuth) return;

    // Briefly dim the text for a micro-transition
    quoteText.style.opacity = "0.3";

    try {
      const res = await fetch("https://dummyjson.com/quotes/random");
      if (!res.ok) throw new Error();
      const data = await res.json();
      quoteText.textContent = `"${data.quote}"`;
      quoteAuth.textContent = `— ${data.author}`;
    } catch {
      showFallback();
    }

    // Fade back in
    setTimeout(() => {
      quoteText.style.opacity = "1";
    }, 80);
  }

  if (newQuote) newQuote.addEventListener("click", fetchQuote);

  /* ── Init ───────────────────────────────────────────── */
  tick();
  setInterval(tick, 1000);
  fetchQuote();
});
