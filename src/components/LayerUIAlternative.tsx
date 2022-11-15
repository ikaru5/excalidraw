import clsx from "clsx";
import React, {useCallback, useState} from "react";
import {ActionManager} from "../actions/manager";
import {exportCanvas} from "../data";
import {isTextElement} from "../element";
import {NonDeletedExcalidrawElement} from "../element/types";
import {Language, t} from "../i18n";
import {calculateScrollCenter, getSelectedElements} from "../scene";
import {ExportType} from "../scene/types";
import {AppProps, AppState, ExcalidrawProps, BinaryFiles} from "../types";
import {muteFSAbortError} from "../utils";
import {ErrorDialog} from "./ErrorDialog";
import {ExportCB, ImageExportDialog} from "./CustomUI/ImageExportDialog";
import {ImageExportDialog as LegacyImageExportDialog} from "./ImageExportDialog";
import {LoadingMessage} from "./LoadingMessage";
import {MobileMenu} from "./MobileMenu";
import {PasteChartDialog} from "./PasteChartDialog";
import {HelpDialog} from "./HelpDialog";
import Library from "../data/library";
import {JSONExportDialog} from "./CustomUI/JSONExportDialog";
import {JSONExportDialog as LegacyJSONExportDialog} from "./JSONExportDialog";
import {isImageFileHandle} from "../data/blob";

import "./LayerUI.scss";
import "./Toolbar.scss";
import {trackEvent} from "../analytics";
import {useDeviceType} from "./App";
import {Button, Portal} from "@mantine/core";
import Footer from "./CustomUI/Footer";
import Topper from "./CustomUI/Topper";

interface LayerUIProps {
  actionManager: ActionManager;
  appState: AppState;
  files: BinaryFiles;
  canvas: HTMLCanvasElement | null;
  setAppState: React.Component<any, AppState>["setState"];
  elements: readonly NonDeletedExcalidrawElement[];
  onCollabButtonClick?: () => void;
  onLockToggle: () => void;
  onPenModeToggle: () => void;
  onInsertElements: (elements: readonly NonDeletedExcalidrawElement[]) => void;
  zenModeEnabled: boolean;
  showExitZenModeBtn: boolean;
  showThemeBtn: boolean;
  toggleZenMode: () => void;
  langCode: Language["code"];
  isCollaborating: boolean;
  renderTopRightUI?: (
    isMobile: boolean,
    appState: AppState,
  ) => JSX.Element | null;
  renderCustomFooter?: (isMobile: boolean, appState: AppState) => JSX.Element;
  viewModeEnabled: boolean;
  libraryReturnUrl: ExcalidrawProps["libraryReturnUrl"];
  UIOptions: AppProps["UIOptions"];
  focusContainer: () => void;
  library: Library;
  id: string;
  onImageAction: (data: { insertOnCanvasDirectly: boolean }) => void;
}

