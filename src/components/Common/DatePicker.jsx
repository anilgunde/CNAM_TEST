import { styled, TextField } from "@mui/material";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";

const StyledDatePicker = styled(MuiDatePicker)(({ theme }) => ({
  borderRadius: 0,
  width: "auto",
}));
const StyledTextField = styled(TextField)(({ theme }) => ({
  borderRadius: 0,
}));

const CustomDatePicker = ({ children, ...other }) => (
  <StyledDatePicker
    inputFormat="DD/MM/YYYY"
    {...other}
    sx={{ borderRadius: 0 }}
    renderInput={params => (
      <StyledTextField sx={{ borderRadius: 0 }} size="small" {...params} />
    )}
  >
    {children}
  </StyledDatePicker>
);

export default CustomDatePicker;
