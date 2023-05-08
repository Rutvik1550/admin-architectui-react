import React from "react";

const withLoader = (WrappedComponent, Loader) => {
  return function WithLoaderComponent({ loading, ...props }) {
    if (loading) return <Loader />;
    return <WrappedComponent {...props} />;
  };
};

export default withLoader;
