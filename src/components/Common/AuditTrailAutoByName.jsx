import { Autocomplete, Stack, TextField } from "@mui/material";

const AuditTrailAutoByName = ({ onChange, options }) => {
  return (
    <Stack direction="row">
      <Autocomplete
        clearOnBlur
        size="small"
        options={options?.sort((a, b) =>
          a?.actorName?.localeCompare(b?.actorName),
        )}
        autoComplete={true}
        getOptionLabel={option => option?.actorName}
        fullWidth
        onChange={(e, value) => {
          value === null ? onChange("") : onChange(value.actorName);
        }}
        renderInput={params => (
          <TextField
            {...params}
            label="Select Customer Name"
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

export default AuditTrailAutoByName;
