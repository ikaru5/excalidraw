import {register} from "./register";
import {getNonDeletedElements} from "../element";
import {
  getCommonAttributeOfSelectedElements,
  getSelectedElements,
  isSomeElementSelected,
} from "../scene";
import {t} from "../i18n";
import {LatexField} from "../components/LatexField";
import {
  ExcalidrawElement,
  ExcalidrawImageElement,
  NonDeletedExcalidrawElement,
} from "../element/types";
import {AppState} from "../types";
import {mutateElement} from "../element/mutateElement";
import App from "../components/App";
import {Stack, Text} from "@mantine/core";
import {getShortcutKey} from "../utils";
import {GroupIcon} from "../components/icons";

export const actionLatexEdit = register({
  name: "latexEdit",
  trackEvent: {category: "element"},
  perform: async (elements, appState, value, app: any) => {
    const editedElement = getCurrentSelectedElement(
      elements,
      appState,
    ) as ExcalidrawImageElement;
    const newLatexValue = value.latex;
    if (editedElement) {
      const targetHeight = editedElement.height;
      const targetX = editedElement.x;
      const targetY = editedElement.y;
      await (app as App).cacheLatexImage(newLatexValue);
      const createdImage = (app as App).latexImageCache.get(
        newLatexValue,
      )?.image;

      const aspectRatio =
        createdImage && !(createdImage instanceof Promise)
          ? createdImage.height / createdImage.width
          : 1;

      mutateElement(editedElement, {
        latex: newLatexValue,
        height: targetHeight,
        width: targetHeight / aspectRatio,
        x: targetX,
        y: targetY,
      });
    }

    return {
      appState: {
        ...appState,
        ...value,
      },
      commitToHistory: false,
    };
  },
  contextItemLabel: "labels.im2latex",
  PanelComponent: ({elements, appState, updateData, data}) => {
    if (data?.useCustomUi) {
      return <Stack spacing={10}>
        <Text aria-hidden="true" weight={700}>{t("labels.latex")}</Text>
        <LatexField
          label={t("labels.latex")}
          value={getFormValue(elements, appState, (element) => element.latex, "")}
          onChange={(value) => updateData({latex: value})}
          elements={elements}
          appState={appState}
          useCustomUi={true}
        />
      </Stack>
    }

    return <>
      <h3 aria-hidden="true">{t("labels.latex")}</h3>
      <LatexField
        label={t("labels.latex")}
        value={getFormValue(elements, appState, (element) => element.latex, "")}
        onChange={(value) => updateData({latex: value})}
        elements={elements}
        appState={appState}
      />
    </>
  },
});

const getCurrentSelectedElement = (
  elements: readonly ExcalidrawElement[],
  appState: AppState,
): NonDeletedExcalidrawElement | null => {
  const editingElement = appState.editingElement;
  const nonDeletedElements = getNonDeletedElements(elements);
  return editingElement ?? getSelectedElements(nonDeletedElements, appState)[0];
};

const getFormValue = (
  elements: readonly ExcalidrawElement[],
  appState: AppState,
  getAttribute: (element: ExcalidrawElement) => string | null,
  defaultValue: string,
): string => {
  const editingElement = appState.editingElement;
  const nonDeletedElements = getNonDeletedElements(elements);
  return (
    (editingElement && getAttribute(editingElement)) ??
    (isSomeElementSelected(nonDeletedElements, appState)
      ? getCommonAttributeOfSelectedElements(
        nonDeletedElements,
        appState,
        getAttribute,
      )
      : null) ??
    defaultValue
  );
};
