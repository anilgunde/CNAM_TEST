import { styled } from "@mui/material";
import MuiButton from "@mui/material/Button";

const StyledButton = styled(MuiButton)(({ theme }) => ({
  borderRadius: 0,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  textTransform: "capitalize",
  fontWeight: "bold",
  color: "#fff",
}));

const Button = ({ children, ...other }) => (
  <StyledButton {...other} size="small" disableRipple disableTouchRipple>
    {children}
  </StyledButton>
);

export default Button;
