figma.showUI(__html__, { width: 360, height: 430, themeColors: true });

type SpacerMessage = {
  type: "create-or-resize-spacer";
  width: number;
  height: number;
  ratio: number;
  lockRatio: boolean;
  transparent: boolean;
  fillHex: string;
  borderHex: string;
  borderWidth: number;
  lockSpacer: boolean;
};

function isRectangleNode(node: SceneNode): node is RectangleNode {
  return node.type === "RECTANGLE";
}

function isSpacerNode(node: SceneNode): node is RectangleNode {
  return isRectangleNode(node) && node.getPluginData("isSpacerTool") === "true";
}

function parseHexColor(hex: string): RGB | null {
  const cleaned = hex.trim().replace(/^#/, "");

  if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) {
    return null;
  }

  return {
    r: parseInt(cleaned.slice(0, 2), 16) / 255,
    g: parseInt(cleaned.slice(2, 4), 16) / 255,
    b: parseInt(cleaned.slice(4, 6), 16) / 255,
  };
}

function buildFills(transparent: boolean, fillHex: string): Paint[] {
  if (transparent) return [];

  const rgb = parseHexColor(fillHex);
  if (!rgb) {
    throw new Error("Fill color must be a 6-digit hex code like #EBD9C4");
  }

  return [{ type: "SOLID", color: rgb }];
}

function buildStrokes(borderHex: string, borderWidth: number): Paint[] {
  if (!borderHex.trim() || borderWidth <= 0) return [];

  const rgb = parseHexColor(borderHex);
  if (!rgb) {
    throw new Error("Border color must be a 6-digit hex code like #6F5A45");
  }

  return [{ type: "SOLID", color: rgb }];
}

function applySpacerStyles(node: RectangleNode, msg: SpacerMessage): void {
  node.name = "Spacer Tool";
  node.setPluginData("isSpacerTool", "true");
  node.setPluginData("fillHex", msg.fillHex.trim());
  node.setPluginData("borderHex", msg.borderHex.trim());
  node.setPluginData("borderWidth", String(msg.borderWidth));
  node.setPluginData("transparent", String(msg.transparent));

  node.fills = buildFills(msg.transparent, msg.fillHex);
  node.strokes = buildStrokes(msg.borderHex, msg.borderWidth);
  node.strokeWeight = Math.max(0, msg.borderWidth);
  node.locked = msg.lockSpacer;
}

function sendSelectedSpacerToUI(): void {
  const selection = figma.currentPage.selection;

  if (selection.length === 1 && isSpacerNode(selection[0])) {
    const node = selection[0];

    figma.ui.postMessage({
      type: "load-spacer",
      width: Math.round(node.width),
      height: Math.round(node.height),
      fillHex: node.getPluginData("fillHex") || "#EBD9C4",
      borderHex: node.getPluginData("borderHex") || "#6F5A45",
      borderWidth: Number(node.getPluginData("borderWidth") || "0"),
      transparent: node.getPluginData("transparent") === "true",
      locked: node.locked,
    });
  }
}

figma.ui.onmessage = (msg: SpacerMessage) => {
  if (msg.type !== "create-or-resize-spacer") return;

  try {
    const width = Math.max(0.01, msg.width);
    const height = Math.max(
      0.01,
      msg.lockRatio && msg.ratio > 0 ? msg.width / msg.ratio : msg.height
    );

    const selection = figma.currentPage.selection;

    if (selection.length === 1 && isSpacerNode(selection[0])) {
      const spacer = selection[0];

      spacer.locked = false;
      spacer.resize(width, height);
      applySpacerStyles(spacer, msg);

      figma.notify(`Spacer updated to ${Math.round(width)} × ${Math.round(height)}`);
      return;
    }

    const rect = figma.createRectangle();
    rect.resize(width, height);
    rect.x = figma.viewport.center.x - width / 2;
    rect.y = figma.viewport.center.y - height / 2;

    applySpacerStyles(rect, msg);

    figma.currentPage.appendChild(rect);
    figma.currentPage.selection = [rect];
    figma.viewport.scrollAndZoomIntoView([rect]);

    figma.notify(`Spacer created at ${Math.round(width)} × ${Math.round(height)}`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong.";
    figma.notify(message, { error: true });
  }
};

sendSelectedSpacerToUI();