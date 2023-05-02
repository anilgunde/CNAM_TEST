import { InputAdornment, styled, TextField } from "@mui/material";
import { Stack } from "@mui/material";
import Button from "../Buttons/Button";
import SearchIcon from "@mui/icons-material/Search";
import { useCallback, useState, useRef } from "react";
import { toast } from "react-toastify";
// import { useTheme } from "@mui/material";

const StyledInput = styled(TextField)(({ theme }) => ({
  width: 180,
}));

export const SearchButton = styled("button")(({ theme }) => ({
  height: "42px",
  paddingLeft: 5,
  paddingRight: 5,
  width: 80,
  border: "none",
  backgroundColor: theme.palette.primary.main,
  textTransform: "uppercase",
  fontWeight: "bold",
  color: "#fff",
}));
const SearchBarByCustomerNumber = ({
  onChange,
  label,
  setFromDate2,
  setToDate2,
}) => {
  //   const theme = useTheme();
  const inputRef = useRef(null);
  const [search, setSearch] = useState("");

  const handleClick = useCallback(() => {
    if (!search.length) {
      toast.error(`Please Fill ${label} `);
    } else {
      return onChange(search);
    }
  }, [label, onChange, search]);

  const handleSearch = useCallback(e => {
    setSearch(e.target.value.replace(/\D/g, ""));
  }, []);
  return (
    <>
      <Stack alignItems="center" direction="row">
        <StyledInput
          type="text"
          value={search}
          size="small"
          placeholder="Search Here"
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <SearchButton
          size="small"
          variant="contained"
          ref={inputRef}
          onClick={handleClick}
        >
          Search
        </SearchButton>
      </Stack>
    </>
  );
};

export default SearchBarByCustomerNumber;
