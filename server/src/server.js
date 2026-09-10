const express = require("express");
const cors = require("cors");

require("./database/init");

const problemRoutes = require("./routes/api/v1/problem.routes");
const attemptRoutes = require("./routes/api/v1/attempt.routes");

const errorMiddleware = require("./middleware/error.middleware");


const app = express();


app.use(cors());
app.use(express.json());


app.get("/api/health", (req, res) => {
    res.status(200).json({
        message: "OK"
    });
});


app.use("/api/problems", problemRoutes);
app.use("/api/attempts", attemptRoutes);


app.use(errorMiddleware);


const PORT = process.env.PORT || 3000;


if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}


module.exports = app;