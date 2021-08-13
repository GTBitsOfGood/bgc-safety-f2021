import React from "react";
import styles from "./filter.module.css";

const Button = (props) => {
  const [clicked, setClicked] = React.useState(true);

  const handleClick = (e) => {
    if (clicked) {
      props.setSelected([...props.selected, e.target.innerText]);
      setClicked(!clicked);
    } else {
      console.log(props.selected);
      props.setSelected(
        props.selected.filter((select) => select != e.target.innerText)
      );
      setClicked(!clicked);
    }
  };

  return (
    <button
      className={clicked ? styles.btnUnclicked : styles.btnClicked}
      onClick={(e) => handleClick(e)}
    >
      {props.children}
    </button>
  );
};

const Filter = (props) => {
  const [show, setShow] = React.useState(false);

  return (
    <div className={styles.filter}>
      <button
        type="button"
        className={styles.dropbtn}
        onClick={() => setShow(!show)}
      >
        {props.children}
        {props.options != undefined && (
          <span className={styles.arrowContainer}>
            <i className={`fa fa-chevron-down ${styles.arrowButton}`} />
          </span>
        )}
      </button>
      {props.options != undefined && show && (
        <div className={styles.dropdownContent}>
          {props.options.map((option, i) => (
            <Button setSelected={props.setSelected} selected={props.selected}>
              {option}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filter;
