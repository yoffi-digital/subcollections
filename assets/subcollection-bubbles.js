class SubcollectionBubblesCarousel extends HTMLElement {
  constructor() {
    super();
    this.handleResize = this.updateStyles.bind(this);
    this.handleScroll = this.updateBtnState.bind(this);

    this.handlePrevClick = this.clickPrev.bind(this);
    this.handleNextClick = this.clickNext.bind(this);

    this.resizeObserver = null;
  }

  connectedCallback() {
    this.carousel = this.querySelector(".subcollections__wrapper-carousel");
    if (!this.carousel) return;

    // native carousel buttons
    this.prev = this.querySelector(".prev-next-button--prev.native");
    this.next = this.querySelector(".prev-next-button--next.native");

    this.updateStyles();

    if (this.prev && this.next) this.updateBtnState();

    window.addEventListener("resize", this.handleResize);
    document.addEventListener("shopify:section:load", this.handleResize);

    if (this.prev && this.next) {
      this.carousel.addEventListener("scroll", this.handleScroll, {
        passive: true,
      });
      this.prev.addEventListener("click", this.handlePrevClick);
      this.next.addEventListener("click", this.handleNextClick);
    }

    this.resizeObserver = new ResizeObserver(() => this.updateStyles());
    this.resizeObserver.observe(this.carousel);
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("shopify:section:load", this.handleResize);
    if (this.prev && this.next) {
      this.carousel.removeEventListener("scroll", this.handleScroll);
      this.prev.removeEventListener("click", this.handlePrevClick);
      this.next.removeEventListener("click", this.handleNextClick);
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }
  updateBtnState() {
    const scrollLeft = this.carousel.scrollLeft;
    const maxScrollLeft = this.carousel.scrollWidth - this.carousel.clientWidth;
    this.prev.disabled = scrollLeft <= 0;
    this.next.disabled = scrollLeft >= maxScrollLeft - 1;
  }

  clickPrev() {
    if (!this.carousel) return;
    this.carousel.scrollBy({
      left: this.carousel.offsetWidth * -1,
      behavior: "smooth",
    });
  }

  clickNext() {
    if (!this.carousel) return;
    this.carousel.scrollBy({
      left: this.carousel.offsetWidth * 1,
      behavior: "smooth",
    });
  }

  updateStyles() {
    const carousel = this.carousel;
    if (!carousel) return;

    const isMobile = window.matchMedia("(pointer: coarse)").matches;

    if (isMobile) {
      carousel.setAttribute("allow-drag", "");
    } else {
      carousel.removeAttribute("allow-drag");
    }

    const carouselWidth = carousel.offsetWidth;
    const computedStyle = window.getComputedStyle(carousel);
    const gap = parseFloat(computedStyle.gap) || 0;

    const desktopGaps =
      parseInt(computedStyle.getPropertyValue("--num-desktop")) || 8;
    const tabletGaps =
      parseInt(computedStyle.getPropertyValue("--num-tablet")) || 6;
    const mobileGaps =
      parseInt(computedStyle.getPropertyValue("--num-mobile")) || 2;

    const totalGapWidth = {
      desktop: gap * desktopGaps,
      tablet: gap * tabletGaps,
      mobile: gap * mobileGaps,
    };

    const isOverflowing = carousel.scrollWidth > carousel.clientWidth;
    carousel.style.justifyContent = isOverflowing ? "flex-start" : "center";

    carousel.style.setProperty("--carousel-width", `${carouselWidth}px`);
    carousel.style.setProperty(
      "--desktop-total-gap-width",
      `${totalGapWidth.desktop}px`,
    );
    carousel.style.setProperty(
      "--tablet-total-gap-width",
      `${totalGapWidth.tablet}px`,
    );
    carousel.style.setProperty(
      "--mobile-total-gap-width",
      `${totalGapWidth.mobile}px`,
    );

    if (this.prev && this.next) {
      this.updateBtnState();
    }
  }
}

customElements.define(
  "subcollection-bubbles-carousel",
  SubcollectionBubblesCarousel,
);
