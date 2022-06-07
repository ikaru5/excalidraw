import { KEYS } from "../keys";
import { register } from "./register";
import {
  ExcalidrawElement,
  ExcalidrawImageElement,
  NonDeleted,
} from "../element/types";
import { getNonDeletedElements, newImageElement } from "../element";
import { getSelectedElements, isSomeElementSelected } from "../scene";
import { ToolButton } from "../components/ToolButton";
import { formula } from "../components/icons";
import { t } from "../i18n";
import { getShortcutKey } from "../utils";
import { AppClassProperties, AppState } from "../types";
import { actionDeleteSelected } from "./actionDeleteSelected";
import { exportToCanvas } from "../scene/export";
import { getCommonBoundingBox } from "../element/bounds";
import { canvasToBlob } from "../data/blob";
import App from "../components/App";

export const actionIm2Latex = register({
  name: "im2latex",
  trackEvent: { category: "element" },
  perform: async (elements, appState, data, app: any) => {
    const pngBlob = await createPngFromSelected(elements, appState, data, app);
    const selectedElements = getSelectedElements(elements, appState, true);
    const bounds = getCommonBoundingBox(selectedElements);
    if (null == pngBlob) {
      throw new Error("Could not create png of selected");
    }
    const response = await sendToMathPix(pngBlob);
    if ("object" !== typeof response) {
      throw new Error("Invalid response from server");
    }
    await (app as App).cacheLatexImage(response.latex_styled);
    const newElement = builtNewLatexImageElement(
      bounds,
      appState,
      response.latex_styled,
    );

    // delete selected elements
    const deleteResult = actionDeleteSelected.perform(
      [newElement, ...elements],
      appState,
    );

    return {
      elements: deleteResult ? deleteResult.elements : elements,
      appState: deleteResult
        ? {
            ...deleteResult.appState,
            selectedElementIds: { [newElement.id]: true },
          }
        : appState,
      commitToHistory: true,
    };
  },
  contextItemLabel: "labels.im2latex",
  keyTest: (event) => event[KEYS.CTRL_OR_CMD] && event.key === KEYS.M,
  PanelComponent: ({ elements, appState, updateData }) => (
    <ToolButton
      type="button"
      icon={formula}
      title={`${t("labels.im2latex")} — ${getShortcutKey("CtrlOrCmd+M")}`}
      aria-label={t("labels.im2latex")}
      onClick={() => updateData(null)}
      visible={isSomeElementSelected(getNonDeletedElements(elements), appState)}
    />
  ),
});

const sendToMathPix = async (file: Blob) => {
  const data = new FormData();
  data.append("file", file);

  const response = await fetch("/transform-to-latex", {
    method: "POST",
    body: data,
  });

  return await response.json();
};

const createPngFromSelected = async (
  elements: readonly ExcalidrawElement[],
  appState: AppState,
  _data: any,
  app: AppClassProperties,
) => {
  if (!app.canvas) {
    return null;
  }
  const selectedElements = getSelectedElements(
    getNonDeletedElements(elements),
    appState,
    true,
  );

  const tempCanvas = await exportToCanvas(
    selectedElements,
    appState,
    app.files,
    {
      exportBackground: false,
      viewBackgroundColor: "",
    },
  );

  tempCanvas.style.display = "none";
  document.body.appendChild(tempCanvas);
  const blob = await canvasToBlob(tempCanvas);
  tempCanvas.remove();
  return blob;
};

const builtNewLatexImageElement = (
  bounds: any,
  appState: AppState,
  latex: string,
): NonDeleted<ExcalidrawImageElement> => {
  return newImageElement({
    type: "image",
    x: bounds.minX,
    y: bounds.minY,
    width: bounds.width,
    height: bounds.height,
    strokeColor: appState.currentItemStrokeColor,
    backgroundColor: appState.currentItemBackgroundColor,
    fillStyle: appState.currentItemFillStyle,
    strokeWidth: appState.currentItemStrokeWidth,
    strokeStyle: appState.currentItemStrokeStyle,
    roughness: appState.currentItemRoughness,
    opacity: appState.currentItemOpacity,
    strokeSharpness: appState.currentItemLinearStrokeSharpness,
    locked: false,
    latex,
  });
};
