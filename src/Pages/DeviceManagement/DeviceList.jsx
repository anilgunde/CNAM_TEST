import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  Table,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useTheme,
  Button,
  TextField,
  Switch,
  Tooltip,
  Fade,
} from "@mui/material";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { Worker } from "@react-pdf-viewer/core";
import "jspdf-autotable";
import jsPDF from "jspdf";
import React, { useCallback, useEffect } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import RejectDialog from "../../components/deviceList/RejectDialog";
import { SearchButton } from "../../components/Common/SearchBar";
import moment from "moment";
import Select from "../../components/Common/Select";
import Autocomplete from "../../components/Common/AutoComplete";
import logo from "../../assets/BoA logo@2x.png";
import { CSVLink } from "react-csv";
import ToggleDialog from "../../components/deviceList/ToggleDialog";
import { PATHS } from "../../utils/constants";
import { useNavigate } from "react-router-dom";

const filterOptions = [
  { label: "Status", value: "status" },
  { label: "Type", value: "type" },
  { label: "device Name", value: "deviceName" },
];

const statusOptions = [
  // { label: "None", value: "chooseOne" },
  { label: "Pending Approval", value: "PENDING_APPROVAL" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];
const typeOptions = [
  // { label: "None", value: "none" },
  { label: "Registration", value: "REGISTRATION" },
  { label: "Name Change", value: "NAME_CHANGE" },
  { label: "Activation", value: "ACTIVATION" },
  { label: "DeActivation", value: "DEACTIVATION" },
];

const DeviceList = () => {
  // const [
  //   { accessToken, reportingRoleName, branchId, branchDistrict, roleName },
  // ] = useLocalStorage("jwtWithDetails");
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [rejectId, setRejectId] = useState("");

  const [pageSize, setPageSize] = useState(10);
  const [totalSize, setTotalSize] = useState(0);
  const [deviceDetails, setDeviceDetails] = useState([]);
  const [deviceDetails2, setDeviceDetails2] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("status");
  const [status, setStatus] = useState("PENDING_APPROVAL");
  const [type, setType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromDate2, setFromDate2] = useState("");
  const [toDate2, setToDate2] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceNames, setDeviceNames] = useState([]);
  const navigate = useNavigate();
  const columns = [
    {
      field: "deviceName",
      headerName: "Device Name",
      width: 20,
    },
    { field: "type", headerName: "Request_Type", width: 50 },
    { field: "status", headerName: "Status", width: 50 },
    { field: "statusReason", headerName: "Status Reason", width: 50 },
    { field: "requestedBy", headerName: "Requested By", width: 50 },
    { field: "requestedAt", headerName: "Requested At", width: 50 },
    {
      ...((status === "APPROVED" ||
        status === "REJECTED" ||
        status === "PENDING_APPROVAL") && {
        field: "approvedBy",
        headerName: "Approved By",
      }),
    },
    {
      ...((status === "APPROVED" || status === "REJECTED") && {
        field: "approvedAt",
        headerName: "Approved At",
      }),
    },
  ];

  const handleApprove = useCallback()
  // const handleApprove = useCallback(
  //   id => {
  //     setIsLoading(true);
  //     axios
  //       .patch(
  //         `/admin/devices/change-requests/${id}`,
  //         {
  //           approved: true,
  //         },
  //         {
  //           headers: {
  //             "content-type": "application/json",
  //             authorization: `Bearer ${accessToken}`,
  //           },
  //         },
  //       )
  //       .then(() => {
  //         setRefresh(prev => !prev);
  //         toast.success("Approved Successfully");
  //         setIsLoading(false);
  //       });
  //   },
  //   [accessToken],
  // );
  const handleReject = useCallback(id => {
    setRejectId(id);
  }, []);

  const handleChangePage = useCallback((_event, newPage) => {
    setPageNumber(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(e => {
    setPageSize(parseInt(e.target.value, 10));
    setPageNumber(0);
  }, []);
  
  // useEffect(() => {
  //   setIsLoading(true);
  //   axios
  //     .get("/admin/devices/change-requests", {
  //       headers: {
  //         "content-type": "application/json",
  //         authorization: `Bearer ${accessToken}`,
  //       },
  //       params: {
  //         from: !fromDate2
  //           ? "2022-01-01"
  //           : moment(fromDate2).format("YYYY-MM-DD"),
  //         to: !toDate2
  //           ? moment(new Date()).format("YYYY-MM-DD")
  //           : moment(toDate2).format("YYYY-MM-DD"),
  //         ...(reportingRoleName === "BRANCH_REPORT_VIEWER" && {
  //           branch: branchId,
  //         }),
  //         ...(reportingRoleName === "DISTRICT_REPORT_VIEWER" && {
  //           district: branchDistrict,
  //         }),
  //         ...(deviceName && { deviceName }),
  //         ...(type && { type }),
  //         ...(status && { status }),
  //         pageNumber: pageNumber + 1,
  //         pageSize,
  //       },
  //     })
  //     .then(res => {
  //       axios
  //         .get("/admin/devices/change-requests", {
  //           headers: {
  //             "content-type": "application/json",
  //             authorization: `Bearer ${accessToken}`,
  //           },
  //           params: {
  //             from: !fromDate2
  //               ? "2022-01-01"
  //               : moment(fromDate2).format("YYYY-MM-DD"),
  //             to: !toDate2
  //               ? moment(new Date()).format("YYYY-MM-DD")
  //               : moment(toDate2).format("YYYY-MM-DD"),
  //             ...(reportingRoleName === "BRANCH_REPORT_VIEWER" && {
  //               branch: branchId,
  //             }),
  //             ...(reportingRoleName === "DISTRICT_REPORT_VIEWER" && {
  //               district: branchDistrict,
  //             }),
  //             ...(deviceName && { deviceName }),
  //             ...(type && { type }),
  //             ...(status && { status }),
  //             pageSize:
  //               res.data.data.totalSize === 0 ? 10 : res.data.data.totalSize,
  //           },
  //         })
  //         .then(res => {
  //           const { content, totalSize } = res.data.data;
  //           setTotalSize(totalSize);
  //           setDeviceDetails2(
  //             content.map((fields, index) => {
  //               return {
  //                 ...fields,
  //                 no: index + 1,
  //               };
  //             }),
  //           );
  //           setDeviceNames(
  //             [
  //               ...new Set(
  //                 res.data.data.content?.map(({ deviceName }) => deviceName),
  //               ),
  //             ]?.map(deviceName => ({
  //               label: deviceName,
  //               value: deviceName,
  //             })),
  //           );
  //         })
  //         .catch(err => console.log(err))
  //         .finally(() => {
  //           setIsLoading(false);
  //         });
  //       const { content, totalSize } = res.data.data;
  //       setTotalSize(totalSize);
  //       setDeviceDetails(content);
  //     })
  //     .catch(err => console.log(err))
  //     .finally(() => {
  //       // setIsLoading(false);
  //     });
  // }, [
  //   accessToken,
  //   fromDate2,
  //   status,
  //   toDate2,
  //   type,
  //   refresh,
  //   pageNumber,
  //   pageSize,
  //   deviceName,
  //   reportingRoleName,
  //   branchId,
  //   branchDistrict,
  // ]);

  const onChangeHandle = useCallback(value => {
    setSelectedFilter(value);
    value === "status" ? setStatus("PENDING_APPROVAL") : setStatus("");
    value === "type" ? setType("REGISTRATION") : setType("");
    setDeviceName("");
    setPageNumber(0);
  }, []);

  // const handleSearch = useCallback();

  const handleSearch = useCallback((e) => {
      e.preventDefault();
      if (!fromDate) {
        return toast.error(`Please Enter  From Date`);
      }
      if (!toDate) {
        return toast.error(`Please Enter To Date`);
      }
      if (
        moment(fromDate, "DD/MM/YYYY").unix() >
        moment(toDate, "DD/MM/YYYY").unix()
      ) {
        return toast.error(`From Date must be smaller than To Date`);
      }
      setFromDate2(fromDate);
      setToDate2(toDate);
    },
    [fromDate, toDate],
  );

  // useEffect(() => {
  //   axios.get("/admin/devices/change-requests", {
  //     headers: {
  //       "content-type": "application/json",
  //       authorization: `Bearer ${accessToken}`,
  //     },
  //     params: {
  //       from: "2022-01-01",
  //       to: moment(new Date()).format("YYYY-MM-DD"),
  //     },
  //   });
  // }, [accessToken]);
  // useEffect(() => {
  //   setPageNumber(0);
  // }, [type, status, deviceName]);
  const PDFData = [
    { label: "S.no", key: "no" },
    { label: "Device Name", key: "deviceName" },
    { label: "Type", key: "type" },
    { label: "Status", key: "status" },
    { label: "statusReason", key: "statusReason" },
    { label: "requestedBy", key: "requestedBy" },
    { label: "requestedAt", key: "requestedAt" },
  ];

  const json = deviceDetails2;

  const handleSubmit = e => {}
  // const handleSubmit = e => {
  //   e.preventDefault();
  //   const pdf = new jsPDF("landscape");
  //   const columns = PDFData.map(fields => fields.label);
  //   var rows = [];

  //   for (let i = 0; i < json.length; i++) {
  //     var temp = [
  //       json[i].no,
  //       json[i].deviceName,
  //       json[i].type,
  //       json[i].status,
  //       json[i].statusReason,
  //       json[i].requestedBy,
  //       json[i].requestedAt,
  //     ];
  //     rows.push(temp);
  //   }
  //   pdf.autoTable(columns, rows, {
  //     startY: 80,
  //     margin: {
  //       right: 2,
  //       top: 75,
  //       left: 8.5,
  //     },
  //     didDrawPage: function (data) {
  //       // Header
  //       pdf.addImage(logo, "PNG", 100, 10, 100, 25);
  //       pdf.setLineWidth(0.2);
  //       pdf.rect(8.5, 45, 280, 28);

  //       pdf.setFontSize(11);
  //       pdf.text(`Date : ${moment(new Date()).format("DD-MM-YYYY")}`, 250, 50);
  //       // pdf.setFontSize(11);
  //       // pdf.text(
  //       //   `Channel : ${Channel.split(" ")
  //       //     .map(
  //       //       word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
  //       //     )
  //       //     .join(" ")}`,
  //       //   250,
  //       //   60,
  //       // );
  //       // pdf.setFontSize(11);
  //       // pdf.text(
  //       //   `Client : ${Type.split(" ")
  //       //     .map(
  //       //       word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
  //       //     )
  //       //     .join(" ")}`,
  //       //   250,
  //       //   70,
  //       // );
  //       pdf.setFontSize(11);
  //       if (deviceName?.length || status?.length || type?.length) {
  //         pdf.text(
  //           `${
  //             selectedFilter === "status"
  //               ? "Status"
  //               : selectedFilter === "deviceName"
  //               ? "Device Name"
  //               : selectedFilter === "type"
  //               ? "Type"
  //               : selectedFilter
  //           } : ${
  //             selectedFilter === "status"
  //               ? status
  //               : selectedFilter === "deviceName"
  //               ? deviceName
  //               : selectedFilter === "type"
  //               ? type
  //               : null
  //           }`,
  //           11.5,
  //           60,
  //         );
  //       }

  //       if (fromDate && toDate) {
  //         pdf.setFontSize(11);
  //         pdf.text(
  //           `Date Period : ${moment(fromDate).format("DD-MM-YYYY")} To ${moment(
  //             toDate,
  //           ).format("DD-MM-YYYY")}`,
  //           11.5,
  //           50,
  //         );
  //       }
  //       if (!fromDate && !toDate) {
  //         pdf.setFontSize(11);
  //         pdf.text(
  //           `Date Period : 01-01-2022 To ${moment(new Date()).format(
  //             "DD-MM-YYYY",
  //           )}`,
  //           11.5,
  //           50,
  //         );
  //       }
  //       pdf.setFontSize(10);
  //       pdf.text(
  //         `Generated by : ${roleName
  //           .split("_")
  //           .join(" ")
  //           .split(" ")
  //           .map(
  //             word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
  //           )
  //           .join(" ")} (${reportingRoleName
  //           .split("_")
  //           .join(" ")
  //           .split(" ")
  //           .map(
  //             word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
  //           )
  //           .join(" ")})`,
  //         11.5,
  //         200,
  //       );
  //       pdf.setFontSize(11);
  //       pdf.text(
  //         `Timestamp : ${moment(new Date()).format("hh:mm:ss A")}`,
  //         240,
  //         200,
  //       );
  //       // Footer
  //       let str = "Page No " + pdf.internal.getNumberOfPages();
  //       pdf.setFontSize(10);

  //       // jsPDF 1.4+ uses getWidth, <1.4 uses .width
  //       let pageSize = pdf.internal.pageSize;
  //       let pageHeight = pageSize.height
  //         ? pageSize.height
  //         : pageSize.getHeight();
  //       // pdf.text('index+1', data.settings.margin.left+250, pageHeight - 10);
  //       pdf.text(str, data.settings.margin.left + 135, pageHeight - 5);
  //     },

  //     columnStyles: {
  //       0: { cellWidth: 15 },
  //       1: { cellWidth: 47 },
  //       2: { cellWidth: 38 },
  //       3: { cellWidth: 40 },
  //       4: { cellWidth: 45 },
  //       5: { cellWidth: 47 },
  //       6: { cellWidth: 47 },
  //       7: { cellWidth: 47 },
  //     },
  //     theme: "grid",
  //     styles: {
  //       font: "times",
  //       overflow: "linebreak",
  //       align: "left",
  //       cellPadding: 2,
  //       lineWidth: 0.2,
  //       lineColor: [0, 0, 0],
  //       textColor: [0, 0, 0],
  //     },
  //     headStyles: {
  //       textColor: [0, 0, 0],
  //       fontStyle: "normal",
  //       lineWidth: 0.2,
  //       lineColor: [0, 0, 0],
  //       fillColor: [244, 182, 47],
  //     },
  //     alternateRowStyles: {
  //       fillColor: [222, 222, 222],
  //       textColor: [0, 0, 0],
  //       lineWidth: 0.2,
  //       lineColor: [0, 0, 0],
  //     },

  //     tableLineColor: [0, 0, 0],
  //   });
  //   pdf.save("BankOfAbyssinia");
  // };
  return (
    <Box>
      <RejectDialog
        rejectId={rejectId}
        setRejectId={setRejectId}
        setRefresh={setRefresh}
        setIsLoading={setIsLoading}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={12}>
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
                  Device Registrations
                </Typography>
              </Box>
            </Stack>
            <Stack
              pt={2}
              pb={3}
              gap={2}
              flexDirection={{ md: "row", sm: "column" }}
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction={"column"}>
                <Select
                  value={selectedFilter}
                  options={filterOptions}
                  onChange={onChangeHandle}
                >
                  {selectedFilter === "type" && (
                    <Select
                      value={type}
                      onChange={setType}
                      options={typeOptions}
                    />
                  )}
                  {selectedFilter === "status" && (
                    <Select
                      value={status}
                      onChange={setStatus}
                      options={statusOptions}
                    />
                  )}

                  {selectedFilter === "deviceName" && (
                    <Autocomplete
                      options={deviceNames}
                      onChange={setDeviceName}
                      placeHolder="Select Device Name"
                    />
                  )}
                </Select>
              </Stack>
              <Stack alignItems="flex-end" direction="row" flexWrap="wrap">
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    label="From Date"
                    value={fromDate}
                    disableFuture
                    onChange={newValue => {
                      setFromDate(newValue);
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
                    value={toDate}
                    disableFuture
                    shouldDisableDate={date =>
                      moment(fromDate, "DD/MM/YYYY", true).diff(date) > 0
                    }
                    onChange={newValue => {
                      setToDate(newValue);
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
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Paper elevation={5} sx={{ p: 2 }}>
            {/* <Stack
              alignItems="flex-end"
              justifyContent="flex-end"
              mb={2}
              gap={2}
              direction="row"
            >
              <Typography variant="h6" color={theme.palette.primary.main}>
                EXPORT as
              </Typography>

              <Button
                sx={{ borderColor: "black", color: "black" }}
                variant="outlined"
                // disabled={active}
                 onClick={handleSubmit}
              >
                PDF
              </Button>
              <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min.js">
                <div
                  style={{
                    alignItems: "center",
                    backgroundColor: "#eeeeee",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                    display: "none",
                    justifyContent: "center",
                  }}
                ></div>
              </Worker>
              <CSVLink
                data={deviceDetails2}
                headers={PDFData}
                filename={"Details.csv"}
              >
                <Button
                  sx={{
                    borderColor: "black",
                    color: "black",
                    fontFamily: "Source Sans Pro",
                  }}
                  variant="outlined"
                >
                  CSV
                </Button>
              </CSVLink>
            </Stack> */}
            <Stack
              alignItems="flex-end"
              justifyContent="flex-end"
              mb={2}
              gap={2}
              direction="row"
            >
              {/* <Typography variant="h6" color={theme.palette.primary.main}>
                EXPORT as
              </Typography>

              <Button
                sx={{ borderColor: "black", color: "black" }}
                variant="outlined"
                // disabled={active}
                onClick={handleSubmit}
              >
                PDF
              </Button>
              <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min.js">
                <div
                  style={{
                    alignItems: "center",
                    backgroundColor: "#eeeeee",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                    display: "none",
                    justifyContent: "center",
                  }}
                ></div>
              </Worker>
              <CSVLink
                data={selectedRows}
                headers={headersCsv}
                filename={"Details.csv"}
              >
                <Button
                  sx={{
                    borderColor: "black",
                    color: "black",
                    fontFamily: "Source Sans Pro",
                  }}
                  variant="outlined"
                >
                  CSV
                </Button>
              </CSVLink> */}
            </Stack>

            <TableContainer
              component={Paper}
              elevation={2}
              sx={{
                maxHeight: "calc(100vh - 200px)",
                minWidth: 250,
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ height: "5%" }}>
                    <TableCell
                      align="left"
                      width="5%"
                      sx={{ backgroundColor: "#EFF2F7" }}
                    >
                      Device Name
                    </TableCell>
                    <TableCell
                      align="left"
                      width="5%"
                      sx={{ backgroundColor: "#EFF2F7" }}
                    >
                      Request Type
                    </TableCell>
                    <TableCell
                      align="left"
                      width="5%"
                      sx={{ backgroundColor: "#EFF2F7" }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      align="left"
                      width="5%"
                      sx={{ backgroundColor: "#EFF2F7" }}
                    >
                      Status Reason
                    </TableCell>
                    <TableCell
                      align="left"
                      width="5%"
                      sx={{ backgroundColor: "#EFF2F7" }}
                    >
                      Requested By
                    </TableCell>
                    <TableCell
                      align="left"
                      width="5%"
                      sx={{ backgroundColor: "#EFF2F7" }}
                    >
                      Requested At
                    </TableCell>
                    {status === "APPROVED" ||
                    status === "REJECTED" ||
                    deviceDetails?.find(
                      status => status.status === "APPROVED",
                    ) ? (
                      <>
                        <TableCell
                          align="left"
                          width="5%"
                          sx={{ backgroundColor: "#EFF2F7" }}
                        >
                          Approved By
                        </TableCell>
                        <TableCell
                          align="left"
                          width="5%"
                          sx={{ backgroundColor: "#EFF2F7" }}
                        >
                          Approved At
                        </TableCell>
                      </>
                    ) : (
                      ""
                    )}

                    {status === "PENDING_APPROVAL" ||
                    deviceDetails?.find(
                      status => status.status === "PENDING_APPROVAL",
                    ) ? (
                      <TableCell
                        align="center"
                        sx={{ backgroundColor: "#EFF2F7" }}
                        width="2%"
                      >
                        ACTIONS
                      </TableCell>
                    ) : (
                      ""
                    )}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={columns.length + 2}>
                        <Typography p={5} textAlign="center">
                          <CircularProgress />
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : deviceDetails?.length ? (
                    deviceDetails?.map((user, index) => (
                      <TableRow key={user.id}>
                        <TableCell
                          component="th"
                          scope="row"
                          align="left"
                          width="10%"
                        >
                          {user.deviceName}
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          align="left"
                          width="10%"
                        >
                          {user.type}
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          align="left"
                          width="10%"
                        >
                          {user.status}
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          align="left"
                          width="10%"
                        >
                          {user.statusReason}
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          align="left"
                          width="10%"
                        >
                          {user.requestedBy}
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          align="left"
                          width="10%"
                        >
                          {user.requestedAt}
                        </TableCell>
                        {user?.status === "APPROVED" ||
                        user?.status === "REJECTED" ? (
                          <>
                            <TableCell
                              component="th"
                              scope="row"
                              align="left"
                              width="10%"
                            >
                              {user.approvedBy}
                            </TableCell>
                            <TableCell
                              component="th"
                              scope="row"
                              align="left"
                              width="10%"
                            >
                              {user.approvedAt}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}

                        {(user?.status === "PENDING_APPROVAL" ||
                          user?.status === "APPROVED") &&
                        deviceDetails?.find(
                          status => status.status === "APPROVED",
                        ) ? (
                          <>
                            {user?.status === "APPROVED" ? (
                              <>
                                {/* <TableCell align="center">
                                  <Switch
                                    checked={!user.status}
                                    onChange={() => handleToggle(user.id)}
                                    inputProps={{ "aria-label": "controlled" }}
                                  />
                                </TableCell> */}
                              </>
                            ) : user?.status === "PENDING_APPROVAL" ? (
                              <>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell>
                                  <Stack flexDirection="row" gap={3}>
                                    <Button
                                      sx={{
                                        backgroundColor: "#7EC8E3",
                                      }}
                                      variant="contained"
                                      size="small"
                                      onClick={() => handleApprove(user?.id)}
                                    >
                                      approve
                                    </Button>
                                    <Button
                                      color="error"
                                      variant="contained"
                                      size="small"
                                      onClick={() => handleReject(user?.id)}
                                    >
                                      reject
                                    </Button>
                                  </Stack>{" "}
                                </TableCell>
                              </>
                            ) : (
                              ""
                            )}
                          </>
                        ) : user?.status === "PENDING_APPROVAL" &&
                          deviceDetails?.find(
                            status => status.status === "PENDING_APPROVAL",
                          ) ? (
                          <TableCell align="center">
                            <Stack flexDirection="row" gap={3}>
                              <Button
                                sx={{
                                  backgroundColor: "#7EC8E3",
                                }}
                                variant="contained"
                                size="small"
                                onClick={() => handleApprove(user?.id)}
                              >
                                approve
                              </Button>
                              <Button
                                color="error"
                                variant="contained"
                                size="small"
                                onClick={() => handleReject(user?.id)}
                              >
                                reject
                              </Button>
                            </Stack>
                          </TableCell>
                        ) : (
                          ""
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length + 2}>
                        <Typography p={5} textAlign="center">
                          NO Data Available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 15, 20]}
              component="div"
              // sx={{
              //   "& .css-194a1fa-MuiSelect-select-MuiInputBase-input.css-194a1fa-MuiSelect-select-MuiInputBase-input.css-194a1fa-MuiSelect-select-MuiInputBase-input":
              //     {
              //       paddingRight: "24px",
              //       paddingBottom: "19px",
              //       minWidth: "16px",
              //     },
              // }}
              sx={{
                '.MuiInputBase-root': {
                  // backgroundColor: 'green',
                  marginTop:'-12px',
                  marginRight:'5px'
                },
                '.MuiTablePagination-toolbar': {
                  // backgroundColor: 'pink',
                  // width: '950px',
                  color: 'rgb(41, 39, 39)',
                  height: '35px',
                },
                '.MuiBox-root': {
                  // backgroundColor: 'yellow',
                  color: 'black',
          
                  '& .MuiSvgIcon-root': {
                    // backgroundColor: 'purple',
                    color: 'black',
                  },
                },
                '.MuiTablePagination-actions':{
                  marginTop:'-12px',
                  marginLeft:'2px'
                },
                marginTop:'10px',
                marginBottom:'-20px'
              }}
              count={totalSize}
              rowsPerPage={pageSize}
              page={pageNumber}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DeviceList;
