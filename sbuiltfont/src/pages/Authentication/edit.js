import React, { useEffect, useState } from 'react';
import FileBase64 from 'react-file-base64';
import { createItem, getItems } from './editfunction.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

const Edit = () => {

  const [item, setItem] = useState({ title: '', image: '', model: false });
  const [items, setItems] = useState([])
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const result = await createItem(item);

    setItems([...items, result]);
  }

  const fetchData = async () => {
    const result = await getItems();
    console.log('fetch data;m', result)
    setItems(result)
  }

  // useEffect(() => {
  //   fetchData()
  // }, [])

  return (
    <div className="container" 
      style={{
      paddingBottom: "20vh",
      paddingTop:"9vh",
      width: "30vw",
      margin: "0 auto",
      textAlign: "left",
  }}>
      <h4>Add data to catalog or add an model (เพิ่มข้อมูลไปยังแคตตาล้อกหรือเพิ่มโมเดล)</h4>
      {/* <pre>{JSON.stringify(item, null, '\t')}</pre> */}
      <form action="" onSubmit={onSubmitHandler}>
        <label for="text">&nbsp; Please provide a description for image or model</label>
        <br/>
        <input type="text" id="text" className="input-field" style={{borderColor: "black", borderRadius: "5px"}}

          onChange={e => setItem({ ...item, title: e.target.value })}
        />
        <br/>
        <br/>
        <FileBase64
          type="file"
          id="image"
          multiple={false}
          onDone={({ base64 }) => setItem({ ...item, image: base64 })}
        />
        <label for="image">Support .gltf .jpg .png</label>
        <br/>
        <br/>
        <div className="right-align">
          <label><input type='checkbox' onChange={() => setItem({...item, model: true})}/> &nbsp;It's a 3D model</label>
          <br/>
          <button type="submit" className="btn btn-primary btn-block" id="to-catalog" style={{ marginTop: "2vh" }}>Submit</button>
        </div>
      </form>

      <h4>Delete existing model or catalog data (not finished)</h4>
      <form action="" onSubmit={(e) => {
        e.preventDefault()
        fetchData()}}>
        <div className='right-align'>
          <button type="submit" className="btn btn-primary btn-block" id="load-data" style={{ marginTop: "2vh" , backgroundColor: "green", borderColor: "darkgreen"}}>Load data from database</button>
          <label for="load-data">Not finished</label>
        </div>
      </form>
      {items?.map(item => (

        <div className="card" key={item._id}>
          <div className="card-image waves-effect waves-block waves-light">
            <img className="activator" style={{ width: '70%', height: '70%' }} src={item.image} />
          </div>
          <div className="card-content">
            <span className="card-title activator grey-text text-darken-4">{item.title}</span>
          </div>

        </div>



      ))}
    </div>
  );
}


export default Edit;