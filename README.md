# Spacer Tool (Figma Plugin)

A customizable spacer tool for Figma — and a beginner-friendly example of how to build a plugin using TypeScript.

---

## 📚 Getting Started (For Beginners)

Below are the steps to get your plugin running.

You can also refer to the official Figma guide:
https://www.figma.com/plugin-docs/plugin-quickstart-guide/

---

### 1. Install Node.js

Download Node.js (includes NPM):
https://nodejs.org/en/download/

---

### 2. Install dependencies

In your plugin directory, run:

```bash
npm install
```

---

### 3. Install TypeScript (if not already installed)

```bash
npm install -g typescript
```

---

### 4. Install Figma Plugin typings

```bash
npm install --save-dev @figma/plugin-typings
```

---

### 5. Run the build

```bash
npm run build -- --watch
```

This will:

* compile `code.ts` → `code.js`
* automatically update on save

---

### 6. Import plugin into Figma

In Figma Desktop:

Plugins → Development → Import plugin from manifest

Select your `manifest.json`.

---

## 🧠 About TypeScript

If you are familiar with JavaScript, TypeScript will feel very similar.

TypeScript adds type annotations, which helps:

* catch errors early
* improve autocomplete in editors like VS Code
* make Figma API usage clearer

Learn more: https://www.typescriptlang.org/

---

## ✨ Plugin Features

* Create spacer blocks with custom width and height
* Lock aspect ratio
* Edit existing spacers by selecting them and reopening the plugin
* Optional customization:

  * Transparent spacers
  * Fill colors (hex input)
  * Borders (color + width)
* Lock spacers to prevent accidental movement

---

## 🧠 How It Works

Each spacer is:

* a rectangle node
* tagged using `setPluginData()`

This allows the plugin to:

* recognize spacers
* reload their settings into the UI
* update them instead of creating duplicates

---

## 🚀 Usage

### Create a spacer

1. Run the plugin
2. Enter width, height, and styling
3. Click **Create / Resize Spacer**

### Edit a spacer

1. Select an existing spacer
2. Run the plugin again
3. Adjust values
4. Click **Create / Resize Spacer**

---

## ⚠️ Notes

* Spacers are standard Figma nodes — other elements can still overlap them
* Locked spacers may need to be selected via the Layers panel
* Minimum size is enforced to prevent invalid resizing

---

## 🛠 Tech Stack

* TypeScript
* Figma Plugin API
* HTML / CSS (UI)

---

## 📁 Project Structure

```
.
├── code.ts        # Plugin logic
├── code.js        # Compiled output
├── ui.html        # Plugin UI
├── manifest.json  # Plugin configuration
```

---

## 💡 Future Improvements

* Auto-detect Auto Layout direction
* Preset spacing values (8, 16, 24, etc.)
* Better selection UX (relaunch buttons)
* Design system integration

---

## 🧑‍💻 Recommended Editor

We recommend using Visual Studio Code:

1. Download: https://code.visualstudio.com/
2. Open this project folder
3. Run the build task:

```bash
npm run build -- --watch
```

VS Code will automatically recompile TypeScript on save.

---

## 📌 License
MIT License

## 💻 Video Preview

https://github.com/user-attachments/assets/282548fd-6b6a-4825-82cb-04352cc6532f




