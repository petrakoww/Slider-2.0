function slider(sliderContainer) {
  if (!sliderContainer) {
    return;
  }

  const slidesInCarousel = [...sliderContainer.children];
  const carouselTrack = document.createElement("div");

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

  //full width of carousel
  slidesInCarousel.forEach((slide) => {
    slide.style.display = "inline-block";
    slideWidths.push(slide.clientWidth);
    slideHeights.push(slide.clientHeight);
  });
  function resizeSlider() {
    if (slideHeights[currentSlideIndex] < 200) {
      slideHeights[currentSlideIndex] = 200;
    }

    const wrappedEls = [
      ...carouselTrack.querySelectorAll(".vasko-slide-wrapper"),
    ];
  
    wrappedEls[
      currentSlideIndex
    ].childNodes[0].style.width = `${slideWidths[currentSlideIndex]}px`;
    wrappedEls[
      currentSlideIndex
    ].childNodes[0].style.height = `${slideHeights[currentSlideIndex]}px`;

    carouselTrack.style.width = `${slideWidths[currentSlideIndex]}px`;
    carouselTrack.style.height = `${slideHeights[currentSlideIndex]}px`;

    // slidesInCarousel.forEach((slide, index) => {
    //   if (slide.clientHeight < 200 || slide.clientWidth < 200) {
    //     slideHeights[index] = 200;
    //     slidesInCarousel[index].style.width = "180px";
    //     // slidesInCarousel[index].style.height="200px";
    //   }
    // });
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
      slideWrapper.append(slideContent);
      carouselTrack.appendChild(slideWrapper);
    });

    //
    function smoothSlider(){
    const lastDiv = document.createElement("div");
    lastDiv.classList.add("lastClone");
    const firstDiv = document.createElement("div");
    firstDiv.classList.add("firstClone");
    

    let selectFirstEl = carouselTrack.firstChild.firstChild;
    let selectLastEl = carouselTrack.lastChild.lastChild;

    let lastEL = selectFirstEl.cloneNode(true);
    let firstEl = selectLastEl.cloneNode(true);

    
    lastDiv.append(lastEL)
    firstDiv.append(firstEl)
    
    carouselTrack.insertAdjacentElement("afterbegin",firstDiv)
    carouselTrack.insertAdjacentElement("beforeend",lastDiv)
  }
  //
  // smoothSlider();

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
        currentSlideIndex++;
        goToSlide(currentSlideIndex);
      }
    } else if (direction === "prev") {
      if (currentSlideIndex <= 0) {
        goToSlide(numberOfIndexesInCarousel);
      } else {
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
