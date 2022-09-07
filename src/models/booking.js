const supabase = require("../config/supabase");

module.exports = {
  createBooking: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("booking")
        .insert([data])
        .then((resultBooking) => {
          if (!resultBooking.error) {
            resolve(resultBooking);
          } else {
            reject(resultBooking);
          }
        });
    }),
  createBookingSection: (dataBookingSect) =>
    new Promise((resolve, reject) => {
      supabase
        .from("bookingSection")
        .insert([dataBookingSect])
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getBookingByUserId: (userId) =>
    new Promise((resolve, reject) => {
      // SELECT * FROM product WHERE id = "123"
      supabase
        .from("booking")
        .select("*, bookingSection(*)")
        .eq("userId", userId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
