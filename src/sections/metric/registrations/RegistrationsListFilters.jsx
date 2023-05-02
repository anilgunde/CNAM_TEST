import React, { useCallback, useState, useEffect } from "react";
import { Paper, Stack, Typography, TextField, Box } from "@mui/material";
import { useTheme } from "@mui/material";
import DropDownList from "../../../components/Common/RegistrationsDropDown";
import DropDown from "../../../components/Common/DropDown";
import SearchBar, { SearchButton } from "../../../components/Common/SearchBar";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import AutoComplete from "../../../components/Common/AutoComplete";

import moment from "moment";
import { toast } from "react-toastify";
// import AutoCompleteByName from "../../../components/Common/AutoCompleteByName";
import axios from "../../../api/axios";
import useLocalStorage from "../../../hooks/useLocalStorage";
// import AutoCompleteByRegistrationUserName from "../../../components/Common/AutoCompleteByRegistrationUserName";
import ResAutoByName from "../../../components/Common/ResAutoByName";

const RegistrationsListFilters = ({
  branches,
  districts,
  setSelectedFilter,
  selectedFilter,
  setFromDate,
  setToDate,
  setChannel,
  setType,
  Channel,
  search,
  Type,
  typeOptions,
  channelOptions,
  setSearch,
}) => {
  const theme = useTheme();
  const [{ accessToken, reportingRoleName, branchId, branchDistrict }] =
    useLocalStorage("jwtWithDetails");
  const [fromDate2, setFromDate2] = useState("");
  const [toDate2, setToDate2] = useState("");
  const [usersList, setUsersList] = useState([]);
  const handleOptionChange = useCallback(
    e => {
      setSelectedFilter(e.target.value);
    },
    [setSelectedFilter],
  );

  const [typeOptionss, setTypeOptionss] = useState(typeOptions);

  const handleChannelChange = useCallback(
    e => {
      setChannel(e.target.value);

      if (e.target.value === "SELF_KYC") {
        setType("MOBILE");
        const a = typeOptions.filter(el => el.value === "MOBILE");
        setTypeOptionss(a);
      } else {
        setTypeOptionss(typeOptions);
      }
    },
    [setChannel, setType, typeOptions],
  );
  const handleTypeChange = useCallback(
    e => {
      setType(e.target.value);
    },
    [setType],
  );

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

  useEffect(() => {
    if (reportingRoleName === "BRANCH_REPORT_VIEWER") {
      axios
        .get("/admin/reporting/enrollments/list", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          params: {
            from:
              fromDate2.length === 0
                ? "2022-01-01"
                : moment(fromDate2).format("YYYY-MM-DD"),
            to:
              toDate2.length === 0
                ? moment(new Date()).format("YYYY-MM-DD")
                : moment(toDate2).format("YYYY-MM-DD"),
            branch: branchId,
            ...(search && {
              [selectedFilter]:
                selectedFilter === "mobileNumber" ? `+251${search}` : search,
            }),
          },
        })
        .then(res => {
          const data = res.data.data.content;
          const trimmedData = data.map(values => {
            return {
              fullName: values?.fullName,
            };
          });
          setUsersList(trimmedData);
        });
    } else if (reportingRoleName === "DISTRICT_REPORT_VIEWER") {
      axios
        .get("/admin/reporting/enrollments/list", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          params: {
            from:
              fromDate2.length === 0
                ? "2022-01-01"
                : moment(fromDate2).format("YYYY-MM-DD"),
            to:
              toDate2.length === 0
                ? moment(new Date()).format("YYYY-MM-DD")
                : moment(toDate2).format("YYYY-MM-DD"),
            ...(search && {
              [selectedFilter]:
                selectedFilter === "mobileNumber" ? `+251${search}` : search,
            }),

            district: branchDistrict,
          },
        })
        .then(res => {
          const data = res.data.data.content;
          const trimmedData = data.map(values => {
            return {
              fullName: values?.fullName,
            };
          });
          setUsersList(trimmedData);
        });
    } else {
      axios
        .get("/admin/reporting/enrollments/list", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          params: {
            from:
              fromDate2.length === 0
                ? "2022-01-01"
                : moment(fromDate2).format("YYYY-MM-DD"),
            to:
              toDate2.length === 0
                ? moment(new Date()).format("YYYY-MM-DD")
                : moment(toDate2).format("YYYY-MM-DD"),
            ...(search && {
              [selectedFilter]:
                selectedFilter === "mobileNumber" ? `+251${search}` : search,
            }),
          },
        })
        .then(res => {
          const data = res.data.data.content;
          const trimmedData = data.map(values => {
            return {
              fullName: values?.fullName,
            };
          });
          setUsersList(trimmedData);
        });
    }
  }, [
    accessToken,
    branchDistrict,
    branchId,
    fromDate2,
    reportingRoleName,
    search,
    selectedFilter,
    toDate2,
  ]);
  return (
    <Paper elevation={5} sx={{ p: 2 }}>
      <Stack
        pb={2}
        direction="row"
        justifyContent="space-between"
        flexWrap="wrap"
        spacing={1}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" color={theme.palette.primary.main}>
            Registrations
          </Typography>
        </Box>
        <DropDown
          options={channelOptions}
          value={Channel}
          onChange={handleChannelChange}
        />
        <DropDown
          options={typeOptionss}
          value={Type}
          disabled={Channel === "SELF_KYC" ? true : false}
          onChange={handleTypeChange}
        />
      </Stack>
      <Stack
        pt={2}
        pb={3}
        gap={2}
        flexDirection={{ md: "row", sm: "column" }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack>
          {reportingRoleName==='BRANCH_REPORT_VIEWER' ? null : <DropDownList value={selectedFilter} onChange={handleOptionChange}>
            <Stack width={250}>
              {selectedFilter === "mobileNumber" && (
                <SearchBar
                  onChange={setSearch}
                  label="mobileNumber"
                  setFromDate2={setFromDate2}
                  setToDate2={setToDate2}
                />
              )}
              {selectedFilter === "name" && (
                <ResAutoByName
                  options={usersList}
                  placeHolder={"Select Customer Name"}
                  onChange={setSearch}
                />
              )}
              {selectedFilter === "branch" && (
                <AutoComplete
                  options={branches}
                  placeHolder={"Select Branch Name"}
                  onChange={setSearch}
                  label={selectedFilter}
                />
              )}
              {selectedFilter === "district" && (
                <AutoComplete
                  options={districts}
                  placeHolder={"Select District Name"}
                  onChange={setSearch}
                  label={selectedFilter}
                />
              )}
            </Stack>
          </DropDownList>}
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
                  sx={{
                    "& .MuiInputBase-input": {
                      width: 85,
                    },
                  }}
                  size="small"
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
                  sx={{
                    "& .MuiInputBase-input": {
                      width: 85,
                    },
                  }}
                  size="small"
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

export default RegistrationsListFilters;
