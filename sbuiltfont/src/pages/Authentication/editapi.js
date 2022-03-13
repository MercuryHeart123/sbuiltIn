import axios from 'axios';
const url = "http://localhost:8080/edit";
export const getItems = ()=>axios.get(url);
export const createItem = (item)=>axios.post(url,item);