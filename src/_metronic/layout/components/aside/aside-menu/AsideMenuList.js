/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import { ApiPostInce } from "../../../../../helpers/API/ApiData";
export function AsideMenuList({ layoutProps }) {
  const [accountData, setaccountData] = useState({});
  const [type, setType] = useState();
  const [open1, setOpen1] = useState(false);
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
      : "";
  };
  const handleonChange = (e) => {
    console.log(e);
    let { name, value } = e.target;
    if (name === "canShareWithDifferent") {
      accountData[name] = e.target.checked;
      setaccountData({ ...accountData });
    } else if (name === "canShareWithSame") {
      accountData[name] = e.target.checked;
      setaccountData({ ...accountData });
    } else if (name === "requestSignature") {
      accountData[name] = e.target.checked;
      setaccountData({ ...accountData });
    } else {
      setaccountData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const handleClickOpen1 = () => {
    console.log("jjjjjjjjj");
    setOpen1(true);
  };
  const submitfeed = () => {
    if (accountData.message) {
      console.log(accountData);
      const Id3 = JSON.parse(localStorage.getItem("token"));
      let body = {
        message: accountData.message,
      };
      ApiPostInce("feedBack", Id3, body)
        // ApiPost("get-user-details-by-id",data)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            console.log(res);
            alert(res.message);
            handleClose1();
          } else {
          }
        });
    } else {
      alert("please enter Message");
    }
  };
  const handleClose1 = () => {
    setOpen1(false);
  };
  const signout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  useEffect(() => {
    const Id = JSON.parse(localStorage.getItem("userinfo"));
    console.log();
    setType(Id?.role);
  }, []);
  console.log("type", 2);
  return (
    <>
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}
        <li
          className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/dashboard">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
            </span>
            <span className="menu-text">Dashboard</span>
          </NavLink>
        </li>
        <li
          className={`menu-item ${getMenuItemActive("/user", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/user">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
            </span>
            <span className="menu-text">User</span>
          </NavLink>
        </li>
        <li
          className={`menu-item ${getMenuItemActive("/category", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/category">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/General/User.svg")} />
            </span>
            <span className="menu-text">Animal</span>
          </NavLink>
        </li>
        <li
          className={`menu-item ${getMenuItemActive("/subCategory", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/subCategory">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/General/User.svg")} />
            </span>
            <span className="menu-text">Breed</span>
          </NavLink>
        </li>
        <li
          className={`menu-item ${getMenuItemActive("/color", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/color">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/General/User.svg")} />
            </span>
            <span className="menu-text">Color</span>
          </NavLink>
        </li>
        <li
          className={`menu-item ${getMenuItemActive("/blog", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/blog">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/General/User.svg")} />
            </span>
            <span className="menu-text">Blog</span>
          </NavLink>
        </li>
        <li
          className={`menu-item ${getMenuItemActive("/reminder", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/reminder">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl(
                  "/media/svg/icons/Communication/Mail-notification.svg"
                )}
              />
            </span>
            <span className="menu-text">Reminder</span>
          </NavLink>
        </li>
        <li
          className={`menu-item ${getMenuItemActive("/calender", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/calender">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl(
                  "/media/svg/icons/Communication/Clipboard-list.svg"
                )}
              />
            </span>
            <span className="menu-text">Calender</span>
          </NavLink>
        </li>
        <li
          className={`menu-item ${getMenuItemActive("/party", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/party">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Food/Sushi.svg")} />
            </span>
            <span className="menu-text">Party</span>
          </NavLink>
        </li>
        <li
          className={`menu-item ${getMenuItemActive("/discount", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/discount">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/sale1.svg")} />
            </span>
            <span className="menu-text">Discount</span>
          </NavLink>
        </li>

        {/* <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/error",
              true
            )}`}
            aria-haspopup="true"
            data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="/error">
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Earth.svg")} />
              </span>
              <span className="menu-text">Manage Categories</span>
              <i className="menu-arrow mt-2" />
            </NavLink>
            <div className="menu-submenu ">
              <i className="menu-arrow" />
              <ul className="menu-subnav">
                <li
                  className="menu-item  menu-item-parent"
                  aria-haspopup="true"
                >
                  <span className="menu-link">
                    <span className="menu-text">Manage Categories</span>
                  </span>
                </li>
                <li
                  className={`menu-item ${getMenuItemActive("/category_List")}`}
                  aria-haspopup="true"
                >
                  <NavLink className="menu-link" to="/category_List">
                    <i className="menu-bullet menu-bullet-dot">
                      <span />
                    </i>
                    <span className="menu-text"> Main Categories</span>
                  </NavLink>
                </li>
                <li
                  className={`menu-item ${getMenuItemActive(
                    "/subCategory_List"
                  )}`}
                  aria-haspopup="true"
                >
                  <NavLink className="menu-link" to="/subCategory_List">
                    <i className="menu-bullet menu-bullet-dot">
                      <span />
                    </i>
                    <span className="menu-text"> Sub Categories</span>
                  </NavLink>
                </li>
                <li
                  className={`menu-item ${getMenuItemActive("/software_List")}`}
                  aria-haspopup="true"
                >
                  <NavLink className="menu-link" to="/software_List">
                    <i className="menu-bullet menu-bullet-dot">
                      <span />
                    </i>
                    <span className="menu-text"> Software</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          </li> */}
        <li
          className={`menu-item ${getMenuItemActive("", false)}`}
          aria-haspopup="true"
        >
          <div className="menu-link" onClick={() => signout()}>
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Navigation/Sign-out.svg")}
              />
            </span>
            <span className="menu-text">Sign Out</span>
          </div>
        </li>
      </ul>
    </>
  );
}
