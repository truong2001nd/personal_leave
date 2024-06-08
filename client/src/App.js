import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "./assets/style/global.css";
import AuthContextProvider from "./contexts/AuthContext.js";
import RootRouter from "./router/RootRouter.jsx";

function App() {
  return (
    <div className="App-container">
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
    </div>
  );
}

export default App;
