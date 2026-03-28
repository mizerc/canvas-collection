import { Box } from "../core/Box";
import { Size } from "../utils/Size";

/**
 * A toggle holds state when user clicks on it.
 */
class ToggleButton extends Box {
  static defaultBgColor: string = "white";

  declare state: Record<string, unknown> & { toggle: boolean };

  constructor(
    name: string = "toggle",
    size: Size = new Size(50, 50),
    props?: unknown,
  ) {
    super(name, size, {
      style: {
        backgroundColor: ToggleButton.defaultBgColor,
        borderColor: "black",
        borderWidth: 2,
      },
      onMouseClickCallback: (box: Box): void => {
        const toggleBox = box as ToggleButton;

        if (toggleBox.state.toggle) {
          toggleBox.state.toggle = false;
          toggleBox.style.backgroundColor = "white";
        } else {
          toggleBox.style.backgroundColor = "green";
          toggleBox.state.toggle = true;
        }
      },
      onMouseDownCallback: (box: Box): void => {
        box.style.borderWidth = 4;
      },
      onMouseUpCallback: (box: Box): void => {
        box.style.borderWidth = 2;
      },
      onMouseHoverStartCallback: (box: Box): void => {
        box.style.borderColor = "red";
      },
      onMouseHoverEndCallback: (box: Box): void => {
        box.style.borderColor = "black";
      },
      ...(typeof props === "object" && props !== null ? props : {}),
    });

    this.state.toggle = false;
  }
}
