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
  async refreshToken(user) {
    const token = await axios.get(`${url}/refresh-token`, { user });
    return token;
  },
  async validate(jwt) {
    const res = await axios.post(`${url}/validate`, { jwt });
    return res.data;
  },
};
