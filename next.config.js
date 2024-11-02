import withPWA from "next-pwa";
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  // other config options if any
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(config);
