import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const useStyles = makeStyles(() => ({
  header: {
    display: "flex",
    justifyContent: "space-around",
  },
  attended: {
    backgroundColor: "#BDE0FB",
    borderRadius: 20,
  },
  date: {
    padding: "4px 0px",
  },
  button: {
    border: "none",
  },
  th: {
    flex: 1,
    fontWeight: "bold",
    padding: "4px 0px",
  },
  td: {
    flex: 1,
    padding: "0px 3px",
  },
  tr: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
  },
  table: {
    display: "flex",
    flexDirection: "column",
  },
}));

const getMonthString = (monthInd) => {
  return months[monthInd];
};

const buildCalendarRows = (month, year) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const rows = [];

  let currentRow = [];
  let j = firstDay.getDay();
  for (let k = 0; k < j; k += 1) {
    currentRow.push(null);
  }
  for (let i = firstDay.getDate(); i <= lastDay.getDate(); i += 1) {
    if (j % 7 === 0) {
      rows.push(currentRow);
      currentRow = [];
      j = 0;
    }
    currentRow.push(i);
    j += 1;
  }
  while (j < 7) {
    currentRow.push(null);
    j += 1;
  }
  rows.push(currentRow);
  return rows;
};

const formatDatesAttended = (datesAttended) => {
  return datesAttended.map((date) => date.getDate());
};

const Calendar = (props) => {
  const { defaultMonth, defaultYear } = props;
  const { getDatesAttended } = props;
  const datesAttended = formatDatesAttended(getDatesAttended());
  const [month, setMonth] = React.useState(defaultMonth);
  const [year, setYear] = React.useState(defaultYear);
  const classes = useStyles();

  const handleBackMonth = (currentMonth, currentYear) => {
    if (currentMonth - 1 < 0) {
      setYear(currentYear - 1);
      setMonth(11);
    } else {
      setMonth(currentMonth - 1);
    }
  };

  const handleForwardMonth = (currentMonth, currentYear) => {
    if (currentMonth + 1 > 11) {
      setYear(currentYear + 1);
      setMonth(0);
    } else {
      setMonth(currentMonth + 1);
    }
  };

  const getAttended = (date) => {
    return datesAttended.includes(date);
  };

  return (
    <div>
      <div className={classes.header}>
        <button
          type="button"
          className={classes.button}
          onClick={() => handleBackMonth(month, year)}
        >
          {"<"}
        </button>
        {`${getMonthString(month)} ${year}`}
        <button
          type="button"
          className={classes.button}
          onClick={() => handleForwardMonth(month, year)}
        >
          {">"}
        </button>
      </div>
      <div className={classes.table}>
        <div className={classes.tr}>
          <div className={classes.th}>Sun</div>
          <div className={classes.th}>Mon</div>
          <div className={classes.th}>Tue</div>
          <div className={classes.th}>Wed</div>
          <div className={classes.th}>Thu</div>
          <div className={classes.th}>Fri</div>
          <div className={classes.th}>Sat</div>
        </div>
        {buildCalendarRows(month, year).map((row) => (
          <div className={classes.tr}>
            {row.map((date) => (
              <div className={classes.td}>
                <div
                  className={`${getAttended(date) && classes.attended} ${
                    classes.date
                  }`}
                >
                  {date}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

Calendar.propTypes = {
  defaultMonth: PropTypes.number.isRequired,
  defaultYear: PropTypes.number.isRequired,
};

export default Calendar;
