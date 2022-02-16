const baseService = require("./base");
const Booking = require("./schema/booking");
const logger = require("../../logger");
const computerService = require("./computerService");
const userService = require("./userService");
const res = require("express/lib/response");

class bookingService extends baseService {
  constructor() {
    super();
  }

  async initialize() {
    await super.initialize(Booking);
    await computerService.initialize();
  }

  async find(params, attrs = null) {
    const bookings = await super.find(params, attrs);

    for (const booking of bookings) {
      await this.updateStatus(booking);
    }

    return super.find(params, attrs);
  }

  async findOne(params, attrs = null) {
    const booking = await super.findOne(params, attrs);
    if (booking) {
      await this.updateStatus(booking);
    } else {
      logger.warn("No booking found");
    }

    return super.findOne(params, attrs);
  }

  async updateOne(filter, params) {
    if (params.final_condition && params.final_condition <= 5){
      await computerService.updateOne({_id: params.computer}, {available: false});
      logger.info("params: " + JSON.stringify(params));
    }

    if (!params.computer){
      delete params.computer;
    }

    const ack = await super.updateOne(filter, params);
    await this.findOne(filter);

    return ack;
  }

  async insertOne(params) {
    await super.insertOne(params);
    await this.findOne({
      user: params["user"],
      computer: params["computer"],
    });
  }

  async getAvailByDates(begin, end) {
    logger.info(begin + "  " + end);
    const bookings = await this.find(
      {
        begin: { $lte: end },
        end: { $gte: begin },
      },
      "computer"
    );
    const available = await computerService.find(
      {
        _id: { $nin: bookings.map((book) => book.computer) },
      },
      "_id"
    );
    return available.map((el) => el._id);
  }

  async getDefaultDiscount(userId, computerId, days) {
    const discounts = [];
    const userScore = await this.getUserScore(userId);
    const computerInfo = await computerService.getDiscount(computerId);

    if (computerInfo.discount) {
      discounts.push({
        reason: "sconto dispositivo",
        amount: computerInfo.price * (computerInfo.discount / 100) * days,
      });
    }

    if (userScore <= 2) {
      discounts.push({
        reason: "sconto buona condotta",
        amount: (
          computerInfo.price *
          ((5 * (3 - userScore)) / 100) *
          days
        ).toFixed(2),
      });
    }
    console.log(discounts);
    return discounts;
  }

  async getDefaultDiscountComputer(computerId, days) {
    const discounts = [];
    const computerInfo = await computerService.getDiscount(computerId);

    if (computerInfo.discount) {
      discounts.push({
        reason: "sconto dispositivo",
        amount: computerInfo.price * (computerInfo.discount / 100) * days,
      });
    }

    console.log(discounts);
    return discounts;
  }

  async getUserScore(userId) {
    var avg = 5;
    const scores = await this.find({
      user: userId,
      end: { $lt: new Date().toISOString() },
      returned: true,
      payed: true,
    });
    if (scores.length >= 3) {
      var total = 0;
      var lateNum = 0;
      scores.forEach((score) => {
        total = total + score.final_condition;
        lateNum = score.late ? lateNum + 1 : lateNum;
      });
      avg = lateNum >= 3 ? 5 : Math.ceil(total / scores.length);
    }
    return avg;
  }

  async getBookingsByUser(userId) {
    logger.info("in getBookingsByUser");
    const bookings = await this.find({ user: userId });
    return bookings;
  }

  async getPopulatedBookings(params = null, attrs = null) {
    const bookings = await this.find(params, attrs);

    for (const booking of bookings) {
      if (booking.user) {
        await booking.populate("user");
        await booking.populate("user.person");
      }
      logger.info(typeof filtered_booking);

      if (booking.computer) {
        await booking.populate("computer");
      }
    }

    return bookings;
  }

  async getPopulatedBookingsByUser(user_id, attrs = null) {
    logger.info("in getPopulateBookingsByUser");
    return this.getPopulatedBookings({ user: user_id }, attrs);
  }

  async getPopulatedBookingsByComputer(computer_id, attrs = null) {
    return this.getPopulatedBookings({ computer: computer_id }, attrs);
  }

  async getPopulatedBooking(booking_id, attrs = null) {
    const booking = await this.findOne({ _id: booking_id }, attrs);

    if (booking) {
      if (booking.user) {
        await booking.populate("user");
        await booking.populate("user.person");
      }

      if (booking.computer) {
        await booking.populate("computer");
      }
    } else {
      logger.warn("Booking not found");
    }

    return booking;
  }

  async updateStatus(booking) {
    await booking.populate("computer");
    let has_change = true;

    const filtered_booking = this._filterObject(booking, (key, value) => {
      const filter = ["_id", "onHold", "status", "defaulted", "late"];
      return filter.includes(key);
    });

    logger.info("PRE filtered_booking: " + JSON.stringify(filtered_booking));

    if (
      !filtered_booking.defaulted ||
      filtered_booking.status === 5 ||
      (booking.returned && booking.payed)
    ) {
      const today = new Date().setHours(0, 0, 0, 0);
      const begin = new Date(booking.begin).setHours(0, 0, 0, 0);
      const end = new Date(booking.end).setHours(0, 0, 0, 0);
      const available = booking.computer.available;

      logger.info("AVAILABLE: " + available);

      const future = today < begin;
      const current = today <= end;
      const past = !future && !current;
      logger.info("FUTURE: " + future);
      logger.info("CURRENT: " + current);

      if (future) {
        // if available but onHold not updated
        if (available) {
          filtered_booking.status = 2;
          if (filtered_booking.onHold) {
            filtered_booking.onHold = false;
          }
        } else {
          filtered_booking.status = 1;
          // if not available but onHold not updated
          if (!filtered_booking.onHold) {
            filtered_booking.onHold = true;
          }
        }
      } else if (current && !booking.returned && !booking.payed) {
        // if should have been started but computer not available
        if (available) {
          filtered_booking.status = 3;
        } else {
          filtered_booking.defaulted = true;
          filtered_booking.status = 0;
        }
      } else if (!booking.returned || !booking.payed) {
        logger.info("STAT LATE IS AVAILABLE: " + available);
        if (!available){
          filtered_booking.late = true;
          filtered_booking.status = 0;
        } else {
          filtered_booking.late = true;
          filtered_booking.status = 4;
        }
      } else {
        filtered_booking.status = 5;
        logger.info(booking._id + " is done ");
      }
    } else {
      // if defaulted but field have not been updated
      if (filtered_booking.defaulted) {
        filtered_booking.status = 0;
      } else {
        has_change = false;
      }
    }

    logger.info("AFTER filtered_booking: " + JSON.stringify(filtered_booking));

    if (has_change) {
      // TODO: status need to be updated!
      await super.updateOne({ _id: filtered_booking }, filtered_booking);
    }
  }

  _filterObject(object, callback) {
    // Convert `obj` to a key/value array
    const asArray = Object.entries(object["_doc"]);

    const filtered = asArray.filter(([key, value]) => callback(key, value));

    // Convert the key/value array back to an object:
    return Object.fromEntries(filtered);
  }
}

const service = new bookingService();

module.exports = service;
