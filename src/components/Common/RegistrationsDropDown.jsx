import { MenuItem, Select, Stack } from "@mui/material";
import { styled } from "@mui/material";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";

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

const OptionsDropdown = ({ value, onChange, children, ...other }) => {
  const [{ reportingRoleName }] = useLocalStorage("jwtWithDetails");
  const [first, setFirst] = useState();
  const options = useMemo(
    () => [
      // { value: "name", label: "Name " },
      // { value: "mobileNumber", label: "Mobile Number" },
      { value: "branch", label: "Branch" },
      { value: "district", label: "District" },
    ],
    [],
  );
  useEffect(() => {
    if (reportingRoleName.includes("BRANCH")) {
      setFirst(
        options?.filter(el => el.label !== "Branch" && el.label !== "District"),
      );
    } else if (reportingRoleName?.includes("DISTRICT")) {
      setFirst(options?.filter(el => el.label !== "District"));
    } else {
      setFirst(options);
    }
  }, [options, reportingRoleName]);

  return (
    <Stack flexWrap="wrap" direction={"row"}>
      <StyledInput value={value} size="small" onChange={onChange} {...other}>
        {first?.map(({ value, label }) => (
          <StyledOptions key={value} value={value}>
            {label}
          </StyledOptions>
        ))}
      </StyledInput>

      {children}
    </Stack>
  );
};

export default OptionsDropdown;
