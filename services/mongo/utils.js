require("dotenv").config({ path: __dirname + "../bin/.env" });
const logger = require("./../../logger.js");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");

class mongo_helper {
  #mongo_uri = ""; // uri for mongo
  #conn; // connection promise
  #toPopulate = "feedback.emplCode";

  constructor() {
    // creation of the mongo uri based on the environment
    let db_cred =
      process.env.DB_USER && process.env.DB_PSW
        ? process.env.DB_USER + ":" + process.env.DB_PSW + "@"
        : "";
    let db_name = process.env.DB_NAME || "";
    let db_options = process.env.DB_OPTIONS || "";
    this.#mongo_uri =
      "mongodb://" +
      db_cred +
      process.env.DB_HOST +
      ":" +
      process.env.DB_PORT +
      "/" +
      db_name +
      "?" +
      db_options;

    // get the connection to the mongo server as a promise
    this.#conn = mongoose.createConnection(this.#mongo_uri).asPromise();
  }

  get mongo_uri() {
    return this.#mongo_uri;
  }

  // if used it will "return" a promise that will eventually return the model requested
  async get_model(table, schema) {
    let model = "model";

    // await to get the connecion
    await this.#conn
      // then get the model requested
      .then((connection) => {
        model = connection.model(table, schema);
      })
      // logger the error that happend
      .catch((reason) => {
        logger.fatal(reason);
      });

    return model;
  }

  // return the store for the session package
  get_store(promise) {
    let conn_prom = this.#conn;
    // options for the store to be created
    let options = {
      conn_prom,
      dbName: "test",
      ttl: 5 * 60,
      autoRemove: "native",
    };

    // if the store has to be made without a promise of the connection
    if (!!!promise) options.mongoUrl = this.#mongo_uri;

    return MongoStore.create(options);
  }

  // returns a person either employee or user
  // in case of employee, req should be the mail
  async getOne(modelInstance, req) {
    const model = await modelInstance;

    // checks if user or employee
    if (model.collection.collectionName == "users") {
      //if user, use the custom find
      var users = await this.populatedFindOne(model, req);
      return users;
    } else {
      // otherwise, regular findOne trought email
      return await model.findOne({ "person.mail": req });
    }
  }

  // updates info of existing user or employee doc
  async setOne(getModel, req) {
    const model = await getModel;

    //finds the document
    const personInstance = await model
      .findOne({ "person.mail": req.body.mail })
      .populate(this.#toPopulate);

    //sets up the person subdocument
    const person = {
      name: req.body.name,
      surname: req.body.surname,
      password: personInstance.person.password,
      mail: req.body.newMail,
      role: req.body.role,
    };

    //assigns the new person data
    personInstance.person = person;

    //checks if the model is user or employee
    if (model.collection.collectionName == "users") {
      //sets up user specific data
      personInstance.birth = req.body.birth;
      personInstance.status = req.body.status;

      //adjustment for jquery issue with arrays
      if (!Array.isArray(req.body["feeds[]"])) {
        req.body["feeds[]"] = [req.body["feeds[]"]];
      }

      //updates the feeds 'cause' some might have been deleted
      personInstance.feedback = personInstance.feedback.filter((feed) => {
        return !req.body["feeds[]"].includes(feed.id);
      });
    } else {
      //employee specific operations
    }

    await personInstance.save();
    return personInstance;
  }

  // get all docs of the given model
  async getAll(modelInstance) {
    const model = await modelInstance;

    if (model.collection.collectionName == "users") {
      //user specific operations
      return await model.find().populate(this.#toPopulate);
    } else {
      //employee spcific operations
      return await model.find();
    }
  }

  // adds document to provided model
  async add(modelInstance, req) {
    const model = await modelInstance;
    var newPerson = new model();

    // initialize person subdoc
    newPerson.person = {};

    // sets up person subdoc
    newPerson.person.name = req.body.name;
    newPerson.person.surname = req.body.surname;
    newPerson.person.mail = req.body.mail;
    newPerson.person.password = req.body.password;

    // checks if user or employee
    if (model.collection.collectionName == "users") {
      //user specific data
      newPerson.person.role = 2;
      newPerson.birth = req.body.birth;
      newPerson.status = req.body.status;
    } else {
      //employee specific data
      newPerson.person.role = req.body.role;
    }
    await newPerson.save();
  }

  // deletes a doc in provoded model
  async deleteOne(modelInstace, mail) {
    const model = await modelInstace;
    return await model.deleteOne({ "person.mail": mail });
  }

  // checks if doc with provided mail already exists
  async checkExist(modelInstance, mail) {
    const model = await modelInstance;
    return await model.findOne({ "person.mail": mail });
  }

  // finds and populates a user document
  // WATCH OUT: if search by name and surname, might return multiple docs, implement usage accordingly
  async populatedFindOne(model, req) {
    var users;

    // checks if find should be by mail or name and surname
    if (req.query.mail) {
      users = await model
        .findOne({ "person.mail": req.query.mail })
        .populate(this.#toPopulate);
    } else {
      users = await model
        .find({
          "person.name": req.query.name,
          "person.surname": req.query.surname,
        })
        .populate(this.#toPopulate);
    }

    // checks if the feeds should be filtered cause employee might delete them
    if (req.query.mode == "edit") {
      users.feedback = this.filterFeeds(users.feedback, req.session.mail);
    }

    return users;
  }

  // filters the feeds associated with a user
  filterFeeds(feeds, mail) {
    return feeds.filter((feed) => {
      if (feed.emplCode.person.mail === mail) {
        return feed;
      }
    });
  }

  //formats the documents copying the person subdoc into the parent doc
  format(instance, isObject) {
    //checks if instance is already a POJO or a mongoose query object
    isObject ? instance : (instance = instance.toObject());

    // extracts person subdoc
    const person = instance.person;

    //deletes person's id, we dont need it no more
    delete person._id;

    //delete person subdoc
    delete instance.person;

    //magic
    instance = { ...instance, ...person };
    return instance;
  }
}

const helper = new mongo_helper();

module.exports = helper;
