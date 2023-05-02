import React, { useCallback, useState, useEffect } from "react";
import {
  Paper,
  Stack,
  Typography,
  TextField,
  Box,
  Autocomplete,
} from "@mui/material";
import { useTheme } from "@mui/material";
import axios from "../../../api/axios";
import UserListDropDown from "../../../components/Common/AuditTrailListDropDown";
import SearchBar, { SearchButton } from "../../../components/Common/SearchBar";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
// import ComboBox from "../../../components/Common/AutoComplete";
import SearchBarByAuditName from "../../../components/Common/SearchBarByAuditName";

import moment from "moment";
import { toast } from "react-toastify";
import DropDown from "../../../components/Common/DropDown";
import SearchBarByCustomerNumber from "../../../components/Common/SearchBarByCustomerNumber";
import RoleDropDown from "../../../components/Common/RoleDropDown";

const AuditTrailListFilters = ({
  // branches,
  // districts,
  setFromDate,
  setToDate,
  setSelectedFilter,
  setSelectedFilter2,
  selectedFilter,
  channelOptions,
  setRoleFilter,
  setRoleFilter2,
  roleFilter,
  setRoleSearch,
  setChannel,
  setType,
  Channel,
  Type,
  typeOptions,
  setSearch,
}) => {
  const theme = useTheme();

  const [fromDate2, setFromDate2] = useState("");
  const [toDate2, setToDate2] = useState("");
  const [typeOptionss, setTypeOptionss] = useState(typeOptions);

  const roles = [
    "AGENT",
    "SELF_KYC_CLIENT",
    "LEVEL_ONE_ADJUDICATOR",
    "LEVEL_TWO_ADJUDICATOR",
    "USER_MANAGER",
    "LEVEL_ONE_BRANCH_ADJUDICATOR",
    "LEVEL_TWO_BRANCH_ADJUDICATOR",
  ];

  const handleOptionChange = useCallback(
    e => {
      setSelectedFilter(e.target.value);
    },
    [setSelectedFilter],
  );
  const handleRoleChange = useCallback(
    e => {
      setRoleFilter(e.target.value);
    },
    [setRoleFilter],
  );

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

  const handleSearchClick = useCallback(
    value => {
      setSearch(value);
      setSelectedFilter2(selectedFilter);
    },
    [selectedFilter, setSearch, setSelectedFilter2],
  );

  const handleSearchRole = useCallback(
    (event, value) => {
      setRoleSearch(value);
      setRoleFilter2(roleFilter);
    },
    [roleFilter, setRoleFilter2, setRoleSearch],
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

  return (
    <Paper elevation={5} sx={{ p: 2 }}>
      <Stack
        direction='row'
        justifyContent='flex-end'
        spacing={1}
        flexWrap='wrap'
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant='h5' color={theme.palette.primary.main}>
            Audit Trail Events
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
        justifyContent='space-between'
        alignItems='center'
      >
        <Stack gap={2}>
        
          <RoleDropDown value={"role"} onChange={handleRoleChange}>
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
          </RoleDropDown>
          <UserListDropDown
            value={selectedFilter}
            onChange={handleOptionChange}
          >
            <Stack width={250}>
              {selectedFilter === "mobileNumber" && (
                <SearchBar onChange={handleSearchClick} label='mobileNumber' />
              )}
              {selectedFilter === "customerNumber" && (
                <SearchBarByCustomerNumber
                  onChange={handleSearchClick}
                  label='customerNumber'
                />
              )}

              {selectedFilter === "customerName" && (
                <SearchBarByAuditName
                  onChange={handleSearchClick}
                  label='customerName'
                />
              )}
              {/* {selectedFilter === "branchId" && (
                <ComboBox
                  label={selectedFilter}
                  options={branches}
                  placeHolder={`Selecet By ${selectedFilter.toUpperCase()}`}
                  onChange={setSearch}
                />
              )} */}
              {/* {selectedFilter === "district" && (
                <ComboBox
                  label={selectedFilter}
                  options={districts}
                  onChange={setSearch}
                />
              )} */}
            </Stack>
          </UserListDropDown>
        </Stack>
        <Stack alignItems='flex-end' direction='row' flexWrap='wrap'>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              inputFormat='DD/MM/YYYY'
              label='From Date'
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
                      // width: "50%",
                    },
                  }}
                  error={false}
                  size='small'
                />
              )}
            />
            <DatePicker
              inputFormat='DD/MM/YYYY'
              label='To Date'
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
                      // width: "50%",
                    },
                  }}
                  error={false}
                  size='small'
                />
              )}
            />
          </LocalizationProvider>

          <SearchButton
            variant='contained'
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

export default AuditTrailListFilters;
