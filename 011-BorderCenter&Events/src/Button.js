class Button extends Box {
  constructor({ ...props }) {
    super({
      ...props,
      onMouseOverChange: (bto, isOver) => {
        if (isOver) {
          bto.setStyle({ backgroundColor: "#5ae6ffff" });
        } else {
          bto.setStyle({ backgroundColor: "#4e3dcdff" });
        }
      },
    });
  }
}
