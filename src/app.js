import "../style/style.css";
import "../style/website-specific-styles.css";

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
  const goButton = document.createElement("button");

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
    autoPlayInterval = 5000,
    isInfinite = true,
    biggestElement = 0,
    disableDraggableButtons = false,
    thresholdMobile,
    thresholdDesktop;

  carouselTrack.style.width = `${
    sliderContainer.clientWidth * numberOfElementsInCarousel +
    2 * sliderContainer.clientWidth
  }px`;

  function disableDragOnButtons() {
    disableDraggableButtons = true;
  }
  function enableDrag() {
    disableDraggableButtons = false;
  }
  function disableButtons() {
    buttonsContainer.style.visibility = "hidden";
    if (currentSlideIndex == numberOfElementsInCarousel) {
      buttonsContainer.childNodes[1].style.visibility = "vissible";
      buttonsContainer.childNodes[1].disabled = true;
      buttonsContainer.childNodes[1].classList.add("vip-disableArrows");
    } else {
      buttonsContainer.childNodes[1].style.visibility = "visible";
      buttonsContainer.childNodes[1].disabled = false;
      buttonsContainer.childNodes[1].classList.remove("vip-disableArrows");
    }

    if (currentSlideIndex == 1) {
      buttonsContainer.childNodes[0].style.visibility = "visible";
      buttonsContainer.childNodes[0].disabled = true;
      buttonsContainer.childNodes[0].classList.add("vip-disableArrows");
    } else {
      buttonsContainer.childNodes[0].style.visibility = "visible";
      buttonsContainer.childNodes[0].disabled = false;
      buttonsContainer.childNodes[0].classList.remove("vip-disableArrows");
    }
  }

  slidesInCarousel.forEach((slide) => {
    if (biggestElement < slide.clientWidth) {
      biggestElement = slide.clientWidth;
    }
  });
  function resizeSlider() {
    if (sliderContainer.clientWidth < biggestElement) {
      slidesInCarousel.forEach((slide, index) => {
        carouselTrack.childNodes[
          index
        ].style.width = `${sliderContainer.clientWidth}px`;
        carouselTrack.childNodes[
          index
        ].childNodes[0].style.width = `${sliderContainer.clientWidth}px`;
      });
      carouselTrack.style.transform = `translateX(${
        -sliderContainer.clientWidth * currentSlideIndex
      }px)`;
    } else {
      slidesInCarousel.forEach((slide, index) => {
        //div
        carouselTrack.childNodes[
          index
        ].style.width = `${sliderContainer.clientWidth}px`;
        // element
        carouselTrack.childNodes[index].childNodes[0].style.width = `auto`;
        //transition
        carouselTrack.style.transform = `translateX(${
          -sliderContainer.clientWidth * currentSlideIndex
        }px)`;

        carouselTrack.style.width = `${
          sliderContainer.clientWidth * numberOfElementsInCarousel +
          2 * sliderContainer.clientWidth
        }px`;
      });
    }
    //accurate slide transition when resized
    transitionSize = 0;
    slidesInCarousel.forEach((slide, index) => {
      if (index < currentSlideIndex) {
        transitionSize += sliderContainer.clientWidth;
      }
    });
  }
  function autoPlayButtons() {
    const autoplayButtonContainer = document.createElement("div");
    autoplayButtonContainer.classList.add("vip-autoplayButtonContainer");
    sliderContainer.insertAdjacentElement("beforeend", autoplayButtonContainer);
    autoplayButton.textContent = "Pause";
    autoplayButtonContainer.insertAdjacentElement("afterbegin", autoplayButton);

    if (!enableAutoplay && enableAutoplayButtons) {
      autoplayButton.textContent = "Play";
      // isAutoplayPaused = false;
    }

    autoplayButton.addEventListener("click", autoplayBtnFn);
    function autoplayBtnFn() {
      if (autoplayButton.textContent === "Play") {
        isAutoplayPaused = false;
        autoplayButton.textContent = "Pause";
      } else {
        isAutoplayPaused = true;
        autoplayButton.textContent = "Play";
      }

      if (
        !enableAutoplay &&
        enableAutoplayButtons &&
        autoplayButton.textContent === "Pause"
      ) {
        isAutoplayPaused = false;
        enableAutoplay = true;
        startAutoplay();
      }
    }

    autoplayButtonContainer.addEventListener(
      "mouseenter",
      disableDragOnButtons
    );
    autoplayButtonContainer.addEventListener("mouseleave", enableDrag);
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
    carouselTrack.classList.add("vip-carousel-track");
    slidesInCarousel.forEach((slideContent) => {
      const slideWrapper = document.createElement("div");
      slideWrapper.classList.add("vip-slide-wrapper");
      slideWrapper.style.width = `${sliderContainer.clientWidth}px`;

      slideWrapper.append(slideContent);
      carouselTrack.appendChild(slideWrapper);
    });

    function smoothSlider() {
      const lastDiv = document.createElement("div");
      lastDiv.classList.add("vip-slide-wrapper-lastClone");
      lastDiv.style.width = `${sliderContainer.clientWidth}px`;
      const firstDiv = document.createElement("div");
      firstDiv.classList.add("vip-slide-wrapper-firstClone");
      firstDiv.style.width = `${sliderContainer.clientWidth}px`;

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
    const inputContainer = document.createElement("div");
    inputContainer.classList.add("vip-inputContainer");
    sliderContainer.insertAdjacentElement("beforeend", inputContainer);

    const goInput = document.createElement("input");
    goInput.type = "number";
    goInput.min = "1";
    goInput.max = numberOfElementsInCarousel;
    inputContainer.insertAdjacentElement("afterbegin", goInput);

    goButton.textContent = "GO";
    inputContainer.insertAdjacentElement("beforeend", goButton);

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

    inputContainer.addEventListener("mouseenter", disableDragOnButtons);
    inputContainer.addEventListener("mouseleave", enableDrag);
  }
  function goToSlide(slideToGo) {
    transitionSize = 0;
    slidesInCarousel.forEach((slide, index) => {
      if (index < slideToGo) {
        transitionSize += sliderContainer.clientWidth;
      }
    });

    carouselTrack.style.transform = `translateX(${-transitionSize}px)`;
    if (sliderContainer.dataset.dots === "true") {
      navigationDots.forEach((dot) => {
        if (dot.classList.contains("vip-dot-active")) {
          dot.classList.remove("vip-dot-active");
        }
      });
      navigationDots[slideToGo].classList.add("vip-dot-active");
    }

    currentSlideIndex = slideToGo;

    if (sliderContainer.dataset.infinitetrack === "false") {
      disableButtons();
    }
  }
  function createNavDots() {
    const dotsContainer = document.createElement("div");
    dotsContainer.classList.add("vip-dotsContainer");
    sliderContainer.appendChild(dotsContainer);

    slidesInCarousel.forEach((el, index) => {
      dot = document.createElement("button");
      dot.className = "vip-dot";

      dot.id = index;
      dotsContainer.appendChild(dot);
    });
    dotsContainer.childNodes[numberOfElementsInCarousel + 1].style.display =
      "none";
    dotsContainer.childNodes[0].style.display = "none";

    //active button
    navigationDots = sliderContainer.querySelectorAll(".vip-dot");

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
    dotsContainer.addEventListener("mouseenter", disableDragOnButtons);
    dotsContainer.addEventListener("mouseleave", enableDrag);
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

      if (!isInfinite && currentSlideIndex > numberOfElementsInCarousel) {
        goToSlide(numberOfElementsInCarousel);
        stopAutoplay();
      } else {
        goToSlide(currentSlideIndex);
      }

      // goToSlide(currentSlideIndex);
    } else if (direction === "prev") {
      carouselTrack.style.transition = "transform 0.4s ease-in-out";
      if (currentSlideIndex < 1) {
        return;
      }
      currentSlideIndex--;

      if (!isInfinite && currentSlideIndex < 1) {
        goToSlide(1);
      } else {
        goToSlide(currentSlideIndex);
      }

      // goToSlide(currentSlideIndex);
    }
  }
  function buttons() {
    //create prev and next button dynamically
    //prev
    buttonsContainer.classList.add("vip-buttonsContainer");
    sliderContainer.appendChild(buttonsContainer);

    const prevButton = document.createElement("button");
    prevButton.classList.add("vip-arrow", "left");
    buttonsContainer.appendChild(prevButton);

    //next
    const nextButton = document.createElement("button");
    nextButton.classList.add("vip-arrow", "right");
    buttonsContainer.appendChild(nextButton);

    nextButton.addEventListener("click", () => {
      if (!isAutoplayPaused) {
        resetAutoplay();
      }
      moveSlide("next");
    });
    nextButton.addEventListener("mouseenter", disableDragOnButtons);
    nextButton.addEventListener("mouseleave", enableDrag);
    prevButton.addEventListener("click", () => {
      if (!isAutoplayPaused) {
        resetAutoplay();
      }
      moveSlide("prev");
    });
    prevButton.addEventListener("mouseenter", disableDragOnButtons);
    prevButton.addEventListener("mouseleave", enableDrag);
  }
  function arrowKeysEnter() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        moveSlide("prev");
      } else if (e.key === "ArrowRight") {
        moveSlide("next");
      } else if (e.key === "Enter") {
        goButton.click();
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
      if (e.target.parentNode.classList !== "vip-slide-wrapper") {
        e.preventDefault();
      }
      pressed = true;
      carouselTrack.style.cursor = "grabbing";
      carouselTrack.addEventListener("mousemove", sliderMouseMove);

      if (disableDraggableButtons) {
        carouselTrack.removeEventListener("mousemove", sliderMouseMove);
      }

      currPosition = sliderContainer.getBoundingClientRect().x + e.clientX;
      carouselTrack.addEventListener("mouseleave", sliderMouseLeave);
    }
    function sliderMouseMove(e) {
      pressed = true;
      carouselTrack.style.cursor = "grabbing";
      leftClientBorderToSlider = sliderContainer.getBoundingClientRect().x;

      startPosition = sliderContainer.getBoundingClientRect().x + e.clientX;
      if (startPosition < currPosition) {
        if (currentSlideIndex == numberOfElementsInCarousel && !isInfinite) {
          return;
        }
        carouselTrack.style.transform =
          "translateX(" +
          (-transitionSize -
            leftClientBorderToSlider -
            (sliderContainer.clientWidth - e.clientX)) +
          "px)";
      } else {
        if (currentSlideIndex == 1 && !isInfinite) {
          return;
        }
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
      endlessSlider();
      pressed = false;
      carouselTrack.style.cursor = "grab";
      if (
        (startPosition - currPosition < thresholdDesktop &&
          startPosition - currPosition > 0) ||
        (currPosition - startPosition > 0 &&
          currPosition - startPosition < thresholdDesktop)
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
        if (currentSlideIndex == numberOfElementsInCarousel && !isInfinite) {
          return;
        }
        carouselTrack.style.transform =
          "translateX(" +
          (-transitionSize -
            leftClientBorderToSlider -
            (sliderContainer.clientWidth - e.touches[0].clientX)) +
          "px)";
      } else {
        if (currentSlideIndex == 1 && !isInfinite) {
          return;
        }
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
        (startPosition - currPosition < thresholdMobile &&
          startPosition - currPosition > 0) ||
        (currPosition - startPosition > 0 &&
          currPosition - startPosition < thresholdMobile)
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
    if (sliderContainer.dataset.arrowkeys === "true") {
      arrowKeysEnter();
    }
    if (sliderContainer.dataset.thresholdmobile) {
      if (sliderContainer.dataset.thresholdmobile <= 0) {
        thresholdMobile = 50;
      } else {
        thresholdMobile = sliderContainer.dataset.thresholdmobile;
      }
    }
    if (sliderContainer.dataset.thresholddesktop) {
      if (sliderContainer.dataset.thresholddesktop <= 0) {
        thresholdDesktop = 100;
      } else {
        thresholdDesktop = sliderContainer.dataset.thresholddesktop;
      }
    }
    if (sliderContainer.dataset.draggable === "true") {
      draggable();
    }
    if (sliderContainer.dataset.draggabletouchfunction === "true") {
      draggableTouchFunction();
    }
    if (sliderContainer.dataset.autoplay === "true") {
      enableAutoplay = true;
      startAutoplay();
      if (sliderContainer.dataset.autoplayinterval) {
        autoPlayInterval = parseInt(sliderContainer.dataset.autoplayinterval);
        if (autoPlayInterval < 1000) {
          autoPlayInterval = 5000;
        }
      }
    }
    if (sliderContainer.dataset.autoplaybuttons === "true") {
      enableAutoplayButtons = true;
      autoPlayButtons();
      if (sliderContainer.dataset.autoplayinterval) {
        autoPlayInterval = parseInt(sliderContainer.dataset.autoplayinterval);
        if (autoPlayInterval < 1000) {
          autoPlayInterval = 5000;
        }
      }
    }
    if (sliderContainer.dataset.goto === "true") {
      InputDiv();
    }
    if (sliderContainer.dataset.infinitetrack === "false") {
      disableButtons();
      isInfinite = false;
    }
  }

  window.addEventListener("load", resizeSlider);
  window.addEventListener("resize", resizeSlider);

  wrapEl();
  dataSets();
}
const sliders = document.querySelectorAll(".vip-carousel-container");

sliders.forEach((slide) => {
  slider(slide);
});
