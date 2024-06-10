import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";
import Loading from "../components/layout/Loading";
import config from "../config";
import Login from "../views/Login/Login";
import Home from "../views/Home/Home";
import DefaultLayout from "../layout/DefaultLayout";
import Account from "../views/Account/Account.js";
import ListRoom from "../views/Room/List.js";
import ListPosition from "../views/Position/List.js";
import ListPermissions from "../views/Permissions/List.js";

const RootRouter = () => {
  const {
    authState: { authLoading, isAuthenticated },
  } = useContext(AuthContext);

  let body = "";
  if (authLoading) {
    body = <Loading />;
  } else {
    if (isAuthenticated) {
      body = (
        <DefaultLayout>
          <Routes>
            <Route exact path={config.urls.home} element={<Home />} />
            <Route exact path={config.urls.account} element={<Account />} />
            <Route exact path={config.urls.room} element={<ListRoom />} />
            <Route
              exact
              path={config.urls.position}
              element={<ListPosition />}
            />
            <Route
              exact
              path={config.urls.permission}
              element={<ListPermissions />}
            />
            <Route
              exact
              path="*"
              element={<Navigate to={config.urls.home} />}
            />
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
