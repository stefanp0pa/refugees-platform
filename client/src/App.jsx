import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from './pages/Home/Home';
import Info from './pages/Info/Info';
import Error from './pages/Error/Error';
import Register from './pages/Auth/Register/Register';
import Login from "./pages/Auth/login/Login";

import Navbar from './components/Navbar/Navbar';

import './App.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
