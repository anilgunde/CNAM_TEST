import Select from "react-select";
// import {} from '@mui/material'
import React, { useCallback } from "react";

const RSelect = ({ options, onChange }) => {
  const handleChange = useCallback(
    e => {
      onChange(e.value);
    },
    [onChange],
  );

  return (
    <Select
      options={options}
      onChange={handleChange}
      style={{ borderRadius: 0, backgroundColor: "red" }}
    />
  );
};

export default RSelect;
