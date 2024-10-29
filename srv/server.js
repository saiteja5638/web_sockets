const cds = require("@sap/cds");
const cov2ap = require("@sap/cds-odata-v2-adapter-proxy");
const WebSocket = require('ws');

cds.on("bootstrap", (app) => {
    // Use OData V2 Adapter Proxy for compatibility
    app.use(cov2ap());

    // Delay WebSocket setup until the server is fully initialized
    cds.on('listening', ({ server }) => {
        // Create a WebSocket server
        const wss = new WebSocket.Server({ noServer: true });

        // Upgrade HTTP server to handle WebSocket connections
        server.on('upgrade', (request, socket, head) => {
            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit('connection', ws, request);
            });
        });

        // Store WebSocket server globally for use in other files
        global.wss = wss;

        // Handle WebSocket connections
        wss.on('connection', (ws) => {
            console.log('New WebSocket connection established');

            ws.on('close', () => {
                console.log('WebSocket connection closed');
            });
        });

        console.log('WebSocket server is ready');
    });
});

// Export the CAPM server
module.exports = cds.server;
