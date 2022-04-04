import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './style.edit.css';
import { v4 as uuidv4 } from 'uuid';
import { NavLink as Link } from "react-router-dom";
import Popup from './popup';

const Edit = () => {

  const [item, setItem] = useState({ image: [], imagePreview: [], imageAddon: null, full64: [], fullPreview: [], fullAddon: null });
  // const [items, setItems] = useState([]);
  const [display, setDisplay] = useState("catalog");
  const [allData, setallData] = useState([]);
  const [allImg, setallImg] = useState([]);
  const [img64, setimg64] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [chkAddon, setchkAddon] = useState(false);
  const [preUpload, setpreUpload] = useState([]);
  const [Preview, setPreview] = useState(false);

  const url = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

  const listAllData = (type) => {
    console.log("hello");
    axios.defaults.withCredentials = true;
    const urldata = url + "/" + type;
    axios.get(urldata)
      .then((res) => {
        let response = res.data;
        setallData([...response]);
        console.log(response);
        console.log("Data has been received");
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.msg);
        console.log("Error: either server or database is down!");
      })
  }

  const selectFiles = (e) => {
    let imgdata = [];
    setpreUpload([]);
    for (let i = 0; i < e.length; i++) {
      parseImg(e[`${i}`]);
      imgdata.push(e[`${i}`]);
    }
    setItem({ ...item, full64: imgdata });
    if(Preview !== true || Preview === true) {
      setPreview(true);
    }
  }

  const parseImg = (img) => {
    let reader = new FileReader();
    reader.onload = (e) => {
      let list = item.image;
      list.push(e.target.result);
      setItem({ ...item, image: list });
      console.log(list);
      let preview = [];
      for (let i=0;i<list.length;i++) {
        let base64Image = list[i].split(";base64,").pop();
        preview.push(base64Image);
        console.log(base64Image);
      }
      setpreUpload([...preview]);
    };
    reader.readAsDataURL(img);
  }

  const selectPreview = (e) => {
    let imgdata = item.fullPreview;
    for (let i = 0; i < e.length; i++) {
      parsePreview(e[`${i}`]);
      imgdata.push(e[`${i}`]);
    }
    setItem({ ...item, fullPreview: imgdata });
    if(Preview !== true || Preview === true) {
      setPreview(true);
    }
  }

  const parsePreview = (img) => {
    let reader = new FileReader();
    reader.onload = (e) => {
      let list = item.imagePreview;
      list.push(e.target.result);
      setItem({ ...item, imagePreview: list });
      console.log(list);
      let preview = [];
      for (let i=0;i<list.length;i++) {
        let base64Image = list[i].split(";base64,").pop();
        preview.push(base64Image);
        console.log(base64Image);
      }
      setpreUpload([...preview]);
    };
    reader.readAsDataURL(img);
  }

  const selectAddon = (e) => {
    let imgdata = [];
    for (let i = 0; i < e.length; i++) {
      parseAddon(e[`${i}`]);
      imgdata.push(e[`${i}`]);
    }
    setItem({ ...item, fullAddon: imgdata });
  }

  const parseAddon = (img) => {
    let reader = new FileReader();
    reader.onload = (e) => {
      let list = [];
      list.push(e.target.result);
      setItem({ ...item, imageAddon: list });
      console.log(list);
    };
    reader.readAsDataURL(img);
  }

  const onSubmitHandler = (type, e) => {
    e.preventDefault();
    console.log(type);
    const urldata = url + "/" + type;
    if (type == "editmodel") {
      let namemodel = e.target.namemodel.value;
      let detailmodel = e.target.detailmodel.value;
      let pricemodel = e.target.pricemodel.value;
      let dimensionmodel = e.target.dimensionmodel.value;
      let uid = uuidv4();
      let image = item.image;
      let imagePreview = item.imagePreview;
      let imageAddon;
      if (imageAddon !== null) {
        imageAddon = item.imageAddon;
        const formData = { namemodel, detailmodel, pricemodel, dimensionmodel, image, imagePreview, imageAddon, uid };
        axios.post(urldata, formData)
          .then(() => {
            alert("Complete: data has been uploaded!");
            listAllData("listmodel");
          })
          .catch((err) => {
            alert("Failed: client and server are out of sync!");
            console.log(err.response.data.msg);

          });
        resetAll("model");
      } else {
        const formData = { namemodel, detailmodel, pricemodel, dimensionmodel, image, imagePreview, uid };
        axios.post(urldata, formData)
          .then(() => {
            alert("Complete: data has been uploaded!");
            listAllData("listmodel");
          })
          .catch((err) => {
            alert("Failed: client and server are out of sync!");
            console.log(err.response.data.msg);

          });
        resetAll("model");
      }

    } else if (type == "editcatalog") {
      let namecat = e.target.namecat.value;
      let detailcat = e.target.detailcat.value;
      let placecat = e.target.placecat.value;
      let image = item.image;
      // let imagePreview = item.imagePreview; 
      let uid = uuidv4();
      // setItem({ ...item, name: namecat, detail: detailcat, place: placecat });
      const formData = { namecat, detailcat, placecat, image, uid };
      axios.post(urldata, formData)
        .then(() => {
          alert("Complete: data has been uploaded!");
          listAllData("listcatalog");
        })
        .catch((err) => {
          alert("Failed: client and server are out of sync! Try reload this page");
          console.log(err.response.data.msg);
        });
      resetAll("catalog");
    }
  }

  const toggleCatalog = () => {
    if (display !== "catalog") {
      listAllData("listcatalog");
      setDisplay("catalog");
    }

  }

  const toggleModel = () => {
    if (display !== "model") {
      listAllData("listmodel");
      setDisplay("model");
    }

  }

  const togglePopup = (uuid, title, path, e) => {
    let uid = uuid;
    let name = title;
    const urldata = url + "/" + path;
    console.log(uid);
    const formData = { uid, name };
    axios.post(urldata, formData)
      .then((res) => {
        let response = res.data;
        setimg64(response);
        // console.log(response);
        console.log("Data from get catalog or model has been received");

      })
      .catch((err) => {
        console.log(err);
        console.log("Error: either server or database is down!");
      })
    setIsOpen(!isOpen);
  }

  const closePopup = () => {
    setimg64("");
    setIsOpen(false);
  }

  const toggleAddon = () => {
    if (chkAddon !== true) {
      setchkAddon(true);
    } else if (chkAddon === true) {
      setchkAddon(false);
    }
  }

  const resetAll = (path) => {
    if (path === "catalog") {
      setItem({ ...item, image: [], imagePreview: [], full64: [], fullPreview: [] });
      const form = document.getElementById("catalog-input");
      form.reset();
    } else if (path === "model") {
      setItem({ ...item, image: [], imagePreview: [], imageAddon: null, full64: [], fullPreview: [], fullAddon: null });
      setchkAddon(false);
      const form = document.getElementById("model-input");
      form.reset();
    }
    setpreUpload([]);
    setPreview(false);

  }

  const deletefromDB = (type, uid, e) => {
    e.preventDefault();
    let uuid = uid;
    let pathDB = type;
    console.log(uuid);
    const urldata = url + "/deletepost";
    const formData = { uuid, pathDB };
    axios.post(urldata, formData)
      .then(() => {
        alert("Complete: post has been deleted!");
        console.log("Data from get catalog or model has been received");

      })
      .catch((err) => {
        console.log(err);
        console.log("Error: either server or database is down!");
      })
    setIsOpen(false);
    if (pathDB == "catalog") {
      setallData([]);
      listAllData("listcatalog");
    } else if (pathDB == "model") {
      setallData([]);
      listAllData("listmodel");
    }
  }

  const imglist = preUpload.map((img, index) => {
    return (
      <>
      <img src={`data:image/jpg;base64,${img}`} style={{width: "40%", height: "40%", marginRight: "10px", marginTop: "10px"}}/>
      </>
    )
  })

  useEffect(() => {
    // const fetchData = async () => {
    //   const result = await getItems();
    //   console.log('fetch data;m', result)
    //   setItems(result);
    // }

    // fetchData();
    // listDataCatalog();
    // listDataModel();
    listAllData("listcatalog");
  }, [])

  return (
    <div className="container" style={{ fontFamily: "Prompt, sans-serif" }}>
      <br />
      <h4>Add data to catalog or add an model (เพิ่มข้อมูลไปยังแคตตาล้อกหรือเพิ่มโมเดล)</h4>
      <br />
      <h5>คุณต้องการแก้ไขหรือเพิ่มข้อมูลไปยังส่วนใด?</h5>
      <button className="btn btn-primary btn-block" id="btn-catalog" style={{ backgroundColor: "darkblue", borderColor: "darkblue", marginRight: "5px", marginBottom: "5px" }} onClick={toggleCatalog}>Catalog (แคตตาล้อก)</button>
      <button className="btn btn-primary btn-block" id="btn-model" style={{ backgroundColor: "green", borderColor: "green", marginLeft: "5px", marginBottom: "5px" }} onClick={toggleModel}>Model (โมเดล)</button>

      <div className="flex-container">
        {display == "catalog" && <div className="flex-child lightyellow" id="catalog" style={{ borderColor: "darkblue" }}>
          <form id="catalog-input" onSubmit={(e) => { onSubmitHandler("editcatalog", e) }}>
            <u><h5>All post in catalog (รายการทั้งหมดของแคตตาล้อก)</h5></u>
            {isOpen && <Popup
              content={<>
                <u><h5>แก้ไขข้อมูล (Edit)</h5></u>
                <button className="btn btn-primary btn-block" id="delete-cat" style={{ marginTop: "2vh", backgroundColor: "red", borderColor: "red" }} onClick={(e) => {
                  deletefromDB("catalog", img64[4], e)
                  listAllData("listcatalog");
                }}>ลบข้อมูล (Delete)</button>
                <br />
                <br />
                <label for="name">&nbsp; Name (ชื่อผลงาน)</label>
                <br />
                <input defaultValue={img64[0]} type="text" id="edit-cat" name="namecat" className="form-control" placeholder="Enter name" style={{ borderColor: "black", borderRadius: "5px" }} />
                <br />
                <label for="detail">&nbsp; Detail (รายละเอียด)</label>
                <br />
                <input defaultValue={img64[1]} type="text" id="edit-cat" name="detailcat" className="form-control" placeholder="Enter detail" style={{ borderColor: "black", borderRadius: "5px" }} />
                <br />
                <label for="place">&nbsp; Place (สถานที่)</label>
                <br />
                <input defaultValue={img64[2]} type="text" id="edit-cat" name="placecat" className="form-control" placeholder="Enter place" style={{ borderColor: "black", borderRadius: "5px" }} />
                <br />
                <label for="preview">&nbsp; Preview image (ภาพตัวอย่าง)</label>
                <br />
                <img src={`data:image/jpg;base64,${img64[5]}`} id="preview" alt="placeholder" width="50%" height="50%"></img>
                <br />
                <br />
                <h6>{img64[3]}</h6>
              </>}
              handleClose={closePopup}
            />}
            <div>
              {allData ? allData.map((model, index) => {
                return (
                  <div>
                    <Link to="/edit" onClick={(e) => { togglePopup(model.uid, model.title, "getcatalog", e) }}>{model.title} {model.dateModified}</Link>
                    <br />
                  </div>)
              }) : null}
            </div>
            <div style={{borderTop: "1px solid darkblue", marginBottom: "10px", marginTop: "10px"}}></div>
            <u><h5>To catalog (เพิ่มแคตตาล้อก)</h5></u>
            <label for="name">&nbsp; Name (ชื่อผลงาน)</label>
            <br />

            <input required type="text" id="name-cat" name="namecat" className="form-control" placeholder="Enter name" style={{ borderColor: "black", borderRadius: "5px" }} />
            <br />
            <label for="detail">&nbsp; Enter detail (รายละเอียด)</label>
            <br />
            <input required type="text" id="detail-cat" name="detailcat" className="form-control" placeholder="Enter detail" style={{ borderColor: "black", borderRadius: "5px" }} />
            <br />
            <label for="place">&nbsp; Place (สถานที่)</label>
            <br />
            <input required type="text" id="place-cat" name="placecat" className="form-control" placeholder="Enter place" style={{ borderColor: "black", borderRadius: "5px" }} />
            <input
              required
              multiple
              class="form-control"
              type="file"
              accept=".jpg,.png,.jpeg"
              id="image"
              style={{ marginTop: "10px" }}
              onChange={(e) => {
                setpreUpload([]);
                selectFiles(e.target.files);
                setpreUpload([]);}}
            />
            <label for="image">Upload catalog content (Support .jpeg .jpg .png)</label>
            <br />
            <br />
            {Preview &&
            <>
              <u><label for="preview">Preview before upload (ภาพตัวอย่างก่อนทำการอัพโหลด)</label></u>
              <br />
              {imglist}
              <br />
              <br />
              <div style={{borderTop: "1px solid darkblue"}}></div>
              <br />
              <u><label for="preview">This image will use as preview (ภาพนี้จะถูกใช้เป็นภาพปกแคตตาล้อก)</label></u>
              <br />
              <img src={`data:image/jpg;base64,${preUpload[0]}`} id="preview" width="40%" height="40%" style={{marginTop: "10px"}}></img>
              <br />
            </>}
            <div className="right-align">
              <button type="submit" className="btn btn-primary btn-block" id="to-catalog" value="Reset" style={{ marginTop: "2vh" }}>Submit</button>
              <button type="reset" className="btn btn-primary btn-block" value="Reset" style={{ marginTop: "2vh", backgroundColor: "red", borderColor: "red", marginLeft: "10px" }} onClick={() => {
                resetAll("catalog");
              }}>Reset form</button>
            </div>
          </form>
          <button className="btn btn-primary btn-block" id="load-model" style={{ marginTop: "2vh", background: "green", borderColor: "green" }} onClick={() => {
            listAllData("listcatalog")
          }}>Load catalog data</button>
        </div>}
        {display == "model" && <div className="flex-child lightgreen" id="model" style={{ borderColor: "green" }}>
          <form id="model-input" onSubmit={(e) => { onSubmitHandler("editmodel", e) }}>
            <u><h5>All data in model (ข้อมูลโมเดลทั้งหมด)</h5></u>
            {isOpen && <Popup
              content={<>
                <u><h5>แก้ไขข้อมูล (Edit)</h5></u>
                <button className="btn btn-primary btn-block" id="delete-model" style={{ marginTop: "2vh", backgroundColor: "red", borderColor: "red" }} onClick={(e) => {
                  deletefromDB("model", img64[5], e)
                  listAllData("listmodel");
                }}>ลบข้อมูล (Delete)</button>
                <br />
                <br />
                <label for="name">&nbsp; Name (ชื่อโมเดล)</label>
                <br />
                <input defaultValue={img64[0]} type="text" id="name-model" name="namemodel" className="form-control" placeholder="Enter name" style={{ borderColor: "black", borderRadius: "5px" }} />
                <br />
                <label for="detail">&nbsp; Detail (รายละเอียด)</label>
                <br />
                <input defaultValue={img64[1]} type="text" id="detail-model" name="detailmodel" className="form-control" placeholder="Enter detail" style={{ borderColor: "black", borderRadius: "5px" }} />
                <br />
                <label for="price">&nbsp; Price (ราคา)</label>
                <br />
                <input defaultValue={img64[2]} type="number" id="price-model" name="pricemodel" className="form-control" placeholder="Enter price" style={{ borderColor: "black", borderRadius: "5px" }} />
                <br />
                <label for="width">&nbsp; Width dimension (ขนาดความกว้างของโมเดล)</label>
                <br />
                <input defaultValue={img64[3]} type="number" id="width-model" name="widthmodel" className="form-control" placeholder="Enter width dimension" style={{ borderColor: "black", borderRadius: "5px" }} />
                <label for="preview">&nbsp; Preview image (ภาพตัวอย่าง)</label>
                <br />
                <img src={`data:image/jpg;base64,${img64[6]}`} id="preview" alt="placeholder" width="50%" height="50%"></img>
                <br />
                <br />
                <h6>{img64[4]}</h6>
              </>}
              handleClose={closePopup}
            />}
            <div>
              {allData ? allData.map((model, index) => {
                return (
                  <div>
                    <Link to="/edit" onClick={(e) => { togglePopup(model.uid, model.title, "getmodel", e) }}>{model.title} {model.dateModified}</Link>
                    <br />
                  </div>)
              }) : null}
            </div>
            <div style={{borderTop: "1px solid green", marginBottom: "10px", marginTop: "10px"}}></div>
            <u><h5>To model (เพิ่มโมเดล)</h5></u>
            <label for="name">&nbsp; Name (ชื่อโมเดล)</label>
            <br />
            <input required type="text" id="name-model" name="namemodel" className="form-control" placeholder="Enter name" style={{ borderColor: "black", borderRadius: "5px" }} />
            <br />
            <label for="detail">&nbsp; Enter detail (รายละเอียดโมเดล)</label>
            <br />
            <input required type="text" id="detail-model" name="detailmodel" className="form-control" placeholder="Enter detail" style={{ borderColor: "black", borderRadius: "5px" }} />
            <br />
            <label for="price">&nbsp; Enter price (ราคา)</label>
            <br />
            <input required type="number" id="price-model" name="pricemodel" className="form-control" placeholder="Enter price" style={{ borderColor: "black", borderRadius: "5px" }} />
            <br />
            <label for="dimension">&nbsp; Enter width dimension (ขนาดความกว้างของโมเดล)</label>
            <br />
            <input required type="number" step=".001" id="dimension-model" name="dimensionmodel" className="form-control" placeholder="Enter width dimension" style={{ borderColor: "black", borderRadius: "5px" }} />
            <input
              required
              class="form-control"
              type="file"
              accept=".gltf"
              id="image"
              style={{ marginTop: "10px" }}
              onChange={(e) => {
                selectFiles(e.target.files);
              }}
            />
            <label for="image">Upload model (Support .gltf)</label>
            <br />
            <br />
            <button type="button" className="btn btn-primary btn-block" id="btn-addon" style={{ backgroundColor: "darkgoldenrod", borderColor: "darkgoldenrod", marginRight: "5px", marginBottom: "5px" }} onClick={toggleAddon}>Add model component (เพิ่มส่วนประกอบโมเดล)</button>
            {chkAddon == true &&
              <>
                <input
                  required
                  class="form-control"
                  type="file"
                  accept=".gltf"
                  id="image"
                  style={{ marginTop: "10px", borderColor: "darkgoldenrod", borderWidth: "2px" }}
                  onChange={(e) => selectAddon(e.target.files)}
                />
                <label for="image">Upload model component (Support .gltf)</label>
              </>

            }
            <br />
            <br />
            <input
              required
              class="form-control"
              type="file"
              accept=".jpg,.png,.jpeg"
              id="image"
              style={{ marginTop: "10px" }}
              onChange={(e) => selectPreview(e.target.files)}
            />
            <label for="image">Upload preview model (Support .jpeg .jpg .png)</label>
            <br />
            <br />
            {Preview &&
            <>
              <u><label for="preview">This image will use as preview (ภาพนี้จะถูกใช้เป็นภาพตัวอย่างโมเดล)</label></u>
              <br />
              <img src={`data:image/jpg;base64,${preUpload[0]}`} id="preview" width="40%" height="40%" style={{marginTop: "10px"}}></img>
              <br />
            </>}
            <div className="right-align">
              <button type="submit" className="btn btn-primary btn-block" id="to-model" value="Reset" style={{ marginTop: "2vh" }}>Submit</button>
              <button type="reset" className="btn btn-primary btn-block" value="Reset" style={{ marginTop: "2vh", backgroundColor: "red", borderColor: "red", marginLeft: "10px" }} onClick={() => {
                resetAll("model");
              }}>Reset form</button>
            </div>
          </form>
          <button className="btn btn-primary btn-block" id="load-model" style={{ marginTop: "2vh", background: "green", borderColor: "green" }} onClick={() => {
            listAllData("listmodel")
          }}>Load model data</button>
        </div>}
      </div>
    </div>

  );
}



export default Edit;