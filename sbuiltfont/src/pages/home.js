import React, {Component} from 'react'

class Home extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div>
                <div className='landing' style={{minHeight:'100vh',backgroundColor:'white'}}>
                    Home page
                </div>
                <div className='about-us'style={{minHeight:'100vh',backgroundColor:'whitesmoke'}}>
                    about us
                </div>
                <div className='catalog'style={{minHeight:'100vh'}}>
                    catalog
                </div>

            </div>
            
        )
    }
}
export default Home