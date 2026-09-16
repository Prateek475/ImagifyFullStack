import './App.css'
import { Route,Routes } from 'react-router-dom'
//now with the help of this we will display diff routing path and on diff routing paths we will display different pages..
import Home from './pages/Home'
import Result from './pages/Result'
import BuyCredit from './pages/BuyCredit'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Login from './Components/Login'
import { useContext } from 'react';
import { AppContext } from './context/AppContext'
function App() {

  const {showLogin} = useContext(AppContext);
  return (
    <div className='px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-linear-to-b from-teal-50 to-orange-50'>
      <Navbar/>
      {showLogin && <Login/>}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/result' element={<Result/>}/>
        <Route path='/buy' element={<BuyCredit/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
