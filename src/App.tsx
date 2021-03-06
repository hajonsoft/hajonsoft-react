import { ThemeProvider } from "@material-ui/core";
import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import createSagaMiddleware from "redux-saga";
import Customers from "./features/customer";
import Dashboard from "./features/Dashboard";
import CustomerHome from "./features/Home/CustomerHome";
import Home from "./features/Home/Home";
import Profile from "./features/Profile";
import Register from "./features/Register/Register";
import ForgotPassword from "./features/SignIn/ForgotPassword";
import PrivateRoute from "./features/SignIn/PrivateRoute";
import PublicRoute from "./features/SignIn/PublicRoute";
import SignIn from "./features/SignIn/SignIn";
import SignOut from "./features/SignIn/SignOut";
import OnlinePackages from "./features/onlinePackage";
import HajjPackagesContainer from "./features/onlinePackage/components/HajjPackagesContainer";
import UmrahPackagesContainer from "./features/onlinePackage/components/UmrahPackagesContainer";
import TourPackagesContainer from "./features/onlinePackage/components/TourPackagesContainer";
import PackageDetailCardM3li from "./features/onlinePackage/components/PackageDetailCardM3li";
import reducer from "./redux/reducer";
import sagas from "./redux/saga";
import defaultTheme from "./theme/default";
import Reserve from "./features/onlinePackage/components/Reserve";
import Favorite from './features/favorite';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});
sagaMiddleware.run(sagas);

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Router>
        <Provider store={store}>
          <PublicRoute exact path="/">
            <CustomerHome />
          </PublicRoute>
          <PublicRoute exact path="/admin">
            <Home />
          </PublicRoute>
          <PublicRoute path="/register">
            <Register />
          </PublicRoute>
          <PublicRoute path="/login">
            <SignIn />
          </PublicRoute>
          <PublicRoute path="/forgot-password">
            <ForgotPassword />
          </PublicRoute>
          <PublicRoute path="/logout">
            <SignOut />
          </PublicRoute>
          <PublicRoute path="/reserve/:packageName">
            <Reserve />
          </PublicRoute>
          <PublicRoute exact path="/hajj-packages">
            <HajjPackagesContainer />
          </PublicRoute>
          <PublicRoute exact path="/umrah-packages">
            <UmrahPackagesContainer />
          </PublicRoute>
          <PublicRoute exact path="/tours">
            <TourPackagesContainer />
          </PublicRoute>
          <PublicRoute exact path="/package/detail/:packageName">
            <PackageDetailCardM3li />
          </PublicRoute>
          <PrivateRoute path="/groups">
            <Dashboard />
          </PrivateRoute>
          <PrivateRoute path="/online">
            <OnlinePackages />
          </PrivateRoute>
          <PrivateRoute path="/profile">
            <Profile />
          </PrivateRoute>
          <PrivateRoute path="/:packageName/customers">
            <Customers />
          </PrivateRoute>
          <PrivateRoute path="/favorite">
            <Favorite />
          </PrivateRoute>
        </Provider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
