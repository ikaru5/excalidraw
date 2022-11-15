import React, {SyntheticEvent} from "react";
import {ActionManager} from "../../actions/manager";
import {t} from "../../i18n";
import {AppState} from "../../types";

import {ActionName} from "../../actions/types";
import {PointerType} from "../../element/types";
import {SHAPES} from "../../shapes";
import {capitalizeString, setCursorForShape} from "../../utils";
import {ToolButtonRadio} from "./ToolButtonRadio";
import {trackEvent} from "../../analytics";
import {Popover, ActionIcon, Stack, Divider} from "@mantine/core";
import {ArrowBack, ArrowForward, ArrowRight, CircleSquare, Eraser} from "tabler-icons-react";

interface ShapesSwitcherProps {
  actionManager: ActionManager;
  canvas: HTMLCanvasElement | null;
  activeTool: AppState["activeTool"];
  setAppState: React.Component<any, AppState>["setState"];
  onImageAction: (data: { pointerType: PointerType | null }) => void;
  zenModeEnabled: boolean;
  viewModeEnabled: boolean;
  appState: AppState;
}

const ShapesSwitcher = ({
                          actionManager,
                          canvas,
                          activeTool,
                          setAppState,
                          zenModeEnabled,
                          viewModeEnabled,
                          onImageAction,
                          appState
                        }: ShapesSwitcherProps) => {
  const performAction = (action: ActionName) => {
    return () => actionManager.executeAction(actionManager.actions[action], "ui");
  }

  // this is the imperative way without groups:
  // return <>
  //   {SHAPES.map(({value, icon, key, customIcon = undefined}, index) =>
  //     ShapeSwitcherButton({value, icon, key, index, activeTool, appState, setAppState, canvas, onImageAction, customIcon}))}
  // </>

  // this is the declarative way:
  const mapShapesByValue = () => {
    const output: any = {};
    SHAPES.forEach(({value, icon, key, customIcon = undefined}, index) => {
      output[value] = {value, icon, savedKey: key, index, customIcon}
    })
    return output;
  }
  const [shapes, _] = React.useState(mapShapesByValue());

  return <>
    <ShapeSwitcherButton {...{...shapes["selection"], ...{activeTool, appState, setAppState, canvas, onImageAction}}} />
    <Popover position="bottom" withArrow closeOnClickOutside closeOnEscape shadow="md">
      <Popover.Target>
        <ActionIcon size="xl" color={["rectangle", "diamond", "ellipse", "arrow", "line"].includes(activeTool.type) ? "indigo" : "dark"} variant={["rectangle"].includes(activeTool.type) ? "light" : undefined}><CircleSquare size={30} /></ActionIcon>
      </Popover.Target>
      <Popover.Dropdown p={5}>
        <Stack p={0} spacing={5}>
          <ShapeSwitcherButton {...{...shapes["rectangle"], ...{activeTool, appState, setAppState, canvas, onImageAction}}} />
          <ShapeSwitcherButton {...{...shapes["diamond"], ...{activeTool, appState, setAppState, canvas, onImageAction}}} />
          <ShapeSwitcherButton {...{...shapes["ellipse"], ...{activeTool, appState, setAppState, canvas, onImageAction}}} />
          <ShapeSwitcherButton {...{...shapes["arrow"], ...{activeTool, appState, setAppState, canvas, onImageAction}}} />
          <ShapeSwitcherButton {...{...shapes["line"], ...{activeTool, appState, setAppState, canvas, onImageAction}}} />
        </Stack>
      </Popover.Dropdown>
    </Popover>
    <ShapeSwitcherButton {...{...shapes["text"], ...{activeTool, appState, setAppState, canvas, onImageAction}}} />
    <ShapeSwitcherButton {...{...shapes["image"], ...{activeTool, appState, setAppState, canvas, onImageAction}}} />
    <ShapeSwitcherButton {...{...shapes["freedraw"], ...{activeTool, appState, setAppState, canvas, onImageAction}}} />
    <Divider orientation="vertical" mt={5} mb={5} />
    <ShapeSwitcherButton {...{...shapes["mathdraw"], ...{activeTool, appState, setAppState, canvas, onImageAction}}} />
    <ShapeSwitcherButton {...{...shapes["createFormula"], ...{activeTool, appState, setAppState, canvas, onImageAction}}} />
    <Divider orientation="vertical" mt={5} mb={5} />
    {!zenModeEnabled && <ActionIcon size="xl" color="dark" onClick={performAction("undo")}><ArrowBack size={30} /></ActionIcon> }
    {!zenModeEnabled && <ActionIcon size="xl" color="dark" onClick={performAction("redo")}><ArrowForward size={30} /></ActionIcon> }
    <ShapeSwitcherButton {...{...{value: "eraser", icon: <Eraser size={30} />, savedKey: "e", index: 12, customIcon: undefined}, ...{activeTool, appState, setAppState, canvas, onImageAction}}} />
  </>
};

