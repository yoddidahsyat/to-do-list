import axios from "axios";

export const baseURL = "https://todo.api.devcode.gethired.id";
export const uploadURL = baseURL + "/";

export const API = axios.create({
    baseURL
});