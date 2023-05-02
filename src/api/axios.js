import axios from "axios";
import { getConfig } from "../utils/config";

export default axios.create({
  baseURL: `${getConfig("API_URL")}`,
  headers: {
    Accept: "application/json",
    // "X-Client-Type": "WEB",
    "Content-Type": "application/json",
  },
});
