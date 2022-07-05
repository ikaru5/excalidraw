import React, { useEffect, useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

export const MathKeyboard = ({ onClose, onChange, onKeyPress }) => {
  const [pressed, setPressed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [layoutName, setLayoutName] = useState("default");
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
  }, [position]);

  const onMouseMove = (event) => {
    if (pressed) {
      if (event.buttons === 0) {
        setPressed(false);
      } else {
        setPosition({
          x: position.x + event.movementX,
          y: position.y + event.movementY,
        });
      }
    }
  };

  const onChangeHandler = (input) => {
    console.log("Input changed", input);
    // TODO need to process func buttons
    if (onChange) {
      onChange(input);
    }
  };

  const onKeyPressHandler = (button, event) => {
    event.preventDefault();
    if (event.relatedTarget) {
      event.relatedTarget.focus();
    }
    console.log("Button pressed", button);
    switch (button) {
      case "{f(x)}":
        setLayoutName("func");
        break;
      case "{123}":
        setLayoutName("default");
        break;
      default:
        if (onKeyPress) {
          onKeyPress(button);
        }
    }
  };

  const topBarStyle = {
    backgroundColor: "gray",
    width: "100%",
    height: "3em",
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
    paddingRight: "0.5em",
    paddingBottom: "1em",
    borderStartStartRadius: "0.5em",
    borderStartEndRadius: "0.5em",
    position: "relative",
    zIndex: "0",
    transform: "translate(0, 1em)",
    cursor: "pointer",
  };

  const layout = {
    default: [
      "0 1 2 3 4 5 6 7 8 9",
      "× + - ÷ = . , ( )",
      "𝑥 𝑦 𝜋 𝑒 second-power power abs square-root",
      "{123} {f(x)} {left} {right} {bksp} {enter}",
    ],
    func: [
      "sin cos tan sin⁻¹ cos⁻¹ tan⁻¹",
      "ln log10 log-base e-power ten-power nth-root",
      "% ! $ ° { } ; := 𝑖",
      "{123} {f(x)} {left} {right} {bksp} {enter}",
    ],
  };

  const generateButtonSkinAttribute = (button, value = undefined) => {
    return {
      attribute: "data-button",
      value: value || button,
      buttons: button,
    };
  };

  const buttonAttributes = [
    generateButtonSkinAttribute("{left}", "left"),
    generateButtonSkinAttribute("{right}", "right"),
    generateButtonSkinAttribute("{bksp}", "backspace"),
    generateButtonSkinAttribute("{enter}", "enter"),
    generateButtonSkinAttribute("second-power"),
    generateButtonSkinAttribute("power"),
    generateButtonSkinAttribute("square-root"),
    generateButtonSkinAttribute("abs"),
    generateButtonSkinAttribute("log-base"),
    generateButtonSkinAttribute("e-power"),
    generateButtonSkinAttribute("ten-power"),
    generateButtonSkinAttribute("nth-root"),
  ];

  return (
    <div ref={ref} style={{ position: "fixed", left: "30%", top: "25%" }}>
      <div
        style={topBarStyle}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseMove={onMouseMove}
      >
        {!!onClose && (
          <button
            style={{ width: "1.5em", height: "1.5em" }}
            onClick={onClose}
          ></button>
        )}
      </div>
      <div style={{ zIndex: 1, position: "relative" }}>
        <Keyboard
          layout={layout}
          onChange={onChangeHandler}
          onKeyPress={onKeyPressHandler}
          buttonAttributes={buttonAttributes}
          mergeDisplay={true}
          layoutName={layoutName}
          display={{
            "{f(x)}": "f(x)",
            "{123}": "123",
          }}
        />
      </div>
    </div>
  );
};
