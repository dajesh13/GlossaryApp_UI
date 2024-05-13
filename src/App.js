import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Glossary from './components/Glossary';
import Login from './components/Login';


function App() {
  return (
    <div className='App'>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/glossary' element={<Glossary/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );

}

export default App;
