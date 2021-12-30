const personService = require("./person_service");
const Employee = require("./schema/employee");

class employeeService extends personService {
  constructor() {
    super();
  }

  async initialize() {
    await super.initialize(Employee);
  }
}

const helper = new employeeService();
module.exports = helper;
