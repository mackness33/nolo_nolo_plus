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

    for (let i = 0; i < bookings.length; i++) {
      bookings[i] = await this.updateStatus(bookings[i]);
    }

    return bookings;
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
    // if (params.final_condition && params.final_condition <= 5) {
    //   await computerService.updateOne(
    //     { _id: params.computer },
    //     { available: false }
    //   );
    //   logger.info("params: " + JSON.stringify(params));
    // }

    if (!params.computer) {
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

    if (userScore >= 8) {
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

  async getPopulatedBookingsByEmployee(emp_id, attrs = null) {
    logger.info("in getPopulateBookingsByUser");
    return this.getPopulatedBookings({ employee: emp_id }, attrs);
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
    if (booking.status === 5 || booking.status === 0) {
      return booking;
    }

    await booking.populate({ path: "computer", select: "available" });
    // let filtered_booking = this._filterObject(booking, (key, value) => {
    //   // const filter = ["onHold", "status", "revoked", "late"];
    //   const filter = ["onHold", "status", "revoked", "late", "returned", "payed"];
    //   return filter.includes(key);
    // });

    // logger.info("Computer available: " + JSON.stringify(booking.computer.available));

    // logger.info("PRE filtered_booking: " + JSON.stringify(filtered_booking));

    const today = new Date().setHours(0, 0, 0, 0);
    const begin = new Date(booking.begin).setHours(0, 0, 0, 0);
    const end = new Date(booking.end).setHours(0, 0, 0, 0);

    const future = today < begin;
    const current = today <= end;

    if (booking.returned && booking.payed) {
      // is done
      booking.status = 5;
    }

    if (!booking.computer.available) {
      if (!booking.late){
        booking.late = false;
        if (!future) {
          // if revoked
          booking.revoked = true;
          booking.status = 0;
        } else {
          // if onHold
          booking.onHold = true;
          booking.status = 1;
        }
      }
    } else {
      booking.onHold = false;
      booking.revoked = false;

      if (future) {
        // if future
        booking.status = 2;
      } else {
        if (current && !booking.returned && !booking.payed) {
          // if current
          booking.status = 3;
        } else if (!booking.returned || !booking.payed) {
          // if late
          booking.late = true;
          booking.status = 4;
        } else {
          // is done
          booking.status = 5;
        }
      }
    }

    // logger.info("AFTER filtered_booking: " + JSON.stringify(filtered_booking));

    const filtered_booking = this._filterObject(booking, (key, value) => {
      const filter = ["onHold", "status", "revoked", "late"];
      // const filter = ["onHold", "status", "revoked", "late", "returned", "payed"];
      return filter.includes(key);
    });

    await super.updateOne({ _id: booking._id }, filtered_booking);

    return booking;
  }

  _filterObject(object, callback) {
    // Convert `obj` to a key/value array
    const asArray = Object.entries(object["_doc"]);

    const filtered = asArray.filter(([key, value]) => callback(key, value));

    // Convert the key/value array back to an object:
    return Object.fromEntries(filtered);
  }

  async getCharts(match, group, variable) {
    const result = [];
    const bModel = await Booking;
    const params = [];

    if (match) {
      params.push({
        $match: match,
      });
    }
    if (group) {
      params.push({
        $group: group,
      });
    }

    const booking_per_count = await bModel.aggregate(params);

    for (const booking of booking_per_count) {
      logger.info(booking);
      result.push([booking._id, booking[variable]]);
    }

    logger.info(JSON.stringify(result));

    return result;
  }
}

const service = new bookingService();

module.exports = service;
