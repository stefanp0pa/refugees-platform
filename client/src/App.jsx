import { createBrowserRouter, RouterProvider } from "react-router-dom";

import About from './pages/About/About';
import Info from './pages/Info/Info';
import Error from './pages/Error/Error';
import Register from './pages/Auth/Register/Register';
import Login from "./pages/Auth/login/Login";
import Requests from "./pages/Requests/Requests";
import RequestDetails from './pages/RequestDetails/RequestDetails';
import RequestForm from './pages/RequestForm/RequestForm';

import Navbar from './components/Navbar/Navbar';

import './App.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <About />,
    errorElement: <Error />,
  },
  {
    path: "register",
    element: <Register/>
  },
  {
    path: "login",
    element: <Login/>
  },
  {
    path: "info",
    element: <Info />,
  },
  {
    path: "requests",
    element: <Requests/>
  },
  {
    path: "request-details/:requestId",
    element: <RequestDetails/>
  },
  {
    path: 'request-form',
    element: <RequestForm/>
  }
]);

function App() {
  return (
    <div className="align-items-center justify-content-center set-font">
      <div className="w-100">
        <Navbar/>
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
