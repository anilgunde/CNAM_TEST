import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import CustomDatePicker from "../../components/Common/DatePicker";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import DropDown from "../../components/Common/DropDown";
import { DROPOps } from "../../utils/constants";
import moment from "moment/moment";
import { toast } from "react-toastify";

const countData = [
  { id: "ACTIVE", value: 12 },
  { id: "INCOMPLETE", value: 3 },
  { id: "ESCLATED", value: 12 },
  { id: "RESOLVED", value: 8 },
];
const MetricFilters = ({
  handleAuthenticationsTypeChange,
  authType,
  setFromDate,
  setToDate,
  handleAuthenticationsChannelChange,
  authChannel,
}) => {
  const theme = useTheme();
  const [fromDate2, setFromDate2] = useState("");
  const [toDate2, setToDate2] = useState("");
  const handleSearch = useCallback(async () => {
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
    try {
      const res = await "dsad";
      setFromDate(fromDate2);
      setToDate(toDate2);
      return res;
    } catch (error) {
      console.log("error", error);
    }
  }, [fromDate2, setFromDate, setToDate, toDate2]);

  return (
    <Box component={Paper} elevation={5} minHeight={"auto"} padding={2}>
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
          textTransform="uppercase"
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
          Reports
        </Typography>

        <Stack gap={1} direction="row" flexWrap="wrap">
          <LocalizationProvider
            dateAdapter={AdapterMoment}
            sx={{ border: "2px solid blue" }}
          >
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
          <Button
            disableElevation
            disableFocusRipple
            disableRipple
            disableTouchRipple
            onClick={handleSearch}
            sx={{
              paddingLeft: 5,
              paddingRight: 5,
              width: "20%",
              textTransform: "uppercase",
              fontWeight: "bold",
              color: "#fff",
              backgroundColor: theme.palette.primary.main,
              "&.MuiButton-root": { borderRadius: 0 },
              "&.MuiButton-root:hover": {
                backgroundColor: theme.palette.primary.main,
              },
              height: "40px",
              marginX: "8px",
            }}
          >
            Search
          </Button>
        </Stack>
        <Stack gap={1} direction="row">
          <DropDown
            options={DROPOps.channelOptions}
            value={authChannel}
            onChange={handleAuthenticationsChannelChange}
          />
          <DropDown
            options={DROPOps.typeOptions}
            value={authType}
            onChange={handleAuthenticationsTypeChange}
          />
        </Stack>
        {/* <Stack
          width={1}
          minHeight="10vh"
          direction="row"
          alignItems="center"
          justifyContent="space-around"
        >
          {countData.map(data => (
            <Box key={data.id}>
              <Typography
                fontSize={{ xs: 18, md: 18, lg: 21 }}
                align="center"
                color="common.black"
              >
                {data.value}
              </Typography>
              <Typography fontSize={{ xs: 8, md: 12, lg: 10 }} align="center">
                {data.id}
              </Typography>
            </Box>
          ))}
        </Stack> */}
      </Stack>
    </Box>
  );
};

export default MetricFilters;
