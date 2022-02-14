import React, {Component} from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Footer from './components/footer/footer';
import Navbar from './components/navbar/navbar';
import Home from './pages/Home/home';
import ThreeD from './pages/threeD';
import Catalog from './pages/Catalog/catalog'
import Contact from './pages/Contact/contact';
import ScrollToTop from './scrolltop'

class App extends Component{
  constructor(props){
    super(props);
  }
  
  render(){
    return(
      <Router>
      <div className="App">
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/3d" element={<ThreeD />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </Router>
    )
  }
}
export default App
