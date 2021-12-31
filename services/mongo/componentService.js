const baseService = require("./base");
const Component = require("./schema/component");
const logger = require("../../logger");

class componentService extends baseService {
  constructor() {
    super();
  }

  async initialize() {
    await super.initialize(Component);
  }

  async getAll() {
    const components = await super.find();
    var obj = {};
    components.forEach((comp) => {
      obj[comp.name] = comp.list;
    });
    return obj;
  }

  async #insertEntry(name, entry) {
    const component = await super.findOne({ name: name });
    if (Array.isArray(entry)) {
      component.list.push.apply(component.list, entry);
      component.list = [...new Set(component.list)];
    } else if (!component.list.includes(entry)) {
      component.list.push(entry);
    }
    await component.save();
  }

  async addComponents(params) {
    const filteredParams = this.#filtercomponents(params);
    for (const [entry, value] of Object.entries(filteredParams)) {
      await this.#insertEntry(entry, value);
    }
  }

  #filtercomponents({ brand, model, type, cpu, gpu, ram }) {
    return {
      ...(type ? { type } : {}),
      ...(brand ? { brand } : {}),
      ...(model ? { model } : {}),
      ...(cpu ? { cpu } : {}),
      ...(gpu ? { gpu } : {}),
      ...(ram ? { ram } : {}),
    };
  }
}

const helper = new componentService();
module.exports = helper;
