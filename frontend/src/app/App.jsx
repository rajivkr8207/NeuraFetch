import { BrowserRouter } from 'react-router-dom'
import store from './store'
import { Provider } from 'react-redux'
import Navbar from '../components/common/Navbar'
import AppRoutes from './app.route'
 import { ToastContainer } from 'react-toastify';
const App = () => {
  return (
    <Provider store={store}>
       <BrowserRouter>
      <Navbar />
      <AppRoutes />

      <ToastContainer />
    </BrowserRouter>
    </Provider>
  )
}

export default App