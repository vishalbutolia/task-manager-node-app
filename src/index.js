const express = require('express');
const userRouter = require('./routers/User');
const taskRouter = require('./routers/Task');
const authMiddleware = require('./middleware/auth');
const app = express();
const port = process.env.PORT || 3000;


// app.use((req, res, next) => {
//   res.status(503).send("Site is under maintainence. Check back soon");
// });

app.use(express.json());

app.use("/users", userRouter);
app.use("/tasks", taskRouter);

app.listen(port, () => {
  console.log(`Server is up at port ${port}`);
});