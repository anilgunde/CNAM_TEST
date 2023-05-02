import React, { useState, useCallback, useMemo } from "react";
import {
  MenuItem,
  InputBase,
  Select,
  Box,
  MenuList,
  Stack,
} from "@mui/material";
import { styled, useTheme } from "@mui/material";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useEffect } from "react";

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

const OptionsDropdown = ({ country, handleChange, children, ...other }) => {
  const [{ reportingRoleName }] = useLocalStorage("jwtWithDetails");
  const [first, setFirst] = useState();
  const options = useMemo(
    () => [
      { value: "name", label: "Name" },
      { value: "mobileNumber", label: "Mobile Number" },
      { value: "branchId", label: "Branch" },
      { value: "district", label: "District" },
    ],
    [],
  );
  useEffect(() => {
    if (reportingRoleName?.includes("BRANCH")) {
      setFirst(
        options?.filter(
          el => el?.label !== "Branch" && el?.label !== "District",
        ),
      );
    } else if (reportingRoleName?.includes("DISTRICT")) {
      setFirst(options?.filter(el => el.label !== "District"));
    } else {
      setFirst(options);
    }
  }, [options, reportingRoleName]);

  return (
    <Stack flexWrap="wrap" direction={"row"}>
      <StyledInput
        value={country}
        size="small"
        onChange={handleChange}
        {...other}
      >
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
