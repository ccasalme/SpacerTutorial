figma.showUI(__html__, { width: 320, height: 240, themeColors: true });

type SpacerMessage = {
  type: "create-or-resize-spacer";
  width: number;
  height: number;
  ratio: number;
  lockRatio: boolean;
};

function isResizableNode(node: SceneNode): node is SceneNode & { resize(width: number, height: number): void } {
  return "resize" in node;
}

figma.ui.onmessage = (msg: SpacerMessage) => {
  if (msg.type !== "create-or-resize-spacer") return;

  const newWidth = msg.width;
  const newHeight = msg.lockRatio && msg.ratio > 0
    ? msg.width / msg.ratio
    : msg.height;

  const selection = figma.currentPage.selection;

  if (selection.length === 1 && isResizableNode(selection[0])) {
    selection[0].resize(newWidth, newHeight);
    figma.notify(`Spacer resized to ${Math.round(newWidth)} × ${Math.round(newHeight)}`);
    return;
  }

  const rect = figma.createRectangle();
  rect.resize(newWidth, newHeight);
  rect.name = "Spacer";
  rect.fills = [];

  figma.currentPage.appendChild(rect);
  figma.currentPage.selection = [rect];
  figma.viewport.scrollAndZoomIntoView([rect]);

  figma.notify(`Spacer created at ${Math.round(newWidth)} × ${Math.round(newHeight)}`);
};