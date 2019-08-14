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
        const hexColor = msg.hexColor;
        function LightenDarkenColor(color, brightness) {
            var usePound = false;
            if (color[0] == "#") {
                color = color.slice(1);
                usePound = true;
            }
            var num = parseInt(color, 16);
            var r = (num >> 16) + brightness;
            if (r > 255)
                r = 255;
            else if (r < 0)
                r = 0;
            var b = ((num >> 8) & 0x00FF) + brightness;
            if (b > 255)
                b = 255;
            else if (b < 0)
                b = 0;
            var g = (num & 0x0000FF) + brightness;
            if (g > 255)
                g = 255;
            else if (g < 0)
                g = 0;
            return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
        }
        function convertHex(hexColor, opacity) {
            hexColor = hexColor.replace('#', '');
            const r = parseInt(hexColor.substring(0, 2), 16) / 255;
            const g = parseInt(hexColor.substring(2, 4), 16) / 255;
            const b = parseInt(hexColor.substring(4, 6), 16) / 255;
            const result = { r, g, b };
            return result;
        }
        function precise_round(num, dec) {
            if ((typeof num !== 'number') || (typeof dec !== 'number'))
                return false;
            var num_sign = num >= 0 ? 1 : -1;
            return (Math.round((num * Math.pow(10, dec)) + (num_sign * 0.0001)) / Math.pow(10, dec)).toFixed(dec);
        }
        const originalRGBAColor = convertHex(hexColor, 1);
        const darkenColor = LightenDarkenColor(hexColor, 20);
        const darkenRGBAColor = convertHex(darkenColor, 1);
        const lightenColor = LightenDarkenColor(hexColor, -20);
        const lightenRGBAColor = convertHex(lightenColor, 1);
        //Creates the rectangle
        const rectDark = figma.createRectangle();
        const rectLight = figma.createRectangle();
        const rectOriginal = figma.createRectangle();
        rectLight.x = 150;
        rectOriginal.x = 350;
        rectDark.x = 550;
        rectDark.fills = [{ type: 'SOLID', color: { r: darkenRGBAColor['r'], g: darkenRGBAColor['g'], b: darkenRGBAColor['b'] } }];
        rectOriginal.fills = [{ type: 'SOLID', color: { r: originalRGBAColor['r'], g: originalRGBAColor['g'], b: originalRGBAColor['b'] } }];
        rectLight.fills = [{ type: 'SOLID', color: { r: lightenRGBAColor['r'], g: lightenRGBAColor['g'], b: lightenRGBAColor['b'] } }];
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
