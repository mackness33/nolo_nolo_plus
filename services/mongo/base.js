require("dotenv").config({ path: __dirname + "../bin/.env" });
const logger = require("../../logger");

class baseService {
  _model;
  #model_ready;

  constructor() {
    this.#model_ready = false;
  }

  /* FINDS */

  async findOne(params, attrs = null) {
    return this._model.findOne(params, attrs);
  }

  async find(params, attrs = null) {
    return this._model.find(params, attrs)
  }

  /* UPDATES */
  async updateOne(filter, params) {
    return this._model.updateOne(filter, params);
    //return this._model.findOneAndUpdate(filter, params);
  }

  /* INSERTS */
  async insertOne(params) {
    const newDoc = new this._model(params);
    await newDoc.save();
  }

  /* DELETES */
  async deleteOne(params) {
    return this._model.deleteOne(params);
  }

  async deleteMany(params) {
    return this._model.deleteMany(params);
  }

  /* CHECKS */
  async checkExists(params) {
    const num_docs = await this._model.count(params);
    return !!num_docs;
  }

  async initialize(model) {
    if (!this.alreadyInit) {
      this._model = await model;
      this.#model_ready = true;
    }
  }

  // async initialize(){
  //   if (!this.alreadyInit()){
  //     this._model = await Employee;
  //     this.#model_ready = true;
  //   }
  // }

  get alreadyInit() {
    return this.#model_ready;
  }

  //formats the documents copying the person subdoc into the parent doc
  format(instance, attributeName) {
    //checks if instance is already a POJO or a mongoose query object
    instance.toObject ? (instance = instance.toObject()) : instance;

    // extracts person subdoc
    const attribute = instance[attributeName];

    //deletes person's id, we dont need it no more
    delete attribute._id;

    //delete person subdoc
    delete instance[attributeName];

    //magic
    instance = { ...instance, ...attribute };
    return instance;
  }
}

module.exports = baseService;
