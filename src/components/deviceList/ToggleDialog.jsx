import React from "react";
import {
  Dialog,
  DialogActions,
  Button,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useCallback } from "react";
import axios from "../../api/axios";
import useLocalStorage from "../../hooks/useLocalStorage";
import { toast } from "react-toastify";
const ToggleDialog = ({
  setToggleId,
  toggleId,
  setRefresh,
  setIsLoading,
  toggleStatus,
}) => {
  const [{ accessToken }] = useLocalStorage("jwtWithDetails");
  const [value, setValue] = useState("");
  const handleChange = useCallback(e => {
    setValue(e.target.value);
  }, []);
  const handleClose = useCallback(() => {
    setToggleId("");
    setValue("");
  }, [setToggleId]);

  const handleMoveOn = useCallback(() => {
    if (!value) {
      toast.error("Please Add A  Reason");
    } else {
      setTimeout(() => {
        setToggleId("");
        setValue("");
      }, 500);
      setIsLoading(true);
      axios
        .patch(
          `/admin/devices/${toggleId}`,
          {
            active: toggleStatus === "ACTIVE" ? false : true,
            changeReason: value,
          },
          {
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${accessToken}`,
            },
          },
        )
        .then(res => {
          setIsLoading(false);
          setRefresh(prev => !prev);
          toast.success(
            `SuccessFully ${
              toggleStatus === "ACTIVE" ? "InActivated" : "Activated"
            }`,
          );
          setValue("");
          setToggleId("");
        })
        .catch(err => {
          toast.error(err.response.data.error.message);
        });
    }
  }, [
    value,
    setIsLoading,
    toggleId,
    toggleStatus,
    accessToken,
    setRefresh,
    setToggleId,
  ]);
  return (
    <Dialog open={!!toggleId} onClose={handleClose}>
      <DialogTitle>Please Provide Change Reason</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          rows={3}
          onChange={handleChange}
          value={value}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" autoFocus onClick={handleMoveOn}>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ToggleDialog;
