import React from "react";
import PropTypes from "prop-types";

import styles from "./dropdown.module.css";

const Dropdown = (props) => {
  const { selected, children, showContent, toggleDropdown } = props;

  return (
    <div className={styles.dropdown}>
      <button type="button" className={styles.dropbtn} onClick={toggleDropdown}>
        {selected}
        <span className={styles.arrowContainer}>
          <i className={`fa fa-chevron-down ${styles.arrowButton}`} />
        </span>
      </button>
      {showContent && <div className={styles.dropdownContent}>{children}</div>}
    </div>
  );
};

Dropdown.propTypes = {
  selected: PropTypes.string.isRequired,
  children: PropTypes.shape.isRequired,
  showContent: PropTypes.bool.isRequired,
  toggleDropdown: PropTypes.func.isRequired,
};

export default Dropdown;
