const axios=require("axios");

axios.get("https://drive.google.com/uc?export=view&id=1uv17_XyFPBmBbfc5yWUGPFoIjDdRE1EO")
.then(response => console.log(response.data[0]))
.catch(error=> console.log(error));