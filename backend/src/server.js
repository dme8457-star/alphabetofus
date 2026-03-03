import "dotenv/config";
import { createApp } from "./app.js";

console.log("Booting app...");
const app = createApp();
console.log("App created");

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Listening on ${port}`);
});