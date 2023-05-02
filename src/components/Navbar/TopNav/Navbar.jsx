import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton, styled, Toolbar, Tooltip } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import logo from "../../../assets/LOGO-CNAM.png";
import LogoutIcon from "@mui/icons-material/Logout";
import { PATHS, SM_WIDTH } from "../../../utils/constants";
import { useCallback } from "react";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";
const Img = styled("img")(() => ({
  width: "208px",
  height: "51px",
  cursor: "pointer",
}));

const StyledNavbar = styled(MuiAppBar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.secondary,
  paddingTop: theme.spacing(1),
  paddingLeft: theme.spacing(1),
  paddingBottom: theme.spacing(0.5),
  borderBottom: `2px solid ${theme.palette.primary.main}`,
  display: "flex",
  flexDirection: "row",
  position: "fixed",
  top: 0,
  left: 0,
  alignItems: "center",
  boxShadow: `0px 0px ${theme.palette.primary.main}`,
  justifyContent: "space-between",
}));

const Navbar = ({ setIsOpen, ...other }) => {
  // const { displayName, roleName, reportingRoleName } = JSON.parse(
  //   sessionStorage.getItem("jwtWithDetails"),
  // );
  // const details = JSON.parse(sessionStorage.getItem("jwtWithDetails"));
  // const hasReportingRoleName =
  //   Object?.keys(details)?.includes("reportingRoleName");
  const isLarge = useMediaQuery(`(min-width:${SM_WIDTH}px)`);
  const navigate = useNavigate();
  const toggleNavbar = useCallback(() => {
    setIsOpen(prev => !prev);
  }, [setIsOpen]);

  const handleImageClick = () => {
        navigate(PATHS.dashboard);
      }

  // const handleImageClick = () => {
  //   if (roleName.includes("PRIMORDIAL_USER")) {
  //     navigate(PATHS.dashboard);
  //   } else if (
  //     roleName.includes("USER_MANAGER") &&
  //     hasReportingRoleName === true &&
  //     reportingRoleName === "NONE"
  //   ) {
  //   } else if (
  //     hasReportingRoleName === true &&
  //     reportingRoleName.includes("REPORT") &&
  //     !roleName.includes("USER_MANAGER")
  //   ) {
  //     navigate(PATHS.dashboard);
  //   } else if (
  //     hasReportingRoleName === true &&
  //     reportingRoleName.includes("REPORT") &&
  //     roleName.includes("USER_MANAGER")
  //   ) {
  //     navigate(PATHS.dashboard);
  //   } else if (
  //     roleName.includes("USER_MANAGER") &&
  //     hasReportingRoleName === false
  //   ) {
  //   }
  // };

  const logOut = useCallback(() => {
    axios.defaults.headers.common.authorization = "";
    sessionStorage.clear();
    navigate("/");
  }, [navigate]);

  return (
    <StyledNavbar {...other}>
      <Toolbar>
        <Box>
          {!isLarge && (
            <Tooltip title='Open Navigation'>
              <IconButton onClick={toggleNavbar}>
                <MenuIcon />
              </IconButton>
            </Tooltip>
          )}
          <Img src={logo} style={{width:'60%',height:'60%'}} alt='Boa_logo'  onClick={() => handleImageClick()} />
        </Box>
      </Toolbar>
      <IconButton
        aria-label='send'
        color='success'
        size='small'
        sx={{ marginRight: "1%" }}
        onClick={logOut}
      >
        <LogoutIcon />
      </IconButton>
    </StyledNavbar>
  );
};

export default Navbar;
