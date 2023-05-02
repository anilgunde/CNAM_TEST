import { styled, Toolbar } from "@mui/material";
import { Box } from "@mui/material";

const ContainerWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: "#EFEFF1",
  width: "100%",
  minHeight: "100vh",
  padding: theme.spacing(5),
  overflowX: "hidden",
}));

const CardWrapper = ({ children, ...other }) => (
  <ContainerWrapper {...other}>
    <Toolbar />
    {children}
  </ContainerWrapper>
);

export default CardWrapper;
