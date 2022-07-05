import React, { useEffect, useRef, useState } from "react";

const MathQuillField = ({
  latex,
  onChange,
  config,
  mathquillDidMount,
  mathquillRef,
  ...otherProps
}) => {
  // MathQuill fire 2 edit events on startup.
  const ignoreEditEvents = useRef(2);
  const ref = useRef(null);
  const mathField = mathquillRef || ref;
  const wrapperElement = useRef(null);

  const [myLatex, setMyLatex] = useState(latex);
  const onChangeHandler = (mathField) => {
    const latex = mathField.latex();
    onChange(latex);
  };

  // This is required to prevent state closure over the onChange function
  const onChangeRef = useRef(onChangeHandler);
  useEffect(() => {
    if (myLatex !== latex) {
      setMyLatex(latex);
    }
  }, [latex]);

  useEffect(() => {
    onChangeRef.current = onChangeHandler;
  }, [onChangeHandler]);

  // Setup MathQuill on the wrapperElement
  useEffect(() => {
    if (!wrapperElement.current) {
      return;
    }

    let combinedConfig = {
      restrictMismatchedBrackets: true,
      spaceBehavesLikeTab: true,
      handlers: {},
    };

    if (config) {
      combinedConfig = {
        ...combinedConfig,
        ...config,
      };
    }

    const configEditHandler = combinedConfig.handlers.edit;
    combinedConfig.handlers.edit = (mathField) => {
      if (configEditHandler) {
        configEditHandler();
      }

      if (ignoreEditEvents.current > 0) {
        ignoreEditEvents.current -= 1;
      } else if (onChangeRef.current) {
        onChangeRef.current(mathField);
      }
    };

    mathField.current = window.MQ.MathField(
      wrapperElement.current,
      combinedConfig,
    );
    mathField.current.latex(myLatex || "");

    if (mathquillDidMount) {
      mathquillDidMount(mathField.current);
    }
  }, [wrapperElement]);

  useEffect(() => {
    if (mathField.current && mathField.current.latex() !== myLatex) {
      mathField.current.latex(myLatex);
    }
  }, [myLatex]);

  return <span {...otherProps} ref={wrapperElement} />;
};

export default MathQuillField;
