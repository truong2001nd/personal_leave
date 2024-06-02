import LoginForm from "../components/auth/LoginForm";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

const Auth = ({ authRoute }) => {
  const {
    authState: { authLoading, isAuthenticated },
  } = useContext(AuthContext);

  console.log(authLoading, isAuthenticated);
  let body;
  if (authLoading)
    body = <div className="d-flex justify-content-center mt-2"></div>;
  if (isAuthenticated) {
    return <Navigate to="/home" />;
  } else {
    body = <>{authRoute === "login" && <LoginForm />}</>;
  }

  return (
    <div className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">{body}</div>
      </div>
    </div>
  );
};

export default Auth;
