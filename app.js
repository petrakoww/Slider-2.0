function slider(sliderContainer) {
  if (!sliderContainer) {
    return;
  }

  const slidesInCarousel = [...sliderContainer.children];
  const carouselTrack = document.createElement("div");
  const overflowHidden = document.createElement("div");
  sliderContainer.insertAdjacentElement("afterbegin", overflowHidden);
  overflowHidden.style.overflow = "hidden";
  const asd = [...carouselTrack.children];

  const autoplayButton = document.createElement("button");

  let currentSlideIndex = 0,
    transitionSize = 0,
    slideWidths = [],
    slideHeights = [],
    numberOfElementsInCarousel = slidesInCarousel.length,
    numberOfIndexesInCarousel = numberOfElementsInCarousel - 1,
    startPosition,
    currPosition,
    navigationDots,
    dot,
    startIntervalAutoplay,
    timeRemaining,
    leftClientBorderToSlider,
    enableAutoplay = false,
    enableAutoplayButtons = false,
    isAutoplayPaused = false,
    autoPlayInterval = 5000;

  let containerWidth = sliderContainer.clientWidth;

  //full width of carousel
  slidesInCarousel.forEach((slide, index) => {
    slideWidths.push(slide.clientWidth);
    slideHeights.push(slide.clientHeight);
  });

  carouselTrack.style.width = `${
    containerWidth * numberOfElementsInCarousel +
    40 * numberOfElementsInCarousel +
    2 * containerWidth
  }px`;

  function resizeSlider() {
    // if (slideHeights[currentSlideIndex] < 200) {
    //   slideHeights[currentSlideIndex] = 200;
    // }

    // const wrappedEls = [
    //   ...carouselTrack.querySelectorAll(".vasko-slide-wrapper"),
    // ];

    // wrappedEls[
    //   currentSlideIndex
    // ].childNodes[0].style.width = `${slideWidths[currentSlideIndex]}px`;
    // wrappedEls[
    //   currentSlideIndex
    // ].childNodes[0].style.height = `${slideHeights[currentSlideIndex]}px`;

    // carouselTrack.style.width = `${slideWidths[currentSlideIndex]}px`;
    // carouselTrack.style.height = `${slideHeights[currentSlideIndex]}px`;
    // slidesInCarousel.forEach((slide, index) => {
    // slidesInCarousel[index].style.width = `${asd-80}px`;
    // carouselTrack.style.width = `${asd-80}px`;
    // });

    window.addEventListener("resize", () => {
      // containerWidth = 100;
      // carouselTrack.style.width = `${
      //   containerWidth * numberOfElementsInCarousel +
      //   40 * numberOfElementsInCarousel
      // }px`;
      // console.log(window.innerWidth);
      // console.log(window.innerHeight);
    });
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
    // let slideWrapper
    slidesInCarousel.forEach((slideContent) => {
      const slideWrapper = document.createElement("div");
      slideWrapper.classList.add("vasko-slide-wrapper");
      slideWrapper.style.width = `${containerWidth}px`;
      // slideWrapper.style.marginRight = `${40}px`

      // margin-right: 80px;

      slideWrapper.append(slideContent);
      carouselTrack.appendChild(slideWrapper);
    });

    ///
    function smoothSlider() {
      const lastDiv = document.createElement("div");
      lastDiv.classList.add("lastClone");
      lastDiv.style.width = `${containerWidth}px`;
      const firstDiv = document.createElement("div");
      firstDiv.classList.add("firstClone");
      firstDiv.style.width = `${containerWidth}px`;

      let selectFirstEl = carouselTrack.firstChild.firstChild;
      let selectLastEl = carouselTrack.lastChild.lastChild;

      let lastEL = selectFirstEl.cloneNode(true);
      let firstEl = selectLastEl.cloneNode(true);

      lastDiv.append(lastEL);
      firstDiv.append(firstEl);

      carouselTrack.insertAdjacentElement("afterbegin", firstDiv);
      carouselTrack.insertAdjacentElement("beforeend", lastDiv);

      slidesInCarousel.push(lastEL);
      slidesInCarousel.splice(0, 0, firstEl);

      slideWidths.splice(0, 0, slideWidths[slideWidths.length - 1]);
      slideHeights.splice(0, 0, slideHeights[slideHeights.length - 1]);
      slideWidths.push(lastEL.width);
      slideHeights.push(lastEL.height);
    }
    smoothSlider();
    ///

    overflowHidden.appendChild(carouselTrack);
  }
  function InputDiv() {
    const inputDiv = document.createElement("div");
    inputDiv.style.marginTop = "25px";
    sliderContainer.insertAdjacentElement("afterend", inputDiv);

    const goInput = document.createElement("input");
    goInput.type = "number";
    goInput.min = "1";
    goInput.max = numberOfIndexesInCarousel + 1;
    inputDiv.insertAdjacentElement("afterbegin", goInput);

    const goButton = document.createElement("button");
    goButton.textContent = "GO";
    inputDiv.insertAdjacentElement("beforeend", goButton);

    goButton.addEventListener("click", () => {
      if (
        goInput.value < 0 ||
        goInput.value > numberOfIndexesInCarousel + 1 ||
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
        transitionSize += containerWidth;
      }
    });
    carouselTrack.style.transform = `translateX(${-transitionSize}px)`;

    if (sliderContainer.dataset.dots === "true") {
      navigationDots.forEach((dot) => {
        if (dot.classList.contains("dot-red")) {
          dot.classList.remove("dot-red");
        }
      });
      navigationDots[slideToGo].classList.add("dot-red");
    }

    currentSlideIndex = slideToGo;
    resizeSlider();
  }
  function createNavDots() {
    const dotsContainer = document.createElement("div");
    dotsContainer.classList.add("dotsContainer");
    sliderContainer.appendChild(dotsContainer);

    slidesInCarousel.forEach((el, index) => {
      dot = document.createElement("button");
      dot.className = "dot";

      dot.id = index;
      dotsContainer.appendChild(dot);
    });
    dotsContainer.childNodes[numberOfElementsInCarousel + 1].style.display =
      "none";
    dotsContainer.childNodes[0].style.display = "none";

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
  function dsa() {
    if (currentSlideIndex === numberOfElementsInCarousel + 1) {
      carouselTrack.style.transition = "none";
      goToSlide(1);
    }
    if (currentSlideIndex === 0) {
      carouselTrack.style.transition = "none";
      goToSlide(numberOfElementsInCarousel);
    }
  }
  function moveSlide(direction = "next") {
    if (direction === "next") {
      if (currentSlideIndex > numberOfIndexesInCarousel + 1) {
        carouselTrack.addEventListener("transitionend", dsa);
      } else {
        carouselTrack.style.transition = "transform 0.4s ease-in-out";
        currentSlideIndex++;
        goToSlide(currentSlideIndex);
      }
      // currentSlideIndex++;
      // carouselTrack.style.transition = "transform 0.4s ease-in-out";
      // goToSlide(currentSlideIndex);
    } else if (direction === "prev") {
      // carouselTrack.style.transition = "transform 0.4s ease-in-out";
      // currentSlideIndex--;
      // goToSlide(currentSlideIndex);

      if (currentSlideIndex < 1) {
        carouselTrack.addEventListener("transitionend", dsa);
      } else {
        carouselTrack.style.transition = "transform 0.4s ease-in-out";
        currentSlideIndex--;
        goToSlide(currentSlideIndex);
      }
    }
  }

  function buttons() {
    //create prev and next button dynamically
    //prev
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttonsContainer");
    sliderContainer.appendChild(buttonsContainer);

    const prevButton = document.createElement("button");
    prevButton.textContent = "Prev";
    buttonsContainer.appendChild(prevButton);

    //next
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    buttonsContainer.appendChild(nextButton);

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

    sliderContainer.addEventListener("click", sliderClick);
    sliderContainer.addEventListener("mousedown", sliderMouseDown);
    sliderContainer.addEventListener("mouseenter", sliderMouseEnter);

    function sliderMouseEnter() {
      sliderContainer.style.cursor = "grab";
    }

    function sliderMouseDown(e) {
      pressed = true;
      sliderContainer.style.cursor = "grabbing";
      sliderContainer.addEventListener("mousemove", sliderMouseMove);

      currPosition = sliderContainer.getBoundingClientRect().x + e.clientX;
    }
    function sliderMouseMove(e) {
      pressed = true;
      sliderContainer.style.cursor = "grabbing";
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

      sliderContainer.addEventListener("mouseleave", sliderMouseLeave);
      sliderContainer.addEventListener("mouseup", sliderMouseUp);
    }
    function sliderClick() {
      sliderContainer.style.cursor = "grab";
      sliderContainer.removeEventListener("mousemove", sliderMouseMove);
    }
    function sliderMouseUp() {
      pressed = false;
      sliderContainer.style.cursor = "grab";

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

      sliderContainer.removeEventListener("mousemove", sliderMouseMove);
      sliderContainer.removeEventListener("mouseleave", sliderMouseLeave);
      sliderContainer.removeEventListener("mouseup", sliderMouseUp);
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
          moveSlide("prev");
        } else if (startPosition > currPosition) {
          if (!isAutoplayPaused) {
            resetAutoplay();
          }
          moveSlide("next");
        }
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
      } else if (sliderContainer.dataset.startfromindex < 0) {
        sliderContainer.dataset.startfromindex = 0;
      }
      createNavDots(sliderContainer.dataset.startfromindex);
      goToSlide(sliderContainer.dataset.startfromindex);
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
//add padding to transition
