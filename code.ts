const ui = `
<!DOCTYPE html>
<html>
  <body>
    <div style="font-family: sans-serif; padding: 16px;">
      <h3>Spacer Settings</h3>
      <label>
        Width
        <input id="width" type="number" value="100" min="1" />
      </label>
      <br /><br />
      <label>
        Height
        <input id="height" type="number" value="24" min="1" />
      </label>
      <br /><br />
      <label>
        Ratio (W / H)
        <input id="ratio" type="number" value="1" min="0.1" step="0.1" />
      </label>
      <br /><br />
      <label>
        <input id="lockRatio" type="checkbox" checked />
        Lock ratio
      </label>
      <br /><br />
      <button id="apply">Create / Resize Spacer</button>

      <script>
        const widthInput = document.getElementById("width");
        const heightInput = document.getElementById("height");
        const ratioInput = document.getElementById("ratio");
        const lockRatioInput = document.getElementById("lockRatio");
        const applyBtn = document.getElementById("apply");

        applyBtn.onclick = () => {
          parent.postMessage(
            {
              pluginMessage: {
                type: "create-or-resize-spacer",
                width: Number(widthInput.value),
                height: Number(heightInput.value),
                ratio: Number(ratioInput.value),
                lockRatio: lockRatioInput.checked
              }
            },
            "*"
          );
        };
      </script>
    </div>
  </body>
</html>
`;

figma.showUI(ui, { width: 320, height: 240 });

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