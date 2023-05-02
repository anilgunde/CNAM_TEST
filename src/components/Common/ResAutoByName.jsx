import { Autocomplete, Stack, TextField } from "@mui/material";

const ResAutoByName = ({ onChange, options }) => {
  return (
    <Stack direction="row">
      <Autocomplete
        clearOnBlur
        size="small"
        options={options}
        autoComplete={true}
        getOptionLabel={option => option?.fullName}
        fullWidth
        onChange={(e, value) => {
          value === null ? onChange("") : onChange(value.fullName);
        }}
        renderInput={params => (
          <TextField
            {...params}
            label="Select User Name"
            sx={{
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

export default ResAutoByName;
