import axios from 'axios';

//base url of server
export default axios.create({
    baseURL: 'http://localhost:3500'
});