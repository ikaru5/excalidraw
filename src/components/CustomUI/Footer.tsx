import clsx from "clsx";
import React from "react";
import {ActionManager} from "../../actions/manager";
import {t} from "../../i18n";
import {AppState} from "../../types";
import {ZoomActions} from "../Actions";
import {Island} from "../Island";
import {Section} from "../Section";
import Stack from "../Stack";

import colors from "../../colors";
import {ActionIcon, Group, Paper, Text, Button, Divider, Popover, ColorPicker} from "@mantine/core";
import {Check, Minus, Palette, Plus} from "tabler-icons-react";
import {ActionName} from "../../actions/types";
import {useDeviceType} from "../App";
import {Startup} from "mathjax-full/js/components/startup";
import {ExcalidrawElement, NonDeletedExcalidrawElement} from "../../element/types";

interface FooterProps {
  actionManager: ActionManager;
  appState: AppState;
  zenModeEnabled: boolean;
  showExitZenModeBtn: boolean;
  toggleZenMode: () => void;
  renderCustomFooter?: (isMobile: boolean, appState: AppState) => JSX.Element;
  viewModeEnabled: boolean;
  elements: readonly NonDeletedExcalidrawElement[];
}

const Footer = ({toggleZenMode, actionManager, zenModeEnabled, viewModeEnabled, showExitZenModeBtn, renderCustomFooter, appState, elements}: FooterProps) => {
  const deviceType = useDeviceType();
  const performAction = (action: ActionName) => {
    return () => actionManager.executeAction(actionManager.actions[action], "ui");
  }

  const leftMenu = <div
    className={clsx(
      "layer-ui__wrapper__footer-left zen-mode-transition",
      {
        "layer-ui__wrapper__footer-left--transition-left": zenModeEnabled,
      },
    )}
  >

  </div>;

  const centerMenu = <div
    className={clsx(
      "layer-ui__wrapper__footer-center zen-mode-transition",
      {
        "layer-ui__wrapper__footer-left--transition-bottom":
        zenModeEnabled,
      },
    )}
  >
    {!viewModeEnabled &&
      appState.multiElement &&
      deviceType.isTouchScreen && (
        <div
          style={{position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: "10px"}}
          className={clsx("finalize-button zen-mode-transition", {
            "layer-ui__wrapper__footer-left--transition-left":
            zenModeEnabled,
          })}
        >
          <ActionIcon size="xl" onClick={performAction("finalize")} color="green" variant="light"><Check/></ActionIcon>
        </div>
      )}
  </div>;

  // @ts-ignore
  const rightMenu = <div
    className={clsx(
      "layer-ui__wrapper__footer-right zen-mode-transition",
      {
        "transition-right disable-pointerEvents": zenModeEnabled,
      },
    )}
  >
    <Paper shadow="md" p={5} mb={10} withBorder style={{minWidth: "max-content"}}>
      <Group spacing={5}>
        <Popover position="bottom" offset={13} closeOnClickOutside withArrow shadow="xl">
          <Popover.Target>
            <ActionIcon size="md" color="orange"><Palette/></ActionIcon>
          </Popover.Target>
          <Popover.Dropdown p="xs">
            <ColorPicker format="hex"
                         value={appState.viewBackgroundColor}
                         swatches={colors.canvasBackground}
                         onChange={(color) =>
                           actionManager.externalUpdateData(
                             actionManager.actions["changeViewBackgroundColor"],
                             appState,
                             elements as ExcalidrawElement[],
                             {viewBackgroundColor: color}
                           )}
            />
          </Popover.Dropdown>
        </Popover>

        <Divider orientation="vertical" mt={3} mb={3}/>
        <ActionIcon size="md" onClick={performAction("zoomOut")}><Minus/></ActionIcon>
        <Button color="dark" variant="subtle" size="sm" m={0} p={0} onClick={performAction("resetZoom")}>{(appState.zoom.value * 100).toFixed(0)}%</Button>
        <ActionIcon size="md" onClick={performAction("zoomIn")}><Plus/></ActionIcon>
      </Group>
    </Paper>
  </div>;

  return <footer
    role="contentinfo"
    className="layer-ui__wrapper__footer App-menu App-menu_bottom"
  >
    {leftMenu}
    {centerMenu}
    {rightMenu}
  </footer>
};

export default Footer;
