const redis = require("../src/config/redis");

const testData = async () => {
  try {
    const data = [
      {
        id: 1,
        name: "Tea",
      },
      {
        id: 2,
        name: "Milk",
      },
    ];
    const convertData = JSON.stringify(data);
    console.log(typeof convertData);
    console.log("Data Redis = ", convertData);
    const replaceData = JSON.parse(convertData);
    console.log("Data Redis Replace = ", replaceData);
  } catch (error) {
    console.log(error);
  }
};
testData();
