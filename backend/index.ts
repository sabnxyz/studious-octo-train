import * as dotenv from "dotenv";
dotenv.config({
  path: ".env",
});

import getApp from "./src/server";

const port = process.env.PORT || 8000;

async function startApp() {
  const app = await getApp();

  app.listen(port, () => {
    console.log(
      `API SERVER RUNNING ON PORT: ${port} and worker id at ${process.pid}`
    );
  });
}

startApp();
