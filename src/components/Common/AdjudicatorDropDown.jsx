import { MenuItem, InputBase, Select } from "@mui/material";
import { styled } from "@mui/material";

const StyledSelect = styled(Select)(({ theme }) => ({
  border: "none",
  width: 100,
  fontSize: "80%",
  fontWeight: 600,
  paddingLeft: theme.spacing(1),
  backgroundColor: theme.palette.grey[200],
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
  fontSize: 12,
  textAlign: "center",
  backgroundColor: theme.palette.grey[100],
  fontWeight: 500,
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  borderRadius: 0,
  fontWeight: 500,
  textAlign: "center",
}));

const AdjudicatorDropDown = ({ options, ...other }) => {
  return (
    <StyledSelect input={<StyledInput />} {...other}>
      {options?.map(({ value, label }) => (
        <StyledMenuItem key={value} value={value}>
          {label}
        </StyledMenuItem>
      ))}
    </StyledSelect>
  );
};

export default AdjudicatorDropDown;
