import React from "react";
import { BrowserRouter,Route, Routes} from 'react-router-dom'
import Signup from './Component/Signup/Signup'
import SignIn from "./Component/SignIn/SignIn";
import Chat from "./Component/Chat/Chat";
import Geo from "./Component/Geo/Geo"

function App() {
  return (
    <>
    
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<SignIn/>}/>
              <Route path="/signup" element={<Signup/>}/>
              <Route path="/signin" element={<SignIn/>}/>
              <Route path="/chat" element={<Chat/>}/>
              <Route path="/geo" element={<Geo/>}/>
          </Routes>
          </BrowserRouter>

    </>
    );
}

export default App;
