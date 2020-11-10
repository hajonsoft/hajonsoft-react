import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import React from 'react'
import { Grid, Button, Container } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import Alert from '@material-ui/lab/Alert';

const PackageDetail = ({ data }) => {
    const history = useHistory()

    const onGotoCustomers = () => {
        history.push(`${data.name}/customers`)
    }
    return (
        <Container style={{ padding: '1rem' }}>
            <Grid container justify="space-between" alignItems="center">
                <Grid item xs={11}>
                    <Alert severity="info">Under Construction: Stats, gender, Nationality, Tags, etc...</Alert>
                </Grid>
                <Grid item xs={1}>
                    <Button color="primary" variant="outlined" endIcon={<NavigateNextIcon />}
                        onClick={onGotoCustomers}> Customers</Button>
                </Grid>
            </Grid>


        </Container>
    )
}

export default PackageDetail
