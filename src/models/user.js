const supabase = require("../config/supabase");

module.exports = {
  showGreetings: () => new Promise((resolve, reject) => {}),
  getAllUser: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .select("*")
        .then((result) => {
          console.log(result);
        });
    }),
  getEventById: (eventId) =>
    new Promise((resolve, reject) => {
      // SELECT * FROM product WHERE id = "123"
      supabase
        .from("user")
        .select("*")
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
