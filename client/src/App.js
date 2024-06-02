import { ToastContainer } from "react-toastify";

import "./App.css";
import AuthContextProvider from "./contexts/AuthContext.js";
import RootRouter from "./router/RootRouter.jsx";

function App() {
  return (
    <AuthContextProvider>
      <RootRouter />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthContextProvider>
  );
}

export default App;
