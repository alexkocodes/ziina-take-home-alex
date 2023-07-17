import { useCallback, useEffect, useState } from "react";

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
  let overlappingArea = 0;

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
      // check if the current position of the draggable element overlaps with the red box
      if (current_coords.left < redBoxCoords.right && current_coords.right > redBoxCoords.left && current_coords.top < redBoxCoords.bottom && current_coords.bottom > redBoxCoords.top) {
        // calculate the overlapping area
        overlappingArea = Math.max(0, Math.min(current_coords.right, redBoxCoords.right) - Math.max(current_coords.left, redBoxCoords.left)) * Math.max(0, Math.min(current_coords.bottom, redBoxCoords.bottom) - Math.max(current_coords.top, redBoxCoords.top));
        // if the current element overlaps with another draggable element, reduce the overlapping area by the area of the other draggable element, and break the loop when there is overlapping to prevent double counting
        const blue_boxes = document.getElementsByClassName("draggable");
        for (let i = 0; i < blue_boxes.length; i++) {
          if (blue_boxes[i].id !== draggableElement.id) {
            const blueBoxCoords = blue_boxes[i].getBoundingClientRect();
            if (current_coords.left < blueBoxCoords.right && current_coords.right > blueBoxCoords.left && current_coords.top < blueBoxCoords.bottom && current_coords.bottom > blueBoxCoords.top) {
              overlappingArea -= Math.max(0, Math.min(current_coords.right, blueBoxCoords.right) - Math.max(current_coords.left, blueBoxCoords.left)) * Math.max(0, Math.min(current_coords.bottom, blueBoxCoords.bottom) - Math.max(current_coords.top, blueBoxCoords.top));
              break;
            }
          }
        }
      } else {
        // if it is not, set the overlapping area to 0
        overlappingArea = 0;
      }
      callBack(overlappingArea); // call the callback function to update the overlapping area of the draggable element
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
