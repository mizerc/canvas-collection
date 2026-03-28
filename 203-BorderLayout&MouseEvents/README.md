Study of layout systems.

# Timeline
1) Added VList
2) Added HList
3) Added BorderLayout (top, bottom, left, right, center)
4) Added mouse click event
5) Added perfomance feature to ignore render/update if no event is fired
6) TODO: Mouse move event

# Technical Notes
Content-driven system.
You define size of boxes.
Layout define position of boxes.
Layout change its size of fit all boxes.
Parent define position of layout, layout define positino of its child.

## Frame
setCanvas()

## Container
setLayout()

## Box
setName()/setLabel()
setSize()
setStyle({strokeColor, fillColor})
b1.style.borderColor = "blue";