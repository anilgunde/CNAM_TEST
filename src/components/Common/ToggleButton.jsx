import { styled } from "@mui/material";
import { ToggleButton as MuiToggleButton } from "@mui/material";
const StyledToggleButton = styled(MuiToggleButton)(({ theme }) => ({
  borderBottom: `3px solid ${theme.palette.primary.main}`,
  borderTop: "none",
  borderRight: "none",
  borderLeft: "none",
  height: 14,
  fontWeight: 600,
  minWidth: 70,
  fontSize: 12,
  backgroundColor: theme.palette.grey[100],
}));

export default StyledToggleButton;
