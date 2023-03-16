import React, { Suspense } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { DashboardPage } from "./Dashboard/DashboardPage";
import Reminder from "./pages/Reminder/Reminder";
import Calender from "./pages/Calender/Calender";
import Party from "./pages/Party/Party";
// import User from "./pages/User/User";
import Discount from "./pages/Discount/Discount";
import Category from "./pages/Category/Category";
import SubCategory from "./pages/SubCategory/SubCategory";
import Color from "./pages/color/AddColor";
import AddColor from "./pages/color/AddColor";
import Blog from "./pages/Blog/Blog";
import User from "./pages/User/User";
export default function BasePage() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/dashboard" />
        }
        <ContentRoute path="/dashboard" component={DashboardPage} />
        <ContentRoute path="/user" component={User} />
        <ContentRoute path="/category" component={Category} />
        <ContentRoute path="/subCategory" component={SubCategory} />
        <ContentRoute path="/color" component={AddColor} />
        <ContentRoute path="/blog" component={Blog} />
        <ContentRoute path="/calender" component={Calender} />
        <ContentRoute path="/party" component={Party} />
        <ContentRoute path="/discount" component={Discount} />

        <Redirect to="error/error-v1" />
      </Switch>
    </Suspense>
  );
}
