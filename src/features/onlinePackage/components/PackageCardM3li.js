import { Box, Button, Container, Grid } from '@material-ui/core';
import ColorScheme from 'color-scheme';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Animated } from "react-animated-css";
import { useHistory } from 'react-router';
import firebase from "../../../firebaseapp";
import PackageCard from './PackageCard';


const PackageCardM3li = () => {

  const [onlinePackages, setOnlinePackages] = useState([])
  useEffect(() => {
    firebase.database().ref("protected/onlinePackage").once('value', snapshot => {
      setOnlinePackages(Object.values(snapshot.toJSON()))
    })
  }, [])


  const isCurrent = (p) => {
    return (moment(p.departureDate).isAfter(moment()) && moment(p.returnDate).isAfter(moment()))
  }

  const scheme = new ColorScheme();
  scheme.from_hex('4caf50').scheme('triade').variation('default');
  const history = useHistory();
  const indexColor = (i) => {
    const colors = scheme.colors();
    const colorLength = colors.length;
    if (i < colorLength) {
      return '#' + colors[i];
    } else {
      return '#' + colors[colorLength % i];
    }
  }
  return (
    <Container>
      <Box mt={8}>
        <Grid container spacing={3} justify="space-between" alignItems="center">
          {onlinePackages && onlinePackages.map(p => isCurrent(p) && 
            <Grid item xs={12} lg={4} sm={12} md={6} >
              <Animated animationIn="bounceInLeft" isVisible={true}>
                <PackageCard detail={p} key={p.name} />
              </Animated>
            </Grid>
          )}
        </Grid>
      </Box>

      <Box m={4}>
        <Grid container alignItems="center" justify="center">
          <Grid item><Button color="primary" variant="outlined" size="large" fullWidth style={{ textTransform: 'none' }} onClick={() => history.push('/reserve/interest')}>Register expression of interest</Button></Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default PackageCardM3li
