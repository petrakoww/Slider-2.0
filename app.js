function slider(sliderContainer) {
  if (!sliderContainer) {
    return;
  }
  const slider = sliderContainer.querySelector(".carousel-slide");
  const elementsInCarousel = sliderContainer.querySelectorAll(
    ".carousel-slide img"
  );

  const prevButton = document.createElement("button");
  const nextButton = document.createElement("button");

  let counter = 0;
  let imagesSizesArray = [];
  let currentImageSize = 0;
  let transitionSize = 0;
  let numberOfImagesInCarousel = elementsInCarousel.length;
  let fullWidth = 0;

  let start, currPosition;

  //get sizes of images in array to use currentImageSize with [counter]
  for (let i = 0; i < numberOfImagesInCarousel; i++) {
    imagesSizesArray.push(elementsInCarousel[i].clientWidth);
  }

  //full width of carousel
  for (let i = 0; i < numberOfImagesInCarousel; i++) {
    fullWidth += imagesSizesArray[i];
  }
  //remove last element size because it gives us full size. we need last pic's beginning not end
  fullWidth = fullWidth - imagesSizesArray[numberOfImagesInCarousel - 1];

  let activeButton;
  function dots(bool) {
    if (bool) {
      //create dots
      const circleDiv = document.createElement("div");
      circleDiv.style.textAlign = "center";
      sliderContainer.insertAdjacentElement("beforeend", circleDiv);

      let dot;
      for (let i = 0; i < numberOfImagesInCarousel; i++) {
        dot = document.createElement("button");
        dot.className = "dot";
        dot.id = i;
        circleDiv.appendChild(dot);
      }

      //active button
      activeButton = sliderContainer.querySelectorAll(".dot");
      activeButton[0].style.backgroundColor = "red";

      circleDiv.addEventListener("click", (e) => {
        transitionSize = 0;

        const { id } = e.target;
        //console.log(e.target);

        if (id) {
          for (let i = 0; i < id; i++) {
            transitionSize += imagesSizesArray[i];
          }
          slider.style.transform = "translateX(" + -transitionSize + "px)";
        }

        counter = id;
        //sets inactive buttons grey and checks if e.target is accurate
        if (e.target.className == "dot") {
          for (let i = 0; i <= numberOfImagesInCarousel - 1; i++) {
            activeButton[i].style.backgroundColor = "#bbb";
          }
        }

        //sets active buttons red
        if (counter) {
          activeButton[counter].style.backgroundColor = "red";
        }
      });
    }
  }
  function buttons(bool) {
    if (bool === true) {
      //create prev and next button dynamically
      //prev
      prevButton.textContent = "Prev";
      sliderContainer.insertAdjacentElement("beforebegin", prevButton);

      //next
      nextButton.textContent = "Next";
      sliderContainer.insertAdjacentElement("afterend", nextButton);

      nextButton.addEventListener("click", () => {
        currentImageSize = imagesSizesArray[counter];
        counter++;

        transitionSize += currentImageSize;
        if (counter >= numberOfImagesInCarousel) {
          counter = 0;
          transitionSize = 0;
        }

        slider.style.transform = "translateX(" + -transitionSize + "px)";

        if (counter) {
          activeButton[counter].style.backgroundColor = "red";
          activeButton[counter - 1].style.backgroundColor = "#bbb";
        } else if (counter == 0) {
          activeButton[0].style.backgroundColor = "red";
          //sets last button to inactive
          activeButton[numberOfImagesInCarousel - 1].style.backgroundColor =
            "#bbb";
        }
      });

      prevButton.addEventListener("click", () => {
        currentImageSize = imagesSizesArray[counter];
        counter--;
        transitionSize -= currentImageSize;

        if (counter < 0) {
          counter = numberOfImagesInCarousel - 1;
          transitionSize = fullWidth;
        }
        slider.style.transform = "translateX(" + -transitionSize + "px)";

        activeButton[counter].style.backgroundColor = "red";
        if (activeButton[counter].id != 0) {
          activeButton[0].style.backgroundColor = "#bbb";
        }
        if (counter < numberOfImagesInCarousel - 1) {
          activeButton[counter + 1].style.backgroundColor = "#bbb";
        }
      });
    }
  }
  function arrowKeys(bool) {
    if (bool) {
      window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
          prevButton.click();
        } else if (e.key === "ArrowRight") {
          nextButton.click();
        }
      });
    }
  }
  function draggable(bool) {
    if (bool) {
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
            (-imagesSizesArray[counter] * counter - 250 - (499 - e.clientX)) +
            "px)";
        } else {
          slider.style.transform =
            "translateX(" +
            (-imagesSizesArray[counter] * counter + 250 - (499 - e.clientX)) +
            "px)";
        }

        // slider.style.transform = "translateX(" + ((-imagesSizesArray[counter]*counter)-e.clientX-252+500) + "px)";
        // slider.style.transform = "translateX(" + (asd-252-500) + "px)";
        console.log(
          -imagesSizesArray[counter] * counter - 250 - (499 - e.clientX)
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
          nextButton.click();
        } else if (start < currPosition) {
          prevButton.click();
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
  }
  function draggableTouchFunction(bool) {
    if (bool) {
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
          prevButton.click();
        } else if (start > currPosition) {
          nextButton.click();
        }
      }
    }
  }
  buttons(true);
  dots(true);
  arrowKeys(true);
  draggable(true);
  draggableTouchFunction(true);
}

const sliders = document.querySelectorAll(".carousel-container");

sliders.forEach((slide) => {
  slider(slide);
});
