import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";
import Loading from "../components/layout/Loading";
import config from "../config";
import Login from "../views/Login/Login";
import Home from "../views/Home/Home";
import DefaultLayout from "../layout/DefaultLayout";

const RootRouter = () => {
  const {
    authState: { authLoading, isAuthenticated },
  } = useContext(AuthContext);

  console.log("authLoading", authLoading);
  console.log("isAuthenticated", isAuthenticated);

  let body = "";
  if (authLoading) {
    body = <Loading />;
  } else {
    if (isAuthenticated) {
      body = (
        <DefaultLayout>
          <Routes>
            <Route path={config.urls.home} element={<Home />} />
          </Routes>
        </DefaultLayout>
      );
    } else {
      body = (
        <DefaultLayout showHeader={false}>
          <Routes>
            <Route path={config.urls.login} element={<Login />} />
            <Route path="*" element={<Navigate to={config.urls.login} />} />
          </Routes>
        </DefaultLayout>
      );
    }
  }

  return body;
};

export default RootRouter;
