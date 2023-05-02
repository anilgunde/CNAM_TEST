import { styled, Box, Paper, Stack } from "@mui/material";

const StyledBox = styled(Box)(() => ({
  minHeight: "calc(22vh)",
  width: "14rem",
  "&.MuiPaper-rounded": { borderRadius: 0 },
  flexWrap: "wrap",
}));

const StyledStack = styled(Stack)(() => ({
  minHeight: "calc(22vh)",
  justifyContent: "space-around",
  alignItems: "center",
  // gap: 2,
  paddingTop: 2,
  flexWrap: "wrap",
  flexDirection: "row",
}));

const MetricCard = ({ children, ...other }) => (
  <StyledBox {...other} component={Paper} elevation={5}>
    <StyledStack {...other}>{children}</StyledStack>
  </StyledBox>
);

export default MetricCard;
