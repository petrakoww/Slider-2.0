function slider(sliderContainer) {
  if (!sliderContainer) {
    return;
  }

  const slidesInCarousel = [...sliderContainer.children];
  const carouselTrack = document.createElement("div");

  const autoplayButton = document.createElement("button");

  let currentSlideIndex = 0,
    transitionSize = 0;
  let slideWidths = [],
    slideHeights = [];
  let numberOfElementsInCarousel = slidesInCarousel.length;
  let numberOfIndexesInCarousel = numberOfElementsInCarousel - 1;
  let startPosition,
    currPosition,
    navigationDots,
    dot,
    moveToSlide,
    startIntervalAutoplay,
    timeRemaining,
    leftClientBorderToSlider;
  let enableAutoplay = false,
    enableAutoplayButtons = false,
    isAutoplayPaused = false;
  let autoPlayInterval = 5000,
    sliderWidth = 500,
    sliderheight = 500;

  //full width of carousel
  slidesInCarousel.forEach((slide) => {
    slideWidths.push(slide.clientWidth);
  });
  slidesInCarousel.forEach((slide) => {
    slideHeights.push(slide.clientHeight);
  });
  function resizeSlider() {
    // // currentSlideIndex++;
    carouselTrack.style.width = `${slideWidths[moveToSlide]}px`;
    carouselTrack.style.height = `${slideHeights[moveToSlide]}px`;
  }
  function autoplay() {
    if (enableAutoplay) {
      startAutoplay();
      if (enableAutoplayButtons) {
        autoPlayButtons();
      }
    }
  }
  function autoPlayButtons() {
    const autoplayDiv = document.createElement("div");
    sliderContainer.insertAdjacentElement("afterend", autoplayDiv);
    autoplayButton.textContent = "Pause";
    autoplayButton.style.marginBottom = "10px";
    autoplayDiv.insertAdjacentElement("afterbegin", autoplayButton);

    autoplayButton.addEventListener("click", autoplayBtnFn);
    function autoplayBtnFn() {
      if (autoplayButton.textContent === "Resume") {
        isAutoplayPaused = false;
        autoplayButton.textContent = "Pause";
      } else {
        isAutoplayPaused = true;
        autoplayButton.textContent = "Resume";
      }
    }
  }
  function startAutoplay() {
    timeRemaining = autoPlayInterval;
    startIntervalAutoplay = setInterval(() => {
      if (!isAutoplayPaused) {
        timeRemaining -= 100;
      }
      if (timeRemaining <= 0 && !isAutoplayPaused) {
        moveSlide();
        timeRemaining = autoPlayInterval;
      }
    }, 100);

    if (enableAutoplay) {
      carouselTrack.addEventListener("mouseenter", pauseAutoplay);
      carouselTrack.addEventListener("mouseleave", mouseLeaveHandler);
    }
  }
  function mouseLeaveHandler() {
    if (autoplayButton.textContent === "Pause") {
      isAutoplayPaused = false;
    }
  }
  function pauseAutoplay() {
    isAutoplayPaused = true;
  }
  function resumeAutoplay() {
    isAutoplayPaused = false;
  }
  function stopAutoplay() {
    clearInterval(startIntervalAutoplay);
  }
  function resetAutoplay() {
    isAutoplayPaused = false;
    if (enableAutoplay && !isAutoplayPaused) {
      stopAutoplay();
      startAutoplay();
    }
  }

  function wrapEl() {
    carouselTrack.classList.add("carousel-track");

    slidesInCarousel.forEach((slideContent) => {
      const slideWrapper = document.createElement("div");
      slideWrapper.classList.add("vasko-slide-wrapper");
      slideWrapper.append(slideContent);
      carouselTrack.appendChild(slideWrapper);
    });

    sliderContainer.appendChild(carouselTrack);
  }
  function InputDiv() {
    const inputDiv = document.createElement("div");
    sliderContainer.insertAdjacentElement("afterend", inputDiv);

    const goInput = document.createElement("input");
    goInput.type = "number";
    goInput.min = "0";
    goInput.max = numberOfIndexesInCarousel;
    inputDiv.insertAdjacentElement("afterbegin", goInput);

    const goButton = document.createElement("button");
    goButton.textContent = "GO";
    inputDiv.insertAdjacentElement("beforeend", goButton);

    goButton.addEventListener("click", () => {
      if (
        goInput.value < 0 ||
        goInput.value > numberOfIndexesInCarousel ||
        goInput.value == ""
      ) {
        return;
      }

      if (!isAutoplayPaused) {
        resetAutoplay();
      }
      goToSlide(goInput.value);
    });
  }
  function goToSlide(slideToGo) {
    transitionSize = 0;
    slidesInCarousel.forEach((slide, index) => {
      if (index < slideToGo) {
        transitionSize += slide.clientWidth;
      }
    });
    carouselTrack.style.transform = `translateX(${-transitionSize}px)`;

    navigationDots.forEach((dot) => {
      if (dot.classList.contains("dot-red")) {
        dot.classList.remove("dot-red");
      }
    });
    navigationDots[slideToGo].classList.add("dot-red");
    currentSlideIndex = slideToGo;
    moveToSlide = slideToGo;
    resizeSlider();
  }
  function createNavDots() {
    const dotsContainer = document.createElement("div");
    dotsContainer.classList.add("alignCenter");
    sliderContainer.insertAdjacentElement("beforeend", dotsContainer);

    slideWidths.forEach((el, index) => {
      dot = document.createElement("button");
      dot.className = "dot";

      dot.id = index;
      dotsContainer.appendChild(dot);
    });

    //active button
    navigationDots = sliderContainer.querySelectorAll(".dot");

    dotsContainer.addEventListener("click", (e) => {
      transitionSize = 0;

      let { id } = e.target;

      if (id) {
        if (!isAutoplayPaused) {
          resetAutoplay();
        }
        goToSlide(id);
      }

      currentSlideIndex = id;
      //sets inactive buttons grey and checks if e.target is accurate
      if (e.target.classList.contains("dot")) {
        navigationDots.forEach((dot) => {
          if (dot.classList.contains("dot-red")) {
            dot.classList.remove("dot-red");
          }
        });
        navigationDots[currentSlideIndex].classList.add("dot-red");
      }
    });
  }
  function moveSlide(direction = "next") {
    if (direction === "next") {
      if (currentSlideIndex >= numberOfIndexesInCarousel) {
        goToSlide(0);
      } else {
        moveToSlide++;
        goToSlide(moveToSlide);
      }
    } else if (direction === "prev") {
      if (currentSlideIndex <= 0) {
        goToSlide(numberOfIndexesInCarousel);
      } else {
        moveToSlide--;
        goToSlide(moveToSlide);
      }
    }
  }
  function buttons() {
    //create prev and next button dynamically
    //prev
    const prevButton = document.createElement("button");
    prevButton.textContent = "Prev";
    prevButton.classList.add("prevBtn");
    sliderContainer.insertAdjacentElement("afterbegin", prevButton);

    //next
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.classList.add("nextBtn");
    sliderContainer.insertAdjacentElement("beforeend", nextButton);

    nextButton.addEventListener("click", () => {
      if (!isAutoplayPaused) {
        resetAutoplay();
      }
      moveSlide("next");
    });

    prevButton.addEventListener("click", () => {
      if (!isAutoplayPaused) {
        resetAutoplay();
      }
      moveSlide("prev");
    });
  }
  function arrowKeys() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        moveSlide("prev");
      } else if (e.key === "ArrowRight") {
        moveSlide("next");
      }
    });
  }
  function draggable() {
    let pressed = false;

    carouselTrack.addEventListener("click", sliderClick);
    carouselTrack.addEventListener("mousedown", sliderMouseDown);
    carouselTrack.addEventListener("mouseenter", sliderMouseEnter);

    function sliderMouseEnter() {
      carouselTrack.style.cursor = "grab";
    }

    function sliderMouseDown(e) {
      pressed = true;
      carouselTrack.style.cursor = "grabbing";
      carouselTrack.addEventListener("mousemove", sliderMouseMove);

      currPosition = sliderContainer.getBoundingClientRect().x + e.clientX;
    }
    function sliderMouseMove(e) {
      pressed = true;
      carouselTrack.style.cursor = "grabbing";
      e.preventDefault();

      leftClientBorderToSlider = sliderContainer.getBoundingClientRect().x;

      startPosition = sliderContainer.getBoundingClientRect().x + e.clientX;
      if (startPosition < currPosition) {
        carouselTrack.style.transform =
          "translateX(" +
          (-transitionSize -
            leftClientBorderToSlider -
            (slideWidths[currentSlideIndex] - e.clientX)) +
          "px)";
      } else {
        carouselTrack.style.transform =
          "translateX(" +
          (-transitionSize - (leftClientBorderToSlider - e.clientX)) +
          "px)";
      }

      carouselTrack.addEventListener("mouseleave", sliderMouseLeave);
      carouselTrack.addEventListener("mouseup", sliderMouseUp);
    }
    function sliderClick() {
      carouselTrack.style.cursor = "grab";
      carouselTrack.removeEventListener("mousemove", sliderMouseMove);
    }
    function sliderMouseUp() {
      pressed = false;
      carouselTrack.style.cursor = "grab";

      if (
        (startPosition - currPosition < 100 &&
          startPosition - currPosition > 0) ||
        (currPosition - startPosition > 0 && currPosition - startPosition < 100)
      ) {
        if (!isAutoplayPaused) {
          resetAutoplay();
        }
        carouselTrack.style.transform = "translateX(" + -transitionSize + "px)";
      } else {
        if (startPosition < currPosition) {
          if (!isAutoplayPaused) {
            resetAutoplay();
          }
          moveSlide("next");
        } else if (startPosition > currPosition) {
          if (!isAutoplayPaused) {
            resetAutoplay();
          }
          moveSlide("prev");
        }
      }

      carouselTrack.removeEventListener("mousemove", sliderMouseMove);
      carouselTrack.removeEventListener("mouseleave", sliderMouseLeave);
      carouselTrack.removeEventListener("mouseup", sliderMouseUp);
    }
    function sliderMouseLeave(e) {
      pressed = false;
      sliderMouseUp();
    }
  }
  function draggableTouchFunction() {
    carouselTrack.addEventListener("touchstart", touchStart);
    carouselTrack.addEventListener("touchmove", touchMove);
    carouselTrack.addEventListener("touchend", touchEnd);

    function touchStart(e) {
      startPosition =
        sliderContainer.getBoundingClientRect().x + e.touches[0].clientX;

      stopAutoplay();
    }
    function touchMove(e) {
      leftClientBorderToSlider = sliderContainer.getBoundingClientRect().x;
      currPosition =
        sliderContainer.getBoundingClientRect().x + e.touches[0].clientX;

      if (startPosition > currPosition) {
        carouselTrack.style.transform =
          "translateX(" +
          (-transitionSize -
            leftClientBorderToSlider -
            (slideWidths[currentSlideIndex] - e.touches[0].clientX)) +
          "px)";
      } else {
        carouselTrack.style.transform =
          "translateX(" +
          (-transitionSize -
            (leftClientBorderToSlider - e.touches[0].clientX)) +
          "px)";
      }
    }
    function touchEnd() {
      resumeAutoplay();
      if (startPosition < currPosition) {
        if (!isAutoplayPaused) {
          resetAutoplay();
        }
        moveSlide("prev");
      } else if (startPosition > currPosition) {
        if (!isAutoplayPaused) {
          resetAutoplay();
        }
        moveSlide("next");
      }
    }
  }

  // data attribute for initial slide
  function dataSets() {
    if (sliderContainer.dataset.button === "true") {
      buttons();
    }
    if (sliderContainer.dataset.dots === "true") {
      if (sliderContainer.dataset.startfromindex > numberOfIndexesInCarousel) {
        sliderContainer.dataset.startfromindex = numberOfIndexesInCarousel;
      }
      createNavDots(sliderContainer.dataset.startfromindex || 0);
      goToSlide(sliderContainer.dataset.startfromindex || 0);
    }
    if (sliderContainer.dataset.goto === "true") {
      InputDiv();
    }
    if (sliderContainer.dataset.arrowkeys === "true") {
      arrowKeys();
    }
    if (sliderContainer.dataset.draggable === "true") {
      draggable();
    }
    if (sliderContainer.dataset.draggabletouchfunction === "true") {
      draggableTouchFunction();
    }
    if (sliderContainer.dataset.autoplay === "true") {
      enableAutoplay = true;
      if (sliderContainer.dataset.autoplayinterval) {
        autoPlayInterval = parseInt(sliderContainer.dataset.autoplayinterval);
        if (autoPlayInterval <= 1000) {
          autoPlayInterval = 5000;
        }
      }
      if (sliderContainer.dataset.autoplaybuttons === "true") {
        enableAutoplayButtons = true;
      }
    }
    if (sliderContainer.dataset.sliderwidth) {
      sliderWidth = parseInt(sliderContainer.dataset.sliderwidth);
      if (sliderWidth <= 0) {
        sliderWidth = 500;
      }
      carouselTrack.style.width = `${sliderWidth}px`;
    }
    if (sliderContainer.dataset.sliderheight) {
      sliderheight = parseInt(sliderContainer.dataset.sliderheight);
      if (sliderheight <= 0) {
        sliderheight = 500;
      }
      carouselTrack.style.height = `${sliderheight}px`;
    }
  }
  wrapEl();
  dataSets();
  autoplay();

  resizeSlider();
}

const sliders = document.querySelectorAll(".carousel-container");

sliders.forEach((slide) => {
  slider(slide);
});

//glitch on first and last el when move
