require('dotenv').config({path: __dirname + '../bin/.env'});
const session = require('express-session');
const mongo_service = require('../back-office/mongo/base');
const Employees = require('../back-office/mongo/dipendente');
const logger = require('../logger.js');

class auth_service{
  get_session(options, store){
    let session_options = {
      secret: process.env.SS_SECRET,
      cookie: { maxAge: 36000 },
      store: mongo_service.get_store(),
      saveUninitialized: false,
      resave: false
    };

    // logger.info('options: ' + JSON.stringify(options));
    // logger.info('store: ' + JSON.stringify(store));
    if ( options !== null && options !== undefined )
      session_options = options;

    if (store !== null && store !== undefined)
      session_options.store = store;

    return session(session_options);
  }

  // TODO: add the possibility to get authenticate whatever type of model in input
  async authentication(username, password){
    let employees = await Employees;
    let user = await employees.findOne({ 'user': username, 'psw': password });

    logger.info('query in Service: ' + JSON.stringify(user));

    if (user === null)
      throw new Error("User not found");

    return user;
  }

  check_if_user_logged_in(session){
    return !!session.user;
  }

  authorization(req, res, next, home_url, index_url, role){
    this.is_logged(req.session, () =>  {
      if ( req.session.role === role ){
        next();
        return;
      }

      logger.warn( 'User not authorize' );
      res.redirect(home_url);
    }, () => { res.redirect(index_url); });
  }

  is_logged(session, successful, unsuccessful){
    // logger.info( 'user_logged: ' + this.check_if_user_logged_in(session) );
    if ( this.check_if_user_logged_in(session) ){
      if (successful)
        successful();
    }
    else{
      if (unsuccessful)
        unsuccessful();
    }
  }

  already_logged(req, res, next, home_url){
    logger.info('in already logged');
    this.is_logged(req.session, () => {
      logger.warn( 'User already logged in' );
      res.redirect(302, home_url);
    });

    next();
  }

  not_already_logged(req, res, next, login_url){
    logger.info('in not already logged');
    this.is_logged(req.session, () => {}, () => {
      logger.warn( 'User not logged in' );
      res.redirect(302, login_url);
    });

    next();
  }

  generate(session, user, callback){
    session.regenerate(function(err) {
      logger.info('Creating a new session: ');

      if ( err ){
        logger.error('Error in regenerate session: ' + err);
        throw new Error(err);
      }
    });

    session.user = user.user;
    session.role = user.role;

    if (callback)
      callback();
  }

  destroy(session, res, callback){
    session.destroy(function(err) {
      logger.info('Destroying the session!');

      if ( err ){
        logger.error('Error in destroy session ', err);
        throw new Error(err);
      }

    });

    res.clearCookie(session.id, { path: "/" });

    if (callback)
      callback();
  }
}

const authenticationService = new auth_service();

module.exports = authenticationService;
