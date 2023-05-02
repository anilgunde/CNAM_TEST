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
  TextField,
  Button,
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
import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
// import Button from "../../components/Buttons/Button";
import { CSVLink } from "react-csv";
import logo from "../../assets/BoA logo@2x.png";

const filterOptions = [
  { label: "Status", value: "status" },
  { label: "device Name", value: "deviceName" },
];

const statusOptions = [
  { label: "Select Status", value: "status" },
  { label: "Pending Approval", value: "PENDING_APPROVAL" },
  { label: "Active", value: "ACTIVE" },
  { label: "In Active", value: "INACTIVE" },
];

const DeviceDetails = () => {
  const columns = [
    {
      field: "id",
      headerName: "Device ID",
      width: 20,
    },
    {
      field: "name",
      headerName: "Device Name",
      width: 20,
    },
    // { field: "type", headerName: "Device_Type", width: 50 },
    { field: "status", headerName: "Status", width: 50 },
    // { field: "statusReason", headerName: "Status Reason", width: 50 },
    // { field: "requestedBy", headerName: "Requested By", width: 50 },
    // { field: "requestedAt", headerName: "Requested At", width: 50 },
    { field: "lastUpdatedAt", headerName: "Last Updated At", width: 50 },
  ];
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
  const [status, setStatus] = useState("status");
  const [type, setType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromDate2, setFromDate2] = useState("");
  const [toDate2, setToDate2] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceNames, setDeviceNames] = useState([]);

  

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
  //     .get("/admin/devices", {
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
  //         ...(status !== "status" && { status }),
  //         pageNumber: pageNumber + 1,
  //         pageSize,
  //       },
  //     })
  //     .then(res => {
  //       axios
  //         .get("/admin/devices", {
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
  //             ...(status !== "status" && { status }),
  //             // pageNumber: 1,
  //             pageSize:
  //               res.data.data.totalSize === 0 ? 10 : res.data.data.totalSize,
  //           },
  //         })
  //         .then(res => {
  //           const { content } = res.data.data;
  //           setDeviceNames(
  //             [...new Set(content?.map(({ name }) => name))]?.map(
  //               deviceName => ({
  //                 label: deviceName,
  //                 value: deviceName,
  //               }),
  //             ),
  //           );
  //           setDeviceDetails2(
  //             content.map((fields, index) => {
  //               return {
  //                 ...fields,
  //                 no: index + 1,
  //                 serial: index+1
  //               };
  //             }),
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
  //     .finally(() => {});
  // }, [
  //   fromDate2,
  //   status,
  //   toDate2,
  //   type,
  //   pageNumber,
  //   pageSize,
  //   refresh,
  //   deviceName,
  //   reportingRoleName,
  //   branchId,
  //   branchDistrict,
  //   accessToken,
  // ]);

  // const onChangeHandle = useCallback(value => {
  //   setSelectedFilter(value);
  //   value === "status" ? setStatus("PENDING_APPROVAL") : setStatus("");
  //   value === "type" ? setType("REGISTRATION") : setType("");
  //   setDeviceName("");
  // }, []);
  console.log('sada',deviceName)
  const onChangeHandle = useCallback(value => {
    setSelectedFilter(value);
    value === "status" ? setStatus("status") : setStatus("");
    // value === "type" ? setType("REGISTRATION") : setType("");
    value === "deviceName" ? setStatus("status") : setType("");
    setDeviceName("");
  }, []);

  const handleSearch = useCallback(
    e => {
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

  console.log('hasdjvasf',selectedFilter)

  // useEffect(() => {
  //   axios
  //     .get("/admin/devices", {
  //       headers: {
  //         "content-type": "application/json",
  //         authorization: `Bearer ${accessToken}`,
  //       },
  //       params: {
  //         from: "2022-01-01",
  //         to: moment(new Date()).format("YYYY-MM-DD"),
  //       },
  //     })
  //     .then(res => {
  //       axios
  //         .get("/admin/devices", {
  //           headers: {
  //             "content-type": "application/json",
  //             authorization: `Bearer ${accessToken}`,
  //           },
  //           params: {
  //             from: "2022-01-01",
  //             to: moment(new Date()).format("YYYY-MM-DD"),
  //             pageSize: res.data.data.totalSize,
  //           },
  //         })

  //         .catch(err => {});
  //     })
  //     .catch(err => {});
  // }, [accessToken]);

  const PDFData = [
    { label: "S.no", key: "no" },
    { label: "Device ID", key: "id" },
    { label: "Device Name", key: "name" },
    { label: "Status", key: "status" },
    { label: "Last Updated At", key: "lastUpdatedAt" },
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
  //       json[i].id,
  //       json[i].name,
  //       json[i].status,
  //       json[i].lastUpdatedAt,
  //     ];
  //     rows.push(temp);
  //   }
  //   pdf.autoTable(columns, rows, {
  //     startY: 85,
  //     margin: {
  //       right: 2,
  //       top: 85,
  //       left: 8.5,
  //     },
  //     didDrawPage: function (data) {
  //       // Header
  //       pdf.addImage(logo, "PNG", 100, 10, 100, 25);
  //       pdf.setLineWidth(0.2);
  //       pdf.rect(8.5, 45, 280, 38);
  //       pdf.setFontSize(14);
  //       pdf.text('Assisted Digital Customer Onboarding - Reports',90,50)
  //       pdf.setFontSize(11);
  //       pdf.text(`Date : ${moment(new Date()).format("DD-MM-YYYY")}`, 250, 60);
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
  //       if (deviceName?.length || status !== "status") {
  //         pdf.text(
  //           `${
  //             selectedFilter === "status"
  //               ? "Status"
  //               : selectedFilter === "deviceName"
  //               ? "Device Name"
  //               : selectedFilter
  //           } : ${
  //             selectedFilter === "status"
  //               ? status
  //               : selectedFilter === "deviceName"
  //               ? deviceName
  //               : null
  //           }`,
  //           11.5,
  //           70,
  //         );
  //       }

  //       if (fromDate && toDate) {
  //         pdf.setFontSize(11);
  //         pdf.text(
  //           `Date Period : ${moment(fromDate).format("DD-MM-YYYY")} To ${moment(
  //             toDate,
  //           ).format("DD-MM-YYYY")}`,
  //           11.5,
  //           60,
  //         );
  //       }
  //       if (!fromDate && !toDate) {
  //         pdf.setFontSize(11);
  //         pdf.text(
  //           `Date Period : 01-01-2022 To ${moment(new Date()).format(
  //             "DD-MM-YYYY",
  //           )}`,
  //           11.5,
  //           60,
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
  //       0: { cellWidth: 20 },
  //       1: { cellWidth: 65 },
  //       2: { cellWidth: 65 },
  //       3: { cellWidth: 65 },
  //       4: { cellWidth: 65 },
  //       // 4: { cellWidth: 47 },
  //       // 5: { cellWidth: 47 },
  //       // 6: { cellWidth: 30 },
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




  const addStyles = useCallback((workbookBlob, dataInfo) => {
    return XlsxPopulate.fromDataAsync(workbookBlob).then(workbook => {
      workbook.sheets().forEach(sheet => {
        sheet.column("A").width(10);
        sheet.column("B").width(15);
        sheet.column("C").width(15);
        sheet.column("D").width(15);
        sheet.column("E").width(15);
        sheet.column("F").width(15);
        sheet.column("G").width(15);
        sheet.column("H").width(15);

        sheet.range(dataInfo.titleRange).style({
          bold: true,
        });
      });
      return workbook
        .outputAsync()
        .then(workbookBlob => URL.createObjectURL(workbookBlob));
    });
  }, []);

  // #2
  const s2ab = useCallback(s => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i);
    }

    return buf;
  }, []);

  const workbook2blob = useCallback(
    workbook => {
      const wopts = {
        bookType: "xlsx",
        type: "binary",
      };
      const wbout = XLSX.write(workbook, wopts);

      const blob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream",
      });
      return blob;
    },
    [s2ab],
  );
  // #3
  const handleExport = useCallback(() => {
    const Filterss = [
      {
        A:
        status !== "status" ?  `${
          
            `Status : ${status}`
        } `
   : null},
   {
    A:
    deviceName.length ?  `${
      
        `Device Name : ${deviceName}`
    } `
: null}
   ,
    ];
    const Datee = [
      {
        A: ` Date Period : ${
          fromDate === "" ? "2022-01-01" : moment(fromDate).format("YYYY-MM-DD")
        } To ${
          toDate === ""
            ? moment(new Date()).format("YYYY-MM-DD")
            : moment(toDate).format("YYYY-MM-DD")
        }`,
      },
    ];

    // const Clientt = [
    //   {
    //     A: `Client : ${Type.split(" ")
    //       .map(word => word[0]?.toUpperCase() + word.substring(1).toLowerCase())
    //       .join(" ")}`,
    //   },
    // ];

    // const Channell = [
    //   {
    //     A: `Channel : ${Channel.split(" ")
    //       .map(word => word[0]?.toUpperCase() + word.substring(1).toLowerCase())
    //       .join(" ")}`,
    //   },
    // ];

    const TimeStampp = [
      { A: ` Timestamp : ${moment(new Date()).format("hh:mm:ss A")}` },
    ];
   //const Role = [{ A: roleSearch.length !== 0 ? `ROLE : ${roleSearch}` : null }];
    let table1 = [
      {
        A: "Serial No",
        B: "Device Id",
        C: "Device Name",
        D: "Status",
        E: "Last Updated At"
        
      },
    ];

    deviceDetails2.forEach(row => {
      table1.push({
        A: row.serial,
        B: row.id,
        C: row.name,
        D: row.status,
        E: row.lastUpdatedAt,
       
      });
    });

    const finalData = [
      { A: "Assisted Digital Customer  Onboarding - Reports" },
      {},
      //...Role,
      ...Filterss,
      // ...Clientt,
      // ...Channell,
      ...Datee,
      ...TimeStampp,
      {},
      {},
      ...table1,
    ];
    // Create a workbook
    const wb = XLSX.utils.book_new();
    // Create a worksheet
    const sheet = XLSX.utils.json_to_sheet(finalData, {
      skipHeader: true,
    });

    const dataInfo = {
      titleCell: "A1",
      titleRange: "A1:E2",
      tbodyRange: `A11:E${finalData.length}`,
    };

    XLSX.utils.book_append_sheet(wb, sheet, "Bank of abyssinia");

    const workbookBlob = workbook2blob(wb);

    const headerIndexes = [];
    finalData.forEach((data, index) =>
      data["A"] === "Serial No" ? headerIndexes.push(index) : null,
    );

    return addStyles(workbookBlob, dataInfo);
  }, [
    // Channel,
    // Type,
    addStyles,
    deviceDetails2,
    fromDate,
    //roleSearch,
    selectedFilter,
    
    toDate,
    workbook2blob,
  ]);

  // #4
  const createDownloadData = useCallback(() => {
    handleExport().then(url => {
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", url);
      downloadAnchorNode.setAttribute("download", "bank of abyssinia.xlsx");
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    });
  }, [handleExport]);





  return (
    <Box>
      <RejectDialog
        rejectId={rejectId}
        setRejectId={setRejectId}
        setRefresh={setRefresh}
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
                  Reports
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
            <Stack
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
                onClick={handleSubmit}
               // disabled={!deviceDetails.length ? true : false}
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
              <Button
                sx={{ borderColor: "black", color: "black" }}
                variant='outlined'
                onClick={() => createDownloadData()}
               // disabled={!deviceDetails.length ? true : false}
              >
                CSV
              </Button>
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
                    {columns?.map(cell => (
                      <TableCell
                        key={cell.headerName}
                        align="left"
                        width="5%"
                        sx={{ backgroundColor: "#EFF2F7" }}
                      >
                        {cell.headerName}
                      </TableCell>
                    ))}
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
                        {columns?.map(({ field, width }) => (
                          <TableCell
                            key={field}
                            component="th"
                            scope="row"
                            align="left"
                            width="10%"
                          >
                            {user[field]}
                          </TableCell>
                        ))}
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

export default DeviceDetails;
