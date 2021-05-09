const axios = require("axios");
const url = "http://localhost:8080";

module.exports = {
  async login(data) {
    try {
      const res = await axios.post(
        `${url}/sign-in`,
        { data },
        { withCredentials: true, credentials: "include" }
      );
      return res.data;
    } catch (e) {
      console.log(e);
    }
  },
  async register(data) {
    try {
      const res = await axios.post(
        `${url}/sign-up`,
        { data },
        { withCredentials: true, credentials: "include" }
      );
      console.log(res);
      return res.data;
    } catch (e) {
      console.log(e);
    }
  },
  async refreshToken({ refreshToken, _id }) {
    try {
      const res = await axios.post(
        `${url}/refresh-token`,
        { refreshToken, _id },
        { withCredentials: true, credentials: "include" }
      );
      return res.data.accessToken;
    } catch (e) {
      console.log(e);
    }
  },
  async validate(accessToken) {
    try {
      const res = await axios.post(`${url}/validate`, { accessToken });
      return res.data;
    } catch (e) {
      console.log(e);
    }
  },
};
