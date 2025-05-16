import { useState } from 'react';
import { BrowserRouter,Route,Router,Routes} from 'react-router-dom';

import Navbar from './components/Navbar/Navabar';
import Home from './components/Home/Home';
import Preview from './components/Preview/Preview';
import Footer from './components/Footer/Footer';
import Sell from './components/Sell/Sell';
// import Profile from './components/Profile/Profile';
import Liked from './components/Liked/Liked';

import Car from './components/Post/Car';
// import Bike from './components/Post/Bike';
// import Laptop from './components/Post/Laptop';
// import Camera from './components/Post/Camera';
// import Mobile from './components/Post/Mobile';

// import LoginButton from './components/Auth/Login/Login';
// import LogoutButton from './components/Auth/Logout/Logout';
// import Profile from './components/Auth/Profile/Profile';

import { SearchProvider } from './components/context/search/Search';
import { LikeProvider } from './components/context/like/Like';
import { like } from '../../Server/Controller/data_controller';



function App() {
  return (
    <SearchProvider> 
      <LikeProvider>
    <>  
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path='/' Component={Home}/>
        <Route path='/like' Component={Liked}/>
        <Route path='/sell' Component={Sell}/>
        <Route path='/post/car' Component={Car}/>
        <Route path='/preview' Component={Preview}/>
        <Route path='/like' Component={like}/>
        {/* <Route path='/post/bike' Component={Bike}/> */}
        {/* <Route path='/post/laptop' Component={Laptop}/> */}
        {/* <Route path='/post/camera' Component={Camera}/> */}
        {/* <Route path='/post/mobile' Component={Mobile}/> */}

      </Routes>
      <Footer/>
    </BrowserRouter>
    
        {/* <LoginButton/> */}
        {/* <Profile/> */}
        {/* <LogoutButton/> */}
    
        {/* <Sell/> */}
        {/* <Home/> */}
        {/* <Post/> */}
        {/* <Profile/> */}
    
    </>
    </LikeProvider>
    </SearchProvider>
  )
}

export default App
















// import { Routes, Route } from 'react-router-dom';
// import { SearchProvider } from './SearchContext';
// import Navbar from './components/Navbar';
// import Home from './components/Home';

// function App() {
//   return (
//     <SearchProvider>
//       <div>
//         <Navbar />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/sell" element={<div>Sell Page</div>} />
//         </Routes>
//       </div>
//     </SearchProvider>
//   );
// }

// export default App;
