import { Card, CardContent, Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import firebase from "../../../firebaseapp";

const useStyles = makeStyles({
  mainContainer: {
    borderRadius: "8px",
    position: "relative",
    width: "210px",
    height: "210px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  imgContainer: {
    width: "200px",
    height: "200px",
  },
  pickImage: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "blue",
    fontSize: "0.8em",
  },
  progress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
});

const CoreImage = ({ record, setImage }) => {
  const [url, setUrl] = useState("");
  const [isMouseOver, setIsMouseOver] = useState(false);
  const classes = useStyles();

  const handleFileOnChange = (event) => {
    if (event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setImage(selectedFile);
      setUrl(URL.createObjectURL(selectedFile));
    }
  };

  useEffect(() => {
    if (record.image) {
      setUrl(URL.createObjectURL(record.image));
    }
  }, [record.image]);

  useEffect(() => {
    async function getImage() {
      if (record && record.nationality && record.passportNumber) {
        let imgUrl = await firebase
          .storage()
          .ref(`${record.nationality}/${record.passportNumber}.jpg`)
          .getDownloadURL();
        if (imgUrl) {
          setUrl(imgUrl);
        }
      }
    }
    getImage();
  }, [record]);

  let _fileInput = React.createRef();
  return (
    <React.Fragment>
      <Card
        className={classes.mainContainer}
        onMouseOver={() => setIsMouseOver(true)}
        onMouseLeave={() => setIsMouseOver(false)}
      >
        <CardContent>
          <img
            src={url}
            alt={"customer"}
            className={classes.imgContainer}
            style={{ display: url ? "block" : "none" }}
          ></img>
          <Link
            href="#"
            className={classes.pickImage}
            style={{ display: isMouseOver && record.nationality && record.passportNumber ? "block" : "none" }}
            onClick={() => _fileInput.click()}
          >
            Change Image
          </Link>
        </CardContent>
      </Card>
      <input
        type="file"
        onChange={handleFileOnChange}
        style={{ display: "none" }}
        ref={(fileInput) => (_fileInput = fileInput)}
      />
    </React.Fragment>
  );
};

export default CoreImage;
