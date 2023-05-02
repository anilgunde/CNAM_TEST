import { styled, Toolbar } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import { SM_WIDTH } from "../../../utils/constants";
const drawerWidth = 234;

const StyledDrawer = styled(Drawer)(() => ({
  backgroundColor: "#FFFFFF",
  zIndex: 0,
}));

const MuiDrawer = ({ isOpen, children, ...other }) => {
  const isLarge = useMediaQuery(`(min-width:${SM_WIDTH}px)`);

  return (
    <StyledDrawer
      anchor="left"
      sx={{
        width: drawerWidth,
        // ".css-dm4aar-MuiPaper-root-MuiDrawer-paper": { width: drawerWidth },
        // ".css-12i7wg6-MuiPaper-root-MuiDrawer-paper": { width: drawerWidth },
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      {...other}
      elevation={5}
      variant={isLarge ? "permanent" : "temporary"}
      open={isLarge || isOpen}
    >
      <Toolbar />
      {children}
    </StyledDrawer>
  );
};

export default MuiDrawer;
