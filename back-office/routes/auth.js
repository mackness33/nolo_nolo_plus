const path = require("path");
const router = require("express").Router();
const createError = require("http-errors");
const logger = require("../../logger");
const Employee = require("../../services/mongo/schema/employee");
const SessionService = require("../../services/auth");
const baseClass = require("../../services/mongo/base");
var baseService = new baseClass();

router.use(async (req, res, next) => {
  await baseService.initialize(Employee);
  next();
});

// first function is present to makes checks before the "real" routes

/* LOGIN */

// first we check whether a user is already logged in
router.get(
  "/login",
  (req, res, next) => {
    logger.info("in pre-login GET");
    const result = SessionService.already_logged(req, res, next, "/nnplus/home", 1);
    logger.info("RESULT: " + JSON.stringify(result));
    if (result.success){
      next();
    } else {
      res.send(result);
    }
  },
  (req, res, next) => {
    logger.info("in login GET");
    res.sendFile(path.join(__dirname, "../public/templates/login.html"));
  }
);

// first we check whether a user is already logged in
router.post(
  "/login",
  (req, res, next) => {
    logger.info("in pre-login POST");
    const result = SessionService.already_logged(req, res, next, "/nnplus/home", 1);
    if (result.success){
      next();
    } else {
      res.send(result);
    }
  },
  (req, res, next) => {
    logger.info("in login POST");
    logger.info("Form: " + JSON.stringify(req.body));
    // logger.info('User: ' + JSON.stringify(req.session.user));
    // logger.info('Session: ' + JSON.stringify(req.session));

    let data;

    // promise to authenticate the user
    SessionService.authentication(req.body.user, req.body.psw, Employee)
      // if present generate the session for the user
      .then((user) => {
        user = baseService.format(user, "person");
        SessionService.generate(req.session, user);
      })
      // if successfully logged the user in then send it to the nnplus home
      .then(successful_login)
      // if there're problems during the authentication let the client knwo that it failed
      .catch(wrong_credentials)
      // finally send the result of the operations to the client
      .finally(send_result);

    // create the data to send to the client
    function successful_login() {
      let href = "/nnplus/home";
      data = { url: href, success: true };
    }

    // send to the client that the user couldn't log in
    function wrong_credentials(err) {
      logger.error(err);
      data = { url: "", success: false };
    }

    // send the result of the authentication to the client
    function send_result() {
      logger.info("req session: " + JSON.stringify(req.session));
      logger.info("data: " + JSON.stringify(data));

      res.send(data);
    }
  }
);

/* LOGOUT */

// first we check whether a user is already logged in
router.get(
  "/logout",
  (req, res, next) => {
    logger.info("in pre-logout GET");
    const result = SessionService.not_already_logged(req, res, next, "/nnplus/login", 1);
    if (result.success){
      next();
    } else {
      res.send(result);
    }
  },
  (req, res, next) => {
    logger.info("in logout GET");

    // destroy the session and then redirect to the login/unauth home
    SessionService.destroy(req.session, res);

    // res.redirect(302, "/nnplus/login");
    res.send({ success: true, url: "/nnplus/login" });
  }
);

module.exports = router;
