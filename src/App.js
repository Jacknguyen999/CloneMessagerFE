

import { Routes ,Route } from 'react-router-dom';
import Homepage from './Components/Homepage';

function App() {
  return (
    <div className="">
      
      <Routes>
      
        <Route path='/' element={<Homepage />} />
      

      </Routes>

    </div>
  );
}

export default App;
