# About/Motivation
Study of GUI systems.
What is the simpliest way to create a GUI system for canvas context2d?
How could I implement a GUI library inspired by Java Swing?

# Vite
Adding VITE to have TypeScript and Bundle.

npm install -D vite
npx vite

# State vs Imperative
Java Swing vs Swift/React

# Feature Timeline

1. Added VList
2. Added HList
3. Added BorderLayout (top, bottom, left, right, center)
4. Added mouse click event
5. Added mouse down, mouse up event
6. Added perfomance feature to ignore render/update if no event is fired
7. Added onMouseMove event + onHoverStart + onHoverEnd
8. Added button & toggle (boxes)
9. Added NavigatorContainer (pages, navigation)
10. Working on WindowLayout & WindowFrame <<<
11. TODO: CanvasBox or CanvasWindow
12. TODO: Add support to "grow", so BorderLayout or WindowContainer could occupy all the available space instead of user manually setting the size.
13. TODO: We should use TypeScript and better modularize the library.
14. TODO: Publish.

# Issues

1
WindowFrame lost the mouseMoveEvent if mouse go outside WindowFrame (fast mouse move).
Idealmente WindowLayout deveria escutar move event e enviar para a janelinha.

2
While moving WindowFrame, caso vai em cima de outra janela, ela pode conquistar ownership do evento.
Idealmente once mouseDown hits a window, we should lock it until end of event (mouseUp).

3
WindowFrame doesn't clip content.
So if we add too much button, they will be rendered outside the window region.

4
WindowFrame and Z-Value.
If user click over a WindowFrame, we should bring the Window to the top.
A easy solution would be sorting the array structure to define the render order.

# Technical Notes/API

///
The whole tree is currently driven bottom-up by measured child size, then arranged top-down.

///
Content-driven system.
You define size of boxes.
Layout define position of boxes.
Layout change its size of fit all boxes.
Parent define position of layout, layout define positino of its child.

## Frame

setCanvas()

## Container

setLayout()
setPages({page1: layout1})
navigate("page1")
addNode()

# Navigator

Has pages.
Each page has is a layout.
Add node to a page, if page is undefined, add to the default.

## Box

setName()/setLabel()
setSize()
setStyle({strokeColor, fillColor})
b1.style.borderColor = "blue";
