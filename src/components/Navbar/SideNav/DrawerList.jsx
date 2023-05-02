// Drawer_Left_NavBar_Component
import { Avatar, Typography } from "@mui/material";
import profile_pic from "../../../assets/user.png";
import { useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
// ! Re_usable Component
import CollapsableNav from "./CollapsableNav";
import DvrIcon from "@mui/icons-material/Dvr";
import Link from "../../Common/Link";
import { PATHS } from "../../../utils/constants";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
// import FlakyOutlinedIcon from "@mui/icons-material/FlakyOutlined";
import DevicesIcon from "@mui/icons-material/Devices";
import DatasetIcon from "@mui/icons-material/Dataset";

import axios from "../../../api/axios";

import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import useLocalStorage from "../../../hooks/useLocalStorage";
const DrawList = ({ setIsOpen }) => {

  const roleName = ''
  // const { displayName, roleName, reportingRoleName, branchName,accessToken } = JSON.parse(
  //   sessionStorage.getItem("jwtWithDetails"))
  // const { identityNumber} = JSON.parse(
  //   sessionStorage.getItem("Details"),
  // );
  // const details = JSON.parse(sessionStorage.getItem("jwtWithDetails"));
  // const hasReportingRoleName =
  //   Object?.keys(details)?.includes("reportingRoleName");
  const location = useLocation();

  // ! NavItems
  const navItems = [
    {
      title: "Dashboard",
      link: PATHS.dashboard,
      icon: <DvrIcon />,
    },

   

    {
      title: "Enrollments",
      link: PATHS.enrollments.root,
      icon: <HowToRegOutlinedIcon />,
    },

    {
      title: "User Management",
      link: PATHS.userManagement.root,
      icon: <PersonAddAltRoundedIcon />,
      children: [
        {
          title: "Create User",
          link: PATHS.userManagement.createUser,
        },
      ],
    },
    // {
    //   title: "Configuration",
    //   link: PATHS.configuration.root,
    //   icon: <ManageAccountsOutlinedIcon />,
    // },

    
    // {
    //   title: "Metrics",
    //   link: PATHS.metric.root,
    //   icon: <InsertChartOutlinedIcon />,
    //   children: [
    //     {
    //       title: "Adjudication",
    //       link: PATHS.metric.adjudication,
    //     },
    //   ],
    // },
    // {
    //   title: "Datasets Reports",
    //   link: PATHS.datasets.registrations,
    //   icon: <DatasetIcon />,
    //   children: [
    //     {
    //       title: "Registrations",
    //       link: PATHS.datasets.registrations,
    //     },
    //     { title: "Users", link: PATHS.datasets.users },
    //     {
    //       title: "Audit Trails",
    //       link: PATHS.datasets.auditTrail,
    //     },
    //   ],
    // },
    // {
    //   title: "Device Management",
    //   link: PATHS.deviceManagement.root,
    //   icon: <DevicesIcon />,
    //   children: [
    //     {
    //       title: "Activate / DeActivate",
    //       link: PATHS.deviceManagement.deviceRequests,
    //     },
    //     {
    //       title: "Reports",
    //       link: PATHS.deviceManagement.deviceDetails,
    //     },
    //   ],
    // },

    
  ];

  const closeNavbar = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

 
  const [face,setFace] = useState()
  // useEffect(()=>{
  //   axios
  //   .get(`identity/${identityNumber}/profile`, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       authorization: `Bearer ${accessToken}`,
  //     },
  //   })
  //   .then(response => {
  //     setFace(response?.data?.data?.enrolledFace)
  //   });
  // },[identityNumber])

  // let roleBasedViewPoints = [];
  // if (roleName.includes("PRIMORDIAL_USER")) {
  //   roleBasedViewPoints.push(navItems.filter(el => el.title));
  // } else if (
  //   roleName.includes("USER_MANAGER") &&
  //   hasReportingRoleName === true &&
  //   reportingRoleName === "NONE"
  // ) {
  //   roleBasedViewPoints.push(
  //     navItems.filter(
  //       el =>
  //         el.title !== "Datasets Reports" &&
  //         el.title !== "Metrics" &&
  //         el.title !== "Dashboard",
  //     ),
  //   );
  // } else if (
  //   hasReportingRoleName === true &&
  //   reportingRoleName.includes("REPORT") &&
  //   !roleName.includes("USER_MANAGER")
  // ) {
  //   roleBasedViewPoints.push(
  //     navItems.filter(
  //       el =>
  //         el.title !== "User Management" && el.title !== "Device Management",
  //     ),
  //   );
  // } else if (
  //   hasReportingRoleName === true &&
  //   reportingRoleName.includes("REPORT") &&
  //   roleName.includes("USER_MANAGER")
  // ) {
  //   roleBasedViewPoints.push(navItems.filter(el => el.title));
  // } else if (
  //   roleName.includes("USER_MANAGER") &&
  //   hasReportingRoleName === false
  // ) {
  //   roleBasedViewPoints.push(
  //     navItems.filter(
  //       el =>
  //         el.title !== "Datasets Reports" &&
  //         el.title !== "Metrics" &&
  //         el.title !== "Dashboard",
  //     ),
  //   );
  // } else if (
  //   roleName.includes("ADJUDICATOR") ||
  //   roleName.includes("AGENT") ||
  //   roleName.includes("SELF_KYC_USER")
  // ) {
  //   roleBasedViewPoints.push(
  //     navItems.filter(el => el.title !== "User Management"),
  //   );
  // }
  //  else if (roleName.includes("AGENT") && hasReportingRoleName === true) {
  //   roleBasedViewPoints.push(
  //     navItems.filter(
  //       el => el.title !== "User Management" && el.title !== "Adjudication",
  //     ),
  //   );
  // }
  // const filterItems = (items, fn) =>
  //   items.reduce((acc, item) => {
  //     if (item.children)
  //       return [...acc, { ...item, children: filterItems(item.children, fn) }];
  //     else if (fn(item)) return [...acc, item];
  //     return acc;
  //   }, []);
  // const filtered = filterItems(
  //   roleBasedViewPoints[0],
  //   item => item.title !== "Create User",
  // );
  // console.log("filtered", filtered);

  return (
    <Box
      sx={{
        width: "100%",
        ".MuiBox-root.css-ndow8k": {
          width: "236px",
        },
      }}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        marginY={4}
      >
        <Avatar
          alt="profile_pic"
          src={face?.length ? `data:image/jpeg;base64,${face}` : profile_pic}
          sx={{
            width: "90px",
            height: "90px",
            objectFit: "cover",
          }}
        />
        <Typography
          fontSize={{ xs: 18, md: 16, lg: 18 }}
          variant="body2"
          textAlign={"center"}
        >
          {/* {displayName} */}
        </Typography>

        <Typography
          fontSize={{ xs: 14, md: 14, lg: 14 }}
          variant="h6"
          color="#343434"
          sx={{ fontWeight: "500" }}
        >
          {/* {roleName} */}
        </Typography>
        <Typography
          fontSize={{ xs: 14, md: 14, lg: 14 }}
          variant="h6"
          color="#343434"
          sx={{ fontWeight: "500" }}
        >
          {/* {reportingRoleName} */}
        </Typography>

        <Typography
          fontSize={{ xs: 14, md: 14, lg: 14 }}
          variant="h6"
          color="#343434"
          sx={{ fontWeight: "500" }}
        >
          {/* {branchName} */}
        </Typography>
      </Box>
      <Box sx={{ width: "100%", position: "relative" }}>
        <List component="nav">
          {navItems?.map((navItem, index) =>
            !!navItem?.children?.length ? (
              <CollapsableNav
                key={index}
                onClick={closeNavbar}
                primary={navItem?.title}
                links={navItem?.children}
                icon={navItem?.icon}
                root={navItem?.link}
              />
            ) : (
              <List>
                <Link to={navItem?.link} key={index}>
                  <ListItemButton
                    selected={navItem?.link === location.pathname}
                    onClick={closeNavbar}
                  >
                    <ListItemIcon>{navItem?.icon}</ListItemIcon>
                    <ListItemText primary={navItem?.title} />
                  </ListItemButton>
                </Link>
              </List>
            ),
          )}
        </List>
      </Box>
    </Box>
  );
};

export default DrawList;
