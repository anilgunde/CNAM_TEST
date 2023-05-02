import React from "react";
import {
  Select as MuiSelect,
  styled,
  MenuItem,
  Typography,
  Stack,
} from "@mui/material";
const StyledSelect = styled(MuiSelect)(({ theme }) => ({
  borderRadius: 0,
  color: theme.palette.grey[600],
  fontSize: 15,
  width: 180,
  textAlign: "center",
  fontWeight: 500,
  marginLeft: 0.5,
}));

const StyledOption = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.secondary.main[200],
  borderRadius: 0,
  fontWeight: 500,
  textAlign: "left",
  fontSize: "small",
  zIndex: 1,
}));
const Select = ({ children, value, onChange, options, label }) => {
  return (
    <Stack position="relative" direction="row">
      <Typography sx={{ position: "absolute", top: -20 }} variant="caption">
        {label}
      </Typography>
      <StyledSelect
        size="small"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {options?.map(item => (
          <StyledOption value={item.value} key={item.label}>
            {item.label}
          </StyledOption>
        ))}
      </StyledSelect>
      {children}
    </Stack>
  );
};

export default Select;
