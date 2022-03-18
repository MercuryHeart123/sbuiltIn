import React, { useEffect, useState } from 'react';
import FileBase64 from 'react-file-base64';
import { createItem, getItems } from './editfunction.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './edit.css';

const Edit = () => {

  const [item, setItem] = useState({ name: '', detail: '', dimension: '', price: '', place: '', image: [], full64: [], model: false });
  const [items, setItems] = useState([]);

  const selectFiles = (e) => {
    let imgdata = item.full64;
    for (let i = 0; i < e.length; i++) {
      parseImg(e[`${i}`]);
      imgdata.push(e[`${i}`]);
    }
    setItem({ ...item, full64: imgdata });
  }

  const parseImg = (img) => {
    let reader = new FileReader();
    reader.onload = (e) => {
      let list = item.image;
      list.push(e.target.result);
      setItem({ ...item, image: list });
      console.log(list);
    };
    reader.readAsDataURL(img);
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const result = await createItem(item);

    setItems([...items, result]);
  }

  const onSubmitHandlerModel = async (e) => {
    e.preventDefault();
    const result = await createItem(item);

    setItems([...items, result]);
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await getItems();
      console.log('fetch data;m', result)
      setItems(result);
    }
    fetchData();
  }, [])

  return (
    <div className="container" style={{fontFamily: "Prompt, sans-serif"}}>
      <br/>
      <h4>Add data to catalog or add an model (เพิ่มข้อมูลไปยังแคตตาล้อกหรือเพิ่มโมเดล)</h4>
      <div className="flex-container">
        {/* <pre>{JSON.stringify(item, null, '\t')}</pre> */}
        <div className="flex-child lightyellow">
          <form action="" onSubmit={onSubmitHandler}>
            <u><h5>To catalog</h5></u>
            <label for="name">&nbsp; Name</label>
            <br />
            <input type="text" id="name" className="form-control" placeholder="Enter name" style={{ borderColor: "black", borderRadius: "5px" }}

              onChange={e => setItem({ ...item, name: e.target.value })}
            />
            <br />
            <label for="detail">&nbsp; Enter detail</label>
            <br />
            <input type="text" id="detail" className="form-control" placeholder="Enter detail" style={{ borderColor: "black", borderRadius: "5px" }}

              onChange={e => setItem({ ...item, detail: e.target.value })}
            />
            <br />
            <label for="place">&nbsp; Place</label>
            <br />
            <input type="text" id="place" className="form-control" placeholder="Enter place" style={{ borderColor: "black", borderRadius: "5px" }}

              onChange={e => setItem({ ...item, place: e.target.value })}
            />
            <input
              class="form-control"
              type="file"
              id="image"
              onChange={(e) => selectFiles(e.target.files)}
              multiple="multiple"
            />
            <label for="image">Support .gltf .jpg .png</label>
            <br />
            <br />
            <div className="right-align">
              <button type="submit" className="btn btn-primary btn-block" id="to-catalog" style={{ marginTop: "2vh" }}>Submit</button>
            </div>
          </form>

          {/* <h4>Delete existing model or catalog data (not finished)</h4>
      <form action="" onSubmit={(e) => {
        e.preventDefault();
        useEffect.fetchData();
      }}>
        <div className='right-align'>
          <button type="submit" className="btn btn-primary btn-block" id="load-data" style={{ marginTop: "2vh", backgroundColor: "green", borderColor: "darkgreen" }}>Load data from database</button>
          <label for="load-data">Not finished</label>
        </div>
      </form> */}
          {/* {items?.map(item => (

        <div className="card" key={item._id}>
          <div className="card-image waves-effect waves-block waves-light">
            <img className="activator" style={{ width: '70%', height: '70%' }} src={item.image} />
          </div>
          <div className="card-content">
            <span className="card-title activator grey-text text-darken-4">{item.title}</span>
          </div>

        </div>



      ))} */}
        </div>
        <div className="flex-child lightgreen">
          <form action="" onSubmit={onSubmitHandlerModel}>
            <u><h5>To model</h5></u>
            <label for="name">&nbsp; Name</label>
            <br />
            <input type="text" id="name" className="form-control" placeholder="Enter name" style={{ borderColor: "black", borderRadius: "5px" }}

              onChange={e => {
                setItem({ ...item, name: e.target.value })
                setItem({ ...item, model: true })}}
            />
            <br />
            <label for="detail">&nbsp; Enter detail</label>
            <br />
            <input type="text" id="detail" className="form-control" placeholder="Enter detail" style={{ borderColor: "black", borderRadius: "5px" }}

              onChange={e => setItem({ ...item, detail: e.target.value })}
            />
            <br />
            <label for="price">&nbsp; Enter price</label>
            <br />
            <input type="text" id="price" className="form-control" placeholder="Enter price" style={{ borderColor: "black", borderRadius: "5px" }}

              onChange={e => setItem({ ...item, price: e.target.value })}
            />
            <br />
            <label for="dimension">&nbsp; Dimension</label>
            <br />
            <input type="text" id="dimension" className="form-control" placeholder="Enter dimension" style={{ borderColor: "black", borderRadius: "5px" }}

              onChange={e => setItem({ ...item, dimension: e.target.value })}
            />
            <input
              class="form-control"
              type="file"
              id="image"
              onChange={(e) => selectFiles(e.target.files)}
              multiple="multiple"
            />
            <label for="image">Support .gltf .jpg .png</label>
            <br />
            <br />
            <div className="right-align">
              <button type="submit" className="btn btn-primary btn-block" id="to-catalog" style={{ marginTop: "2vh" }}>Submit</button>
            </div>
          </form>

        </div>
      </div>
    </div>

  );
}


export default Edit;