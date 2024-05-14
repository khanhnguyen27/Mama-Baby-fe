import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import { Route, Routes } from 'react-router-dom';
import SignIn from './components/general/SignIn';
import Introduction from './components/general/Introduction';
import Promotion from './components/general/Promotion';
import SignUp from './components/general/SignUp';
import HomePage from './components/general/HomePage';

function App() {
  return (
    <div className="App">
      <Navigation/>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/introduction' element={<Introduction />} />
        <Route path='/promotion' element={<Promotion />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
