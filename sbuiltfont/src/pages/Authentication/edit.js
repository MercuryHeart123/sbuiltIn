import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './edit.css';

const Edit = () => {

  const [item, setItem] = useState({ name: '', detail: '', dimension: '', price: '', place: '', image: [], full64: [], AllPost: [], AllModel: [], model: false });
  // const [items, setItems] = useState([]);
  const [display, setDisplay] = useState("catalog");
  const [allData, setallData] = useState([]);

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

  // const displayCatalog = (AllPost) => {
  //   if (!AllPost.length) {
  //     return null;
  //   }

  //   return AllPost.map((post, index) => (
  //     <div key={index} style={{ marginTop: "10px" }}>
  //       <h5>{post.title} &nbsp; {post.about} &nbsp; {post.place}</h5>
  //       <img src={post.pathimg}></img>
  //     </div>
  //   ));
  // };

  // const displayModel = (AllModel) => {
  //   if (!AllModel.length) {
  //     return null;
  //   }

  //   return AllModel.map((post, index) => (
  //     <div key={index} style={{ marginTop: "10px" }}>
  //       <h5>{post.title} &nbsp; {post.about} &nbsp; {post.dimension}</h5>
  //       <img src={post.pathimg}></img>
  //     </div>
  //   ));
  // };

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

  // const getItems = async () => {
  //   try {
  //     const { data } = await axios.get(url + "/edit");
  //     return data
  //   } catch (error) {
  //     console.log(error);
  //     console.log(url + "/edit");
      
  //   }
  // }

  // const createItem = async (todo) => {
  //   try {
  //     const { data } = await axios.post(url + "/edit", todo);
  //     alert("Complete: data has been uploaded!");
  //     console.log(data);
  //     return data
  //   } catch (error) {
  //     console.log(error);
  //     alert("Failed: client and server are out of sync!");
  //   }
  // }

  // const onSubmitModel = async (e) => {
  //   e.preventDefault();
  //   let namemodel = e.target.namemodel.value;
  //   let detailmodel = e.target.detailmodel.value;
  //   let pricemodel = e.target.pricemodel.value;
  //   let dimensionmodel = e.target.dimensionmodel.value;
  //   setItem({ ...item, name: namemodel, detail: detailmodel, price: pricemodel, dimension: dimensionmodel });
  //   const result = await createItem(item);
  //   setItems([...items, result]);
  //   listAllData("listmodel");
  // }

  // const onSubmitCatalog = async (e) => {
  //   e.preventDefault();
  //   let namecat = e.target.namecat.value;
  //   let detailcat = e.target.detailcat.value;
  //   let placecat = e.target.placecat.value;
  //   console.log("1" + namecat);
  //   console.log("2" + detailcat);
  //   console.log("3" + placecat);
  //   setItem({ ...item, name: namecat, detail: detailcat, place: placecat });
  //   const result = await createItem(item);
  //   setItems([...items, result]);
  //   listAllData("listcatalog");
  // }

  const onSubmitHandler = async (type, e) => {
    e.preventDefault();
    console.log(type);
    const urldata = url + "/" + type;
    if (type == "editmodel") {
      let namemodel = e.target.namemodel.value;
      let detailmodel = e.target.detailmodel.value;
      let pricemodel = e.target.pricemodel.value;
      let dimensionmodel = e.target.dimensionmodel.value;
      let image = item.image;
      const formData = { namemodel, detailmodel, pricemodel, dimensionmodel, image };
      axios.post(urldata, formData)
      .then(() => {
        alert("Complete: data has been uploaded!");
        listAllData("listmodel");
    })
      .catch((err) => {
          alert("Failed: client and server are out of sync!");
          console.log(err.response.data.msg);
      });
    } else if (type == "editcatalog") {
      let namecat = e.target.namecat.value;
      let detailcat = e.target.detailcat.value;
      let placecat = e.target.placecat.value;
      let image = item.image;
      // setItem({ ...item, name: namecat, detail: detailcat, place: placecat });
      const formData = { namecat, detailcat, placecat, image };
      axios.post(urldata, formData)
      .then(() => {
          alert("Complete: data has been uploaded!");
          listAllData("listcatalog");
      })
      .catch((err) => {
          alert("Failed: client and server are out of sync!");
          console.log(err.response.data.msg);
      });
      // const result = await createItem(item);
      // setItems([...items, result]);
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
          <form action="" onSubmit={(e) => {onSubmitHandler("editcatalog", e)}}>
            <u><h5>All post in catalog (รายการทั้งหมดของ catalog)</h5></u>
            <div>
              {allData ? allData.map((model, index) => {
                return (
                  <div>{model.title}</div>)
              }) : null}
            </div>
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
              class="form-control"
              type="file"
              accept=".jpg,.png,.jpeg"
              id="image"
              style={{ marginTop: "10px" }}
              onChange={(e) => selectFiles(e.target.files)}
              multiple="multiple"
            />
            <label for="image">Upload catalog content (Support .jpeg .jpg .png)</label>
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
            <label for="image">Upload preview catalog (Support .jpg .png .jpeg .bmp)</label>
            <div className="right-align">
              <button type="submit" className="btn btn-primary btn-block" id="to-catalog" style={{ marginTop: "2vh" }}>Submit</button>
              <button type="reset" className="btn btn-primary btn-block" value="Reset" style={{ marginTop: "2vh", backgroundColor: "red", borderColor: "red", marginLeft: "10px" }} onClick={() => {
            setItem({ ...item, name: '', detail: '', dimension: '', price: '', place: '', image: [], full64: [], AllPost: [], AllModel: [], model: false})}}>Reset form</button>
            </div>
          </form>
          <button className="btn btn-primary btn-block" id="load-model" style={{ marginTop: "2vh", background: "green", borderColor: "green" }} onClick={() => {
            listAllData("listcatalog")
          }}>Load catalog data</button>
        </div>}
        {display == "model" && <div className="flex-child lightgreen" id="model" style={{ borderColor: "green" }}>
          <form action="" onSubmit={(e) => {onSubmitHandler("editmodel", e)}}>
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
            <input required type="text" id="price-model" name="pricemodel" className="form-control" placeholder="Enter price" style={{ borderColor: "black", borderRadius: "5px" }} />
            <br />
            <label for="dimension">&nbsp; Dimension (ขนาด)</label>
            <br />
            <input required type="text" id="dimension-model" name="dimensionmodel" className="form-control" placeholder="Enter dimension" style={{ borderColor: "black", borderRadius: "5px" }} />
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
              <button type="reset" className="btn btn-primary btn-block" value="Reset" style={{ marginTop: "2vh", backgroundColor: "red", borderColor: "red", marginLeft: "10px" }} onClick={() => {
            setItem({ ...item, name: '', detail: '', dimension: '', price: '', place: '', image: [], full64: [], AllPost: [], AllModel: [], model: false})}}>Reset form</button>
            </div>
          </form>
          <button className="btn btn-primary btn-block" id="load-model" style={{ marginTop: "2vh", background: "green", borderColor: "green" }} onClick={() => {
            listAllData("listmodel")
          }}>Load model data</button>
          <div>
            {allData ? allData.map((model, index) => {
              return (
                <div>
                  <a href={`${url}/${model.title}`}>{model.title} {model.dateModified}</a>
                  <br />
                  {console.log(model.dateModified)}
                </div>)
            }) : null}
          </div>
        </div>}
      </div>
    </div>

  );
}



export default Edit;