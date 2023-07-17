import { useEffect, useRef, useState } from "react";
import "./styles.css";
import { useDrag } from "./useDrag";

export default function App() {

  const [shapes, setShapes] = useState("0%");
  const positions = [];

  // variable to store the total visible area of the red box
  const [visibleArea, setVisibleArea] = useState(0);

  // an array to store the overlapping area of each draggable element
  const [overlappingArea, setOverlappingArea] = useState([0, 0, 0, 0, 0]);

  for (let i = 0; i < 5; i++) {
    const draggableRef = useRef(null);
    const { position: position, handleMouseDown: handleMouseDown } = useDrag({
      ref: draggableRef,
      id: i,
      callBack: function (e) {
        // set the overlapping area of the draggable element, it cannot exceed 6400
        if (e > 6400) {
          overlappingArea[i] = 6400;
        } else {
          overlappingArea[i] = e;
        }
        // calculate the total overlapping area of all draggable elements
        let totalOverlappingArea = 0;
        for (let j = 0; j < 5; j++) {
          totalOverlappingArea += overlappingArea[j];
        }
        // calculate the total visible area of the red box, but only when the total overlapping area has changed
        setVisibleArea(calculateVisibleArea() - totalOverlappingArea);
      },
    });
    positions.push({ position, handleMouseDown, id: i, ref: draggableRef }); // push the position and handleMouseDown function of each draggable element into the array
  }

  // function to calculate the total visible area of the red box
  const calculateVisibleArea = () => {
    const redBox = document.getElementById('red-box');
    return redBox.offsetWidth * redBox.offsetHeight;
  };

  useEffect(() => {
    setVisibleArea(calculateVisibleArea());
  }, []);

  return (
    <div className="App">
      <button className="button button1" onClick={
        () => {
          if (shapes === "0%") {
            setShapes("50%");
          }
          else if (shapes === "50%") {
            setShapes("0%");
          }
        }
      }>Toggle</button>
      {positions.map((pos) => (
        <div
          key={pos.id}
          className="draggable"
          onMouseDown={pos.handleMouseDown}
          ref={pos.ref}
          id={pos.id}
          style={{
            top: pos.position.y, // set the top position of the draggable element, which gets updated by the useDrag hook
            left: pos.position.x, // set the left position of the draggable element which gets updated by the useDrag hook
            borderRadius: shapes,
          }}
        >
        </div>
      ))}
      <div className="big-container">
        <div
          className="red-box"
          id="red-box"
        />
        <div className="label">
          Total Visible Area: {visibleArea} pixels
        </div>
      </div>

    </div >
  );
}
