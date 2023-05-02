import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import CardWrapper from "../../components/Card/CardWrapper";
import MuiDrawer from "../../components/Navbar/SideNav/Drawer";
import DrawList from "../../components/Navbar/SideNav/DrawerList";
import Navbar from "../../components/Navbar/TopNav/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
const NavMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [timer, setTimer] = useState(900);
  // ! Auto Logout
  useEffect(() => {
    const myInterval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      }
    }, 1000);
    const resetTimeout = () => {
      setTimer(900);
    };
    const events = [
      "load",
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress",
    ];
    for (let i in events) {
      window.addEventListener(events[i], resetTimeout);
    }
    return () => {
      clearInterval(myInterval);
      for (let i in events) {
        window.removeEventListener(events[i], resetTimeout);
      }
    };
  }, [timer]);

  if (timer === 0) {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  }

  return (
    <Stack direction={"row"}>
      <Navbar setIsOpen={setIsOpen} />
      <MuiDrawer style={{ zIndex: 100 }} isOpen={isOpen}>
        <DrawList setIsOpen={setIsOpen} />
      </MuiDrawer>
      <CardWrapper>{<Outlet />}</CardWrapper>
    </Stack>
  );
};

export default NavMenu;
