import './index.css'
import Body from './Body'
import Login from './Login'
import Profil from './Profil'
import Feed from './Feed'
import { BrowserRouter } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './utils/AppStore'

function App() {

  return (
    <>
       <Provider store={store}>
       <BrowserRouter basename='/'>
        <Routes>
            <Route path="/" element={<Body/>} >
              <Route path="/" element={<Feed/>}></Route>
              <Route path="/login" element={<Login/>}></Route>
              <Route path="/profil" element={<Profil/>}></Route>
             </Route>
        </Routes>
       </BrowserRouter>
       </Provider>
    </>
  )
}

export default App
