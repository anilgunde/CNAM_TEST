import React, { useCallback, useState, useEffect } from "react";
import { Paper, Stack, Typography, TextField,Autocomplete, } from "@mui/material";
import { useTheme } from "@mui/material";
import axios from "../../api/axios";
//import OptionsDropDown from "../../../components/Common/OptionsDropDown";
import SearchBar, { SearchButton } from "../../components/Common/SearchBar";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import ComboBox from "../../components/Common/AutoComplete";
import ComboBoxByName from "../../components/Common/AutoCompleteByName";
import moment from "moment";
import { toast } from "react-toastify";
import useLocalStorage from "../../hooks/useLocalStorage";
// import SearchBarByName from "../../../components/Common/SearchBarByName";
import RoleDropDown from "../../components/Common/RoleDropDown";
const EnrolmentFilters = ({
  setFromDate,
  setToDate,
}) => {
  const theme = useTheme();

  // const [{ accessToken, reportingRoleName, branchId, branchDistrict }] =
  //   useLocalStorage("jwtWithDetails");

  const [totalPageSize, setTotalSize] = useLocalStorage("totalPageSize", 1);
  const [fromDate2, setFromDate2] = useState("");
  const [toDate2, setToDate2] = useState("");
  const [usersList, setUsersList] = useState([]);

  const roles = [
    "AGENT",
    "SELF_KYC_CLIENT",
    "LEVEL_ONE_ADJUDICATOR",
    "LEVEL_TWO_ADJUDICATOR",
    "USER_MANAGER",
    "LEVEL_ONE_BRANCH_ADJUDICATOR",
    "LEVEL_TWO_BRANCH_ADJUDICATOR",
  ];

  const handleOptionChange = useCallback();

  // const handleOptionChange = useCallback(
  //   e => {
  //     setSelectedFilter(e.target.value);
  //   },
  //   [setSelectedFilter],
  // );

  const handleRoleChange = useCallback();
  // const handleRoleChange = useCallback(
  //   e => {
  //     setRoleFilter(e.target.value);
  //   },
  //   [setRoleFilter],
  // );

  const handleSearchRole = useCallback();
  // const handleSearchRole = useCallback(
  //   (event, value) => {
  //     setRoleSearch(value);
  //     setRoleFilter2(roleFilter);
  //   },
  //   [roleFilter, setRoleFilter2, setRoleSearch],
  // );

  // useEffect(() => {
  //   axios
  //     .get(`user`, {
  //       headers: {
  //         "content-type": "application/json",
  //         authorization: `Bearer ${accessToken}`,
  //       },
  //       params: {
  //         ...(reportingRoleName === "BRANCH_REPORT_VIEWER" && {
  //           branch: branchId,
  //         }),
  //         ...(reportingRoleName === "DISTRICT_REPORT_VIEWER" && {
  //           district: branchDistrict,
  //         }),
  //       },
  //     })
  //     .then(res => {
  //       const { totalSize } = res.data.data;
  //       setUsersList(
  //         res.data.data.content.map(trim => {
  //           return {
  //             displayName: trim?.displayName,
  //           };
  //         }),
  //       );
  //       setTotalSize(totalSize);
  //     })
  //     .catch(err => {
  //       console.error(err);
  //     });
  // }, [
  //   accessToken,
  //   branchDistrict,
  //   branchId,
  //   reportingRoleName,
  //   setTotalSize,
  //   totalPageSize,
  // ]);

  // const handleSearch = useCallback();
  const handleSearch = useCallback(
    e => {
      e.preventDefault();
      if (!fromDate2) {
        return toast.error(`Please Enter  From Date`);
      }
      if (!toDate2) {
        return toast.error(`Please Enter To Date`);
      }
      if (
        moment(fromDate2, "DD/MM/YYYY").unix() >
        moment(toDate2, "DD/MM/YYYY").unix()
      ) {
        return toast.error(`From Date must be smaller than To Date`);
      }
      setFromDate(fromDate2);
      setToDate(toDate2);
    },
    [fromDate2, setFromDate, setToDate, toDate2],
  );

  return (
    <Paper elevation={5} sx={{ p: 2 }}>
      <Stack
        direction="row"
        justifyContent="flex-end"
        gap={1}
        flexWrap="wrap"
      ></Stack>
      <Stack pb={2}>
        <Typography variant="h5" color={theme.palette.primary.main}>
          Enrolments List
        </Typography>
      </Stack>
      <Stack
        pt={2}
        pb={3}
        gap={2}
        flexDirection={{ md: "row", sm: "column" }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack gap={2}>

        {/* <RoleDropDown value={"role"} onChange={handleRoleChange}>
            <Stack width={250}>
              {roleFilter === "role" && (
                <Autocomplete
                  size='small'
                  disablePortal
                  name='role'
                  onChange={handleSearchRole}
                  options={roles.sort()}
                  renderInput={params => <TextField {...params} label='Select Role' />}
                />
              )}
            </Stack>
          </RoleDropDown> */}
          
          {/* <OptionsDropDown  onChange={handleOptionChange}>
            
          </OptionsDropDown> */}
        </Stack>
        <Stack alignItems="flex-end" direction="row" flexWrap="wrap">
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              inputFormat="DD/MM/YYYY"
              label="From Date"
              value={fromDate2}
              disableFuture
              onChange={newValue => {
                setFromDate2(newValue);
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  size="small"
                  sx={{
                    "& .MuiInputBase-input": {
                      width: 85,
                      // width: "50%",
                    },
                    "& .MuiOutlinedInput-input": {
                      // border: `2px solid ${theme.palette.secondary.main}`,
                      borderRadius: "0",
                    },
                  }}
                  error={false}
                />
              )}
            />
            <DatePicker
              inputFormat="DD/MM/YYYY"
              label="To Date"
              value={toDate2}
              disableFuture
              shouldDisableDate={date =>
                moment(fromDate2, "DD/MM/YYYY", true).diff(date) > 0
              }
              onChange={newValue => {
                setToDate2(newValue);
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  size="small"
                  sx={{
                    "& .MuiInputBase-input": {
                      width: 85,
                    },
                  }}
                  error={false}
                />
              )}
            />
          </LocalizationProvider>

          <SearchButton
            variant="contained"
            sx={{ marginLeft: 1 }}
            onClick={handleSearch}
          >
            Search
          </SearchButton>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default EnrolmentFilters;
