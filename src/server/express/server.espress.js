import dotenv from "dotenv";
dotenv.config();
import path from "path";
import * as url from "url";
// express
import express from "express";

/** ==============================
 * VARIABLE
 */
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const APP = express();
const PORT = process.env.SERVER_PORT || 5000;

/** ==============================
 * MIDDLEWARE
 */
APP.use(express.json());
APP.use(express.urlencoded({ extended: true }));

/** ==============================
 * APIs
 */
APP.get("/", (req, res) => {
  res.json({
    success: true,
  });
});

/** ==============================
 * LISTEN
 */
APP.listen(PORT, () => {
  console.log(`Server is running\nhttp://localhost:${PORT}`);
});
