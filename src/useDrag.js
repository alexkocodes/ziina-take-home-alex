import { useCallback, useEffect, useState } from "react";
// an array of 5 boxes that will be updated to store the coordinates of the overlapping area of each draggable element with the red box
const boxes_inside_red = {
  0: { x1: 0, y1: 0, x2: 0, y2: 0 },
  1: { x1: 0, y1: 0, x2: 0, y2: 0 },
  2: { x1: 0, y1: 0, x2: 0, y2: 0 },
  3: { x1: 0, y1: 0, x2: 0, y2: 0 },
  4: { x1: 0, y1: 0, x2: 0, y2: 0 }
};
let overlappingArea = 0;
export const useDrag = ({ ref, id, callBack }) => {
  const Xs = [400, 483, 313, 245, 480]; // initial x coordinates of the draggable elements
  const Ys = [476, 350, 276, 435, 211]; // initial y coordinates of the draggable elements
  const initialX = Xs[id];
  const initialY = Ys[id];
  const [dragInfo, setDragInfo] = useState();
  const [finalPosition, setFinalPosition] = useState({
    x: initialX,
    y: initialY,
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseUp = (evt) => {
    evt.preventDefault();

    setIsDragging(false); // indicates that the user has stopped dragging the element
  };

  const handleMouseDown = (evt) => {
    evt.preventDefault();

    const { clientX, clientY } = evt;
    const { current: draggableElement } = ref; // get the current element that is being dragged

    if (!draggableElement) {
      return;
    }

    const {
      top,
      left,
      width,
      height
    } = draggableElement.getBoundingClientRect();

    setIsDragging(true); // indicates that the user has started dragging the element
    setDragInfo({
      startX: clientX,
      startY: clientY,
      top,
      left,
      width,
      height
    });

  };
  const handleMouseMove = useCallback(
    (evt) => {
      const { current: draggableElement } = ref; // get the current element that is being dragged

      if (!isDragging || !draggableElement) return; // if the user is not dragging the element, do nothing

      evt.preventDefault();

      const { clientX, clientY } = evt; // get the current position of the mouse

      const position = {
        x: dragInfo.startX - clientX,
        y: dragInfo.startY - clientY
      }; // calculate the distance between the current position of the mouse and the initial position of the mouse

      const { top, left, width, height } = dragInfo;

      const current_coords = draggableElement.getBoundingClientRect();
      //console.log(draggableElement.getBoundingClientRect())
      const redBoxCoords = document.getElementById('red-box').getBoundingClientRect();
      let rectArr = [];
      // check if the current position of the draggable element overlaps with the red box
      if (current_coords.left < redBoxCoords.right && current_coords.right > redBoxCoords.left && current_coords.top < redBoxCoords.bottom && current_coords.bottom > redBoxCoords.top) {
        // find the overlapping coordinates between the red box and the draggable element
        // update the coordinates of corresponding box in the boxes array
        boxes_inside_red[draggableElement.id] = { x1: Math.max(current_coords.left, redBoxCoords.left), y1: Math.max(current_coords.top, redBoxCoords.top), x2: Math.min(current_coords.right, redBoxCoords.right), y2: Math.min(current_coords.bottom, redBoxCoords.bottom) };

        // get the coordinates of all corresponding boxes in the boxes array
        rectArr = Object.values(boxes_inside_red).map((box) => {
          return [box.x1, box.y1, box.x2, box.y2];
        });
      } else {
        // reset the coordinates of corresponding box in the boxes array
        boxes_inside_red[draggableElement.id] = { x1: 0, y1: 0, x2: 0, y2: 0 };
        rectArr = Object.values(boxes_inside_red).map((box) => {
          return [box.x1, box.y1, box.x2, box.y2];
        });
      }
      const area = ([a, b, c, d]) => (c - a) * (d - b); // function to calculate the area of a rectangle

      const clip = (bb, rects) => { // function to find the overlapping area between the red box and the draggable element
        if (!rects.length) {
          return [];
        }

        const [x1, y1, x2, y2] = rects[0];
        const rs = rects.slice(1);
        const [a1, b1, a2, b2] = bb;

        if (a1 === a2 || b1 === b2) {
          return [];
        }

        if (a1 >= x2 || a2 <= x1 || y1 >= b2 || y2 <= b1) {
          return clip(bb, rs);
        }

        return [
          [Math.max(a1, x1), Math.max(b1, y1), Math.min(a2, x2), Math.min(b2, y2)],
          ...clip(bb, rs)
        ];
      };

      const calc = (cr, rects) => { // function to calculate the total overlapping area between the red box and all the draggable elements
        if (!rects.length) {
          return 0;
        }

        const rc = rects[0];
        const rs = rects.slice(1);
        const [x1, y1, x2, y2] = cr;
        const [l1, m1, l2, m2] = rc;
        const t = [x1, m2, x2, y2];
        const b = [x1, y1, x2, m1];
        const l = [x1, m1, l1, m2];
        const r = [l2, m1, x2, m2];

        return area(rc) + [t, b, l, r].reduce(
          (sum, x) => sum + calc(x, clip(x, rs)),
          0
        );
      };

      const redBoxRect = [redBoxCoords.left, redBoxCoords.top, redBoxCoords.right, redBoxCoords.bottom];
      overlappingArea = calc(redBoxRect, rectArr); // calculate the total overlapping area between the red box and the draggable element
      callBack(overlappingArea); // call the callBack function to update the total overlapping area of all draggable elements with the red box
      setFinalPosition({ x: left - position.x, y: top - position.y }); // update the final position of the draggable element
    },
    [isDragging, dragInfo, ref]
  );

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove]);

  return {
    position: finalPosition,
    handleMouseDown,
  };
};
