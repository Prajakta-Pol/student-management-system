import axios from "axios";

export const API = axios.create({
  baseURL: "http://10.210.127.194:5000/api"
});