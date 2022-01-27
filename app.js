function slider(sliderContainer) {
  if (!sliderContainer) {
    return;
  }
  const slider = sliderContainer.querySelector(".carousel-slide");
  const slidesInCarousel = sliderContainer.querySelectorAll(
    ".carousel-slide img"
  );

  let currentSlideIndex = 0,
    transitionSize = 0,
    startPosOfLastElement = 0;
  let slideWidths = [];
  let numberOfElementsInCarousel = slidesInCarousel.length;
  let start, currPosition, navigationDots, dot, moveToSlide;

  //gets startPosOfLastElement + full width of carousel
  slidesInCarousel.forEach((slide, index) => {
    slideWidths.push(slide.clientWidth);
    if (index < numberOfElementsInCarousel - 1) {
      startPosOfLastElement += slide.clientWidth;
    }
  });

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
    slider.style.transform = `translateX(${-transitionSize}px)`;

    navigationDots.forEach((dot) => {
      if (dot.classList.contains("dot-red")) {
        dot.classList.remove("dot-red");
      }
    });
    navigationDots[slideToGo].classList.add("dot-red");
    currentSlideIndex = slideToGo;
    moveToSlide = slideToGo;
    console.log(currentSlideIndex, numberOfElementsInCarousel);
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
  function moveSlide(direction) {
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
        console.log(moveToSlide);
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

    slider.addEventListener("click", sliderClick);
    slider.addEventListener("mousedown", sliderMouseDown);
    slider.addEventListener("mouseenter", sliderMouseEnter);

    function sliderMouseEnter() {
      slider.style.cursor = "grab";
    }

    function sliderMouseDown(e) {
      pressed = true;
      slider.style.cursor = "grabbing";
      start = e.offsetX;
      slider.addEventListener("mousemove", sliderMouseMove);
    }

    function sliderMouseMove(e) {
      pressed = true;
      slider.style.cursor = "grabbing";
      e.preventDefault();
      currPosition = e.offsetX;
      if (start > 250) {
        slider.style.transform =
          "translateX(" +
          (-slideWidths[currentSlideIndex] * currentSlideIndex -
            250 -
            (499 - e.clientX)) +
          "px)";
      } else {
        slider.style.transform =
          "translateX(" +
          (-slideWidths[currentSlideIndex] * currentSlideIndex +
            250 -
            (499 - e.clientX)) +
          "px)";
      }

      // slider.style.transform = "translateX(" + ((-imagesSizesArray[counter]*counter)-e.clientX-252+500) + "px)";
      // slider.style.transform = "translateX(" + (asd-252-500) + "px)";
      console.log(
        -slideWidths[currentSlideIndex] * currentSlideIndex -
          250 -
          (499 - e.clientX)
      );
      console.log("Start ", start, " End ", currPosition);
      //   if (start > currPosition) {
      //     nextBtn.click();
      //   } else if (start < currPosition) {
      //     // slider.style.transform = "translateX(" + (-transitionSize+e.clientX-250) + "px)";
      //     //slider.style.transform = "translateX(" + ((test*asd)-test+e.clientX) + "px)";
      //     //console.log(-transitionSize- e.clientX-250);
      //   }

      slider.addEventListener("mouseleave", sliderMouseLeave);
      slider.addEventListener("mouseup", sliderMouseUp);
    }
    function sliderClick() {
      slider.style.cursor = "grab";
      slider.removeEventListener("mousemove", sliderMouseMove);
    }
    function sliderMouseUp() {
      pressed = false;
      slider.style.cursor = "grab";

      if (start > currPosition) {
        moveSlide("next");
      } else if (start < currPosition) {
        moveSlide("prev");
      }

      slider.removeEventListener("mousemove", sliderMouseMove);
      slider.removeEventListener("mouseleave", sliderMouseLeave);
      slider.removeEventListener("mouseup", sliderMouseUp);
    }
    function sliderMouseLeave(e) {
      pressed = false;
      sliderMouseUp();
    }
  }
  function draggableTouchFunction() {
    slider.addEventListener("touchstart", touchStart);
    slider.addEventListener("touchmove", touchMove);
    slider.addEventListener("touchend", touchEnd);

    function touchStart(e) {
      start = e.touches[0].clientX;
    }

    function touchMove(e) {
      currPosition = e.touches[0].clientX;
      if (start > 470) {
        slider.style.transform =
          "translateX(" +
          (-transitionSize + e.touches[0].screenX - 740) +
          "px)";
      } else if (start < 470) {
        slider.style.transform =
          "translateX(" +
          (-transitionSize + e.touches[0].screenX - 250) +
          "px)";
      }
    }

    function touchEnd() {
      if (start < currPosition) {
        moveSlide("prev");
      } else if (start > currPosition) {
        moveSlide("next");
      }
    }
  }

  // data attribute for initial slide
  function dataSets() {
    if (sliderContainer.dataset.button) {
      buttons();
    }
    if (sliderContainer.dataset.dots) {
      createNavDots(sliderContainer.dataset.startfromindex || 0);
      goToSlide(sliderContainer.dataset.startfromindex || 0);
    }
    if (sliderContainer.dataset.goto) {
      InputDiv();
    }
    if (sliderContainer.dataset.arrowkeys) {
      arrowKeys();
    }
    if (sliderContainer.dataset.draggable) {
      draggable();
    }
    if (sliderContainer.dataset.draggabletouchfunction) {
      draggableTouchFunction();
    }
  }

  dataSets();
  console.log(sliderContainer.attributes);
}

const sliders = document.querySelectorAll(".carousel-container");

sliders.forEach((slide) => {
  slider(slide);
});

//glitch on first and last el when move
