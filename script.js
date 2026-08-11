/* =========================================================
   SPECIAL OLYMPICS VOLUNTEER GUIDE — V2
   Shared interaction system
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* =======================================================
     1. SCROLL REVEALS
     Elements gently appear as they enter the screen.
     ======================================================= */

  const revealItems = document.querySelectorAll(".reveal");

  if (reducedMotion || !("IntersectionObserver" in window)) {

    revealItems.forEach(item => {
      item.classList.add("visible");
    });

  } else {

    const revealObserver = new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            revealObserver.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealItems.forEach(item => {
      revealObserver.observe(item);
    });

  }


  /* =======================================================
     2. STAGGERED CARD ENTRANCES
     Cards don't all appear at exactly the same time.
     ======================================================= */

  const staggerGroups = document.querySelectorAll("[data-stagger]");

  staggerGroups.forEach(group => {

    const children = [...group.children];

    children.forEach((child, index) => {

      child.style.transitionDelay =
        reducedMotion ? "0ms" : `${index * 55}ms`;

    });

  });


  /* =======================================================
     3. INTERACTIVE INFORMATION PANELS
     Used on Behavior + Communication pages.
     ======================================================= */

  const panelTriggers = document.querySelectorAll(
    "[data-panel-target], [data-target]"
  );

  const panels = document.querySelectorAll(".panel");

  function closeAllPanels() {

    panels.forEach(panel => {
      panel.classList.remove("active");
    });

    panelTriggers.forEach(trigger => {
      trigger.setAttribute("aria-expanded", "false");
    });

  }


  function openPanel(panelId, trigger = null) {

    const panel = document.getElementById(panelId);

    if (!panel) return;

    closeAllPanels();

    panel.classList.add("active");

    if (trigger) {
      trigger.setAttribute("aria-expanded", "true");
    }

    if (!reducedMotion) {

      setTimeout(() => {

        panel.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }, 80);

    } else {

      panel.scrollIntoView({
        block: "start"
      });

    }

  }


  panelTriggers.forEach(trigger => {

    const panelId =
      trigger.dataset.panelTarget ||
      trigger.dataset.target;

    trigger.setAttribute("aria-expanded", "false");

    trigger.addEventListener("click", () => {

      const selectedPanel = document.getElementById(panelId);

      if (!selectedPanel) return;

      const isAlreadyOpen =
        selectedPanel.classList.contains("active");

      if (isAlreadyOpen) {

        selectedPanel.classList.remove("active");

        trigger.setAttribute("aria-expanded", "false");

      } else {

        openPanel(panelId, trigger);

      }

    });

  });


  /* =======================================================
     4. CLOSE BUTTONS
     ======================================================= */

  const closeButtons = document.querySelectorAll(".close-button");

  closeButtons.forEach(button => {

    button.setAttribute("aria-label", "Close section");

    button.addEventListener("click", () => {

      const panel = button.closest(".panel");

      if (!panel) return;

      panel.classList.remove("active");

      const matchingTrigger = [...panelTriggers].find(trigger => {

        const id =
          trigger.dataset.panelTarget ||
          trigger.dataset.target;

        return id === panel.id;

      });

      if (matchingTrigger) {

        matchingTrigger.setAttribute(
          "aria-expanded",
          "false"
        );

        if (!reducedMotion) {

          setTimeout(() => {

            matchingTrigger.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });

          }, 60);

        }

      }

    });

  });


  /* =======================================================
     5. ACCORDIONS
     Used for sports and expandable tips.
     ======================================================= */

  const accordions = document.querySelectorAll(".accordion");

  accordions.forEach(accordion => {

    const trigger =
      accordion.querySelector(".accordion-trigger");

    if (!trigger) return;

    trigger.setAttribute("aria-expanded", "false");

    trigger.addEventListener("click", () => {

      const isOpen =
        accordion.classList.toggle("open");

      trigger.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );

    });

  });


  /* =======================================================
     6. 60-SECOND ESSENTIALS STEPPER
     ======================================================= */

  const stepShell = document.querySelector("[data-stepper]");

  if (stepShell) {

    const steps =
      [...stepShell.querySelectorAll(".step")];

    const progressBar =
      stepShell.querySelector(".progress-bar");

    const nextButton =
      stepShell.querySelector("[data-step-next]");

    const backButton =
      stepShell.querySelector("[data-step-back]");

    let currentStep = 0;


    function showStep(index, direction = "forward") {

      if (index < 0 || index >= steps.length) return;

      currentStep = index;

      steps.forEach((step, stepIndex) => {

        const active = stepIndex === currentStep;

        step.classList.toggle("active", active);

        step.setAttribute(
          "aria-hidden",
          active ? "false" : "true"
        );

      });


      /* Progress */

      if (progressBar) {

        const progress =
          ((currentStep + 1) / steps.length) * 100;

        progressBar.style.width = `${progress}%`;

      }


      /* Back button */

      if (backButton) {

        backButton.style.visibility =
          currentStep === 0
            ? "hidden"
            : "visible";

      }


      /* Next button */

      if (nextButton) {

        if (currentStep === steps.length - 1) {

          nextButton.style.display = "none";

        } else {

          nextButton.style.display = "";

          const nextIsFinal =
            currentStep === steps.length - 2;

          nextButton.textContent =
            nextIsFinal
              ? "Finish"
              : "Next";

        }

      }


      /* Add directional motion */

      const activeStep = steps[currentStep];

      if (!reducedMotion && activeStep) {

        const distance =
          direction === "back"
            ? -14
            : 14;

        activeStep.animate(
          [
            {
              opacity: 0,
              transform: `translateX(${distance}px)`
            },
            {
              opacity: 1,
              transform: "translateX(0)"
            }
          ],
          {
            duration: 380,
            easing: "cubic-bezier(.22,.8,.22,1)"
          }
        );

      }

    }


    if (nextButton) {

      nextButton.addEventListener("click", () => {

        if (currentStep < steps.length - 1) {

          showStep(
            currentStep + 1,
            "forward"
          );

        }

      });

    }


    if (backButton) {

      backButton.addEventListener("click", () => {

        if (currentStep > 0) {

          showStep(
            currentStep - 1,
            "back"
          );

        }

      });

    }


    /* Arrow-key navigation on computers */

    document.addEventListener("keydown", event => {

      const tag =
        document.activeElement.tagName.toLowerCase();

      if (
        tag === "input" ||
        tag === "textarea"
      ) return;


      if (event.key === "ArrowRight") {

        if (currentStep < steps.length - 1) {

          showStep(
            currentStep + 1,
            "forward"
          );

        }

      }


      if (event.key === "ArrowLeft") {

        if (currentStep > 0) {

          showStep(
            currentStep - 1,
            "back"
          );

        }

      }

    });


    showStep(0);

  }


  /* =======================================================
     7. PAGE-TO-PAGE TRANSITIONS

     When someone moves between Home, Essentials,
     Behavior, and Communication, the current page
     softly fades instead of suddenly disappearing.
     ======================================================= */

  const pageLinks =
    document.querySelectorAll('a[href$=".html"]');

  pageLinks.forEach(link => {

    link.addEventListener("click", event => {

      /* Don't interfere with modifier-key behavior */

      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const destination =
        link.getAttribute("href");

      if (
        !destination ||
        reducedMotion
      ) {
        return;
      }

      event.preventDefault();


      const pageAnimation =
        document.body.animate(
          [
            {
              opacity: 1,
              transform: "translateY(0)"
            },
            {
              opacity: 0,
              transform: "translateY(-5px)"
            }
          ],
          {
            duration: 210,
            easing: "ease-out",
            fill: "forwards"
          }
        );


      pageAnimation.finished
        .then(() => {
          window.location.href = destination;
        })
        .catch(() => {
          window.location.href = destination;
        });

    });

  });


  /* =======================================================
     8. MICRO-INTERACTION FOR CLICKABLE CARDS

     Adds a very subtle physical "press" feeling on touch.
     ======================================================= */

  const pressables =
    document.querySelectorAll(
      ".nav-card, .action-card, .phrase"
    );

  pressables.forEach(element => {

    element.addEventListener(
      "pointerdown",
      () => {

        element.style.transform =
          "scale(.985)";

      }
    );


    const resetPress = () => {

      element.style.transform = "";

    };


    element.addEventListener(
      "pointerup",
      resetPress
    );

    element.addEventListener(
      "pointercancel",
      resetPress
    );

    element.addEventListener(
      "pointerleave",
      resetPress
    );

  });


  /* =======================================================
     9. OPTIONAL DEEP-LINK PANEL SUPPORT

     Example:
     behavior.html#overwhelmed

     This lets us eventually link someone directly to
     a specific situation if we want.
     ======================================================= */

  const hash =
    window.location.hash.replace("#", "");

  if (hash) {

    const hashPanel =
      document.getElementById(hash);

    if (
      hashPanel &&
      hashPanel.classList.contains("panel")
    ) {

      setTimeout(() => {

        openPanel(hash);

      }, 300);

    }

  }

});
