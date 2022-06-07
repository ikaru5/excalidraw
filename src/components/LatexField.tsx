import React from "react";
import { ExcalidrawElement } from "../element/types";
import { AppState } from "../types";

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
        />
      </div>
    </div>
  );
};

const LatexInput = React.forwardRef(
  (
    {
      latexValue,
      onChange,
      label,
    }: {
      latexValue: string | null;
      onChange: (color: string) => void;
      label: string;
    },
    ref,
  ) => {
    const [innerValue, setInnerValue] = React.useState(latexValue);
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
      <label className="">
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
    );
  },
);
