import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Home from './pages/Home/Home';
import Info from './pages/Info/Info';
import Error from './pages/Error/Error';

import './App.css';

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
  return (
    <div className="align-items-center justify-content-center set-font">
      <div className="w-100">
        <RouterProvider router={router} />
      </div>
    </div>
  );

  // return (
  //   <Router>
  //     <Switch>
  //       <Route path="/" exact component={Home} />
  //       <Route path="/info" component={Info} />
  //       <Route path="*" component={NotFound} />
  //     </Switch>
  //   </Router>
  // );
}

export default App;
