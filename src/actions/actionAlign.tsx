import { alignElements, Alignment } from "../align";
import {
  AlignBottomIcon,
  AlignLeftIcon,
  AlignRightIcon,
  AlignTopIcon,
  CenterHorizontallyIcon,
  CenterVerticallyIcon, SendBackwardIcon,
} from "../components/icons";
import { ToolButton } from "../components/ToolButton";
import { getNonDeletedElements } from "../element";
import { ExcalidrawElement } from "../element/types";
import { t } from "../i18n";
import { KEYS } from "../keys";
import { getSelectedElements, isSomeElementSelected } from "../scene";
import { AppState } from "../types";
import { arrayToMap, getShortcutKey } from "../utils";
import { register } from "./register";
import {ActionIcon} from "@mantine/core";
import React from "react";

const enableActionGroup = (
  elements: readonly ExcalidrawElement[],
  appState: AppState,
) => getSelectedElements(getNonDeletedElements(elements), appState).length > 1;

const alignSelectedElements = (
  elements: readonly ExcalidrawElement[],
  appState: Readonly<AppState>,
  alignment: Alignment,
) => {
  const selectedElements = getSelectedElements(
    getNonDeletedElements(elements),
    appState,
  );

  const updatedElements = alignElements(selectedElements, alignment);

  const updatedElementsMap = arrayToMap(updatedElements);

  return elements.map(
    (element) => updatedElementsMap.get(element.id) || element,
  );
};

export const actionAlignTop = register({
  name: "alignTop",
  trackEvent: { category: "element" },
  perform: (elements, appState) => {
    return {
      appState,
      elements: alignSelectedElements(elements, appState, {
        position: "start",
        axis: "y",
      }),
      commitToHistory: true,
    };
  },
  keyTest: (event) =>
    event[KEYS.CTRL_OR_CMD] && event.shiftKey && event.key === KEYS.ARROW_UP,
  PanelComponent: ({ elements, appState, updateData, data }) => {
    if (data?.useCustomUi) {
      if (!isSomeElementSelected(getNonDeletedElements(elements), appState) || !enableActionGroup(elements, appState)) return null;

      return <ActionIcon onClick={() => updateData(null)}
                         size="xl" color="dark" p={10}
                         title={`${t("labels.alignTop")} — ${getShortcutKey(
                           "CtrlOrCmd+Shift+Up",
                         )}`}
                         aria-label={t("labels.alignTop")}
      ><AlignTopIcon theme={appState.theme}/></ActionIcon>;
    }

    return <ToolButton
      hidden={!enableActionGroup(elements, appState)}
      type="button"
      icon={<AlignTopIcon theme={appState.theme}/>}
      onClick={() => updateData(null)}
      title={`${t("labels.alignTop")} — ${getShortcutKey(
        "CtrlOrCmd+Shift+Up",
      )}`}
      aria-label={t("labels.alignTop")}
      visible={isSomeElementSelected(getNonDeletedElements(elements), appState)}
    />
  },
});

export const actionAlignBottom = register({
  name: "alignBottom",
  trackEvent: { category: "element" },
  perform: (elements, appState) => {
    return {
      appState,
      elements: alignSelectedElements(elements, appState, {
        position: "end",
        axis: "y",
      }),
      commitToHistory: true,
    };
  },
  keyTest: (event) =>
    event[KEYS.CTRL_OR_CMD] && event.shiftKey && event.key === KEYS.ARROW_DOWN,
  PanelComponent: ({ elements, appState, updateData, data }) => {
    if (data?.useCustomUi) {
      if (!isSomeElementSelected(getNonDeletedElements(elements), appState) || !enableActionGroup(elements, appState)) return null;

      return <ActionIcon onClick={() => updateData(null)}
                         size="xl" color="dark" p={10}
                         title={`${t("labels.alignBottom")} — ${getShortcutKey(
                           "CtrlOrCmd+Shift+Down",
                         )}`}
                         aria-label={t("labels.alignBottom")}
      ><AlignBottomIcon theme={appState.theme}/></ActionIcon>;
    }

    return <ToolButton
      hidden={!enableActionGroup(elements, appState)}
      type="button"
      icon={<AlignBottomIcon theme={appState.theme}/>}
      onClick={() => updateData(null)}
      title={`${t("labels.alignBottom")} — ${getShortcutKey(
        "CtrlOrCmd+Shift+Down",
      )}`}
      aria-label={t("labels.alignBottom")}
      visible={isSomeElementSelected(getNonDeletedElements(elements), appState)}
    />
  },
});

