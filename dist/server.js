"use strict";
/*
 * Start api with command: 'npm run dev'
 */
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const PORT = process.env.PORT || 5002;
app_1.default.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
    console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);
});
//# sourceMappingURL=server.js.map