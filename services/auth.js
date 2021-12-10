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

    logger.info('session options: ' + JSON.stringify(session_options));

    return session(session_options);
  }

  // TODO: add the possibility to get authenticate whatever type of model in input
  async authentication(username, password){
    let employees = await Employees;
    logger.info('employees: ' + JSON.stringify(employees));

    let user = await employees.findOne({ 'user': username, 'psw': password });

    logger.info('query in Service: ' + JSON.stringify(user));

    // if (user === null)
    //   throw new Error("User not found");

    return user;
  }
}

const authenticationService = new auth_service();

module.exports = authenticationService;
