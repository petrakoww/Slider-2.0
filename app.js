function slider(sliderContainer) {
  if (!sliderContainer) {
    return;
  }

  const slidesInCarousel = [...sliderContainer.children];
  const carouselTrack = document.createElement("div");
  const overflowHidden = document.createElement("div");
  sliderContainer.insertAdjacentElement("afterbegin", overflowHidden);
  overflowHidden.style.overflow = "hidden";

  const autoplayButton = document.createElement("button");
  const buttonsContainer = document.createElement("div");

  let currentSlideIndex = 0,
    transitionSize = 0,
    numberOfElementsInCarousel = slidesInCarousel.length,
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
    isResized = false,
    autoPlayInterval = 5000;

  let containerWidth = sliderContainer.clientWidth;
  const initialContainerWidth = containerWidth;

  carouselTrack.style.width = `${
    containerWidth * numberOfElementsInCarousel + 2 * containerWidth
  }px`;

  if (window.innerWidth < initialContainerWidth) {
    isResized = true;
  }
  function resizeSlider() {
    let buttonsShow =
      buttonsContainer.childNodes[0].clientWidth +
      buttonsContainer.childNodes[1].clientWidth +
      (buttonsContainer.childNodes[0].clientWidth +
        buttonsContainer.childNodes[1].clientWidth) /
        2;

    if (window.innerWidth < initialContainerWidth) {
      sliderContainer.style.width = `${window.innerWidth}px`;
      slidesInCarousel.forEach((slide, index) => {
        carouselTrack.childNodes[index].style.width = `${window.innerWidth}px`;
        carouselTrack.childNodes[
          index
        ].childNodes[0].style.width = `${window.innerWidth}px`;
      });
      carouselTrack.style.transform = `translateX(${
        -window.innerWidth * currentSlideIndex
      }px)`;

      isResized = true;
    } else {
      sliderContainer.style.width = `${initialContainerWidth}px`;
      slidesInCarousel.forEach((slide, index) => {
        carouselTrack.childNodes[
          index
        ].style.width = `${initialContainerWidth}px`;
        carouselTrack.childNodes[
          index
        ].childNodes[0].style.width = `${initialContainerWidth}px`;

        carouselTrack.style.transform = `translateX(${
          -initialContainerWidth * currentSlideIndex
        }px)`;
      });
      isResized = false;
    }
    console.log(isResized);
    //buttons
    if (window.innerWidth < initialContainerWidth + buttonsShow) {
      buttonsContainer.style.left = "0px";
      buttonsContainer.style.right = "0px";
    } else {
      buttonsContainer.style.left = "-37px";
      buttonsContainer.style.right = "-37px";
    }
    ///activate if resize divs
    // carouselTrack.style.width = `${
    //   containerWidth * numberOfElementsInCarousel + 2 * containerWidth
    // }px`;
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
    autoplayButton.style.marginTop = "10px";
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
    if (autoplayButton.textContent === "Pause" || !enableAutoplayButtons) {
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
      slideWrapper.style.width = `${containerWidth}px`;

      slideWrapper.append(slideContent);
      carouselTrack.appendChild(slideWrapper);
    });

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
    }
    smoothSlider();

    overflowHidden.appendChild(carouselTrack);
  }
  function InputDiv() {
    carouselTrack.style.transition = "transform 0.4s ease-in-out";
    const inputDiv = document.createElement("div");
    inputDiv.style.margin = "20px 0";
    sliderContainer.insertAdjacentElement("afterend", inputDiv);

    const goInput = document.createElement("input");
    goInput.type = "number";
    goInput.min = "1";
    goInput.max = numberOfElementsInCarousel;
    inputDiv.insertAdjacentElement("afterbegin", goInput);

    const goButton = document.createElement("button");
    goButton.textContent = "GO";
    inputDiv.insertAdjacentElement("beforeend", goButton);

    goButton.addEventListener("click", () => {
      carouselTrack.style.transition = "transform 0.4s ease-in-out";

      if (
        goInput.value <= 0 ||
        goInput.value > numberOfElementsInCarousel ||
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
    console.log(isResized);
    slidesInCarousel.forEach((slide, index) => {
      if (index < slideToGo) {
        //////////////////// should not be here cuz it runs only once; its not dynamic
        if (isResized) {
          transitionSize += window.innerWidth;
          //
          containerWidth = window.innerWidth
        } else {
          transitionSize += containerWidth;
          //
          containerWidth = initialContainerWidth
        }
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
console.log(currentSlideIndex, slideToGo);
    currentSlideIndex = slideToGo;
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
      carouselTrack.style.transition = "transform 0.4s ease-in-out";
      transitionSize = 0;

      let { id } = e.target;

      if (id) {
        if (!isAutoplayPaused) {
          resetAutoplay();
        }
        goToSlide(id);
      }

      currentSlideIndex = id;
    });
  }
  function endlessSlider() {
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
    carouselTrack.addEventListener("transitionend", endlessSlider);
    if (direction === "next") {
      carouselTrack.style.transition = "transform 0.4s ease-in-out";
      if (currentSlideIndex > numberOfElementsInCarousel) {
        return;
      }
      currentSlideIndex++;
      goToSlide(currentSlideIndex);
    } else if (direction === "prev") {
      carouselTrack.style.transition = "transform 0.4s ease-in-out";
      if (currentSlideIndex < 1) {
        return;
      }
      currentSlideIndex--;
      goToSlide(currentSlideIndex);
    }
  }
  function buttons() {
    //create prev and next button dynamically
    //prev
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

    console.log(isResized);

    sliderContainer.addEventListener("click", sliderClick);
    sliderContainer.addEventListener("mousedown", sliderMouseDown);
    sliderContainer.addEventListener("mouseenter", sliderMouseEnter);

    function sliderMouseEnter() {
      sliderContainer.style.cursor = "grab";
    }

    function sliderMouseDown(e) {
      e.preventDefault();
      pressed = true;
      sliderContainer.style.cursor = "grabbing";
      sliderContainer.addEventListener("mousemove", sliderMouseMove);

      currPosition = sliderContainer.getBoundingClientRect().x + e.clientX;
    }
    function sliderMouseMove(e) {
      pressed = true;
      sliderContainer.style.cursor = "grabbing";
      // e.preventDefault();
      leftClientBorderToSlider = sliderContainer.getBoundingClientRect().x;

      console.log(transitionSize, leftClientBorderToSlider, containerWidth);

      startPosition = sliderContainer.getBoundingClientRect().x + e.clientX;
      if (startPosition < currPosition) {
        carouselTrack.style.transform =
          "translateX(" +
          (-transitionSize -
            leftClientBorderToSlider -
            (containerWidth - e.clientX)) +
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
      endlessSlider();
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
            (containerWidth - e.touches[0].clientX)) +
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
      if (sliderContainer.dataset.startfromindex > numberOfElementsInCarousel) {
        sliderContainer.dataset.startfromindex = numberOfElementsInCarousel;
      } else if (sliderContainer.dataset.startfromindex < 1) {
        sliderContainer.dataset.startfromindex = 1;
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
        if (autoPlayInterval < 1000) {
          autoPlayInterval = 5000;
        }
      }
      if (sliderContainer.dataset.autoplaybuttons === "true") {
        enableAutoplayButtons = true;
      }
    }
  }

  window.addEventListener("load", resizeSlider);
  window.addEventListener("resize", resizeSlider);

  wrapEl();
  dataSets();
  autoplay();
}
const sliders = document.querySelectorAll(".carousel-container");

sliders.forEach((slide) => {
  slider(slide);
});
