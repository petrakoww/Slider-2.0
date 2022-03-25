# Slider-2.0
Core rework of first-slider.

Insert your elements in the div with class "carousel-container";

Dataset Instructions:

| Data-                  | Description                              | Input           | Default Values |
| :---:                  | :---:                                    | :---:           | :---:          |
| button                 | Enables Next and Prev buttons            | true/false      | -              |
| dots                   | Enables Navigation Dots                  | true/false      | -              |
| goto                   | Go to specific slide                     | true/false      | -              |
| arrowKeys              | Move Slider with keyboard arrows         | true/false      | -              |
| draggable              | Desktop Draggable functionality          | true/false      | -              |
| draggableTouchFunction | Mobile Draggable functionality           | true/false      | -              |
| startFromIndex         | Start from specific Index                | 1/allElements   | 1              |
| autoplay               | Enables Autopplay | true/false           | true/false      | -              |
| autoplayInterval       | Sets Autoplay's interval in milliseconds | 1000/∞          | 5000           |
| autoplayButtons        | Pause/Resume buttons                     | true/false      | -              |
| infiniteTrack          | Endless carousel                         | true/false      | -              |
| thresholdMobile        | Threshold value in pixels                | 1/∞             | 50             |
| thresholdDesktop       | Threshold value in pixels                | 1/∞             | 100            |


If startFromIndex input is < 1, value is set to 1(first element). If startFromIndex > numberOfAllElements, value is set to numberOfAllElements(last element).\
If autoplayInterval input is < 1000, default value is used.

Additional information:

On hover when on desktop, or on touch start when on mobile, Slider's autoplay pauses. Remove mouse or end touch to resume.\
If you click on the Pause button, the autoplay pauses. Leaving Slider's area or pressing other buttons(next, prev, go to, dots), won't change that. To resume press Resume button.\
If autoplayButtons is true, but autoplay is false, if you click on the Resume button, autoPlay will start with default value unless autoplayInterval value is valid.\
When clicking on buttons, autoplay is reset, not resumed. That means it will start counting from 0.\
If the distance when mouseDown/touchStart is less than the thresholdMobile/thresholdDesktop value, the function which moves the slides, won't execute.

You can create as many sliders as you want. To do that simply copy the div with class "carousel-container", again put some elements in it.
