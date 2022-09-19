const supabase = require("../config/supabase");

module.exports = {
  getAllUser: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .select("*")
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getUserById: (userId) =>
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
  createUser: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .insert([data])
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  updateUser: (userId, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .update(data)
        .eq("userId", userId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  deleteUser: (userId, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .select("*")
        .delete(data)
        .eq("userId", userId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  updateImageUser: (userId, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .update([data])
        .eq("userId", userId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  updateUserPassword: (userId, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("user")
        .update(data)
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
