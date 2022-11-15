import clsx from "clsx";
import React from "react";
import {ActionManager} from "../../actions/manager";
import {t} from "../../i18n";
import {AppState} from "../../types";
import {SelectedShapeActions} from "../Actions";
import {Island} from "../Island";
import {Section} from "../Section";
import Stack from "../Stack";
import ShapesSwitcher from "./ShapesSwitcher";

import {ActionIcon, Group, Paper, Text, Button, Stack as MantineStack} from "@mantine/core";
import {Minus, Plus} from "tabler-icons-react";
import {ActionName} from "../../actions/types";
import {showSelectedShapeActions} from "../../element";
import {FixedSideContainer} from "../FixedSideContainer";
import {PenModeButton} from "../PenModeButton";
import {LockButton} from "../LockButton";
import {HintViewer} from "../HintViewer";
import {NonDeletedExcalidrawElement} from "../../element/types";
import {useDeviceType} from "../App";

interface ToolPanelProps {
  actionManager: ActionManager;
  appState: AppState;
  elements: readonly NonDeletedExcalidrawElement[];
  zenModeEnabled: boolean;
  viewModeEnabled: boolean;
  onLockToggle: () => void;
  onPenModeToggle: () => void;
  setAppState: React.Component<any, AppState>["setState"];
  onImageAction: (data: { insertOnCanvasDirectly: boolean }) => void;
  canvas: HTMLCanvasElement | null;
}

const ToolPanel = ({
                     actionManager,
                     zenModeEnabled,
                     viewModeEnabled,
                     appState,
                     elements,
                     setAppState,
                     onLockToggle,
                     onPenModeToggle,
                     onImageAction,
                     canvas
                   }: ToolPanelProps) => {
  const deviceType = useDeviceType();

  if (viewModeEnabled) return null;

  return <Section heading="shapes">
    {(heading) => (
      <Stack.Col gap={4} align="start">
        <Stack.Row
          gap={1}
          className={clsx("App-toolbar-container", {
            "zen-mode": zenModeEnabled,
          })}
        >
          <PenModeButton
            zenModeEnabled={zenModeEnabled}
            checked={appState.penMode}
            onChange={onPenModeToggle}
            title={t("toolBar.penMode")}
            penDetected={appState.penDetected}
          />
          <LockButton
            zenModeEnabled={zenModeEnabled}
            checked={appState.activeTool.locked}
            onChange={() => onLockToggle()}
            title={t("toolBar.lock")}
          />
          <Paper shadow="md" p={5} style={{position: "relative"}} withBorder>
            <HintViewer
              appState={appState}
              elements={elements}
              isMobile={deviceType.isMobile}
            />
            {heading}
            <Group spacing={5} style={{minWidth: "max-content"}}>
              <ShapesSwitcher
                actionManager={actionManager}
                appState={appState}
                canvas={canvas}
                zenModeEnabled={zenModeEnabled}
                viewModeEnabled={viewModeEnabled}
                activeTool={appState.activeTool}
                setAppState={setAppState}
                onImageAction={({pointerType}) => {
                  onImageAction({
                    insertOnCanvasDirectly: pointerType !== "mouse",
                  });
                }}
              />
            </Group>
          </Paper>
        </Stack.Row>
      </Stack.Col>
    )}
  </Section>

};

export default ToolPanel;
