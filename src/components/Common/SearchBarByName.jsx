import { InputAdornment, styled, TextField } from "@mui/material";
import { Stack } from "@mui/material";
import Button from "../Buttons/Button";
import SearchIcon from "@mui/icons-material/Search";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
// import { useTheme } from "@mui/material";

const StyledInput = styled(TextField)(() => ({
  width: 180,
}));

export const SearchButton = styled(Button)(() => ({
  height: "42px",
  paddingLeft: 5,
  paddingRight: 5,
  width: 80,
  textTransform: "uppercase",
  fontWeight: "bold",
  color: "#fff",
}));
const SearchBarByName = ({ onChange, label }) => {
  const [search, setSearch] = useState("");
  const handleClick = useCallback(() => {
    if (search.length === 0) {
      toast.error(`Please Fill ${label} `, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    onChange(search);
  }, [label, onChange, search]);
  return (
    <>
      <Stack alignItems="center" direction="row">
        <StyledInput
          type="text"
          value={search}
          size="small"
          placeholder="Search Here"
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <SearchButton size="small" variant="contained" onClick={handleClick}>
          Search
        </SearchButton>
      </Stack>
    </>
  );
};

export default SearchBarByName;
