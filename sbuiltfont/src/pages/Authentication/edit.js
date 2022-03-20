import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './edit.css';

const Edit = () => {

  const [item, setItem] = useState({ name: '', detail: '', dimension: '', price: '', place: '', image: [], full64: [], AllPost: [], AllModel: [], model: false });
  const [items, setItems] = useState([]);
  const [display, setDisplay] = useState("catalog");
  const [allModel, setallModel] = useState([]);

  const url = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

  // const listDataModel = (e) => {
  //   e.preventDefault();

  //   // axios.defaults.withCredentials = true;
  //   // const urldata = url+"/listmodel";
  //   // axios.get(urldata)
  //   //   .then((res) => {
  //   //     let response = res.data;
  //   //     setItem({ ...item, AllModel: response });
  //   //     console.log(response);
  //   //     console.log("Data has been received");
  //   //   })
  //   //   .catch((err) => {
  //   //     alert(err.response.data.msg);
  //   //     console.log("Error: either server or database is down!");
  //   //   })

  // }

  const listAllModel = (type) => {
    console.log("hello");
    axios.defaults.withCredentials = true;
    const urldata = url + "/" + type;
    axios.get(urldata)
      .then((res) => {
        let response = res.data;
        setallModel([...response]);
        console.log(response);
        console.log("Data has been received");
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.msg);
        console.log("Error: either server or database is down!");
      })
  }

  const listDataCatalog = (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    const urldata = url + "/listcatalog";
    axios.get(urldata)
      .then((res) => {
        let response = res.data;
        setItem({ ...item, AllPost: response });
        console.log(response);
        console.log("Data has been received");
      })
      .catch((err) => {
        alert(err.response.data.msg);
        console.log("Error: either server or database is down!");
      })
  }

  const displayCatalog = (AllPost) => {
    if (!AllPost.length) {
      return null;
    }

    return AllPost.map((post, index) => (
      <div key={index} style={{ marginTop: "10px" }}>
        <h5>{post.title} &nbsp; {post.about} &nbsp; {post.place}</h5>
        <img src={post.pathimg}></img>
      </div>
    ));
  };

  const displayModel = (AllModel) => {
    if (!AllModel.length) {
      return null;
    }

    return AllModel.map((post, index) => (
      <div key={index} style={{ marginTop: "10px" }}>
        <h5>{post.title} &nbsp; {post.about} &nbsp; {post.dimension}</h5>
        <img src={post.pathimg}></img>
      </div>
    ));
  };

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

  const getItems = async () => {
    try {
      const { data } = await axios.get(url + "/edit");
      return data
    } catch (error) {
      console.log(error);
      console.log(url + "/edit");
      alert("Failed: client and server are out of sync!");
    }
  }

  const createItem = async (todo) => {
    try {
      const { data } = await axios.post(url + "/edit", todo);
      alert("Complete: data has been uploaded!");
      console.log(data);
      return data
    } catch (error) {
      console.log(error);
      alert("Failed: client and server are out of sync!");
    }
  }

  const onSubmitModel = async (e) => {
    e.preventDefault();
    // const result = await createItem(item);
    // setItems([...items, result]);
    // window.location.reload(false);
  }

  const onSubmitCatalog = async (e) => {
    e.preventDefault();
    // const result = await createItem(item);
    // setItems([...items, result]);
    // window.location.reload(false);
  }

  const toggleCatalog = () => {
    // var x = document.getElementById("catalog");
    // if (x.style.display !== "none") {
    //   x.style.display = "none";
    // } else {
    //   x.style.display = "block";
    // }
    if (display !== "catalog") {
      listAllModel("listcatalog");
      setDisplay("catalog");
    }

  }

  const toggleModel = () => {
    // var x = document.getElementById("model");
    // if (x.style.display !== "none") {
    //   x.style.display = "none";
    // } else {
    //   x.style.display = "block";
    // }
    if (display !== "model") {
      listAllModel("listmodel");
      setDisplay("model");
    }

  }

  useEffect(() => {
    // const fetchData = async () => {
    //   const result = await getItems();
    //   console.log('fetch data;m', result)
    //   setItems(result);
    // }

    // fetchData();
    // listDataCatalog();
    // listDataModel();
    listAllModel("listcatalog");
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
          <form action="" onSubmit={onSubmitCatalog}>
            <u><h5>All post in catalog (รายการทั้งหมดของ catalog)</h5></u>
            <div>
              {allModel ? allModel.map((model, index) => {
                return (
                  <div>{model.title}</div>)
              }) : null}
            </div>
            <u><h5>To catalog (เพิ่มแคตตาล้อก)</h5></u>
            <label for="name">&nbsp; Name (ชื่อผลงาน)</label>
            <br />

            <input required type="text" id="name" className="form-control" placeholder="Enter name" style={{ borderColor: "black", borderRadius: "5px" }}

              onChange={e => setItem({ ...item, name: e.target.value })}
            />
            <br />
            <label for="detail">&nbsp; Enter detail (รายละเอียด)</label>
            <br />
            <input required type="text" id="detail" className="form-control" placeholder="Enter detail" style={{ borderColor: "black", borderRadius: "5px" }}

              onChange={e => setItem({ ...item, detail: e.target.value })}
            />
            <br />
            <label for="place">&nbsp; Place (สถานที่)</label>
            <br />
            <input required type="text" id="place" className="form-control" placeholder="Enter place" style={{ borderColor: "black", borderRadius: "5px" }}

              onChange={e => setItem({ ...item, place: e.target.value })}
            />
            <input
              required
              class="form-control"
              type="file"
              accept=".jpg,.png,.jpeg"
              id="image"
              style={{ marginTop: "10px" }}
              onChange={(e) => selectFiles(e.target.files)}
              multiple="multiple"
            />
            <label for="image">Support .jpeg .jpg .png</label>
            <br />
            <br />
            <div className="right-align">
              <button type="submit" className="btn btn-primary btn-block" id="to-catalog" style={{ marginTop: "2vh" }}>Submit</button>
              <button type="reset" className="btn btn-primary btn-block" value="Reset" style={{ marginTop: "2vh", backgroundColor: "red", borderColor: "red", marginLeft: "10px" }}>Reset form</button>

            </div>
          </form>
          <button className="btn btn-primary btn-block" id="load-model" style={{ marginTop: "2vh", background: "green", borderColor: "green" }} onClick={() => {
            listAllModel("listcatalog")
          }}>Load catalog data</button>



        </div>}
        {display == "model" && <div className="flex-child lightgreen" id="model" style={{ borderColor: "green" }}>
          <form action="" onSubmit={onSubmitModel}>
            <u><h5>To model (เพิ่มโมเดล)</h5></u>
            <label for="name">&nbsp; Name (ชื่อโมเดล)</label>
            <br />
            <input required type="text" id="name" className="form-control" placeholder="Enter name" style={{ borderColor: "black", borderRadius: "5px" }}

              onChange={e => {
                setItem({ ...item, name: e.target.value, model: true })

              }}
            />
            <br />
            <label for="detail">&nbsp; Enter detail (รายละเอียดโมเดล)</label>
            <br />
            <input required type="text" id="detail" className="form-control" placeholder="Enter detail" style={{ borderColor: "black", borderRadius: "5px" }}

              onChange={e => setItem({ ...item, detail: e.target.value })}
            />
            <br />
            <label for="price">&nbsp; Enter price (ราคา)</label>
            <br />
            <input required type="text" id="price" className="form-control" placeholder="Enter price" style={{ borderColor: "black", borderRadius: "5px" }}

              onChange={e => setItem({ ...item, price: e.target.value })}
            />
            <br />
            <label for="dimension">&nbsp; Dimension (ขนาด)</label>
            <br />
            <input required type="text" id="dimension" className="form-control" placeholder="Enter dimension" style={{ borderColor: "black", borderRadius: "5px" }}

              onChange={e => setItem({ ...item, dimension: e.target.value })}
            />
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
              multiple="multiple"
            />
            <label for="image">Upload model (Support .gltf)</label>
            <br />
            <br />
            <input
              required
              class="form-control"
              type="file"
              accept=".jpg,.png,.jpeg,.bmp"
              id="image"
              style={{ marginTop: "10px" }}
              onChange={(e) => selectFiles(e.target.files)}
            />
            <label for="image">Upload preview model (Support .jpg .png .jpeg .bmp)</label>
            <br />
            <br />
            <div className="right-align">
              <button type="submit" className="btn btn-primary btn-block" id="to-model" style={{ marginTop: "2vh" }}>Submit</button>
              <button type="reset" className="btn btn-primary btn-block" value="Reset" style={{ marginTop: "2vh", backgroundColor: "red", borderColor: "red", marginLeft: "10px" }}>Reset form</button>
            </div>
          </form>
          <button className="btn btn-primary btn-block" id="load-model" style={{ marginTop: "2vh", background: "green", borderColor: "green" }} onClick={() => {
            listAllModel("listmodel")
          }}>Load model data</button>
          <div>
            {allModel ? allModel.map((model, index) => {
              return (
                <div>{model.title}</div>)
            }) : null}
          </div>

        </div>}


      </div>
    </div>

  );
}



export default Edit;