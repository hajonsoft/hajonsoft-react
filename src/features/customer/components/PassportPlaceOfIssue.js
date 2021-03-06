import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { ErrorMessage, Field } from "formik";
import FormHelperText from "@material-ui/core/FormHelperText";

import React from "react";

const name = "passPlaceOfIssue";
const PassportPlaceOfIssue = ({ mode, value, setFieldValue }) => {
  return (
    <Grid item xs={3}>
      <Field
        as={TextField}
        fullWidth
        name={name}
        label="Issued at"
        disabled={mode === "delete"}
        autoComplete="off"
        onChange={(event) => {
          const regex = /^([-a-zA-Z0-9 ]){1,25}$/i;
          if (event.target.value === "" || regex.test(event.target.value)) {
            setFieldValue(name, event.target.value.toUpperCase());
          }
        }}
      />
      <ErrorMessage name={name} component="div" style={{ color: "#f44336" }} />
      <FormHelperText>{value && value.length}</FormHelperText>

    </Grid>
  );
};

export default PassportPlaceOfIssue;
