import { Autocomplete, Stack, TextField } from "@mui/material";

const AutoCompleteByName = ({ onChange, options }) => {
  return (
    <Stack direction="row">
      <Autocomplete
        clearOnBlur
        size="small"
        options={options}
        autoComplete={true}
        getOptionLabel={option => option?.displayName}
        fullWidth
        onChange={(e, value) => {
          value === null ? onChange("") : onChange(value.displayName);
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

export default AutoCompleteByName;
