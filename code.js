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
        const nodes = [];
        const hex = msg.hexColor;
        function LightenDarkenColor(hexColor, brightness) {
            var usePound = false;
            if (hexColor[0] == "#") {
                hexColor = hexColor.slice(1);
                usePound = true;
            }
            var num = parseInt(hexColor, 16);
            var r = ((num >> 16) + brightness) / 255;
            var rVal = precise_round(r, 1);
            // if (r > 255) r = 255;
            // else if (r < 0) r = 0;
            var b = ((((num >> 8) & 0x00FF) + brightness) / 255);
            var bVal = precise_round(b, 1);
            // if (b > 255) b = 255;
            // else if (b < 0) b = 0;
            var g = ((num & 0x0000FF) + brightness) / 255;
            var gVal = precise_round(g, 1);
            // if (g > 255) g = 255;
            // else if (g < 0) g = 0;
            const rgb = { r, g, b };
            return rgb;
        }
        function precise_round(num, dec) {
            if ((typeof num !== 'number') || (typeof dec !== 'number'))
                return false;
            var num_sign = num >= 0 ? 1 : -1;
            return (Math.round((num * Math.pow(10, dec)) + (num_sign * 0.0001)) / Math.pow(10, dec)).toFixed(dec);
        }
        const newColor = LightenDarkenColor(hex, 20);
        console.log(newColor);
        //Creates the rectangle
        const rect = figma.createRectangle();
        rect.fills = [{ type: 'SOLID', color: { r: newColor['r'], g: newColor['g'], b: newColor['b'] } }];
        figma.currentPage.appendChild(rect);
        nodes.push(rect);
        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
};
