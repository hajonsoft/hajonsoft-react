import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  FormControl,
  Select,
  Input,
  InputLabel,
  MenuItem,
  Grid,
} from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import DialogContentText from "@material-ui/core/DialogContentText";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, {useState} from "react";
import useVisaSystemState from "../redux/useVisaSystemState";
import { getTravellersJSON, zipWithPhotos } from "../helpers/common";
import CircularProgressWithLabel from "./CircularProgressWithLabel";


const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ApplyForVisa = ({ open, onClose, travellers, groupName }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [usap, setUsap] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [selectedVisaSystem, setSelectedVisaSystem] = React.useState(0);
  const [exportProgress, setExportProgress] = useState({
    loading: false,
    value: 0,
  });


  const {
    data: visaSystems,
    createData: createVisaSystem,
  } = useVisaSystemState();

  const handleSelectedVisaSystemChange = (system) => {
    setSelectedVisaSystem(system);
  };

  const handleUsapChange = (usap) => {
    setUsap(usap);
  };
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleAddVisaSystem = () => {
    createVisaSystem({
      path: "visaSystem",
      data: { usap, username, password },
    });
  };
const handleExport = async ()=> {
  setExportProgress({ loading: true, value: 0 });
  const travellersData = getTravellersJSON(travellers);
  const exportVisaSystem = visaSystems[selectedVisaSystem];
  const data = {
    system: {
      username: exportVisaSystem.username,
      password: exportVisaSystem.password,
      name: exportVisaSystem.usap,
    },
    travellers: travellersData
  }
  const jsonData = JSON.stringify(data);
  const zip = await zipWithPhotos(
    jsonData,
    travellers,
    null,
    setExportProgress
  );

  zip.generateAsync({ type: "blob" }).then(function(content) {
    const newFile = new Blob([content], { type: "application/zip" });
    var csvURL = window.URL.createObjectURL(newFile);
    const tempLink = document.createElement("a");
    tempLink.href = csvURL;
    tempLink.setAttribute("download", `${groupName}.zip`);
    tempLink.click();
  });

  setExportProgress({ loading: false, value: 100 });
}
  const getUsapName = (u) => {
    switch (u) {
      case "wtu":
        return "Way to umrah";
      case "bau":
        return "Bab al umrah";
      case "gma":
        return "Gabul ya haj";
      case "vst":
        return "Visit Saudi";
      case "twf":
        return "Tawaf";
      case "mot":
        return "Egypt Ministry of Tourism";
      default:
        return "";
    }
  };

  const getSelectedVisaSystem = () => {
    if (visaSystems && visaSystems.length > 0) {
      const defaultSystem = visaSystems[selectedVisaSystem];
      return `${getUsapName(defaultSystem.usap)} - Username: ${
        defaultSystem.username
      }`;
    } else {
      return "No system selected";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="lg"
      keepMounted
    >
      <DialogTitle>Apply for visa</DialogTitle>
      <DialogContent>
        <DialogContentText>
          HAJonSoft uses browser automation to connect to visa systems. To apply
          for visa please follow the steps below or watch this video
        </DialogContentText>

        <div className={classes.root}>
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>
                Step 1: Choose Travellers
              </Typography>
              <Typography
                className={classes.secondaryHeading}
              >{`${travellers.length} Travellers`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              List all travellers in this package in a list or a table, with a
              check box. all checked. User an deselect a traveller
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "system"}
            onChange={handleChange("system")}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>
                Step 2: Choose external system
              </Typography>
              <Typography className={classes.secondaryHeading}>
                {getSelectedVisaSystem()}
                {exportProgress.loading &&  <CircularProgressWithLabel value={exportProgress} />}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <RadioGroup
                    value={usap}
                    onChange={(e) => handleUsapChange(e.target.value)}
                  >
                    <FormControlLabel
                      value="bau"
                      control={<Radio />}
                      label="Bab al umrah (Recommended)"
                    />
                    <FormControlLabel
                      value="wtu"
                      control={<Radio />}
                      label="Way to umrah (legacy)"
                    />
                    <FormControlLabel
                      value="gma"
                      control={<Radio />}
                      label="Gabul ya hajj (difficult)"
                    />
                    <FormControlLabel
                      value="twf"
                      control={<Radio />}
                      label="Gabul ya hajj (slow)"
                    />
                    <FormControlLabel
                      value="vst"
                      control={<Radio />}
                      label="Visit Saudi "
                    />
                    <FormControlLabel
                      value="mot"
                      control={<Radio />}
                      label="Egypt Tourism"
                    />
                  </RadioGroup>
                </Grid>
                <Grid item>
                  <Grid container direction="column" spacing={4}>
                    <Grid item>
                      <TextField
                        value={username}
                        label="User name"
                        onChange={(e) => setUsername(e.target.value)}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        value={password}
                        label="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item>
                      <Button onClick={handleAddVisaSystem}>Add/Replace</Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={5}>
                  <FormControl fullWidth>
                    <InputLabel>System</InputLabel>
                    <Select
                      value={selectedVisaSystem}
                      onChange={(e) =>
                        handleSelectedVisaSystemChange(e.target.value)
                      }
                      input={<Input name="age" />}
                    >
                      {visaSystems &&
                        visaSystems.length > 0 &&
                        visaSystems.map((x, i) => (
                          <MenuItem value={i}>{`${getUsapName(x.usap)} ${
                            x.username
                          }`}</MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel3"}
            onChange={handleChange("panel3")}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>
                Step 3: Choose who will send
              </Typography>
              <Typography className={classes.secondaryHeading}>
                Myself, HajOnSoft Operator, Community Helper
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container justify="space-around" alignItems="center">
                <Grid item xs={4}>
                  <Button onClick={handleExport}>Export</Button>
                </Grid>
                <Grid item xs={4}>
                  <Button>Sent to HajOnSoft</Button>
                </Grid>
                <Grid item xs={4}>
                  <Button>Send to a community helper</Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel4"}
            onChange={handleChange("panel4")}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>
                Step 4: Execute
              </Typography>
              <Typography className={classes.secondaryHeading}>
                Verify software is installed in case of export
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Button to export the data or create an assist request
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplyForVisa;