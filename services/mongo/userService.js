const personService = require("./personService");
const empHelper = require("./employeeService");
const bookingService = require("./bookingService");
const User = require("./schema/user");
const Booking = require("./schema/booking");
const logger = require("../../logger");
const { use } = require("express/lib/router");

class userService extends personService {
  constructor() {
    super();
  }

  async initialize() {
    await super.initialize(User);
    await empHelper.initialize();
    await bookingService.initialize();
  }

  // FINDS
  async findOne(params, attributes = null) {
    var user = await super.findOne(params, attributes);

    if (user && user.feedback) {
      await user.populate("feedback.emplCode");
    }

    return user;
  }

  async find(params, attributes = null) {
    var usersTmp = await super.find(params, attributes);

    for (const user of usersTmp) {
      await this.evalStatus(user);
    }

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

  async evalStatus(user) {
    const bookings = await bookingService.find({ user: user.id });
    let id = user.id;
    let initStatus = user.status;
    let newStatus = 0;
    let stat = [false, false, false, false, false, false];
    for (const booking of bookings) {
      let today = new Date().setHours(0, 0, 0, 0);
      let end = new Date(booking.end).setHours(0, 0, 0, 0);
      stat[0] = booking.status == 0 ? true : stat[0];
      stat[1] = booking.status == 1 ? true : stat[1];
      stat[2] = booking.status == 2 ? true : stat[2];
      stat[3] = booking.status == 3 ? true : stat[3];
      stat[4] = !booking.returned && today > end ? true : stat[4];
      stat[5] = booking.status == 5 ? true : stat[5];
    }

    if (stat[4]) {
      newStatus = 3;
    } else if (stat[3]) {
      newStatus = 2;
    } else if (stat[2] || stat[1]) {
      newStatus = 1;
    } else {
      newStatus = 0;
    }
    await this.updateOne({ _id: user.id }, { status: newStatus });
  }

  async getCharts (match, group, variable){
    const result = [];
    const bModel = await Booking;
    const params = [];

    if (match){
      params.push({
        $match: match
      })
    }
    if (group){
      params.push({
        $group: group
      })
    }

    const user_per_count = await bModel.aggregate(params);

    let populatedUser = null;
    for (const user of user_per_count){
      logger.info(user);
      populatedUser = await this.findOne({_id: user._id});
      logger.info(populatedUser.brand);
      result.push([`${populatedUser.name} ${populatedUser.surname}`, user[variable]]);
    }

    logger.info(JSON.stringify(result));

    return result;
  }
}


const helper = new userService();
module.exports = helper;
