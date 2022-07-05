import React, { useRef } from "react";
import { ExcalidrawElement } from "../element/types";
import { AppState } from "../types";
import MathQuillField from "./MathQuillField";
import { MathKeyboard } from "./MathKeyboard";

export const LatexField = ({
  value,
  onChange,
  label,
  elements,
  appState,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  elements: readonly ExcalidrawElement[];
  appState: AppState;
}) => {
  return (
    <div>
      <div className="">
        <LatexInput
          latexValue={value}
          label={label}
          onChange={(color) => {
            onChange(color);
          }}
          appState={appState}
        />
      </div>
    </div>
  );
};

interface MathquillField {
  keystroke: any;
  cmd: any;
  focus: any;
}

const LatexInput = React.forwardRef(
  (
    {
      latexValue,
      onChange,
      label,
      appState,
    }: {
      latexValue: string | null;
      onChange: (color: string) => void;
      label: string;
      appState: AppState;
    },
    ref,
  ) => {
    const [innerValue, setInnerValue] = React.useState(latexValue);
    const [inputMethod, setInputMethod] = React.useState("mathquill");
    const [isMathKeyboardOpened, setIsMathKeyboardOpened] =
      React.useState(false);
    const mathquillRef = useRef(null);
    const inputRef = React.useRef(null);

    React.useEffect(() => {
      setInnerValue(latexValue);
    }, [latexValue]);

    React.useImperativeHandle(ref, () => inputRef.current);

    const changeLatex = React.useCallback(
      (inputValue: string) => {
        onChange(inputValue);
        setInnerValue(inputValue);
      },
      [onChange],
    );

    const equation = innerValue || "";
    return (
      <>
        {["mathquill", "latex"].map((method) => (
          <button key={method} onClick={() => setInputMethod(method)}>
            {method}
          </button>
        ))}
        <br />

        {"mathquill" === inputMethod && (
          <>
            <label className="" style={{ width: "100%" }}>
              <MathQuillField
                latex={equation}
                onChange={(latex: string) => {
                  if (equation !== latex) {
                    changeLatex(latex);
                  }
                }}
                config={undefined}
                mathquillDidMount={undefined}
                mathquillRef={mathquillRef}
                style={{
                  width: "100%",
                  fontSize: "150%",
                  backgroundColor: "white",
                }}
              />
            </label>
            <br />
            <button
              onClick={() => setIsMathKeyboardOpened(!isMathKeyboardOpened)}
            >
              Toggle Virtual Keyboard
            </button>
            {isMathKeyboardOpened && (
              <MathKeyboard
                onClose={() => setIsMathKeyboardOpened(false)}
                onKeyPress={(button: string) => {
                  if (mathquillRef.current) {
                    const mathquillField =
                      mathquillRef.current as MathquillField;
                    const specialKeys = {
                      "second-power": "²",
                      power: () => mathquillField.cmd("^"),
                      abs: () => {
                        mathquillField.cmd("|");
                        mathquillField.cmd("|");
                        mathquillField.keystroke("Left");
                      },
                      log10: () => {
                        mathquillField.cmd("log");
                        mathquillField.cmd("_");
                        mathquillField.cmd("10");
                        mathquillField.keystroke("Right");
                      },
                      "e-power": () => {
                        mathquillField.cmd("𝑒");
                        mathquillField.cmd("^");
                      },
                      "ten-power": () => {
                        mathquillField.cmd("10");
                        mathquillField.cmd("^");
                      },
                      "log-base": () => {
                        mathquillField.cmd("log");
                        mathquillField.cmd("_");
                      },
                      "nth-root": () => mathquillField.cmd("\\nthroot"),
                      "square-root": () => mathquillField.cmd("\\sqrt"),
                      "{right}": "Right",
                      "{left}": "Left",
                      "{down}": "Down",
                      "{up}": "Up",
                      "{bksp}": "Backspace",
                      "{tab}": "Tab",
                    };

                    const specialKey =
                      specialKeys[button as keyof typeof specialKeys];
                    if (specialKey) {
                      "function" === typeof specialKey
                        ? specialKey()
                        : mathquillField.keystroke(specialKey);
                    } else {
                      mathquillField.cmd(button);
                    }
                  }
                }}
                onChange={undefined}
              />
            )}
          </>
        )}
        {"latex" === inputMethod && (
          <label className="" style={{ width: "100%" }}>
            <textarea
              rows={5}
              cols={30}
              spellCheck={false}
              className=""
              aria-label={label}
              onChange={(event) => changeLatex(event.target.value)}
              value={equation}
              onBlur={() => setInnerValue(latexValue)}
              ref={inputRef}
            />
          </label>
        )}
      </>
    );
  },
);
