import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';

import Home from './pages/Home/Home';
import Info from './pages/Info/Info';
import Error from './pages/Error/Error';

import './App.css';
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import Profile from "./Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: "info",
    element: <Info />,
  },
]);

function App() {
  // return (
  //   <div>
  //     <header>
  //       <LoginButton/>
  //       <LogoutButton/>
  //     </header>
  //     <Profile/>
  //   </div>
  // );

  return (
    <div>
      <header>
        <LoginButton/>
        <LogoutButton/>
      </header>
      <div className="align-items-center justify-content-center set-font">
        <div className="w-100">
          <RouterProvider router={router} />
        </div>
      </div>
    </div>
  );
}

export default App;
