import { Button, Card, CardActions, CardContent } from "@material-ui/core";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import React, { useState } from "react";

const name = "codeLine";

const CustomerCodeline = ({ mode, record, setFieldValue }) => {
  const [editMode, setEditMode] = useState(false);
  const [line1, setLine1] = useState(
    record.codeLine &&
    record.codeLine.length > 44 &&
    record.codeLine.substring(0, 44)
  );
  const [line2, setLine2] = useState(
    record.codeLine &&
    record.codeLine.length > 45 &&
    record.codeLine.substring(44)
  );

  const handleDone = () => {
    setFieldValue(name, line1 + line2);
    setEditMode(false);
  };

  const handleGenerateCodeline = () => {
    // const codeline = generateMRZ({
    //   user: {
    //     firstName: record.firstName,
    //     lastName: record.lastName,
    //     passportNumber: record.passportNumber,
    //     countryCode: "USA",
    //     nationality: "USA",
    //     birthday: record.birthDate,
    //     gender: record.gender,
    //     validUntilDay: "02.03.2028",
    //     personalNumber: "12345678901234",
    //   },
    // });
    // console.log('%c 🍜 codeline: ', 'font-size:20px;background-color: #4b4b4b;color:#fff;', codeline);
    // setFieldValue('codeLine',codeline)
  };
  const handlePDF417 = () => { };
  return (
    <Grid item xs={6}>
      <Card>
        <CardContent>
          <Grid container>
            <Grid item xs={12}>
              {!editMode && <div>{line1}</div>}
              {editMode && (
                <div>
                  <TextField
                    fullWidth
                    autoComplete="off"
                    disabled={mode === "delete"}
                    value={line1}
                    onChange={(event) => {
                      const regex = /^([0-9a-zA-Z<]){1,44}$/i;
                      if (
                        event.target.value === "" ||
                        regex.test(event.target.value)
                      ) {
                        setLine1(event.target.value.toUpperCase());
                        setFieldValue(name, line1 + line2);
                      }
                    }}
                  />
                  <FormHelperText>{line1 && line1.length}</FormHelperText>
                </div>
              )}
            </Grid>
            <Grid item xs={12}>
              {!editMode && <div>{line2}</div>}

              {editMode && (
                <div>
                  <TextField
                    fullWidth
                    autoComplete="off"
                    disabled={mode === "delete"}
                    value={line2}
                    onChange={(event) => {
                      const regex = /^([0-9a-zA-Z<]){1,44}$/i;
                      if (
                        event.target.value === "" ||
                        regex.test(event.target.value)
                      ) {
                        setLine2(event.target.value.toUpperCase());
                        setFieldValue(name, line1 + line2);
                      }
                    }}
                  />
                  <FormHelperText>{line2 && line2.length}</FormHelperText>
                </div>
              )}
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          {!editMode && <Button onClick={() => setEditMode(true)}>Edit</Button>}

          {editMode && (
            <div>
              <Button onClick={handleGenerateCodeline}>Generate</Button>
              <Button onClick={handlePDF417}>PDF417</Button>
              <Button onClick={handleDone}>Finish</Button>
            </div>
          )}
        </CardActions>
      </Card>

      {/* {!editMode && (
        <div>
          <Field
            as={TextField}
            fullWidth
            name={name}
            label="Codeline"
            disabled={mode === "delete"}
            autoComplete="off"
            value={value || ""}
            multiline
            rowsMax={2}
            onChange={(event) => {
              const regex = /^([0-9a-zA-Z<]){1,88}$/i;
              if (event.target.value === "" || regex.test(event.target.value)) {
                setFieldValue(name, event.target.value.toUpperCase());
              }
            }}
          />
          <FormHelperText>{value && value.length}</FormHelperText>
          <ErrorMessage
            name={name}
            component="div"
            style={{ color: "#f44336" }}
          />
        </div>
      )} */}
    </Grid>
  );
};

export default CustomerCodeline;
