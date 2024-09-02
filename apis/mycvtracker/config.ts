import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_MYCVTRACKER_API_HOST;

export const apiInstance = axios.create({
  baseURL,
});
