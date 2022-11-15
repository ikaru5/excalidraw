import "./ToolIcon.scss";

import React, {SyntheticEvent, useEffect, useRef, useState} from "react";
import clsx from "clsx";
import {useExcalidrawContainer} from "../App";
import {PointerType} from "../../element/types";
import {ActionIcon, Button} from "@mantine/core";

const keybindingStyles = {
  position: "absolute",
  bottom: "2px",
  right: "3px",
  fontSize: "0.5em",
  color: "var(--keybinding-color)",
  fontFamily: "var(--ui-font)",
  userSelect: "none"
} as React.CSSProperties;

export type ToolButtonSize = "small" | "medium";

type ToolButtonRadioProps = {
  icon?: React.ReactNode;
  "aria-label": string;
  "aria-keyshortcuts"?: string;
  "data-testid"?: string;
  label?: string;
  title?: string;
  name?: string;
  id?: string;
  size?: ToolButtonSize;
  keyBindingLabel?: string;
  showAriaLabel?: boolean;
  hidden?: boolean;
  visible?: boolean;
  selected?: boolean;
  className?: string;
  isLoading?: boolean;
  type: "radio";
  checked: boolean;
  onChange?(data: { pointerType: PointerType | null }): void;
  onPointerDown?(data: { pointerType: PointerType }): void;
};

export const ToolButtonRadio = React.forwardRef((props: ToolButtonRadioProps, ref) => {
  const {id: excalId} = useExcalidrawContainer();
  const innerRef = React.useRef(null);
  React.useImperativeHandle(ref, () => innerRef.current);
  const sizeCn = `ToolIcon_size_${props.size}`;

  const isMountedRef = useRef(true);

  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    [],
  );

  const lastPointerTypeRef = useRef<PointerType | null>(null);

  return <ActionIcon aria-label={props["aria-label"]}
                     aria-keyshortcuts={props["aria-keyshortcuts"]}
                     data-testid={props["data-testid"]}
                     id={`${excalId}-${props.id}`}
                     name={props.name}
                     size="xl"
                     color={props.checked ? "indigo" : "dark"}
                     variant={props.checked ? "light" : undefined}
                     onPointerDown={(event : SyntheticEvent) => {
                       // @ts-ignore
                       lastPointerTypeRef.current = event.nativeEvent.pointerType || null;
                       // @ts-ignore
                       props.onPointerDown?.({pointerType: event.nativeEvent.pointerType || null});
                     }}
                     onPointerUp={() => {
                       requestAnimationFrame(() => {
                         lastPointerTypeRef.current = null;
                       });
                     }}
                     onClick={(event : SyntheticEvent) => {
                       // @ts-ignore
                       props.onChange?.({pointerType: event.nativeEvent.pointerType});
                     }}
  >
    {props.icon}
    {props.keyBindingLabel && (
      <span style={keybindingStyles}>{props.keyBindingLabel}</span>
    )}
  </ActionIcon>

  return (
    <label
      className={clsx("ToolIcon", props.className)}
      title={props.title}

    >
      <input
        className={`ToolIcon_type_radio ${sizeCn}`}
        onChange={() => {
          props.onChange?.({pointerType: lastPointerTypeRef.current});
        }}
        checked={props.checked}
        ref={innerRef}
      />
      <div className="ToolIcon__icon">
        {props.icon}
        {props.keyBindingLabel && (
          <span className="ToolIcon__keybinding">{props.keyBindingLabel}</span>
        )}
      </div>
    </label>
  );
});

ToolButtonRadio.defaultProps = {
  visible: true,
  className: "",
  size: "medium",
};
