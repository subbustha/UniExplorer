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
const feedbackRouters = require("./routers/feedback");
// app.use(adminRoutes)
app.use(lafRoutes)
app.use(userRoutes);
app.use(homeRoutes);
app.use(imageRouters);
app.use(feedbackRouters);
////////////////////////////////////Router for UI Rendering//////////////////////////////////
const router = new express.Router();
app.use(router);

//Pages to render when user goes to one of the two tabs
app.get("/heartbeat", (request, response) => {
  response.send("Backend is working properly.");
});
//////////////////////////////////////////////////////////////////////////////////////////////

app.listen(process.env.PORT, () => {
  console.log(`Server is up and running at port: ${process.env.PORT}`);
});
