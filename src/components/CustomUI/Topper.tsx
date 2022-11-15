import clsx from "clsx";
import React from "react";
import {ActionManager} from "../../actions/manager";
import {t} from "../../i18n";
import {AppState} from "../../types";
import SelectedShapeActions from "./SelectedShapeActions";
import {Section} from "../Section";
import Stack from "../Stack";

import {ActionIcon, Group, Paper, Text, Button} from "@mantine/core";
import {ActionName} from "../../actions/types";
import {showSelectedShapeActions} from "../../element";
import {FixedSideContainer} from "../FixedSideContainer";
import {NonDeletedExcalidrawElement} from "../../element/types";
import {useDeviceType} from "../App";
import TopRight from "./TopRight";
import ToolPanel from "./ToolPanel";
import TopLeft from "./TopLeft";

interface TopperProps {
  actionManager: ActionManager;
  appState: AppState;
  elements: readonly NonDeletedExcalidrawElement[];
  zenModeEnabled: boolean;
  showExitZenModeBtn: boolean;
  toggleZenMode: () => void;
  setJSONExportDialogShown: (state: boolean) => void;
  setImageExportDialogShown: (state: boolean) => void;
  viewModeEnabled: boolean;
  onLockToggle: () => void;
  onPenModeToggle: () => void;
  setAppState: React.Component<any, AppState>["setState"];
  onImageAction: (data: { insertOnCanvasDirectly: boolean }) => void;
  showThemeBtn: boolean;
  canvas: HTMLCanvasElement | null;
}

const Topper = ({
                  actionManager,
                  zenModeEnabled,
                  showExitZenModeBtn,
                  toggleZenMode,
                  viewModeEnabled,
                  setImageExportDialogShown,
                  setJSONExportDialogShown,
                  appState,
                  elements,
                  setAppState,
                  showThemeBtn,
                  onLockToggle,
                  onPenModeToggle,
                  onImageAction,
                  canvas
                }: TopperProps) => {
  const deviceType = useDeviceType();

  const performAction = (action: ActionName) => {
    return () => actionManager.executeAction(actionManager.actions[action], "ui");
  }

  const renderSelectedShapeActions = () => (
    <Section
      heading="selectedShapeActions"
      className={clsx("zen-mode-transition", {
        "transition-left": zenModeEnabled,
      })}
      style={{position: "absolute", height: "99vh", top: "0px"}}
    >
      <div style={{position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)"}}>
        <SelectedShapeActions
          appState={appState}
          elements={elements}
          renderAction={actionManager.renderAction}
          activeTool={appState.activeTool.type}
        />
      </div>
    </Section>
  );

  const shouldRenderSelectedShapeActions = showSelectedShapeActions(
    appState,
    elements,
  );

  return (
    <FixedSideContainer side="top">
      <div className="App-menu App-menu_top">
        <Stack.Col
          gap={4}
          className={clsx({"disable-pointerEvents": zenModeEnabled})}
        >
          <TopLeft {...{
            actionManager,
            zenModeEnabled,
            viewModeEnabled,
            appState,
            setAppState,
            showThemeBtn
          }}/>
          {shouldRenderSelectedShapeActions && renderSelectedShapeActions()}
        </Stack.Col>
        <ToolPanel {...{
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
        }} />
        <TopRight {...{actionManager, appState, zenModeEnabled, showExitZenModeBtn, toggleZenMode, setJSONExportDialogShown, setImageExportDialogShown}}/>
      </div>
    </FixedSideContainer>
  );

};

export default Topper;

//<FixedSideContainer side="top">
//       <div className="App-menu App-menu_top">
//         <Stack.Col
//           gap={4}
//           className={clsx({ "disable-pointerEvents": zenModeEnabled })}
//         >
//           {viewModeEnabled
//             ? renderViewModeCanvasActions()
//             : renderCanvasActions()}
//           {shouldRenderSelectedShapeActions && renderSelectedShapeActions()}
//         </Stack.Col>
//         {!viewModeEnabled && (
//           <Section heading="shapes">
//             {(heading) => (
//               <Stack.Col gap={4} align="start">
//                 <Stack.Row
//                   gap={1}
//                   className={clsx("App-toolbar-container", {
//                     "zen-mode": zenModeEnabled,
//                   })}
//                 >
//                   <PenModeButton
//                     zenModeEnabled={zenModeEnabled}
//                     checked={appState.penMode}
//                     onChange={onPenModeToggle}
//                     title={t("toolBar.penMode")}
//                     penDetected={appState.penDetected}
//                   />
//                   <LockButton
//                     zenModeEnabled={zenModeEnabled}
//                     checked={appState.activeTool.locked}
//                     onChange={() => onLockToggle()}
//                     title={t("toolBar.lock")}
//                   />
//                   <Island
//                     padding={1}
//                     className={clsx("App-toolbar", {
//                       "zen-mode": zenModeEnabled,
//                     })}
//                   >
//                     <HintViewer
//                       appState={appState}
//                       elements={elements}
//                       isMobile={deviceType.isMobile}
//                     />
//                     {heading}
//                     <Stack.Row gap={1}>
//                       <ShapesSwitcher
//                         appState={appState}
//                         canvas={canvas}
//                         activeTool={appState.activeTool}
//                         setAppState={setAppState}
//                         onImageAction={({ pointerType }) => {
//                           onImageAction({
//                             insertOnCanvasDirectly: pointerType !== "mouse",
//                           });
//                         }}
//                       />
//                     </Stack.Row>
//                   </Island>
//                 </Stack.Row>
//               </Stack.Col>
//             )}
//           </Section>
//         )}
//         <div
//           className={clsx(
//             "layer-ui__wrapper__top-right zen-mode-transition",
//             {
//               "transition-right": zenModeEnabled,
//             },
//           )}
//         >
//           <UserList>
//             {appState.collaborators.size > 0 &&
//               Array.from(appState.collaborators)
//                 // Collaborator is either not initialized or is actually the current user.
//                 .filter(([_, client]) => Object.keys(client).length !== 0)
//                 .map(([clientId, client]) => (
//                   <Tooltip
//                     label={client.username || "Unknown user"}
//                     key={clientId}
//                   >
//                     {actionManager.renderAction("goToCollaborator", {
//                       id: clientId,
//                     })}
//                   </Tooltip>
//                 ))}
//           </UserList>
//           {renderTopRightUI?.(deviceType.isMobile, appState)}
//         </div>
//       </div>
//     </FixedSideContainer>
