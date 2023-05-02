import { MenuItem, Select, Stack } from "@mui/material";
import { styled } from "@mui/material";

const StyledInput = styled(Select)(({ theme }) => ({
  borderRadius: 0,
  color: theme.palette.grey[600],
  fontSize: 15,
  width: 180,
  textAlign: "center",
  fontWeight: 500,
  marginLeft: 0.5,
}));

const StyledOptions = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.secondary.main[200],
  borderRadius: 0,
  fontWeight: 500,
  textAlign: "left",
  fontSize: "small",
  zIndex: 1,
}));

const UserListDropDown = ({ value, onChange, children, ...other }) => {
  const options = [
    { value: "name", label: "Name " },
    { value: "mobileNumber", label: "Mobile Number" },
    { value: "branchId", label: "Branch" },
  ];
  return (
    <Stack flexWrap="wrap" direction={"row"}>
      <StyledInput value={value} size="small" onChange={onChange} {...other}>
        {options.map(({ value, label }) => (
          <StyledOptions key={value} value={value}>
            {label}
          </StyledOptions>
        ))}
      </StyledInput>
      {children}
    </Stack>
  );
};

export default UserListDropDown;
