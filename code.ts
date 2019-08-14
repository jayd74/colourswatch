// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'darken-color') {
    const nodes: SceneNode[] = [];
    const hexColor = msg.hexColor

    function LightenDarkenColor(color, brightness) {
      var usePound = false;

      if (color[0] == "#") {
        color = color.slice(1);
        usePound = true;
      }

      var num = parseInt(color, 16);
      var r = ((num >> 16) + brightness)/255;

      if (r > 1) r = 1;
      else if (r < 0) r = 0;

      var b = (((num >> 8) & 0x00FF) + brightness)/255;

      if (b > 1) b = 1;
      else if (b < 0) b = 0;

      var g = ((num & 0x0000FF) + brightness)/255;

      if (g > 1) g = 1;
      else if (g < 0) g = 0;

      const rgb = {r, g, b}

      return rgb
    }

    const originalColor = LightenDarkenColor(hexColor, 0)
    const darkenColor = LightenDarkenColor(hexColor, 20)
    const lightenColor = LightenDarkenColor(hexColor, -20)

    console.log({originalColor, darkenColor, lightenColor})
    //Creates the rectangle

      const rectDark = figma.createRectangle();
      const rectLight = figma.createRectangle();
      const rectOriginal = figma.createRectangle();

      rectLight.x = 150
      rectOriginal.x = 350
      rectDark.x = 550

      rectDark.fills = [{ type: 'SOLID', color: { r: darkenColor['r'], g: darkenColor['g'], b: darkenColor['b'] }}];
      rectOriginal.fills = [{ type: 'SOLID', color: { r: originalColor['r'], g: originalColor['g'], b: originalColor['b'] } }];
      rectLight.fills = [{ type: 'SOLID', color: { r: lightenColor['r'], g: lightenColor['g'], b: lightenColor['b'] } }];

      figma.currentPage.appendChild(rectDark);
      figma.currentPage.appendChild(rectOriginal);
      figma.currentPage.appendChild(rectLight);

      nodes.push(rectDark, rectLight, rectDark);
      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);
  }
  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};
