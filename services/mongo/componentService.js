const baseService = require("./base");
const Component = require("./schema/component");
const computerService = require("./computerService");
const logger = require("../../logger");

class componentService extends baseService {
  constructor() {
    super();
  }

  async initialize() {
    await super.initialize(Component);
    await computerService.initialize();
  }

  async getAllComponents() {
    await this.clear();
    const components = await super.find();
    var obj = {};
    components.forEach((comp) => {
      obj[comp.name] = comp.list;
    });
    return obj;
  }

  async clear() {
    const components = await super.find();
    for (let i = 0; i < components.length; i++) {
      const entry = components[i].name;
      const values = components[i].list;
      const allItems = await computerService.find({}, "-image");
      const componentDoc = await super.findOne({ name: entry });
      var list = componentDoc.list;
      values.forEach((value) => {
        var item;
        if (entry === "type") {
          item = allItems.filter((item) => item[entry].includes(value));
        } else {
          item = allItems.filter((item) => item[entry] === value);
        }
        list = !item.length ? list.filter((comp) => comp !== value) : list;
      });
      componentDoc.list = list;
      await componentDoc.save();
    }
  }

  async #insertEntry(name, entry) {
    const component = await super.findOne({ name: name });
    logger.info(JSON.stringify(component));
    if (Array.isArray(entry)) {
      component.list.push.apply(component.list, entry);
      component.list = [...new Set(component.list)];
    } else if (!component.list.includes(entry)) {
      component.list.push(entry);
    }
    await component.save();
  }

  async addComponents(params) {
    await this.clear();
    const filteredParams = this.#filterEntries(params);
    for (const [entry, value] of Object.entries(filteredParams)) {
      logger.info(`${entry}: ${value}`);
      await this.#insertEntry(entry, value);
    }
  }

  #filterEntries({ brand, model, type, cpu, gpu, ram }) {
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
