require("dotenv").config({ path: __dirname + "../bin/.env" });
const session = require("express-session");
const mongo_service = require("../services/mongo/utils");
const logger = require("../logger.js");

// class made to manage the authentication of users
class auth_service {
  // get the session based on the options and store in input
  // if not specified there are default values
  get_session(options, store) {
    let session_options = {
      secret: process.env.SS_SECRET,
      cookie: { maxAge: 1000 * 60 * 15 },
      store: mongo_service.get_store(), // get the store from the Mongo Service
      rolling: true,
      saveUninitialized: false,
      resave: false,
    };

    // logger.info('options: ' + JSON.stringify(options));
    // logger.info('store: ' + JSON.stringify(store));
    if (options !== null && options !== undefined) session_options = options;

    if (store !== null && store !== undefined) session_options.store = store;

    return session(session_options);
  }

  // authentication of the user based on the role and credentials
  async authentication(username, password, promised_model) {
    // check the db to see if the user is present
    let role_model = await promised_model;
    let user = await role_model.findOne({
      "person.mail": username,
      "person.password": password,
    });

    logger.info("query in Service: " + JSON.stringify(user));
    logger.info("username: " + JSON.stringify(username));
    logger.info("password: " + JSON.stringify(password));

    // if user is null or undefined than throw an error
    if (!!!user) throw new Error("User not found");

    return user;
  }

  /* CHECKS */

  // returns a boolean. If session.mail !== undefined -> true | otherwise -> false
  check_if_user_logged_in(session) {
    logger.info("session: " + JSON.stringify(session));
    return !!session && !!session.mail;
  }

  // function to check if the user has the right authorization to enter the url
  authorization(req, res, next, home_url, index_url, role) {
    this.is_logged(
      req.session,
      () => {
        // check the user role to be correct
        if (req.session.role <= role) {
          logger.info("User authorizized");
          next();
          return;
        } else {
          logger.warn("User not authorize");
          res.redirect(home_url);
        }
      },
      () => {
        logger.warn("User not logged");
        res.redirect(index_url);
      }
    );
  }

  // base function where as paramenters has the session that we're current in
  // successful as a function to do if the user is logged in
  // otherwise unsuccessful they can be empty if not needed
  is_logged(session, successful, unsuccessful) {
    logger.info("user_logged: " + this.check_if_user_logged_in(session));
    if (this.check_if_user_logged_in(session)) {
      if (successful) successful();
    } else {
      if (unsuccessful) unsuccessful();
    }
  }

  // check wheter the user is already logged in
  already_logged(req, res, next, home_url) {
    this.is_logged(
      req.session,
      () => {
        logger.warn("User already logged in");
        res.redirect(302, home_url);
      },
      () => {
        logger.info("here is the prob bro");
        next();
      }
    );

    // next();
  }

  // check wheter the user isn't already logged in
  not_already_logged(req, res, next, login_url) {
    this.is_logged(
      req.session,
      () => {
        next();
      },
      () => {
        logger.warn("User not logged in");
        res.redirect(302, login_url);
      }
    );

    // next();
  }

  // check if the mail saved in the session has a
  // corresponding account in the model
  async check_model(req, res, model, next) {
    let readyModel = await model;
    const userCount = await readyModel
      .find({ "person.mail": req.session.mail })
      .count();
    if (userCount === 0) {
      this.destroy(req.session, res);
    }
    next();
  }

  /* SESSION OPERATIONS */

  // generate the session and set it up for a generic use
  // callback can be used to make it specific for a particolar use
  generate(session, user, callback) {
    // generate the session
    session.regenerate(function (err) {
      logger.info("Creating a new session: ");

      if (err) {
        logger.error("Error in regenerate session: " + err);
        throw new Error(err);
      }
    });

    logger.info("role in generate: " + user.role);
    logger.info("user in generate: " + user);
    // set the mail and role
    session.mail = user.mail;
    session.role = user.role;

    if (callback) callback();
  }

  // destroy the session for a generic use
  // callback can be used to make it specific for a particolar use
  destroy(session, res, callback) {
    // destroy the session (on the backend side)
    session.destroy(function (err) {
      logger.info("Destroying the session!");

      if (err) {
        logger.error("Error in destroy session ", err);
        throw new Error(err);
      }
    });

    // clear the cookies (on the front side)
    res.clearCookie(session.id, { path: "/" });

    if (callback) callback();
  }
}

const authenticationService = new auth_service();

module.exports = authenticationService;
