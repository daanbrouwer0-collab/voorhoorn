/**
 * Voorhoorn oog-logo engine (uit ogen.html), voor één header-logo.
 */
class VoorhoornEngine {
  constructor(logoId = "siteLogo") {
    this.cursor = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.virtualTarget = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.isMouseIdle = false;
    this.lastMouseMoveTime = Date.now();
    this.isClickInteracting = false;
    this.mutualContact = false;
    this.logos = [];

    this.initLogo(logoId);
    if (!this.logos.length) return;

    this.initEvents();
    this.initSpontaneousEyeContact();
    this.initAutonomousGaze();
    this.startRenderLoop();
  }

  initLogo(id) {
    const cardEl = document.getElementById(id);
    if (!cardEl) return;

    const set1El = cardEl.querySelector(".eye-set-1");
    const set2El = cardEl.querySelector(".eye-set-2");
    const set1Eyes = [];
    const set2Eyes = [];

    set1El?.querySelectorAll(".eye").forEach((eyeEl) => {
      const pupil = eyeEl.querySelector(".googly-clean-pupil");
      set1Eyes.push(this.createEyeObj(eyeEl, pupil, 0.46, 0.2, 1));
    });

    set2El?.querySelectorAll(".eye").forEach((eyeEl) => {
      const pupil = eyeEl.querySelector(".googly-clean-pupil");
      set2Eyes.push(this.createEyeObj(eyeEl, pupil, 0.46, 0.2, 2));
    });

    this.logos.push({
      id,
      el: cardEl,
      set1El,
      set2El,
      set1Eyes,
      set2Eyes,
    });
  }

  createEyeObj(container, pupil, maxTravelFactor, lerpSpeed, setIndex) {
    return {
      container,
      pupil,
      maxTravelFactor,
      lerpSpeed,
      setIndex,
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0,
    };
  }

  initEvents() {
    window.addEventListener(
      "mousemove",
      (e) => {
        this.cursor.x = e.clientX;
        this.cursor.y = e.clientY;
        this.lastMouseMoveTime = Date.now();
        this.isMouseIdle = false;
      },
      { passive: true }
    );

    window.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches.length > 0) {
          this.cursor.x = e.touches[0].clientX;
          this.cursor.y = e.touches[0].clientY;
          this.lastMouseMoveTime = Date.now();
          this.isMouseIdle = false;
        }
      },
      { passive: true }
    );

    window.addEventListener("click", (e) => {
      this.triggerClickInteraction(e.clientX, e.clientY);
    });
  }

  initSpontaneousEyeContact() {
    const triggerGlance = () => {
      if (!this.isClickInteracting) {
        this.executeMutualEyeContact(1200);
      }
      const nextDelay = 3800 + Math.random() * 3200;
      setTimeout(triggerGlance, nextDelay);
    };
    setTimeout(triggerGlance, 2800);
  }

  executeMutualEyeContact(duration = 1200) {
    this.mutualContact = true;
    this.logos.forEach((logo) => {
      logo.el.classList.add("making-eye-contact");
    });

    clearTimeout(this.mutualTimeout);
    this.mutualTimeout = setTimeout(() => {
      this.mutualContact = false;
      this.logos.forEach((logo) => {
        logo.el.classList.remove("making-eye-contact");
      });
    }, duration);
  }

  triggerClickInteraction(clickX, clickY) {
    this.createClickRipple(clickX, clickY);
    this.isClickInteracting = true;
    this.mutualContact = false;
    this.cursor.x = clickX;
    this.cursor.y = clickY;

    clearTimeout(this.clickTimeout1);
    clearTimeout(this.clickTimeout2);

    this.clickTimeout1 = setTimeout(() => {
      this.executeMutualEyeContact(1100);
      this.clickTimeout2 = setTimeout(() => {
        this.isClickInteracting = false;
      }, 1150);
    }, 300);
  }

  createClickRipple(x, y) {
    const container = document.getElementById("click-ripple-container");
    if (!container) return;
    const ripple = document.createElement("div");
    ripple.className = "click-ripple";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    container.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  }

  updateGaze() {
    if (Date.now() - this.lastMouseMoveTime > 2200 && !this.isClickInteracting) {
      this.isMouseIdle = true;
    }

    const defaultAim =
      this.isMouseIdle && !this.isClickInteracting
        ? this.virtualTarget
        : this.cursor;

    this.logos.forEach((logo) => {
      const set1Rect = logo.set1El
        ? logo.set1El.getBoundingClientRect()
        : null;
      const set2Rect = logo.set2El
        ? logo.set2El.getBoundingClientRect()
        : null;

      const set1Center = set1Rect
        ? {
            x: set1Rect.left + set1Rect.width / 2,
            y: set1Rect.top + set1Rect.height / 2,
          }
        : defaultAim;
      const set2Center = set2Rect
        ? {
            x: set2Rect.left + set2Rect.width / 2,
            y: set2Rect.top + set2Rect.height / 2,
          }
        : defaultAim;

      logo.set1Eyes.forEach((eye) => {
        const aimPoint =
          this.mutualContact && set2Rect ? set2Center : defaultAim;
        this.computePupilOffset(eye, aimPoint.x, aimPoint.y);
      });

      logo.set2Eyes.forEach((eye) => {
        const aimPoint =
          this.mutualContact && set1Rect ? set1Center : defaultAim;
        this.computePupilOffset(eye, aimPoint.x, aimPoint.y);
      });
    });
  }

  computePupilOffset(eye, aimX, aimY) {
    const rect = eye.container.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;
    const eyeRadius = rect.width / 2;
    const maxDistance = eyeRadius * eye.maxTravelFactor;

    const dx = aimX - eyeCenterX;
    const dy = aimY - eyeCenterY;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);

    let pull = Math.min(dist / 280, 1.0);
    if (this.mutualContact) pull = 1.0;

    const distanceOffset = pull * maxDistance;
    eye.targetX = Math.cos(angle) * distanceOffset;
    eye.targetY = Math.sin(angle) * distanceOffset;

    eye.currentX += (eye.targetX - eye.currentX) * eye.lerpSpeed;
    eye.currentY += (eye.targetY - eye.currentY) * eye.lerpSpeed;

    if (eye.pupil) {
      eye.pupil.style.transform = `translate3d(${eye.currentX.toFixed(2)}px, ${eye.currentY.toFixed(2)}px, 0)`;
    }
  }

  initAutonomousGaze() {
    const triggerSaccade = () => {
      if (this.isMouseIdle && !this.isClickInteracting && !this.mutualContact) {
        const marginX = window.innerWidth * 0.2;
        const marginY = window.innerHeight * 0.25;
        this.virtualTarget.x =
          marginX + Math.random() * (window.innerWidth - marginX * 2);
        this.virtualTarget.y =
          marginY + Math.random() * (window.innerHeight - marginY * 2);
      }
      setTimeout(triggerSaccade, 1500 + Math.random() * 2200);
    };
    setTimeout(triggerSaccade, 1200);
  }

  startRenderLoop() {
    const loop = () => {
      this.updateGaze();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.voorhoornEngine = new VoorhoornEngine("siteLogo");
});
