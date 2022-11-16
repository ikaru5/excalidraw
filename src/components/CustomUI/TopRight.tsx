import clsx from "clsx";
import React from "react";
import {ActionManager} from "../../actions/manager";
import {t} from "../../i18n";
import {AppState} from "../../types";

import {Tooltip} from "../Tooltip";
import {Group, Menu, Stack, ActionIcon, Text, Button, Avatar} from "@mantine/core";
import {Settings, MessageCircle, Photo, Search, ArrowsLeftRight, Trash, Menu2, Help, Download, PhotoDown, Upload, MoonStars} from "tabler-icons-react";
import {ActionName} from "../../actions/types";

interface TopRightProps {
  actionManager: ActionManager;
  appState: AppState;
  zenModeEnabled: boolean;
  showExitZenModeBtn: boolean;
  toggleZenMode: () => void;
  setJSONExportDialogShown: (state: boolean) => void;
  setImageExportDialogShown: (state: boolean) => void;
}

const TopRight = ({appState, actionManager, zenModeEnabled, showExitZenModeBtn, toggleZenMode, setImageExportDialogShown, setJSONExportDialogShown}: TopRightProps) => {
  const performAction = (action: ActionName) => {
    return () => actionManager.executeAction(actionManager.actions[action], "ui");
  }

  return <>
    <Button style={{position: "absolute", top: "5px", right: "5px"}}
            className={clsx("disable-zen-mode", {"disable-zen-mode--visible": showExitZenModeBtn})}
            onClick={toggleZenMode}
            variant="light" color="red"
    >{t("buttons.exitZenMode")}</Button>
    <div
      className={clsx(
        "layer-ui__wrapper__top-right zen-mode-transition",
        {
          "transition-right": zenModeEnabled,
        },
      )}
    >
      <Stack>
        <Group spacing="xs">
          <Menu shadow="md" width={300} position="bottom-end" offset={10}>
            <Menu.Target>
              <ActionIcon m={5} color="blue" size="xl" radius="xl" variant="light"><Menu2 size={26}/></ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>{t("labels.menu.export")}</Menu.Label>
              <Menu.Item onClick={() => setJSONExportDialogShown(true)} icon={<Download size={14}/>}>{t("buttons.hamburgerMenu.exportJson")}</Menu.Item>
              <Menu.Item onClick={performAction("loadScene")} icon={<Upload size={14}/>}>{t("buttons.hamburgerMenu.loadFromFile")}</Menu.Item>
              <Menu.Item onClick={() => setImageExportDialogShown(true)} icon={<PhotoDown size={14}/>}>{t("buttons.hamburgerMenu.exportImage")}</Menu.Item>
              <Menu.Divider/>
              <Menu.Label>{t("labels.menu.general")}</Menu.Label>
              <Menu.Item onClick={performAction("toggleShortcuts")} icon={<Help size={14}/>}>{t("buttons.hamburgerMenu.help")}</Menu.Item>
              {/*<Menu.Item onClick={performAction("toggleTheme")} icon={<MoonStars size={14}/>}>{t("buttons.hamburgerMenu.darkModeToggle")}</Menu.Item>*/}
              <Menu.Item onClick={performAction("clearCanvas")} color="red" icon={<Trash size={14}/>}>{t("clearCanvasDialog.title")}</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Stack>
      <Stack spacing={5} style={{position: "absolute", right: 10, top: "50vh", transform: "translateY(-50%)", maxHeight: "80vh", flexWrap: "wrap-reverse"}}>
        {appState.collaborators.size > 0 &&
          Array.from(appState.collaborators)
            // Collaborator is either not initialized or is actually the current user.
            .filter(([_, client]) => Object.keys(client).length !== 0)
            .map(([clientId, client]) => (
              <Tooltip
                label={client.username || "Unknown user"}
                key={clientId}
              >
                {actionManager.renderAction("goToCollaborator", {
                  id: clientId, useCustomUi: true
                })}
              </Tooltip>
            ))}
      </Stack>
      {/*{renderTopRightUI?.(deviceType.isMobile, appState)}*/}
    </div>
  </>;
};

export default TopRight;
