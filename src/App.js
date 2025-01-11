
import { Routes ,Route } from 'react-router-dom';
import Homepage from './Components/Homepage';
import Status from './Components/Status/Status';
import SignUp from './Components/UserAccount/SignUp';
import SignIn from './Components/UserAccount/SignIn';



function App() {
  return (
    <div className="">
      
      <Routes>
      
        <Route path='/' element={<Homepage />}/>
        <Route path='/status' element={<Status />}/>
        <Route path='/signup' element={<SignUp />}/>
        <Route path='/signin' element={<SignIn />}/>
      </Routes>

    </div>
  );
}

export default App;
