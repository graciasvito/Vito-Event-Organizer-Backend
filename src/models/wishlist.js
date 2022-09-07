const supabase = require("../config/supabase");

module.exports = {
  getCountWishlist: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("wishlist")
        .select("*", { count: "exact" })
        .then((result) => {
          if (!result.error) {
            resolve(result.count);
          } else {
            reject(result);
          }
        });
    }),
  getAllWishlist: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("wishlist")
        .select("*, event(*)")
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  createWishlist: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("wishlist")
        .insert([data])
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getWishlistById: (wishlistId) =>
    new Promise((resolve, reject) => {
      // SELECT * FROM product WHERE id = "123"
      supabase
        .from("wishlist")
        .select("*")
        .eq("wishlistId", wishlistId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  deleteWishlist: (wishlistId, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("wishlist")
        .delete(data)
        .eq("wishlistId", wishlistId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