const LayerUI = ({
                   actionManager,
                   appState,
                   files,
                   setAppState,
                   canvas,
                   elements,
                   onCollabButtonClick,
                   onLockToggle,
                   onPenModeToggle,
                   onInsertElements,
                   zenModeEnabled,
                   showExitZenModeBtn,
                   showThemeBtn,
                   toggleZenMode,
                   isCollaborating,
                   renderTopRightUI,
                   renderCustomFooter,
                   viewModeEnabled,
                   libraryReturnUrl,
                   UIOptions,
                   focusContainer,
                   library,
                   id,
                   onImageAction,
                 }: LayerUIProps) => {
  const [isJSONExportDialogShown, setJSONExportDialogShown] = useState(false);
  const [isImageExportDialogShown, setImageExportDialogShown] = useState(false);
  const deviceType = useDeviceType();

  const deselectItems = useCallback(() => {
    setAppState({
      selectedElementIds: {},
      selectedGroupIds: {},
    });
  }, [setAppState]);

  const legacyRenderJSONExportDialog = () => {
    if (!UIOptions.canvasActions.export) {
      return null;
    }

    return (
      <LegacyJSONExportDialog
        elements={elements}
        appState={appState}
        files={files}
        actionManager={actionManager}
        exportOpts={UIOptions.canvasActions.export}
        canvas={canvas}
      />
    );
  };

  const renderJSONExportDialog = () => {
    if (!UIOptions.canvasActions.export) {
      return null;
    }

    return (
      <JSONExportDialog
        elements={elements}
        appState={appState}
        files={files}
        actionManager={actionManager}
        exportOpts={UIOptions.canvasActions.export}
        canvas={canvas}
        setModalIsShown={setJSONExportDialogShown}
      />
    );
  };

  const legacyRenderImageExportDialog = () => {
    if (!UIOptions.canvasActions.saveAsImage) {
      return null;
    }

    const createExporter =
      (type: ExportType): ExportCB =>
        async (exportedElements) => {
          trackEvent("export", type, "ui");
          const fileHandle = await exportCanvas(
            type,
            exportedElements,
            appState,
            files,
            {
              exportBackground: appState.exportBackground,
              name: appState.name,
              viewBackgroundColor: appState.viewBackgroundColor,
            },
          )
            .catch(muteFSAbortError)
            .catch((error) => {
              console.error(error);
              setAppState({errorMessage: error.message});
            });

          if (
            appState.exportEmbedScene &&
            fileHandle &&
            isImageFileHandle(fileHandle)
          ) {
            setAppState({fileHandle});
          }
        };

    return (
      <LegacyImageExportDialog
        elements={elements}
        appState={appState}
        files={files}
        actionManager={actionManager}
        onExportToPng={createExporter("png")}
        onExportToSvg={createExporter("svg")}
        onExportToClipboard={createExporter("clipboard")}
      />
    );
  };

  const renderImageExportDialog = () => {
    if (!UIOptions.canvasActions.saveAsImage) {
      return null;
    }

    const createExporter =
      (type: ExportType): ExportCB =>
        async (exportedElements) => {
          trackEvent("export", type, "ui");
          const fileHandle = await exportCanvas(
            type,
            exportedElements,
            appState,
            files,
            {
              exportBackground: appState.exportBackground,
              name: appState.name,
              viewBackgroundColor: appState.viewBackgroundColor,
            },
          )
            .catch(muteFSAbortError)
            .catch((error) => {
              console.error(error);
              setAppState({errorMessage: error.message});
            });

          if (
            appState.exportEmbedScene &&
            fileHandle &&
            isImageFileHandle(fileHandle)
          ) {
            setAppState({fileHandle});
          }
        };

    return (
      <ImageExportDialog
        elements={elements}
        appState={appState}
        files={files}
        actionManager={actionManager}
        onExportToPng={createExporter("png")}
        onExportToSvg={createExporter("svg")}
        onExportToClipboard={createExporter("clipboard")}
        setModalIsShown={setImageExportDialogShown}
      />
    );
  };

  const dialogs = (
    <>
      {appState.isLoading && <LoadingMessage delay={250}/>}
      {appState.errorMessage && (
        <ErrorDialog
          message={appState.errorMessage}
          onClose={() => setAppState({errorMessage: null})}
        />
      )}
      {appState.showHelpDialog && (
        <HelpDialog
          onClose={() => {
            setAppState({showHelpDialog: false});
          }}
        />
      )}
      {appState.pasteDialog.shown && (
        <PasteChartDialog
          setAppState={setAppState}
          appState={appState}
          onInsertChart={onInsertElements}
          onClose={() =>
            setAppState({
              pasteDialog: {shown: false, data: null},
            })
          }
        />
      )}
      {isJSONExportDialogShown && renderJSONExportDialog()}
      {isImageExportDialogShown && renderImageExportDialog()}
    </>
  );

  const renderScrollBackToContent = () =>
    appState.scrolledOutside &&
    <Button
      variant="outline"
      sx={(theme) => ({
        position: "absolute", left: "50%", bottom: "30px", transform: "translateX(-50%)",
        "&:active": {
          transform: "translateY(1px) translateX(-50%)"
        },
        "&:not(:disabled):active": {
          transform: "translateY(1px) translateX(-50%)"
        }
      })}
      onClick={() => {
        setAppState({
          ...calculateScrollCenter(elements, appState, canvas),
        });
      }}
    >
      {t("buttons.scrollBackToContent")}
    </Button>;


  return deviceType.isMobile ? (
    <>
      {dialogs}
      <MobileMenu
        appState={appState}
        elements={elements}
        actionManager={actionManager}
        renderJSONExportDialog={legacyRenderJSONExportDialog}
        renderImageExportDialog={legacyRenderImageExportDialog}
        setAppState={setAppState}
        onCollabButtonClick={onCollabButtonClick}
        onLockToggle={() => onLockToggle()}
        onPenModeToggle={onPenModeToggle}
        canvas={canvas}
        isCollaborating={isCollaborating}
        renderCustomFooter={renderCustomFooter}
        viewModeEnabled={viewModeEnabled}
        showThemeBtn={showThemeBtn}
        onImageAction={onImageAction}
        renderTopRightUI={renderTopRightUI}
        libraryMenu={null}/>
    </>
  ) : (
    <div
      className={clsx("layer-ui__wrapper", {
        "disable-pointerEvents":
          appState.draggingElement ||
          appState.resizingElement ||
          (appState.editingElement && !isTextElement(appState.editingElement)),
      })}
    >
      {dialogs}
      <Topper {...{
        actionManager,
        zenModeEnabled,
        viewModeEnabled,
        showExitZenModeBtn,
        toggleZenMode,
        setJSONExportDialogShown,
        setImageExportDialogShown,
        appState,
        elements,
        setAppState,
        showThemeBtn,
        onLockToggle,
        onPenModeToggle,
        onImageAction,
        canvas
      }} />
      <Footer {...{actionManager, appState, zenModeEnabled, showExitZenModeBtn, toggleZenMode, viewModeEnabled, elements}} />
      {renderScrollBackToContent()}
    </div>
  );
};

const areEqual = (prev: LayerUIProps, next: LayerUIProps) => {
  const getNecessaryObj = (appState: AppState): Partial<AppState> => {
    const {
      suggestedBindings,
      startBoundElement: boundElement,
      ...ret
    } = appState;
    return ret;
  };
  const prevAppState = getNecessaryObj(prev.appState);
  const nextAppState = getNecessaryObj(next.appState);

  const keys = Object.keys(prevAppState) as (keyof Partial<AppState>)[];
  return (
    prev.renderCustomFooter === next.renderCustomFooter &&
    prev.langCode === next.langCode &&
    prev.elements === next.elements &&
    prev.files === next.files &&
    keys.every((key) => prevAppState[key] === nextAppState[key])
  );
};

export default React.memo(LayerUI, areEqual);
