import React, { useState, useEffect } from "react";
import { FaUniversity, FaBoxOpen, FaUserShield, FaFingerprint, FaSignOutAlt} from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";

const Navigation = () => {
  const [currentTab, setCurrentTab] = useState("");
  console.log(window.location.pathname);

  useEffect(() => {
    let location = window.location.pathname;
    location = location.replace("/" , "");
    setCurrentTab(location);
  }, []);

  const navigationTabs = [
    <SidebarIcon
      icon={<FaUniversity size="40" />}
      text="Home"
      key="home_tab"
      focus={currentTab === "Home"}
      changeTab={setCurrentTab}
    />,
    <SidebarIcon
      icon={<FaBoxOpen size="40" />}
      text="LostAndFound"
      key="lostandfound_tab"
      focus={currentTab === "LostAndFound"}
      changeTab={setCurrentTab}
    />,
    <SidebarIcon
      icon={<FaUserShield size="40" />}
      text="Admin"
      key="admin_tab"
      focus={currentTab === "Admin"}
      changeTab={setCurrentTab}
    />,
    <SidebarIcon
      icon={<FaFingerprint size="40" />}
      text="Login"
      key="login_tab"
      focus={currentTab === "Login"}
      changeTab={setCurrentTab}
    />,
    <SidebarIcon
      icon={<FaSignOutAlt size="40" />}
      text="Logout"
      key="logout_tab"
      last={true}
      changeTab={() => {
        // eslint-disable-next-line no-restricted-globals
        const deleteData = confirm(
          "Are you sure you want to delete your record?"
        );
        if (deleteData) {
          localStorage.clear();
          window.location.reload();
        }
      }}
    />,
  ];

  return (
    <div className="nav-container" data-testid="navigation-container">
      <div>
        <img
          className="w-full text-white h-24 p-3 mb-5"
          src={Logo}
          alt="University Logo"
        />
      </div>
      {navigationTabs.map((component) => component)}
    </div>
  );
};

function SidebarIcon({
  icon,
  text = "tooltip",
  focus = false,
  changeTab,
  last = false,
}) {
  return (
    <Link to={text} className={`${last && "mt-auto mb-10"}`}>
      <div
        className={`sidebar-icon group ${focus && "selected-nav"} ${
          last && "text-red-600 hover:bg-red-600 hover:text-black"
        }`}
        onClick={() => changeTab(text)}
      >
        {icon}
        <span className="sidebar-tooltip">{text}</span>
      </div>
    </Link>
  );
}

export default Navigation;
