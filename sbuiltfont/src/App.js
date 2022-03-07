import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Footer from './components/footer/footer';
import Navbar from './components/navbar/navbar';
import Home from './pages/Home/home';
import ThreeD from './pages/3D/threeD';
import Catalog from './pages/Catalog/catalog'
import Contact from './pages/Contact/contact';
import ScrollToTop from './scrolltop'
import Login from './pages/Authentication/login';
import axios from "axios";
import { connect } from "react-redux";

import Edit from './pages/Authentication/edit';
import { PrivateRoute } from './pages/Authentication/private';


const App = (props) => {

  useEffect(
    async () => {
      axios.defaults.withCredentials = true;
      axios
        .get(`${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/login`)
        .then((response) => {
          if (response.data.loggedIn == true) {
            props.dispatch({
              type: "login",
              data: response.data.username,
            });
          }
        });

    }, [])

  return (
    <Router>
      <div className="App">
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/edit"
            element={<PrivateRoute username={props.username} />}
          >
            <Route path="/edit" element={<Edit />} />
          </Route>
          <Route path="/3d" element={<ThreeD />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

const mapStateToProps = (state) => {
  return {
    username: state.username,
  };
};
export default connect(mapStateToProps)(App);