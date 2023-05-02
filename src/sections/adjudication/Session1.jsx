import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import DropDown from "../../components/Common/DropDown";
import { SearchButton } from "../../components/Common/SearchBar";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "../../api/axios";
import useLocalStorage from "../../hooks/useLocalStorage";
import { toast } from "react-toastify";

const Session1 = ({
  setFromDate,
  setToDate,
  setChannel,
  setType,
  authChannel,
  adjCount,
  authType,
  typeOptions,
  channelOptions,
}) => {
  const theme = useTheme();
  const [{ accessToken }] = useLocalStorage("jwtWithDetails");
  const [fromDate2, setFromDate2] = useState("");
  const [toDate2, setToDate2] = useState("");

  const handleChannelChange = useCallback(
    e => {
      setChannel(e.target.value);
    },
    [setChannel],
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
  const countData = [
    { id: "ACTIVE", value: 12 },
    { id: "INCOMPLETE", value: 3 },
    { id: "ESCLATED", value: 12 },
    { id: "RESOLVED", value: 8 },
  ];
  // useEffect(() => {
  //   axios
  //     .get("adjudication/summary", {
  //       headers: {
  //         "Content-Type": "application/json",
  //         authorization: `Bearer ${accessToken}`,
  //       },
  //       params: {
  //         from:
  //           fromDate2.length === 0
  //             ? "2022-01-01"
  //             : moment(fromDate2).format("YYYY-MM-DD"),
  //         to:
  //           toDate2.length === 0
  //             ? moment(new Date()).format("YYYY-MM-DD")
  //             : moment(toDate2).format("YYYY-MM-DD"),
  //       },
  //     })
  //     .then(response => {
  //       console.log(response.data.data);
  //     });
  // }, [accessToken]);
  return (
    <Box component={Paper} elevation={5} minHeight={"auto"}>
      <Stack
        direction="row"
        gap={1}
        padding={1}
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
      >
        <Typography
          fontWeight={600}
          sx={{
            position: "relative",
            "&.MuiTypography-root::before ": {
              content: "''",
              position: "absolute",
              height: 0.05,
              backgroundColor: "#36454F",
              left: 0,
              right: { lg: -70, md: -20, sm: -10, xs: -10 },
              bottom: -1,
            },
          }}
          variant="h6"
        >
          Adjudication
        </Typography>

        <Stack gap={1} direction="row" flexWrap="wrap">
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
                    },
                    "& .MuiOutlinedInput-input": {
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
                    "& .MuiOutlinedInput-input": {
                      borderRadius: "0",
                    },
                  }}
                  error={false}
                />
              )}
            />
          </LocalizationProvider>
          <SearchButton
            variant="contained"
            sx={{
              "&.MuiButtonBase-root": {
                width: "120px",
              },
            }}
            onClick={handleSearch}
          >
            Search
          </SearchButton>
        </Stack>
        {/* <Stack spacing={1} direction="row">
          <DropDown
            options={channelOptions}
            value={authChannel}
            onChange={handleChannelChange}
          />
          <DropDown
            options={typeOptions}
            value={authType}
            onChange={handleTypeChange}
          />
        </Stack> */}
        <Stack
          width={1}
          minHeight="10vh"
          direction="row"
          alignItems="center"
          justifyContent="space-around"
        >
          <Box display={"flex"} justifyContent={"space-around"} width={"100%"}>
            <Box>
              <Typography
                fontSize={{ xs: 18, md: 18, lg: 21 }}
                align="center"
                fontWeight={600}
                sx={{ color: `${theme.palette.primary.main}` }}
              >
                {adjCount.find(group => group.group === "ACTIVE")?.count || 0}
              </Typography>
              <Typography
                fontSize={{ xs: 12, md: 12, lg: 14 }}
                align="center"
                fontWeight={"bold"}
              >
                ACTIVE
              </Typography>
            </Box>
            <Box>
              <Typography
                fontSize={{ xs: 18, md: 18, lg: 21 }}
                align="center"
                fontWeight={600}
                sx={{ color: `${theme.palette.primary.main}` }}
              >
                {adjCount.find(group => group.group === "CREATED")?.count || 0}
              </Typography>
              <Typography
                fontSize={{ xs: 12, md: 12, lg: 14 }}
                align="center"
                fontWeight={"bold"}
              >
                INCOMPLETED/CREATED
              </Typography>
            </Box>
            <Box>
              <Typography
                fontSize={{ xs: 18, md: 18, lg: 21 }}
                align="center"
                fontWeight={600}
                sx={{ color: `${theme.palette.primary.main}` }}
              >
                {adjCount.find(group => group.group === "ESCALATED")?.count ||
                  0}
              </Typography>
              <Typography
                fontSize={{ xs: 12, md: 12, lg: 14 }}
                align="center"
                fontWeight={"bold"}
              >
                ESCALATED
              </Typography>
            </Box>
            <Box>
              <Typography
                fontSize={{ xs: 18, md: 18, lg: 21 }}
                align="center"
                fontWeight={600}
                sx={{ color: `${theme.palette.primary.main}` }}
              >
                {adjCount.find(group => group.group === "RESOLVED")?.count || 0}
              </Typography>
              <Typography
                fontSize={{ xs: 12, md: 12, lg: 14 }}
                align="center"
                fontWeight={"bold"}
              >
                RESOLVED
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Session1;
