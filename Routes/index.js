module.exports = (app) => {
  app.get("/", (req, res) => {
    res
      .status(STATUS_CODES.SUCCESS)
      .send("Welcome to " + process.env.PROJECT_NAME);
  });

  app.use("/user", require("./Users.route"));
  app.use("/auth", require("./Auth.route"));
  app.use("/chat", require("./Chat.route"));

};
