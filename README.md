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
| startFromIndex         | Start from specific Index                | 0/allElements-1 | 0              |
| autoplay               | Enables Autopplay | true/false           | true/false      | -              |
| autoplayInterval       | Sets Autoplay's interval in milliseconds | 1001/∞          | 5000           |
| autoplayButtons        | Pause/Resume buttons                     | true/false      | -              |
| sliderWidth            | Sets Slider's width                      | 1/∞             | 500            |
| sliderHeight           | Sets Slider's height                     | 1/∞             | 500            |

If startFromIndex is < 0, default value is used. If startFromIndex > allElements-1, startFromIndex = allElements-1(last element).
If autoplayInterval is < 1, default value is used. 
If Slider's width/height is < 0, default value is used.


Additional information:

On hover when on desktop, or on touch start when on mobile, Slider's autoplay pauses. Remove mouse or end touch to resume.
If you click on the Pause button, the autoplay pauses. Leaving Slider's area or pressing other buttons(next, prev, go to, dots), won't change that. To resume press Resume button.
When clicking on buttons, autoplay is reset, not resumed. That means it will start counting from 0.

You can create as many sliders as you want. To do that simply copy the div with class "carousel-container", again put some elements in it.
