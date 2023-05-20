import axios from "axios";
import { API_END_POINT_URL } from "./env";

axios.defaults.baseURL = API_END_POINT_URL;


export default axios;

