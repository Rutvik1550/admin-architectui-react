import React from "react";
import { useEffect } from "react";
import { useRef } from "react";

export const SearchForm = ({ filterOptions, setFilterOptions }) => {
  const ref = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name) {
      setFilterOptions((prevVal) => ({
        ...prevVal,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    ref.current.focus();
  },[])

  return (
    <>
      <div className="search-form-container p-4">
        <div className="search-form-wrapper">
          <div className="form-group d-flex mb-2">
            <label for="SearchByFrom" className="d-flex align-items-center">From: </label>
            <input ref={ref} type="SearchByFrom" name="SearchByFrom" value={filterOptions?.SearchByFrom} onChange={handleChange} className="form-control" id="SearchByFrom" aria-describedby="SearchByFromHelp" />
          </div>
          <div className="form-group d-flex mb-2">
            <label for="SearchByTo_CC" className="d-flex align-items-center">To: </label>
            <input type="SearchByTo_CC" name="SearchByTo_CC" value={filterOptions?.SearchByTo_CC} onChange={handleChange} className="form-control" id="SearchByTo_CC" />
          </div>
          <div className="form-group d-flex mb-2">
            <label for="SearchSubject" className="d-flex align-items-center">Subject: </label>
            <input type="SearchSubject" name="SearchSubject" value={filterOptions?.SearchSubject} onChange={handleChange} className="form-control" id="SearchSubject" />
          </div>
          <div className="form-group d-flex mb-2">
            <label for="SearchWords" className="d-flex align-items-center">Includes: </label>
            <input type="SearchWords" name="SearchWords" value={filterOptions?.SearchWords} onChange={handleChange} className="form-control" id="SearchWords" />
          </div>
          <div className="form-group d-flex mb-2">
            <label for="AttachmentSize" className="d-flex align-items-center">Size: </label>
            <input type="AttachmentSize" name="AttachmentSize" value={filterOptions?.AttachmentSize} onChange={handleChange} className="form-control" id="AttachmentSize" />
          </div>
          <div className="form-group d-flex mb-2">
            <label for="StartDate" className="d-flex align-items-center">Start Date: </label>
            <input type="date" name="StartDate" value={filterOptions?.StartDate} onChange={handleChange} className="form-control" id="StartDate" />
          </div>
          <div className="form-group d-flex mb-2">
            <label for="EndDate" className="d-flex align-items-center">End Date: </label>
            <input type="date" name="EndDate" value={filterOptions?.EndDate} onChange={handleChange} className="form-control" id="EndDate" />
          </div>
        </div>
      </div>
    </>
  );
};
