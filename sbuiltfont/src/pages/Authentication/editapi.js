import React, { useEffect, useState } from 'react';
import axios from 'axios';
const url = "http://localhost:8080/edit";
export const getItems = ()=>axios.get(url);
export const createItem = (item)=>axios.post(url,item).then((res) => {
    let [redirect, setRedirect] = useState(false)
    let msg = res.msg;
    console.log(msg);
    alert(msg);
    setRedirect(true);
}).catch((err) => {
    alert(err.res.msg);
});;