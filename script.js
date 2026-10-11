
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

let stars = [];
let width = 0;
let height = 0;
let animationFrame;

function createStars() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  stars = Array.from(
    { length: Math.min(160, Math.floor(width * height / 5000)) },
    () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      phase: Math.random() * Math.PI * 2
    })
  );

  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }

  drawStars();
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);

  const time = performance.now() / 1000;

  stars.forEach(star => {
    const twinkle = reduceMotion
      ? 1
      : 0.7 + 0.3 * Math.sin(time + star.phase);

    ctx.globalAlpha = star.alpha * twinkle;
    ctx.fillStyle = "#e0eaff";
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.globalAlpha = 1;

  if (!reduceMotion) {
    animationFrame = requestAnimationFrame(drawStars);
  }
}

window.addEventListener("resize", createStars);
createStars();

// Scroll to the letter.
document.getElementById("readButton").addEventListener("click", () => {
  document.getElementById("letter").scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth"
  });
});

// Reveal each letter section as it enters the screen.
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(section => {
  observer.observe(section);
});

// Tiny heart and star effects on click.
document.addEventListener("click", event => {
  if (reduceMotion) return;

  for (let i = 0; i < 3; i++) {
    const sparkle = document.createElement("span");

    sparkle.className = "sparkle";
    sparkle.textContent = ["✦", "♡", "·"][i];
    sparkle.style.left =
      `${event.clientX + (Math.random() * 40 - 20)}px`;
    sparkle.style.top =
      `${event.clientY + (Math.random() * 25 - 12)}px`;
    sparkle.style.fontSize = `${12 + Math.random() * 10}px`;

    document.body.appendChild(sparkle);
    sparkle.addEventListener("animationend", () => sparkle.remove());
  }
});