export const actionAlignLeft = register({
  name: "alignLeft",
  trackEvent: { category: "element" },
  perform: (elements, appState) => {
    return {
      appState,
      elements: alignSelectedElements(elements, appState, {
        position: "start",
        axis: "x",
      }),
      commitToHistory: true,
    };
  },
  keyTest: (event) =>
    event[KEYS.CTRL_OR_CMD] && event.shiftKey && event.key === KEYS.ARROW_LEFT,
  PanelComponent: ({ elements, appState, updateData, data }) => {
    if (data?.useCustomUi) {
      if (!isSomeElementSelected(getNonDeletedElements(elements), appState) || !enableActionGroup(elements, appState)) return null;

      return <ActionIcon onClick={() => updateData(null)}
                         size="xl" color="dark" p={10}
                         title={`${t("labels.alignLeft")} — ${getShortcutKey(
                           "CtrlOrCmd+Shift+Left",
                         )}`}
                         aria-label={t("labels.alignLeft")}
      ><AlignLeftIcon theme={appState.theme}/></ActionIcon>;
    }

    return <ToolButton
      hidden={!enableActionGroup(elements, appState)}
      type="button"
      icon={<AlignLeftIcon theme={appState.theme}/>}
      onClick={() => updateData(null)}
      title={`${t("labels.alignLeft")} — ${getShortcutKey(
        "CtrlOrCmd+Shift+Left",
      )}`}
      aria-label={t("labels.alignLeft")}
      visible={isSomeElementSelected(getNonDeletedElements(elements), appState)}
    />
  },
});

export const actionAlignRight = register({
  name: "alignRight",
  trackEvent: { category: "element" },

  perform: (elements, appState) => {
    return {
      appState,
      elements: alignSelectedElements(elements, appState, {
        position: "end",
        axis: "x",
      }),
      commitToHistory: true,
    };
  },
  keyTest: (event) =>
    event[KEYS.CTRL_OR_CMD] && event.shiftKey && event.key === KEYS.ARROW_RIGHT,
  PanelComponent: ({ elements, appState, updateData, data }) => {
    if (data?.useCustomUi) {
      if (!isSomeElementSelected(getNonDeletedElements(elements), appState) || !enableActionGroup(elements, appState)) return null;

      return <ActionIcon onClick={() => updateData(null)}
                         size="xl" color="dark" p={10}
                         title={`${t("labels.alignRight")} — ${getShortcutKey(
                           "CtrlOrCmd+Shift+Right",
                         )}`}
                         aria-label={t("labels.alignRight")}
      ><AlignRightIcon theme={appState.theme}/></ActionIcon>;
    }

    return <ToolButton
      hidden={!enableActionGroup(elements, appState)}
      type="button"
      icon={<AlignRightIcon theme={appState.theme}/>}
      onClick={() => updateData(null)}
      title={`${t("labels.alignRight")} — ${getShortcutKey(
        "CtrlOrCmd+Shift+Right",
      )}`}
      aria-label={t("labels.alignRight")}
      visible={isSomeElementSelected(getNonDeletedElements(elements), appState)}
    />
  },
});

export const actionAlignVerticallyCentered = register({
  name: "alignVerticallyCentered",
  trackEvent: { category: "element" },

  perform: (elements, appState) => {
    return {
      appState,
      elements: alignSelectedElements(elements, appState, {
        position: "center",
        axis: "y",
      }),
      commitToHistory: true,
    };
  },
  PanelComponent: ({ elements, appState, updateData, data }) => {
    if (data?.useCustomUi) {
      if (!isSomeElementSelected(getNonDeletedElements(elements), appState) || !enableActionGroup(elements, appState)) return null;

      return <ActionIcon onClick={() => updateData(null)}
                         size="xl" color="dark" p={10}
                         title={t("labels.centerVertically")}
                         aria-label={t("labels.centerVertically")}
      ><CenterVerticallyIcon theme={appState.theme}/></ActionIcon>;
    }

    return <ToolButton
      hidden={!enableActionGroup(elements, appState)}
      type="button"
      icon={<CenterVerticallyIcon theme={appState.theme}/>}
      onClick={() => updateData(null)}
      title={t("labels.centerVertically")}
      aria-label={t("labels.centerVertically")}
      visible={isSomeElementSelected(getNonDeletedElements(elements), appState)}
    />
  },
});

export const actionAlignHorizontallyCentered = register({
  name: "alignHorizontallyCentered",
  trackEvent: { category: "element" },
  perform: (elements, appState) => {
    return {
      appState,
      elements: alignSelectedElements(elements, appState, {
        position: "center",
        axis: "x",
      }),
      commitToHistory: true,
    };
  },
  PanelComponent: ({ elements, appState, updateData, data }) => {
    if (data?.useCustomUi) {
      if (!isSomeElementSelected(getNonDeletedElements(elements), appState) || !enableActionGroup(elements, appState)) return null;

      return <ActionIcon onClick={() => updateData(null)}
                         size="xl" color="dark" p={10}
                         title={t("labels.centerHorizontally")}
                         aria-label={t("labels.centerHorizontally")}
      ><CenterHorizontallyIcon theme={appState.theme}/></ActionIcon>;
    }

    return <ToolButton
      hidden={!enableActionGroup(elements, appState)}
      type="button"
      icon={<CenterHorizontallyIcon theme={appState.theme}/>}
      onClick={() => updateData(null)}
      title={t("labels.centerHorizontally")}
      aria-label={t("labels.centerHorizontally")}
      visible={isSomeElementSelected(getNonDeletedElements(elements), appState)}
    />
  },
});
