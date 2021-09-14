import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const SelectDropdown = (props) => {
  const { label, options, setFilters, filters } = props;
  const classes = useStyles();
  const [value, setValue] = React.useState("");

  const handleClick = (newValue) => {
    setFilters([...filters.filter((filter) => filter != value), newValue]);
    setValue(newValue);
  };

  const handleDeleteFilters = (deleteFilter) => {
    setFilters(
      filters.map((filter) => {
        if (filter == deleteFilter) {
          return "";
        }
        return filter;
      })
    );
  };

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel id="demo-simple-select-outlined-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={value}
        onChange={(e) => handleClick(e.target.value)}
        label={label}
      >
        {options.map((option) => {
          return <MenuItem value={option}>{option}</MenuItem>;
        })}
      </Select>
    </FormControl>
  );
};

export default SelectDropdown;
