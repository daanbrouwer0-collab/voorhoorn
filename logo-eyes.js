/**
 * Voorhoorn oog-logo: individuele blikken alle kanten op.
 */
class VoorhoornEngine {
  constructor(logoId = "siteLogo") {
    this.cursor = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.isMouseIdle = true;
    this.lastMouseMoveTime = Date.now();
    this.isClickInteracting = false;
    this.mutualContact = false;
    this.slideshowFocus = null; // { mode, start, duration, from, to } | { mode:'look', x, y, until }
    this.logos = [];

    this.initLogo(logoId);
    if (!this.logos.length) return;

    this.initEvents();
    this.initIndependentGaze();
    this.initRareEyeContact();
    this.initOccasionalSlideshowGlance();
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
      set1Eyes.push(this.createEyeObj(eyeEl, pupil));
    });

    set2El?.querySelectorAll(".eye").forEach((eyeEl) => {
      const pupil = eyeEl.querySelector(".googly-clean-pupil");
      set2Eyes.push(this.createEyeObj(eyeEl, pupil));
    });

    // Eigen richting per oogpaar (en lichte offset per oog)
    this.pickRandomGaze(set1Eyes);
    this.pickRandomGaze(set2Eyes);

    this.logos.push({
      id,
      el: cardEl,
      set1El,
      set2El,
      set1Eyes,
      set2Eyes,
    });
  }

  createEyeObj(container, pupil) {
    return {
      container,
      pupil,
      maxTravelFactor: 0.52,
      lerpSpeed: 0.14 + Math.random() * 0.06,
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0,
      aimX: 0,
      aimY: 0,
    };
  }

  /** Kies een willekeurige kijkrichting rondom het logo (alle kanten even waarschijnlijk). */
  pickRandomGaze(eyes) {
    if (!eyes.length) return;
    const angle = Math.random() * Math.PI * 2;
    const strength = 0.35 + Math.random() * 0.65; // 35–100% van max travel
    eyes.forEach((eye, i) => {
      // Kleine individuele afwijking per oog in het paar
      const jitter = (i === 0 ? -1 : 1) * (0.08 + Math.random() * 0.12);
      const a = angle + jitter;
      const s = strength * (0.85 + Math.random() * 0.2);
      eye.gazeAngle = a;
      eye.gazeStrength = s;
    });
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
      // Alleen reageren als klik in/bij het logo is — anders te afleidend op de pagina
      const logo = this.logos[0]?.el;
      if (!logo) return;
      const rect = logo.getBoundingClientRect();
      const pad = 40;
      const near =
        e.clientX >= rect.left - pad &&
        e.clientX <= rect.right + pad &&
        e.clientY >= rect.top - pad &&
        e.clientY <= rect.bottom + pad;
      if (near) this.triggerClickInteraction(e.clientX, e.clientY);
    });
  }

  /** Zelden oogcontact — vooral individueel kijken. */
  initRareEyeContact() {
    const triggerGlance = () => {
      if (!this.isClickInteracting && Math.random() < 0.35) {
        this.executeMutualEyeContact(700);
      }
      setTimeout(triggerGlance, 10000 + Math.random() * 12000);
    };
    setTimeout(triggerGlance, 8000);
  }

  executeMutualEyeContact(duration = 700) {
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
      // Daarna weer alle kanten op
      this.logos.forEach((logo) => {
        this.pickRandomGaze(logo.set1Eyes);
        this.pickRandomGaze(logo.set2Eyes);
      });
    }, duration);
  }

  triggerClickInteraction(clickX, clickY) {
    this.createClickRipple(clickX, clickY);
    this.isClickInteracting = true;
    this.mutualContact = false;
    this.cursor.x = clickX;
    this.cursor.y = clickY;
    this.isMouseIdle = false;
    this.lastMouseMoveTime = Date.now();

    clearTimeout(this.clickTimeout1);
    clearTimeout(this.clickTimeout2);

    this.clickTimeout1 = setTimeout(() => {
      this.executeMutualEyeContact(800);
      this.clickTimeout2 = setTimeout(() => {
        this.isClickInteracting = false;
      }, 850);
    }, 280);
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

  /** Per oogpaar (en soms per paar apart) nieuwe kijkrichting. */
  initIndependentGaze() {
    const tick = () => {
      if (
        !this.isClickInteracting &&
        !this.mutualContact &&
        !this.slideshowFocus
      ) {
        this.logos.forEach((logo) => {
          if (Math.random() < 0.55) {
            this.pickRandomGaze(logo.set1Eyes);
          } else {
            this.pickRandomGaze(logo.set2Eyes);
          }
          if (Math.random() < 0.25) {
            this.pickRandomGaze(logo.set1Eyes);
            this.pickRandomGaze(logo.set2Eyes);
          }
        });
      }
      setTimeout(tick, 700 + Math.random() * 1100);
    };
    setTimeout(tick, 400);
  }

  getSlideshowRect() {
    const el =
      document.getElementById("promoSlideshow") ||
      document.querySelector(".promo-slideshow");
    if (!el || el.offsetParent === null) return null;
    return el.getBoundingClientRect();
  }

  /** Af en toe even naar de slideshow kijken (zonder slide-wissel). */
  initOccasionalSlideshowGlance() {
    const glance = () => {
      if (!this.isClickInteracting && !this.mutualContact && !this.slideshowFocus) {
        const rect = this.getSlideshowRect();
        if (rect && Math.random() < 0.55) {
          const x = rect.left + rect.width * (0.35 + Math.random() * 0.3);
          const y = rect.top + rect.height * (0.4 + Math.random() * 0.25);
          this.slideshowFocus = {
            mode: "look",
            x,
            y,
            until: performance.now() + 900 + Math.random() * 700,
          };
        }
      }
      setTimeout(glance, 4500 + Math.random() * 5500);
    };
    setTimeout(glance, 3500);
  }

  /**
   * Bij slide-wissel: eerst naar rechts kijken (nieuwe slide komt eraan),
   * daarna meezweepen naar het midden terwijl de kaart in beeld schuift.
   */
  onSlideshowChange({ direction = 1 } = {}) {
    const rect = this.getSlideshowRect();
    if (!rect) return;

    const midY = rect.top + rect.height * 0.5;
    // Nieuwe slide komt vanaf rechts (vooruit) of links (achteruit)
    const incomingX =
      direction >= 0 ? rect.right - rect.width * 0.08 : rect.left + rect.width * 0.08;
    const settleX = rect.left + rect.width * 0.5;

    // Kort alvast naar de binnenkomende kant kijken
    this.slideshowFocus = {
      mode: "look",
      x: incomingX,
      y: midY,
      until: performance.now() + 180,
    };

    // Daarna sweep synchroniseren met CSS-transition (~550ms)
    clearTimeout(this.slideshowSweepTimeout);
    this.slideshowSweepTimeout = setTimeout(() => {
      this.slideshowFocus = {
        mode: "sweep",
        start: performance.now(),
        duration: 550,
        from: { x: incomingX, y: midY },
        to: { x: settleX, y: midY },
      };
    }, 160);
  }

  getSlideshowAimPoint(now = performance.now()) {
    const focus = this.slideshowFocus;
    if (!focus) return null;

    if (focus.mode === "look") {
      if (now > focus.until) {
        this.slideshowFocus = null;
        return null;
      }
      return { x: focus.x, y: focus.y };
    }

    if (focus.mode === "sweep") {
      const t = Math.min(1, (now - focus.start) / focus.duration);
      // Benadert cubic-bezier(0.4, 0, 0.2, 1)
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const x = focus.from.x + (focus.to.x - focus.from.x) * eased;
      const y = focus.from.y + (focus.to.y - focus.from.y) * eased;
      if (t >= 1) {
        // Nog even op de nieuwe slide blijven kijken
        this.slideshowFocus = {
          mode: "look",
          x: focus.to.x,
          y: focus.to.y,
          until: now + 650,
        };
      }
      return { x, y };
    }

    return null;
  }

  updateGaze() {
    if (Date.now() - this.lastMouseMoveTime > 1600 && !this.isClickInteracting) {
      this.isMouseIdle = true;
    }

    const slideshowAim = this.getSlideshowAimPoint();

    this.logos.forEach((logo) => {
      const set1Rect = logo.set1El?.getBoundingClientRect() || null;
      const set2Rect = logo.set2El?.getBoundingClientRect() || null;
      const set1Center = set1Rect
        ? {
            x: set1Rect.left + set1Rect.width / 2,
            y: set1Rect.top + set1Rect.height / 2,
          }
        : null;
      const set2Center = set2Rect
        ? {
            x: set2Rect.left + set2Rect.width / 2,
            y: set2Rect.top + set2Rect.height / 2,
          }
        : null;

      const driveEye = (eye, partnerCenter) => {
        if (slideshowAim) {
          this.computePupilTowardPoint(eye, slideshowAim.x, slideshowAim.y, true);
        } else if (this.mutualContact && partnerCenter) {
          this.computePupilTowardPoint(eye, partnerCenter.x, partnerCenter.y, true);
        } else if (!this.isMouseIdle) {
          this.computePupilTowardPoint(eye, this.cursor.x, this.cursor.y, false);
        } else {
          this.computePupilFromAngle(eye);
        }
      };

      logo.set1Eyes.forEach((eye) => driveEye(eye, set2Center));
      logo.set2Eyes.forEach((eye) => driveEye(eye, set1Center));
    });
  }

  computePupilFromAngle(eye) {
    const rect = eye.container.getBoundingClientRect();
    const maxDistance = (rect.width / 2) * eye.maxTravelFactor;
    const angle = eye.gazeAngle || 0;
    const strength = eye.gazeStrength ?? 0.7;
    eye.targetX = Math.cos(angle) * maxDistance * strength;
    eye.targetY = Math.sin(angle) * maxDistance * strength;
    this.applyPupilLerp(eye);
  }

  computePupilTowardPoint(eye, aimX, aimY, fullPull) {
    const rect = eye.container.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;
    const maxDistance = (rect.width / 2) * eye.maxTravelFactor;

    const dx = aimX - eyeCenterX;
    const dy = aimY - eyeCenterY;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);

    const pull = fullPull ? 1 : Math.min(dist / 220, 1);
    eye.targetX = Math.cos(angle) * pull * maxDistance;
    eye.targetY = Math.sin(angle) * pull * maxDistance;
    this.applyPupilLerp(eye);
  }

  applyPupilLerp(eye) {
    eye.currentX += (eye.targetX - eye.currentX) * eye.lerpSpeed;
    eye.currentY += (eye.targetY - eye.currentY) * eye.lerpSpeed;
    if (eye.pupil) {
      eye.pupil.style.transform = `translate3d(${eye.currentX.toFixed(2)}px, ${eye.currentY.toFixed(2)}px, 0)`;
    }
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
