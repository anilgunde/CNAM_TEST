import { Autocomplete as MuiAuto, Stack, TextField } from "@mui/material";

const Autocomplete = ({ options, onChange, placeHolder, label }) => {

  //console.log('asfsdsdf',label)
  return (
    <Stack direction="row">
      <MuiAuto
        clearOnBlur
        size="small"
        options={options}
        getOptionLabel={option => option?.label}
        fullWidth
        onChange={(e, value) => {
          value === null ? onChange("") : onChange(value.value);
        }}
        renderInput={params => (
          <TextField
            {...params}
            label={`Select ${label}`}
            sx={{
              minWidth: 180,
              "& .MuiAutocomplete-inputRoot": {
                borderRadius: 0,
              },
            }}
          />
        )}
      />
    </Stack>
  );
};

export default Autocomplete;
