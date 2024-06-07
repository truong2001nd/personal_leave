import { createContext, useReducer, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import authReducer from "../reducers/authReducer.js";
import { apiUrl, LOCAL_STORAGE_TOKEN_NAME } from "./constants.js";
import setAuthToken from "../utils/setAuthToken";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, {
    authLoading: true, // trạng thái chưa login
    isAuthenticated: false, // chưa xác thực
    user: null, // chưa có thông tin tk
  });

  // Authenticate user
  const loadUser = async () => {
    try {
      if (localStorage[LOCAL_STORAGE_TOKEN_NAME] != null) {
        setAuthToken(localStorage[LOCAL_STORAGE_TOKEN_NAME]);
      }

      const response = await axios.get(`${apiUrl}/users/loadUser`);
      console.log("first", response.data);
      if (response.data.status === 200) {
        dispatch({
          type: "SET_AUTH",
          payload: { isAuthenticated: true, user: response.data.data },
        });
      } else {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
        setAuthToken(null);
        dispatch({
          type: "SET_AUTH",
          payload: { isAuthenticated: false, user: null },
        });
      }
    } catch (error) {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
      setAuthToken(null);
      dispatch({
        type: "SET_AUTH",
        payload: { isAuthenticated: false, user: null },
      });
    }
  };
  useEffect(() => {
    loadUser();
  }, []);
  // Login
  const loginUser = async (userForm) => {
    try {
      const response = await axios.post(`${apiUrl}/users/login`, userForm);

      if (response.data.status === 200) {
        localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data.token);
      } else {
        toast.error(response.data.message);
      }

      await loadUser();

      return response.data;
    } catch (error) {
      if (error.response.data) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    setAuthToken(null);
    await loadUser();
  };

  // context data
  const authContextData = { loginUser, authState, dispatch, logout };
  //return
  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
