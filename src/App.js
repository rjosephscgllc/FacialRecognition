import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

import './App.css';


const particlesOptions = {
  
  particles: {
    number: {
      value: 30,
      density: {
               enable: true,
        value_area: 800
      }
    }
  }
}
 
 const initialState = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
       name: '',
       email: '',
       entries: 0,
       joined: ''
      }  
 }  

class App extends Component {
  constructor(){
    super();
    this.state = initialState;
    }
  //for testing connection to the server 
  //componentDidMount(){
  //   fetch('http://localhost:3000')
  //   .then(response=>response.json())
  //   .then(console.log)
  // }
  loadUser = (data) => {
    this.setState({user : {
        id: data.id,
       name: data.name,
       email: data.email,
       entries: data.entries,
       joined: data.joined
    }})
  }
  calculateFaceLocation = (data) => {
     const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
     const image = document.getElementById('inputImage');
     // console.log('image',image);
     const width = Number(image.width);
     const height = Number(image.height);
     // console.log('width',width);
     // console.log('height',height);
     return {
         leftCol: clarifaiFace.left_col * width,
         topRow: clarifaiFace.top_row * height,
         rightCol: width - (clarifaiFace.right_col * width),
         bottomRow: height - (clarifaiFace.bottom_row * height)
     }
  }
  displayFaceBox = (box) => {
    // console.log('box',box);
    this.setState({box:box})
  }
  onInputChange = (event) => {
    this.setState({input:event.target.value})
  }
  onRouteChange = (route) => {

   if(route === 'signout'){
     this.setState(initialState)
   }else if(route === 'home'){
     this.setState({isSignedIn:true})
   }
    this.setState({route:route})
      
  }

  onButtonSubmit = () => {
    this.setState({imageUrl:this.state.input})
  //  console.log('Click!')
   /* this.setState((state)=>{
           console.log('input',this.state.input)
           return {imageUrl:this.state.input};
         });*/

    //758735ed87d846f481a42c9f0dcffc45
    // console.log('imageUrl',this.state.imageUrl) 
    // console.log('imageUrlinput',this.state.input) 
    
    fetch('http://localhost:3000/imageurl',{
               method:'post',
               headers: {'Content-Type':'application/json'},
               body: JSON.stringify({
                     input:this.state.input
             })})
      .then(response=>response.json()) 
       .then(response=> {
      if(response && this.state.input.length){
        fetch('http://localhost:3000/image',{
               method:'put',
               headers: {'Content-Type':'application/json'},
               body: JSON.stringify({
                     id:this.state.user.id
             })
    })
     .then(response=>response.json())
     .then(count=>{
      this.setState(Object.assign(this.state.user,{entries: count}))
      })
     .catch(console.log)   
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })  
    .catch(err=>console.log(err))   
  //  app.models.predict(Clarifai.FACE_DETECT_MODEL,this.state.imageUrl).then(  
  }
  render(){
    const { isSignedIn, box, imageUrl, route} = this.state;
  return (
    <div className="App">
       <Particles className='particles' 
              params={particlesOptions}
       />        
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      {route === 'home' 
      ?   
       <div>
          <Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries}/>
          <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecognition box={box} imageUrl={imageUrl}/> 
        </div>
        :(
          route === 'signin'
        ?
        <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        :
        <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        ) 
        } 
    </div>
  );
}
}
export default App;
