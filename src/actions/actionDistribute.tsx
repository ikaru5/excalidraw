import {
  CenterHorizontallyIcon,
  DistributeHorizontallyIcon,
  DistributeVerticallyIcon,
} from "../components/icons";
import { ToolButton } from "../components/ToolButton";
import { distributeElements, Distribution } from "../disitrubte";
import { getNonDeletedElements } from "../element";
import { ExcalidrawElement } from "../element/types";
import { t } from "../i18n";
import { CODES, KEYS } from "../keys";
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

const distributeSelectedElements = (
  elements: readonly ExcalidrawElement[],
  appState: Readonly<AppState>,
  distribution: Distribution,
) => {
  const selectedElements = getSelectedElements(
    getNonDeletedElements(elements),
    appState,
  );

  const updatedElements = distributeElements(selectedElements, distribution);

  const updatedElementsMap = arrayToMap(updatedElements);

  return elements.map(
    (element) => updatedElementsMap.get(element.id) || element,
  );
};

export const distributeHorizontally = register({
  name: "distributeHorizontally",
  trackEvent: { category: "element" },
  perform: (elements, appState) => {
    return {
      appState,
      elements: distributeSelectedElements(elements, appState, {
        space: "between",
        axis: "x",
      }),
      commitToHistory: true,
    };
  },
  keyTest: (event) =>
    !event[KEYS.CTRL_OR_CMD] && event.altKey && event.code === CODES.H,
  PanelComponent: ({ elements, appState, updateData, data }) => {
    if (data?.useCustomUi) {
      if (!isSomeElementSelected(getNonDeletedElements(elements), appState) || !enableActionGroup(elements, appState)) return null;

      return <ActionIcon onClick={() => updateData(null)}
                         size="xl" color="dark" p={10}
                         title={`${t("labels.distributeHorizontally")} — ${getShortcutKey(
                           "Alt+H",
                         )}`}
                         aria-label={t("labels.distributeHorizontally")}
      ><DistributeHorizontallyIcon theme={appState.theme}/></ActionIcon>;
    }

    return <ToolButton
      hidden={!enableActionGroup(elements, appState)}
      type="button"
      icon={<DistributeHorizontallyIcon theme={appState.theme}/>}
      onClick={() => updateData(null)}
      title={`${t("labels.distributeHorizontally")} — ${getShortcutKey(
        "Alt+H",
      )}`}
      aria-label={t("labels.distributeHorizontally")}
      visible={isSomeElementSelected(getNonDeletedElements(elements), appState)}
    />
  },
});

export const distributeVertically = register({
  name: "distributeVertically",
  trackEvent: { category: "element" },
  perform: (elements, appState) => {
    return {
      appState,
      elements: distributeSelectedElements(elements, appState, {
        space: "between",
        axis: "y",
      }),
      commitToHistory: true,
    };
  },
  keyTest: (event) =>
    !event[KEYS.CTRL_OR_CMD] && event.altKey && event.code === CODES.V,
  PanelComponent: ({ elements, appState, updateData, data }) => {
    if (data?.useCustomUi) {
      if (!isSomeElementSelected(getNonDeletedElements(elements), appState) || !enableActionGroup(elements, appState)) return null;

      return <ActionIcon onClick={() => updateData(null)}
                         size="xl" color="dark" p={10}
                         title={`${t("labels.distributeVertically")} — ${getShortcutKey("Alt+V")}`}
                         aria-label={t("labels.distributeVertically")}
      ><DistributeVerticallyIcon theme={appState.theme}/></ActionIcon>;
    }

    return <ToolButton
      hidden={!enableActionGroup(elements, appState)}
      type="button"
      icon={<DistributeVerticallyIcon theme={appState.theme}/>}
      onClick={() => updateData(null)}
      title={`${t("labels.distributeVertically")} — ${getShortcutKey("Alt+V")}`}
      aria-label={t("labels.distributeVertically")}
      visible={isSomeElementSelected(getNonDeletedElements(elements), appState)}
    />
  },
});
