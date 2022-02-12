const personService = require("./personService");
const empHelper = require("./employeeService");
const bookingService = require("./bookingService");
const User = require("./schema/user");
const logger = require("../../logger");

class userService extends personService {
  constructor() {
    super();
  }

  async initialize() {
    await super.initialize(User);
    await empHelper.initialize();
    //await bookingService.initialize();
  }

  // FINDS
  async findOne(params, attributes = null) {
    var user = await super.findOne(params, attributes);
    user.full_name = user.person.full_name;

    if (user && user.feedback) {
      await user.populate("feedback.emplCode");
    }

    return user;
  }

  async find(params, attributes = null) {
    var users = await super.find(params, attributes);

    for (const user of users) {
      user.full_name = user.person.full_name;
      if (user.feedback) {
        await user.populate("feedback.emplCode");
      }
    }
    // for (let i = 0; i < users.length; i++) {
    //   await users[i].populate("feedback.emplCode");
    // }

    return users;
  }

  //UPDATES
  async updateOne(filter, params) {
    var user = {};
    const person = super.setUpPerson(params);
    user = {
      ...person,
      ...(params.birth ? { birth: params.birth } : {}),
      ...(params.status ? { status: params.status } : {}),
      ...(params.points ? { points: params.points } : {}),
    };
    console.log(user);
    if (params.feeds) {
      await this.editFeeds(filter, params.feeds);
    }
    await super.updateOne(filter, user);
  }

  //USER SPECIFIC FUNCTIONS
  async addFeed(empMail, userMail, feed) {
    const emp = await empHelper.findOne({ "person.mail": empMail });
    const user = await super.findOne({ "person.mail": userMail });

    user.feedback.push({
      date: feed.date,
      text: feed.text,
      emplCode: emp._id,
    });

    await user.save();
  }

  // filters the feeds associated with a user
  filterFeeds(feeds, mail) {
    return feeds.filter((feed) => {
      if (feed.emplCode.person.mail === mail) {
        return feed;
      }
    });
  }

  async editFeeds(filter, feeds) {
    const user = await super.findOne(filter);

    //adjustment for jquery issue with arrays
    if (!Array.isArray(feeds)) {
      feeds = [feeds];
    }

    //updates the feeds 'cause' some might have been deleted
    user.feedback = user.feedback.filter((feed) => {
      return !feeds.includes(feed.id);
    });

    await user.save();
  }

  async changePoints(userId, amount) {
    const user = await super.findOne({ _id: userId });
    user.points = user.points + amount;
    await user.save();
  }
}

const helper = new userService();
module.exports = helper;