interface ShapeSwitcherButtonProps {
  value: "selection" | "rectangle" | "diamond" | "ellipse" | "arrow" | "line" | "freedraw" | "mathdraw" | "createFormula" | "text" | "image" | "eraser"; // <-- I hate TS because of this
  icon: JSX.Element;
  savedKey: "a" | "d" | "e" | "o" | "r" | "t" | "v" | readonly ["p", "l"] | readonly ["x", string] | null;
  index: number;
  customIcon: JSX.Element | undefined;
  canvas: HTMLCanvasElement | null;
  activeTool: AppState["activeTool"];
  setAppState: React.Component<any, AppState>["setState"];
  onImageAction: (data: { pointerType: PointerType | null }) => void;
  appState: AppState;
}

const ShapeSwitcherButton = ({value, icon, savedKey, index, activeTool, appState, setAppState, canvas, onImageAction, customIcon = undefined}: ShapeSwitcherButtonProps) => {
  const key = savedKey;
  const label = t(`toolBar.${value}`);
  const letter = key && (typeof key === "string" ? key : key[0]);
  const shortcut = letter
    ? `${capitalizeString(letter)} ${t("helpDialog.or")} ${index + 1}`
    : `${index + 1}`;

  const isChecked = () => {
    switch (value) {
      case "freedraw":
        return activeTool.type === value && activeTool.mode !== "mathdraw";
      case "mathdraw":
        return (
          activeTool.type === "freedraw" && activeTool.mode === "mathdraw"
        );
      default:
        return activeTool.type === value;
    }
  };

  return (
    <ToolButtonRadio
      className="Shape"
      key={value}
      type="radio"
      icon={customIcon || icon}
      checked={isChecked()}
      name="editor-current-shape"
      title={`${capitalizeString(label)} — ${shortcut}`}
      keyBindingLabel={`${index + 1}`}
      aria-label={capitalizeString(label)}
      aria-keyshortcuts={shortcut}
      data-testid={value}
      onPointerDown={({pointerType}) => {
        if (!appState.penDetected && pointerType === "pen") {
          setAppState({
            penDetected: true,
            penMode: true,
          });
        }
      }}
      onChange={({pointerType}) => {
        const newValue = value === "mathdraw" ? "freedraw" : value;
        const mode = value === "mathdraw" ? "mathdraw" : undefined;
        if (appState.activeTool.type !== newValue) {
          trackEvent("toolbar", value, "ui");
        }
        const nextActiveTool = {
          ...activeTool,
          type: newValue,
          mode,
        };
        setAppState({
          activeTool: nextActiveTool,
          multiElement: null,
          selectedElementIds: {},
        });
        setCursorForShape(canvas, {
          ...appState,
          activeTool: nextActiveTool,
        });
        if (newValue === "image") {
          onImageAction({pointerType});
        }
      }}
    />
  );
}

export default ShapesSwitcher;
