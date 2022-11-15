import clsx from "clsx";
import React from "react";
import {ActionManager} from "../../actions/manager";
import {t} from "../../i18n";
import {AppState} from "../../types";
import {SelectedShapeActions, ShapesSwitcher} from "../Actions";
import {Island} from "../Island";
import {Section} from "../Section";
import Stack from "../Stack";

import {ActionIcon, Group, Paper, Text, Button} from "@mantine/core";
import {Minus, Plus} from "tabler-icons-react";
import {ActionName} from "../../actions/types";
import {showSelectedShapeActions} from "../../element";
import {FixedSideContainer} from "../FixedSideContainer";
import {NonDeletedExcalidrawElement} from "../../element/types";
import {BackgroundPickerAndDarkModeToggle} from "../BackgroundPickerAndDarkModeToggle";
import {CLASSES} from "../../constants";
import {useDeviceType} from "../App";
import TopRight from "./TopRight";
import ToolPanel from "./ToolPanel";

interface TopLeftProps {
  actionManager: ActionManager;
  appState: AppState;
  zenModeEnabled: boolean;
  viewModeEnabled: boolean;
  setAppState: React.Component<any, AppState>["setState"];
  showThemeBtn: boolean;
}

const TopLeft = ({
                   actionManager,
                   zenModeEnabled,
                   viewModeEnabled,
                   appState,
                   setAppState,
                   showThemeBtn,
                 }: TopLeftProps) => {
  const performAction = (action: ActionName) => {
    return () => actionManager.executeAction(actionManager.actions[action], "ui");
  }

  // Not sure what this is and if it is needed
  //           {appState.fileHandle && (
  //             <>{actionManager.renderAction("saveToActiveFile")}</>
  //           )}

  return null; // everything is done somewhere else
};

export default TopLeft;
