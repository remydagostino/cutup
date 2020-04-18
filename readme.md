A simple app which displays text boxes that can be overlayed and used creatively for generating random text via the cut-up technique.

Workflow:

- A plus button is visible in the bottom right.
- Clicking it creates a text area on the page where text can be pasted
- Clicking out of the text area commits it to the page
  - If empty it deletes itself
  - If it contains text, it becomes committed to the page. A numeric indicator displays for it in the bottom right
- Text boxes can be dragged around
- The area containing the boxes can be panned and zoomed with click and drag, or the mouse wheel
- Holding shift while clicking and dragging creates a selection box where multiple text areas can be selected.
- Clicking a textbox, or its indicator in the bottom left selects it and allows it to be dragged to move
- In order to copy text out of the page it will be necessary to go into a mode where each line is rerendered as a span are arranged in the dom in the order of their Y positions
- It would be great if dragging snapped (horizontally at least)
- What should the default text in textboxes be? Randomly generate from a corpus?
  - How to write a dadaist poem
  - William Burroughs?
  - Some other poems?
  - Genesis
- Need to sanitize html before setting (once I start loading potentially malicious data)

