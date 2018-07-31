/*
 * Start api with command: 'npm run dev'
 */

import app from "./app";

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
    console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);
})