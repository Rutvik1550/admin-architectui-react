import React, { useEffect, useState } from "react";
import { useDebounce } from "../../../hooks/useDebounce";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { setAuthToken } from "../../../reducers/Auth";
import { connect } from "react-redux";
import { useMailService } from "../../../services/mail.service";

const animatedComponents = makeAnimated();

const MultiSelect = ({name, onChange, token}) => {
  const [searchText, setSearchText] = useState("");
  const mailService = useMailService(token);
  const [selectOptions, setSelectOptions] = useState({});

  const searchQuery = useDebounce(searchText, 1200);

  const handleSearchEmail = async (text) => {
    try {
      const res = await mailService.autoFillEmail(text);
      const result = {};
      res.autofillItems?.forEach((item) => {
        const temp = item["Items"].split(", ");
        if (temp.length > 1) {
          temp.forEach((email) => {
            const splitEmail = email.split(" <");
            if (splitEmail[1]) {
              result[splitEmail[1].slice(0, splitEmail[1].length - 1)] = email;
            } else {
              result[email] = email;
            }
          });
        } else {
          const splitEmail = temp[0].split(" <");
          if (splitEmail[1]) {
            result[splitEmail[1].slice(0, splitEmail[1].length - 1)] = temp[0];
          } else {
            result[temp[0]] = temp[0];
          }
        }
      });
      setSelectOptions(result);
    } catch (error) {
      console.log("Error with handleSearchMails: ", error);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      handleSearchEmail(searchQuery);
    }
  }, [searchQuery]);

  const handleChange = (text) => {
    setSearchText(text);
  };

  const handleMultiSelect = (val) => {
    const selectedValues = val.map(email => email.value).join(" ");
    onChange(selectedValues, name)
  };

  return (
    <>
      <div className="input-group-prepend d-flex">
        <label className="input-group-text" htmlFor="inputGroupSelect01">
          {name}:{" "}
        </label>
      </div>
      <Select
        closeMenuOnSelect={false}
        components={animatedComponents}
        defaultValue={[]}
        onChange={handleMultiSelect}
        onInputChange={handleChange}
        isMulti
        className={`react-multi-select ${Object.keys(selectOptions).length ? "" : "hide-select-list"}`}
        options={Object.keys(selectOptions).map(key => ({
            label: selectOptions[key],
            value: key
        }))}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  token: state.authReducer.token,
});

const mapDispatchToProps = (dispatch) => ({
  setAuthToken: (token) => dispatch(setAuthToken(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MultiSelect);
