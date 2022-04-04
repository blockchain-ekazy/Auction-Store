// const firebase = require("firebase");
// const { collection, addDoc } = require("firebase/firestore");
// const db = firebase.firestore();
// const fetch = require("fetch");
// const https = require("https");
const axios = require("axios");

module.exports = {
  get_metadata_by_id: async (req, res, next) => {
    try {
      const { id } = req.params;

      await axios
        .get(
          "https://firestore.googleapis.com/v1/projects/dutchauction-83348/databases/(default)/documents/items/" +
            id +
            "?key=AIzaSyCYWaaVk6XSUwmX19gPFwHT0UkDfqqnlxQ"
        )
        .then((data) => {
          let fields = data.data.fields;
          return res.json({
            name: fields.name.stringValue,
            description: fields.description.stringValue,
            image:
              "http://" +
              req.header("Host") +
              "/upload/" +
              fields.path.stringValue,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.log("server error", error.message);
      next(error);
    }
  },
};
