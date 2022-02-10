const logger = require("../../logger");
const baseService = require("./base");

class personService extends baseService {
  setUpPerson(params) {
    var person = {
      ...(params.mail ? { "person.mail": params.mail } : {}),
      ...(params.name ? { "person.name": params.name } : {}),
      ...(params.surname ? { "person.surname": params.surname } : {}),
      ...(params.password ? { "person.password": params.password } : {}),
      ...(params.role ? { "person.role": params.role } : {}),
      ...(params.picture ? { "person.picture": params.picture } : {}),
    };
    return person;
  }
}

module.exports = personService;
