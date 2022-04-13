//Rquired Modules
require("./db/mongoose");
const express = require("express");
const cors = require("cors");

//Declerations
const app = express();
app.use(express.json());
app.use(cors());

////////////////////////////////////Routers for REST APIs/////////////////////////////////////
// const adminRoutes=require('./routers/admin')
const lafRoutes=require('./routers/lafItem')
const userRoutes = require("./routers/user");
const homeRoutes = require("./routers/home");
const imageRouters = require("./routers/image");
// app.use(adminRoutes)
app.use(lafRoutes)
app.use(userRoutes);
app.use(homeRoutes);
app.use(imageRouters);

////////////////////////////////////Router for UI Rendering//////////////////////////////////
const router = new express.Router();
app.use(router);

//Pages to render when user goes to one of the two tabs
app.get("/heartbeat", (request, response) => {
  response.send("Backend is working properly.");
});
//404 Page not found Error
router.get("/api/404", (request, response) => {
  //On browser run localhost:3000/check. The server should be running
  response.send("404 Page not found");
});
//////////////////////////////////////////////////////////////////////////////////////////////

app.listen(process.env.PORT, () => {
  console.log(`Server is up and running at port: ${process.env.PORT}`);
});
