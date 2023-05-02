import { Autocomplete, Stack, TextField } from "@mui/material";

const AutoCompleteByRegistrationUserName = ({ onChange, options }) => {
  return (
    <Stack direction="row">
      <Autocomplete
        clearOnBlur
        size="small"
        options={options}
        autoComplete={true}
        getOptionLabel={option => (option === undefined ? null : [option])}
        fullWidth
        onChange={(e, value) => {
          value === null ? onChange("") : onChange(value);
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

export default AutoCompleteByRegistrationUserName;
