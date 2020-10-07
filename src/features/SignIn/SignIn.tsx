import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import Alert from "@material-ui/lab/Alert";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import * as yup from "yup";
import allied_logo from "../../images/allied_logo_svg.svg";
import identityService from "../Register/redux/saga/identityService";
import AlertDialog from "../shared/components/AlertDialog";
import SpinnerDialog from "../shared/components/SpinnerDialog";
import { FingerprintService } from "../shared/services/fingerprint-service";
import useUserState from "./redux/useUserState";
import UserPool from "./UserPool";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    height: "100vh",
    margin: "0 auto",
    background: "linear-gradient(180deg, #007EB8 0%, #00547A 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const SignIn = () => {
  const mediaMobile = useMediaQuery((theme: any) =>
    theme.breakpoints.down("sm")
  );
  const classes = useStyles();
  const history = useHistory();
  const [user, setUser] = useState({ email: "", password: "" });
  const [state, setState] = useState({
    isError: false,
    message: "",
    isNewPassword: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const { setCognitoUser } = useUserState();
  const [failCounter, setFailCounter] = useState(0);
  const [fpValue, setFPValue] = useState("");
  const [regLocked, setRegLocked] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [regSubmit, setRegSubmit] = useState(false);

  const identitySvc = identityService();

  useEffect(() => {
    async function getIsLocked() {
      const fpSvc = await FingerprintService.getInstance();
      if (fpSvc !== undefined) {
        let fp = fpSvc.getFingerPrint();
        let locked = await identitySvc.queryLoginLockout(user.email, fp);
        setFPValue(fp);
        setRegLocked(locked);
      }
    }
    getIsLocked();
  }, [failCounter, identitySvc, user.email]);

  const createAccountSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Required"),
    password: yup
      .string()
      .required("Required")
      .matches(/[a-z]/, "At least one lower case character")
      .matches(/[A-Z]/, "At least one upper case character")
      .matches(/[0-9]/, "At least one number")
      .matches(
        /[!@#$%^&*)()]/,
        "At least one keyboard special character ex. !@#$%^&*()"
      ),
  });

  const handleAlertClose = () => {
    setAlertOpen(false);
    history.push("/");
  };

  const handleLogin = (values: any, actions: any) => {
    setRegSubmit(true);
    const cognitoUser = new CognitoUser({
      Username: values.email,
      Pool: UserPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: values.email,
      Password: values.password,
    });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (data: any) => {
        console.log("success", data);
        setCognitoUser(data);
        identitySvc.loginSuccessReport(values.email, fpValue);
        history.push("/dashboard");
      },
      onFailure: (err: any) => {
        setState((prev) => ({ ...prev, isError: true, message: err.message }));
        identitySvc.loginFailureReport(values.email, fpValue);
        setUser(values);
        setFailCounter(failCounter + 1);
      },
      newPasswordRequired: (data: any) => {
        console.log("New password Required", data);
        setState((prev) => ({
          ...prev,
          isError: true,
          message: "Please enter new password",
          isNewPassword: true,
        }));
        cognitoUser.changePassword(values.password, "(Paris1234!)", function(
          err,
          result
        ) {
          if (err) {
            alert(err.message || JSON.stringify(err));
            return;
          }
          console.log("call result: " + result);
        });
      },
    });
    setUser(values);
    actions.setSubmitting(false);
    setRegSubmit(false);
  };
  return (
    <div className={classes.container}>
      <AlertDialog
        title="Registration Locked"
        open={regLocked}
        setOpen={setAlertOpen}
        onClose={handleAlertClose}
        showOk={true}
      >
        <p>
          Your account is currently locked from further registration attempts.
          <br />
          Please contact the Lisa Help Desk at 949-555-1212 to resolve this
          issue.
        </p>
      </AlertDialog>
      <SpinnerDialog open={regSubmit}>
        <CircularProgress />
      </SpinnerDialog>
      <Grid
        container
        direction="column"
        alignItems="stretch"
        justify="center"
        spacing={4}
        alignContent="center"
        component={Paper}
        elevation={4}
        style={{ height: mediaMobile ? "100%" : "auto" }}
        md={3}
        xs={12}
      >
        <Grid item>
          <Box p={4} style={{ display: "flex", justifyContent: "center" }}>
            <img src={allied_logo} alt="Allied logo"></img>
          </Box>

          <Typography color="primary" variant="h6" gutterBottom align="center">
            <Box p={2}>WELCOME</Box>
          </Typography>

          <Typography align="center">
            Login to continue to Lisa-Portal
          </Typography>
        </Grid>
        <Grid item>
          <Formik
            initialValues={user}
            validationSchema={createAccountSchema}
            onSubmit={handleLogin}
          >
            {({ handleSubmit }) => (
              <Form>
                <Box p={2}>
                  <Grid container direction="column" spacing={2}>
                    <Grid
                      item
                      container
                      justify="space-between"
                      spacing={2}
                      alignItems="center"
                    >
                      <Grid item xs={12}>
                        <Field
                          name="email"
                          label="Username or email address"
                          as={TextField}
                          variant="outlined"
                          fullWidth
                        ></Field>

                        <Box style={{ color: "#C13636" }}>
                          <ErrorMessage name="email" />
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          name="password"
                          label="Password"
                          as={TextField}
                          fullWidth
                          variant="outlined"
                          type={showPassword ? "text" : "password"}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() =>
                                    setShowPassword((prev) => !prev)
                                  }
                                >
                                  {showPassword ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <Box style={{ color: "#C13636" }} mb={1}>
                          <ErrorMessage name="password" />
                        </Box>
                      </Grid>
                      <Grid item>
                        <Link onClick={() => history.push("forgot-password")}>
                          <Typography variant="subtitle1" color="textSecondary">
                            <Box mt={-2}>Forgot password?</Box>
                          </Typography>
                        </Link>
                      </Grid>
                    </Grid>
                    {state.isError && (
                      <Grid item>
                        <Alert severity="error">{`${state.message}`}</Alert>
                      </Grid>
                    )}
                  </Grid>
                  <Box mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      fullWidth
                    >
                      Continue
                    </Button>
                  </Box>
                </Box>
              </Form>
            )}
          </Formik>
        </Grid>
        <Grid item>
          <Divider />
        </Grid>
        <Grid item>
          <Typography align="center">
            <Box mb={4}>
              <Link href="#" onClick={() => history.push("register")}>
                Need to Register?
              </Link>
            </Box>
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default SignIn;
