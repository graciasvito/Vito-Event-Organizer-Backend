const supabase = require("../config/supabase");

module.exports = {
  getCountEvent: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("event")
        .select("name", { count: "exact" })
        .then((result) => {
          if (!result.error) {
            resolve(result.count);
          } else {
            reject(result);
          }
        });
    }),
  getAllEvent: (
    offset,
    limit,
    searchName,
    sortColumn,
    sortType,
    day,
    nextDay
  ) =>
    new Promise((resolve, reject) => {
      const query = supabase
        .from("event")
        .select("*")
        .range(offset, offset + limit - 1)
        .ilike("name", searchName)
        .order(sortColumn, { ascending: sortType });
      if (day) {
        query
          .gt("dateTimeShow", `${day.toISOString()}`)
          .lt("dateTimeShow", `${nextDay.toISOString()}`)
          .then((result) => {
            if (!result.error) {
              resolve(result);
            } else {
              reject(result);
            }
          });
      } else {
        query.then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
      }
    }),

  getEventById: (eventId) =>
    new Promise((resolve, reject) => {
      // SELECT * FROM product WHERE id = "123"
      supabase
        .from("event")
        .select("*")
        .eq("eventId", eventId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  createEvent: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("event")
        .insert([data])
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  updateEvent: (eventId, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("event")
        .update([data])
        .eq("eventId", eventId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  deleteEvent: (eventId, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("event")
        .delete(data)
        .eq("eventId", eventId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
