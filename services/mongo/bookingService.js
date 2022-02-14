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

  async insertOne(params) {
    await super.insertOne(params);
  }

  async getAvailByDates(begin, end) {
    logger.info(begin + "  " + end);
    const bookings = await super.find(
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

  async getUserScore(userId) {
    var avg = 5;
    const scores = await super.find(
      {
        user: userId,
        end: { $lt: new Date().toISOString() },
        picked: true,
        returned: true,
        payed: true,
      },
      "final_condition late"
    );
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
    const bookings = await super.find({ user: userId });
    return bookings;
  }

  async getPopulatedBookings(params = null, attrs = null) {
    const bookings = await super.find(params, attrs);

    for (const booking of bookings){
      if (booking.user){
        await booking.populate("user");
        await booking.populate("user.person");
      }
      if (booking.computer){
        await booking.populate("computer");
      }
    }

    return bookings;
  }

  async getPopulatedBookingsByUser(user_id, attrs = null) {
    return this.getPopulatedBookings({'user': user_id}, attrs);
  }

  async getPopulatedBookingsByComputer(computer_id, attrs = null) {
    return this.getPopulatedBookings({'computer': computer_id}, attrs);
  }

  async getPopulatedBooking(booking_id, attrs = null) {
    const bookings = await super.findOne({'_id': booking_id}, attrs);

    if (booking.user){
      await booking.populate("user");
      await booking.populate("user.person");
    }
    
    if (booking.computer){
      await booking.populate("computer");
    }

    return bookings;
  }
}

const service = new bookingService();

module.exports = service;
