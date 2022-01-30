import React, {Component} from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Footer from './components/footer/footer';
import Navbar from './components/navbar/navbar';
import Home from './pages/home';
import ThreeD from './pages/threeD';

class App extends Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <Router>
      <div className="App">
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/3d" element={<ThreeD />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
    )
  }
}
export default App
