function slider(sliderContainer) {
  if (!sliderContainer) {
    return;
  }
  // sliderContainer.innerHTML = ``;
  const slidesInCarousel = [...sliderContainer.children];
  const carouselTrack = document.createElement("div");

  let currentSlideIndex = 0,
    transitionSize = 0,
    startPosOfLastElement = 0;
  let slideWidths = [];
  let numberOfElementsInCarousel = slidesInCarousel.length;
  let start, currPosition, navigationDots, dot, moveToSlide, intervalAutoplay;
  let enableAutoplay = false,
    enableAutoplayButtons = false,
    blocked = false;
  let autoPlayInterval = 5000;

  //gets startPosOfLastElement + full width of carousel
  slidesInCarousel.forEach((slide, index) => {
    slideWidths.push(slide.clientWidth);
    if (index < numberOfElementsInCarousel - 1) {
      startPosOfLastElement += slide.clientWidth;
    }
  });

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
    const autoplayButton = document.createElement("button");
    autoplayButton.textContent = "Pause";
    autoplayButton.style.marginBottom = "10px";
    autoplayDiv.insertAdjacentElement("afterbegin", autoplayButton);

    autoplayButton.addEventListener("click", autoplayBtnFn);
    function autoplayBtnFn() {
      if (autoplayButton.textContent === "Resume") {
        blocked = false;
        resetAutoplay();
        autoplayButton.textContent = "Pause";
      } else {
        blocked = true;
        stopAutoplay();
        autoplayButton.textContent = "Resume";
      }
    }
  }
  function startAutoplay() {
    intervalAutoplay = setInterval(moveSlide, autoPlayInterval);
    if (sliderContainer.dataset.autoplay === "true") {
      carouselTrack.addEventListener("mouseenter", stopAutoplay);
      carouselTrack.addEventListener("mouseleave", resetAutoplay);
    }
  }
  function stopAutoplay() {
    clearInterval(intervalAutoplay);
  }
  function resetAutoplay() {
    if (sliderContainer.dataset.autoplay === "true" && !blocked) {
      stopAutoplay();
      startAutoplay();
    }
  }

  function wrapEl() {
    carouselTrack.classList.add("carousel-track");

    slidesInCarousel.forEach((slideContent) => {
      const slideWrapper = document.createElement("div");
      slideWrapper.classList.add("vasko-slide-wrapper");
      // console.log(slideContent);
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
    goInput.max = numberOfElementsInCarousel - 1;
    inputDiv.insertAdjacentElement("afterbegin", goInput);

    const goButton = document.createElement("button");
    goButton.textContent = "GO";
    inputDiv.insertAdjacentElement("beforeend", goButton);

    goButton.addEventListener("click", () => {
      if (
        goInput.value < 0 ||
        goInput.value >= numberOfElementsInCarousel - 1 ||
        goInput.value == ""
      ) {
        return;
      }
      resetAutoplay();
      goToSlide(goInput.value);
    });
  }
  function goToSlide(slideToGo) {
    transitionSize = 0;
    slidesInCarousel.forEach((slide, index) => {
      if (index < slideToGo) {
        transitionSize += slide.clientWidth;
      }
      // console.log(transitionSize);
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
    // console.log(currentSlideIndex, numberOfElementsInCarousel);
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
        resetAutoplay();
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
    resetAutoplay();
    if (direction === "next") {
      if (currentSlideIndex >= numberOfElementsInCarousel - 1) {
        goToSlide(0);
      } else {
        moveToSlide++;
        goToSlide(moveToSlide);
      }
    } else if (direction === "prev") {
      if (currentSlideIndex <= 0) {
        goToSlide(numberOfElementsInCarousel - 1);
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
      moveSlide("next");
    });

    prevButton.addEventListener("click", () => {
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
      start = e.offsetX;
      carouselTrack.addEventListener("mousemove", sliderMouseMove);
    }

    function sliderMouseMove(e) {
      pressed = true;
      carouselTrack.style.cursor = "grabbing";
      e.preventDefault();
      currPosition = e.offsetX;
      if (start > 250) {
        carouselTrack.style.transform =
          "translateX(" +
          (-slideWidths[currentSlideIndex] * currentSlideIndex -
            250 -
            (499 - e.clientX)) +
          "px)";
      } else {
        carouselTrack.style.transform =
          "translateX(" +
          (-slideWidths[currentSlideIndex] * currentSlideIndex +
            250 -
            (499 - e.clientX)) +
          "px)";
      }

      // slider.style.transform = "translateX(" + ((-imagesSizesArray[counter]*counter)-e.clientX-252+500) + "px)";
      // slider.style.transform = "translateX(" + (asd-252-500) + "px)";
      // console.log(
      //   -slideWidths[currentSlideIndex] * currentSlideIndex -
      //     250 -
      //     (499 - e.clientX)
      // );
      // console.log("Start ", start, " End ", currPosition);
      //   if (start > currPosition) {
      //     nextBtn.click();
      //   } else if (start < currPosition) {
      //     // slider.style.transform = "translateX(" + (-transitionSize+e.clientX-250) + "px)";
      //     //slider.style.transform = "translateX(" + ((test*asd)-test+e.clientX) + "px)";
      //     //console.log(-transitionSize- e.clientX-250);
      //   }

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

      if (start > currPosition) {
        moveSlide("next");
      } else if (start < currPosition) {
        moveSlide("prev");
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
      start = e.touches[0].clientX;
      stopAutoplay();
    }

    function touchMove(e) {
      currPosition = e.touches[0].clientX;
      if (start > 470) {
        carouselTrack.style.transform =
          "translateX(" +
          (-transitionSize + e.touches[0].clientX - 740) +
          "px)";
      } else {
        carouselTrack.style.transform =
          "translateX(" +
          (-transitionSize + e.touches[0].clientX - 250) +
          "px)";
      }
    }

    function touchEnd() {
      resetAutoplay();
      if (start < currPosition) {
        moveSlide("prev");
      } else if (start > currPosition) {
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
      }
      if (sliderContainer.dataset.autoplaybuttons === "true") {
        enableAutoplayButtons = true;
      }
    }
  }
  wrapEl();
  dataSets();
  autoplay();
  // console.log(sliderContainer.attributes);
}

const sliders = document.querySelectorAll(".carousel-container");

sliders.forEach((slide) => {
  slider(slide);
});

//glitch on first and last el when move
