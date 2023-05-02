import React, { useEffect, useCallback, useMemo } from "react";
import { Worker } from "@react-pdf-viewer/core";
import "jspdf-autotable";
import jsPDF from "jspdf";
import logo from "../../../assets/BoA logo@2x.png";
import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import {
  Paper,
  Stack,
  Button,
  TablePagination,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Table,
  TableContainer,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import moment from "moment";
import { CSVLink } from "react-csv";
import { useState } from "react";
import axios from "../../../api/axios";
import { v4 as uuid } from "uuid";
import useLocalStorage from "../../../hooks/useLocalStorage";

const columns = [
  { field: "createdAt", headerName: "Created Date", width: 50 },
  { field: "actorName", headerName: "Actor Name", width: 50 },
  {
    field: "channel",
    headerName: "Channel",
    width: 50,
  },
  {
    field: "clientType",
    headerName: "Client Type",
    width: 50,
  },
  {
    field: "result",
    headerName: "Result",
    width: 50,
  },
  {
    field: "identityNumber",
    headerName: "Identity Number",
    width: 50,
  },
  {
    field: "description",
    headerName: "Description",
    width: 50,
  },
  {
    field: "eventTypeSpecificAttributes",
    headerName: "Event_Type_Specific_Attributes",
    width: 50,
  },
];

const headersCsv = [
  { label: "Created Date", key: "createdAt" },
  { label: "Actor Name", key: "actorName" },
  { label: "Channel", key: "channel" },
  { label: "Client Type", key: "clientType" },
  { label: "Result", key: "result" },
  { label: "Identity Number", key: "identityNumber" },
  { label: "Description", key: "description" },

  {
    label: "Event_Type_Specific_Attributes",
    key: "eventTypeSpecificAttributes",
  },
];

const PDFDate = [
  { label: "No", key: "serial" },
  { label: "Created Date", key: "createdAt" },
  { label: "Actor Name", key: "actorName" },
  { label: "Channel", key: "channel" },
  { label: "Client Type", key: "clientType" },
  { label: "Result", key: "result" },
  { label: "Identity Number", key: "identityNumber" },

  { label: "Description", key: "description" },
  {
    label: "Event_Type_Specific_Attributes",
    key: "eventTypeSpecificAttributes",
  },
];
const AuditTrailListCard = ({
  search,
  selectedFilter,
  roleFilter,
  roleSearch,
  branches,
  Type,
  Channel,
  fromDate,
  toDate,
}) => {
  // ! Replace
  const [
    { accessToken, reportingRoleName, branchId, branchDistrict, roleName },
  ] = useLocalStorage("jwtWithDetails");
  const [csvFile, setCsvFile] = useState([]);
  const [userListData, setUserListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalSize, setTotalSize] = useState(0);
  const theme = useTheme();

  const searchText = useMemo(
    () => ({
      ...(search && {
        [selectedFilter]:
          selectedFilter === "mobileNumber" ? `+251${search}` : search,
      }),
      ...(roleSearch && {
        [roleFilter]: roleSearch,
      }),
    }),
    [roleFilter, roleSearch, search, selectedFilter],
  );
  const auditTrailList = useCallback(
    (pageSize, pageNumber) => {
      return axios.get("/admin/reporting/events", {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        params: {
          ...(pageNumber === 0
            ? { pageNumber: 1 }
            : { pageNumber: pageNumber + 1 }),
          from:
            fromDate === ""
              ? "2022-01-01"
              : moment(fromDate).format("YYYY-MM-DD"),
          to:
            toDate === ""
              ? moment(new Date()).format("YYYY-MM-DD")
              : moment(toDate).format("YYYY-MM-DD"),
          clientType: Type,
          channel: Channel,
          ...(reportingRoleName === "BRANCH_REPORT_VIEWER" && {
            branch: branchId,
          }),
          ...(reportingRoleName === "DISTRICT_REPORT_VIEWER" && {
            district: branchDistrict,
          }),
          pageSize,
          ...searchText,
        },
      });
    },
    [
      Channel,
      Type,
      accessToken,
      branchDistrict,
      branchId,
      fromDate,
      reportingRoleName,
      searchText,
      toDate,
    ],
  );

  // ! Displaying  BranchId as BranchName
  // const branchesMap = useMemo(
  //   () =>
  //     branches?.reduce((acc, branch) => {
  //       acc[branch?.value] = branch?.label;
  //       return acc;
  //     }, {}) || {},
  //   [branches],
  // );


  // #1
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
          search.length !== 0
            ? ` ${
                selectedFilter === "branchId"
                  ? "Branch Name"
                  : selectedFilter === "mobileNumber"
                  ? "Mobile Number"
                  : selectedFilter === "district"
                  ? "District"
                  : selectedFilter === "name"
                  ? "Name"
                  : selectedFilter
              }:${search}`
            : null,
      },
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

    const Clientt = [
      {
        A: `Client : ${Type.split(" ")
          .map(word => word[0]?.toUpperCase() + word.substring(1).toLowerCase())
          .join(" ")}`,
      },
    ];

    const Channell = [
      {
        A: `Channel : ${Channel.split(" ")
          .map(word => word[0]?.toUpperCase() + word.substring(1).toLowerCase())
          .join(" ")}`,
      },
    ];

    const TimeStampp = [
      { A: ` Timestamp : ${moment(new Date()).format("hh:mm:ss A")}` },
    ];
    const Role = [{ A: roleSearch.length !== 0 ? `ROLE : ${roleSearch}` : null }];
    let table1 = [
      {
        A: "Serial No",
        B: "CreatedAt",
        C: "ActorName",
        D: "Channel",
        E: "ClientType",
        F: "Result",
        G: "IdentityNumber",
        H: "Description",
        I: "EventTypeSpecificAttributes",
      },
    ];

    csvFile.forEach(row => {
      table1.push({
        A: row.serial,
        B: row.createdAt,
        C: row.actorName,
        D: row.channel,
        E: row.clientType,
        F: row.result,
        G: row.identityNumber,
        H: row.description,
        I: row.eventTypeSpecificAttributes,
      });
    });

    const finalData = [
      { A: "Assisted Digital Customer  Onboarding - Audit Trail Events" },
      {},
      ...Role,
      ...Filterss,
      ...Clientt,
      ...Channell,
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
      titleRange: "A1:I2",
      tbodyRange: `A11:I${finalData.length}`,
    };

    XLSX.utils.book_append_sheet(wb, sheet, "Bank of abyssinia");

    const workbookBlob = workbook2blob(wb);

    const headerIndexes = [];
    finalData.forEach((data, index) =>
      data["A"] === "createdAt" ? headerIndexes.push(index) : null,
    );

    return addStyles(workbookBlob, dataInfo);
  }, [
    Channel,
    Type,
    addStyles,
    csvFile,
    fromDate,
    roleSearch,
    search,
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


  // const handleSubmit = async e => {
  //   e.preventDefault();
  //   const data = await auditTrailList(totalSize, 0);

  //   const json = data.data.data.content?.map((values, index) => {
  //     return {
  //       serial: index + 1,
  //       createdAt: values.createdAt,
  //       actorName: values.actorName,
  //       channel: values.channel,
  //       clientType: values.clientType,
  //       result: values.result,
  //       identityNumber: values.identityNumber,
  //       description: values.description,
  //       eventTypeSpecificAttributes: values.attributes?.credentialType,
  //     };
  //   });

  //   const pdf = new jsPDF("landscape");
  //   const columns = PDFDate.map(fields => fields.label);
  //   var rows = [];

  //   for (let i = 0; i < json.length; i++) {
  //     var temp = [
  //       json[i].serial,
  //       json[i].createdAt,
  //       json[i].actorName,
  //       json[i].channel,
  //       json[i].clientType,
  //       json[i].result,
  //       json[i].identityNumber,
  //       json[i].description,
  //       json[i].eventTypeSpecificAttributes,
  //     ];
  //     rows.push(temp);
  //   }
  //   pdf.autoTable(columns, rows, {
  //     startY: 75,
  //     margin: {
  //       right: 2,
  //       top: 75,
  //       left: 8.5,
  //     },
  //     didDrawPage: function (data) {
  //       pdf.addImage(logo, "PNG", 100, 10, 100, 25);
  //       pdf.setLineWidth(0.2);
  //       pdf.rect(8.5, 45, 280, 28);
  //       pdf.setFontSize(11);
  //       pdf.text(`Date : ${moment(new Date()).format("DD-MM-YYYY")}`, 250, 50);
  //       pdf.setFontSize(11);
  //       pdf.text(
  //         `Channel : ${Channel.split(" ")
  //           .map(
  //             word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
  //           )
  //           .join(" ")}`,
  //         250,
  //         60,
  //       );
  //       pdf.setFontSize(11);
  //       pdf.text(
  //         `Client : ${Type.split(" ")
  //           .map(
  //             word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
  //           )
  //           .join(" ")}`,
  //         250,
  //         70,
  //       );
  //       pdf.setFontSize(11);
  //       if (search.length) {
  //         pdf.text(
  //           `${
  //             selectedFilter === "branchId"
  //               ? "Branch Name"
  //               : selectedFilter === "mobileNumber"
  //               ? "Mobile Number"
  //               : selectedFilter === "district"
  //               ? "District"
  //               : selectedFilter === "name"
  //               ? "Name"
  //               : selectedFilter
  //           } : ${
  //             selectedFilter === "branchId"
  //               ? branches.find(dem => dem.value === search).label
  //               : search
  //           }`,
  //           11.5,
  //           60,
  //         );
  //       }
  //       if (roleSearch.length) {
  //         pdf.text(
  //           `${roleFilter === "role" ? "Role" : "Role"} : ${
  //             roleFilter === "role" ? roleSearch : null
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
  //       let str = "Page No " + pdf.internal.getNumberOfPages();
  //       pdf.setFontSize(10);

  //       let pageSize = pdf.internal.pageSize;
  //       let pageHeight = pageSize.height
  //         ? pageSize.height
  //         : pageSize.getHeight();
  //       pdf.text(str, data.settings.margin.left + 125, pageHeight - 5);
  //     },

  //     columnStyles: {
  //       0: { cellWidth: 10 },
  //       1: { cellWidth: 30 },
  //       2: { cellWidth: 30 },
  //       3: { cellWidth: 35 },
  //       4: { cellWidth: 20 },
  //       5: { cellWidth: 35 },
  //       6: { cellWidth: 35 },
  //       7: { cellWidth: 35 },
  //       8: { cellWidth: 50 },
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
  //     pdf.save("BankOfAbyssinia");
  // };


  const handleSubmit = async e => {
    e.preventDefault();
    const data = await auditTrailList(totalSize, 0);

    const json = data.data.data.content?.map((values, index) => {
      return {
        serial: index + 1,
        createdAt: values.createdAt,
        actorName: values.actorName,
        channel: values.channel,
        clientType: values.clientType,
        result: values.result,
        identityNumber: values.identityNumber,
        description: values.description,
        eventTypeSpecificAttributes: values.attributes?.credentialType,
      };
    });

    const pdf = new jsPDF("landscape");
    const columns = PDFDate.map(fields => fields.label);
    var rows = [];

    for (let i = 0; i < json.length; i++) {
      var temp = [
        json[i].serial,
        json[i].createdAt,
        json[i].actorName,
        json[i].channel,
        json[i].clientType,
        json[i].result,
        json[i].identityNumber,
        json[i].description,
        json[i].eventTypeSpecificAttributes,
      ];
      rows.push(temp);
    }
    pdf.autoTable(columns, rows, {
      startY: 85,
      margin: {
        right: 2,
        top: 85,
        left: 8.5,
      },
      didDrawPage: function (data) {
        pdf.addImage(logo, "PNG", 100, 10, 100, 25);
        pdf.setLineWidth(0.2);
        pdf.rect(8.5, 45, 280, 38);
        pdf.setFontSize(14);
        pdf.text('Assisted Digital Customer Onboarding - Audit Trails',90,50)
        pdf.setFontSize(11);
        pdf.text(`Date : ${moment(new Date()).format("DD-MM-YYYY")}`, 250, 60);
        pdf.setFontSize(11);
        pdf.text(
          `Channel : ${Channel.split(" ")
            .map(
              word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
            )
            .join(" ")}`,
          250,
          70,
        );
        pdf.setFontSize(11);
        pdf.text(
          `Client : ${Type.split(" ")
            .map(
              word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
            )
            .join(" ")}`,
          250,
          80,
        );
        pdf.setFontSize(11);
        if (search.length) {
          pdf.text(
            `${
              selectedFilter === "branchId"
                ? "Branch Name"
                : selectedFilter === "mobileNumber"
                ? "Mobile Number"
                : selectedFilter === "district"
                ? "District"
                : selectedFilter === "name"
                ? "Name"
                : selectedFilter
            } : ${
              selectedFilter === "branchId"
                ? branches.find(dem => dem.value === search).label
                : search
            }`,
            11.5,
            70,
          );
        }
        if (roleSearch?.length) {
          pdf.text(
            `${roleFilter === "role" ? "Role" : roleFilter} : ${
              roleFilter === "role" ? roleSearch : null
            }`,
            11.5,
            80,
          );
        }
        if (fromDate && toDate) {
          pdf.setFontSize(11);
          pdf.text(
            `Date Period : ${moment(fromDate).format("DD-MM-YYYY")} To ${moment(
              toDate,
            ).format("DD-MM-YYYY")}`,
            11.5,
            60,
          );
        }
        if (!fromDate && !toDate) {
          pdf.setFontSize(11);
          pdf.text(
            `Date Period : 01-01-2022 To ${moment(new Date()).format(
              "DD-MM-YYYY",
            )}`,
            11.5,
            60,
          );
        }
        pdf.setFontSize(10);
        pdf.text(
          `Generated by : ${roleName
            .split("_")
            .join(" ")
            .split(" ")
            .map(
              word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
            )
            .join(" ")} (${reportingRoleName
            .split("_")
            .join(" ")
            .split(" ")
            .map(
              word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
            )
            .join(" ")})`,
          11.5,
          200,
        );
        pdf.setFontSize(11);
        pdf.text(
          `Timestamp : ${moment(new Date()).format("hh:mm:ss A")}`,
          240,
          200,
        );
        let str = "Page No " + pdf.internal.getNumberOfPages();
        pdf.setFontSize(10);

        let pageSize = pdf.internal.pageSize;
        let pageHeight = pageSize.height
          ? pageSize.height
          : pageSize.getHeight();
        pdf.text(str, data.settings.margin.left + 125, pageHeight - 5);
      },

      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 35 },
        4: { cellWidth: 20 },
        5: { cellWidth: 35 },
        6: { cellWidth: 35 },
        7: { cellWidth: 35 },
        8: { cellWidth: 50 },
      },
      theme: "grid",
      styles: {
        font: "times",
        overflow: "linebreak",
        align: "left",
        cellPadding: 2,
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        textColor: [0, 0, 0],
      },
      headStyles: {
        textColor: [0, 0, 0],
        fontStyle: "normal",
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        fillColor: [244, 182, 47],
      },
      alternateRowStyles: {
        fillColor: [222, 222, 222],
        textColor: [0, 0, 0],
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },

      tableLineColor: [0, 0, 0],
    });
    pdf.save("BankOfAbyssinia");
  };




  useEffect(() => {
    setIsLoading(true);

    auditTrailList(pageSize, pageNumber)
      .then(res => {
        const data = res.data.data.content;
        setTotalSize(res.data.data.totalSize);
        const trimmedData = data.map(values => {
          return {
            id: uuid(),
            createdAt: values.createdAt,
            actorName: values.actorName,
            channel: values.channel,
            clientType: values.clientType,
            result: values.result,
            identityNumber: values.identityNumber,
            description: values.description,
            eventTypeSpecificAttributes: values.attributes?.credentialType,
          };
        });

        axios
          .get("/admin/reporting/events", {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${accessToken}`,
            },
            params: {
              pageNumber:1,
              clientType: Type,
              channel: Channel,
              ...(reportingRoleName === "BRANCH_REPORT_VIEWER" && {
                branch: branchId,
              }),
              ...(reportingRoleName === "DISTRICT_REPORT_VIEWER" && {
                district: branchDistrict,
              }),
              from:
                fromDate === ""
                  ? "2022-01-01"
                  : moment(fromDate).format("YYYY-MM-DD"),
              to:
                toDate === ""
                  ? moment(new Date()).format("YYYY-MM-DD")
                  : moment(toDate).format("YYYY-MM-DD"),
              pageSize:
                res.data.data.totalSize === 0 ? 10 : res.data.data.totalSize,
              ...searchText,
            },
          })
          .then(res2 => {
            const json = res2.data.data.content?.map((values, index) => {
              return {
                serial:index + 1,
                createdAt: values.createdAt,
                actorName: values.actorName,
                channel: values.channel,
                clientType: values.clientType,
                result: values.result,
                identityNumber: values.identityNumber,
                description: values.description,
                eventTypeSpecificAttributes: values.attributes?.credentialType,
              };
            });
            setCsvFile(json);
          });
        setUserListData(trimmedData);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [
    Channel,
    Type,
    accessToken,
    auditTrailList,
    branchDistrict,
    branchId,
    fromDate,
    pageNumber,
    pageSize,
    reportingRoleName,
    searchText,
    toDate,
  ]);

  const handleChangePage = useCallback((e, newPage) => {
    setPageNumber(newPage);
  }, []);
  const handleChangeRowsPerPage = useCallback(e => {
    setPageSize(parseInt(e.target.value, 10));
    setPageNumber(0);
  }, []);

  return (
    <Paper elevation={5} sx={{ p: 2 }}>
      <Stack
        alignItems='flex-end'
        justifyContent='flex-end'
        mb={2}
        gap={2}
        direction='row'
      >
        <Typography variant='h6' color={theme.palette.primary.main}>
          EXPORT as
        </Typography>

        <Button
          sx={{ borderColor: "black", color: "black" }}
          variant='outlined'
          onClick={handleSubmit}
        >
          PDF
        </Button>
        <Worker workerUrl='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min.js'>
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
              {columns.map(cell => (
                <TableCell
                  key={cell.headerName}
                  align='left'
                  width='5%'
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
                  <Typography p={5} textAlign='center'>
                    <CircularProgress />
                  </Typography>
                </TableCell>
              </TableRow>
            ) : userListData.length ? (
              userListData.map((user, index) => (
                <TableRow key={user.id}>
                  {/* <TableCell padding="checkbox">
                  <Checkbox color="primary" />
                </TableCell> */}

                  {columns.map(({ field, width }) => (
                    <TableCell
                      key={field}
                      component='th'
                      scope='row'
                      align='left'
                      width='10%'
                    >
                      {/* {field === "branchId"
                        ? branchesMap[user[field]]
                        : user[field]} */}
                      {user[field]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 2}>
                  <Typography p={5} textAlign='center'>
                    NO Data Available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        sx={{
          "& .css-194a1fa-MuiSelect-select-MuiInputBase-input.css-194a1fa-MuiSelect-select-MuiInputBase-input.css-194a1fa-MuiSelect-select-MuiInputBase-input":
            {
              paddingRight: "24px",
              paddingBottom: "19px",
              minWidth: "16px",
            },
        }}
        rowsPerPageOptions={[10, 15, 20]}
        component='div'
        count={totalSize}
        rowsPerPage={pageSize}
        page={pageNumber}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default AuditTrailListCard;
