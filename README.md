# Slider-2.0
Core rework of first-slider.

Insert your elements in the div with class "carousel-container";

Dataset Instructions:

| Data-                  | Description                              | Input           | Default Values |
| :---:                  | :---:                                    | :---:           | :---:          |
| button                 | Enables Next and Prev buttons            | true/false      | false          |
| dots                   | Enables Navigation Dots                  | true/false      | false          |
| goto                   | Go to specific slide                     | true/false      | false          |
| arrowKeys              | Move Slider with keyboard arrows         | true/false      | false          |
| draggable              | Desktop Draggable functionality          | true/false      | false          |
| draggableTouchFunction | Mobile Draggable functionality           | true/false      | false          |
| startFromIndex         | Start from specific Index                | 0/allElements-1 | 0              |
| autoplay               | Enables Autopplay | true/false           | true/false      | false          |
| autoplayInterval       | Sets Autoplay's interval in milliseconds | 1001/∞          | 5000           |
| autoplayButtons        | Pause/Resume buttons                     | true/false      | false          |


If startFromIndex input is < 0, value is set to 0(first element). If startFromIndex > allElements-1, value is set to allElements-1(last element).\
If autoplayInterval input is < 1, default value is used.

Additional information:

On hover when on desktop, or on touch start when on mobile, Slider's autoplay pauses. Remove mouse or end touch to resume.\
If you click on the Pause button, the autoplay pauses. Leaving Slider's area or pressing other buttons(next, prev, go to, dots), won't change that. To resume press Resume button.\
When clicking on buttons, autoplay is reset, not resumed. That means it will start counting from 0.

You can create as many sliders as you want. To do that simply copy the div with class "carousel-container", again put some elements in it.
