import {AppState} from "../../types"
import {ExcalidrawElement} from "../../element/types"
import {ActionManager} from "../../actions/manager"
import {canChangeSharpness, canHaveArrowheads, getTargetElements, hasBackground, hasStrokeStyle, hasStrokeWidth, hasText} from "../../scene"
import {getNonDeletedElements} from "../../element"
import {hasBoundTextElement, isBoundToContainer} from "../../element/typeChecks"
import {useDeviceType} from "../App"
import {isTransparent} from "../../utils"
import {hasStrokeColor} from "../../scene/comparisons"
import {t} from "../../i18n"
import React from "react"
import {ActionIcon, Divider, Group, Paper, Popover, Stack} from "@mantine/core";
import {BoxAlignRight, BoxMultiple, Brush, CircleDotted, Droplet, Line, Palette, TextSize} from "tabler-icons-react";
import colors from "../../colors";
import BucketDroplet from "./bucket-droplet";

const SelectedShapeActions = ({
                                appState,
                                elements,
                                renderAction,
                                activeTool,
                              }: {
  appState: AppState;
  elements: readonly ExcalidrawElement[];
  renderAction: ActionManager["renderAction"];
  activeTool: AppState["activeTool"]["type"];
}) => {
  const targetElements = getTargetElements(
    getNonDeletedElements(elements),
    appState,
  );

  let isSingleElementBoundContainer = false;
  if (
    targetElements.length === 2 &&
    (hasBoundTextElement(targetElements[0]) ||
      hasBoundTextElement(targetElements[1]))
  ) {
    isSingleElementBoundContainer = true;
  }
  const isEditing = Boolean(appState.editingElement);
  const deviceType = useDeviceType();
  const isRTL = document.documentElement.getAttribute("dir") === "rtl";

  const showFillIcons =
    hasBackground(activeTool) ||
    targetElements.some(
      (element) =>
        hasBackground(element.type) && !isTransparent(element.backgroundColor),
    );
  const showChangeBackgroundIcons =
    hasBackground(activeTool) ||
    targetElements.some((element) => hasBackground(element.type));

  const showLinkIcon =
    targetElements.length === 1 || isSingleElementBoundContainer;

  let commonSelectedType: string | null = targetElements[0]?.type || null;

  for (const element of targetElements) {
    if (element.type !== commonSelectedType) {
      commonSelectedType = null;
      break;
    }
  }

  const isLatexElement =
    targetElements.length === 1 && "string" == typeof targetElements[0].latex;

  const renderStrokeActions = () => {
    const shouldRenderStrokeColor = ((hasStrokeColor(activeTool) &&
        activeTool !== "image" &&
        commonSelectedType !== "image") ||
      targetElements.some((element) => hasStrokeColor(element.type)));

    const shouldRenderStrokeWidth = (hasStrokeWidth(activeTool) ||
      targetElements.some((element) => hasStrokeWidth(element.type)));

    const shouldRenderStrokeShape = (activeTool === "freedraw" ||
      activeTool === "mathdraw" ||
      targetElements.some(
        (element) =>
          element.type === "freedraw" || element.type === "mathdraw",
      ));

    const shouldRenderStrokeStyle = (hasStrokeStyle(activeTool) ||
      targetElements.some((element) => hasStrokeStyle(element.type)));

    const shouldRenderSharpness = (canChangeSharpness(activeTool) ||
      targetElements.some((element) => canChangeSharpness(element.type)));

    if (!shouldRenderStrokeColor && !shouldRenderStrokeWidth && !shouldRenderStrokeStyle && !shouldRenderStrokeShape && !shouldRenderSharpness) return null;

    return <Popover position="right" offset={13} closeOnClickOutside withArrow shadow="xl">
      <Popover.Target>
        <ActionIcon color="dark" title={t("labels.stroke")} size="xl"><Brush/></ActionIcon>
      </Popover.Target>
      <Popover.Dropdown p="xs" style={{minWidth: "200px"}}>
        <Stack spacing={5}>
          {shouldRenderStrokeColor && renderAction("changeStrokeColor", {useCustomUi: true})}
          <Group spacing={3}>
            {shouldRenderStrokeWidth && renderAction("changeStrokeWidth", {useCustomUi: true})}
            {shouldRenderStrokeShape && renderAction("changeStrokeShape", {useCustomUi: true})}
            {shouldRenderStrokeStyle && <>
              {renderAction("changeStrokeStyle", {useCustomUi: true})}
              {renderAction("changeSloppiness", {useCustomUi: true})}
            </>}
            {shouldRenderSharpness && renderAction("changeSharpness", {useCustomUi: true})}
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  }

  const renderBackgroundActions = () => {
    const shouldRenderBackgroundColor = showChangeBackgroundIcons;
    const shouldRenderFillStyle = showFillIcons;

    if (!shouldRenderBackgroundColor && !shouldRenderFillStyle) return null;

    return <Popover position="right" offset={13} closeOnClickOutside withArrow shadow="xl">
      <Popover.Target>
        <ActionIcon title={t("labels.background")} color="dark" size="xl"><BucketDroplet/></ActionIcon>
      </Popover.Target>
      <Popover.Dropdown p="xs" style={{minWidth: "200px"}}>
        <Stack spacing="xs">
          {shouldRenderBackgroundColor && renderAction("changeBackgroundColor", {useCustomUi: true})}
          {shouldRenderFillStyle && renderAction("changeFillStyle", {useCustomUi: true})}
        </Stack>

      </Popover.Dropdown>
    </Popover>
  }

  const renderFontActions = () => {
    const shouldRenderBasics = (hasText(activeTool) ||
      targetElements.some((element) => hasText(element.type)));

    const shouldRenderVerticalAlign = targetElements.some((element) => hasBoundTextElement(element) || isBoundToContainer(element));

    if (!shouldRenderBasics && !shouldRenderVerticalAlign) return null;

    return <Popover position="right" offset={13} closeOnClickOutside withArrow shadow="xl">
      <Popover.Target>
        <ActionIcon title={t("labels.typography")} color="dark" size="xl"><TextSize/></ActionIcon>
      </Popover.Target>
      <Popover.Dropdown p="xs">
        <Stack spacing={5}>
          {shouldRenderBasics && <>
            {renderAction("changeFontSize", {useCustomUi: true})}
            {renderAction("changeFontFamily", {useCustomUi: true})}
            {renderAction("changeTextAlign", {useCustomUi: true})}
          </>}
          {shouldRenderVerticalAlign && renderAction("changeVerticalAlign", {useCustomUi: true})}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  }

  const renderOpacity = () => {
    return <Popover position="right" offset={13} closeOnClickOutside withArrow shadow="xl">
      <Popover.Target>
        <ActionIcon color="dark" size="xl" title={t("labels.opacity")}><CircleDotted/></ActionIcon>
      </Popover.Target>
      <Popover.Dropdown p="xs">
        {renderAction("changeOpacity", {useCustomUi: true})}
      </Popover.Dropdown>
    </Popover>
  }

  const renderLayers = () => {
    if (!(!isEditing && targetElements.length > 0)) return null;

    return <Popover position="right" offset={13} closeOnClickOutside withArrow shadow="xl">
      <Popover.Target>
        <ActionIcon title={t("labels.layers")} size="xl" color="dark"><BoxMultiple/></ActionIcon>
      </Popover.Target>
      <Popover.Dropdown p="xs">
        <Stack spacing={3}>
          {renderAction("sendToBack", {useCustomUi: true})}
          {renderAction("sendBackward", {useCustomUi: true})}
          {renderAction("bringToFront", {useCustomUi: true})}
          {renderAction("bringForward", {useCustomUi: true})}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  }

  const renderAlignmentAndDistribution = () => {
    if (!(targetElements.length > 1 && !isSingleElementBoundContainer)) return null;

    return <Popover position="right" offset={13} closeOnClickOutside withArrow shadow="xl">
      <Popover.Target>
        <ActionIcon title={t("labels.layers")} size="xl" color="dark"><BoxAlignRight/></ActionIcon>
      </Popover.Target>
      <Popover.Dropdown p="xs">
        <Stack spacing="xs">
          <Group spacing={3}>
            {isRTL ? (
              <>
                {renderAction("alignRight", {useCustomUi: true})}
                {renderAction("alignHorizontallyCentered", {useCustomUi: true})}
                {renderAction("alignLeft", {useCustomUi: true})}
              </>
            ) : (
              <>
                {renderAction("alignLeft", {useCustomUi: true})}
                {renderAction("alignHorizontallyCentered", {useCustomUi: true})}
                {renderAction("alignRight", {useCustomUi: true})}
              </>
            )}
            {targetElements.length > 2 && renderAction("distributeHorizontally", {useCustomUi: true})}
          </Group>

          <Group spacing={3}>
            {renderAction("alignTop", {useCustomUi: true})}
            {renderAction("alignVerticallyCentered", {useCustomUi: true})}
            {renderAction("alignBottom", {useCustomUi: true})}
            {targetElements.length > 2 && renderAction("distributeVertically", {useCustomUi: true})}
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  }

  return (
    <Stack>
      <Paper shadow="md" p={5} style={{width: "fit-content"}} withBorder>
        <Stack spacing={3}>
          {renderStrokeActions()}
          {(canHaveArrowheads(activeTool) ||
            targetElements.some((element) => canHaveArrowheads(element.type))) && (
            <>{renderAction("changeArrowhead", {useCustomUi: true})}</>
          )}
          {renderBackgroundActions()}
          {renderFontActions()}
          {renderOpacity()}
          {renderLayers()}
          {renderAlignmentAndDistribution()}
          {!isEditing && targetElements.length > 0 && (
            <>
              <Divider mr={5} ml={5}/>
              {!deviceType.isMobile && renderAction("duplicateSelection", {useCustomUi: true})}
              {renderAction("group", {useCustomUi: true})}
              {renderAction("ungroup", {useCustomUi: true})}
              {showLinkIcon && renderAction("hyperlink", {useCustomUi: true})}
              {!isLatexElement && renderAction("im2latex", {useCustomUi: true})}
              {!deviceType.isMobile && renderAction("deleteSelectedElements", {useCustomUi: true})}
            </>
          )}
        </Stack>
      </Paper>
      {isLatexElement && <Paper shadow="xl" p={10} style={{}} withBorder>
        {renderAction("latexEdit", {useCustomUi: true})}
      </Paper>}
    </Stack>
  );
};

export default SelectedShapeActions;
