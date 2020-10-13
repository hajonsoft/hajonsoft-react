import { Typography } from "@material-ui/core";
import React from "react";

const AppFooter = () => (
  <React.Fragment >
    <div style={{ color: "#DDDDDA", opacity: "0.5" }}>
      <Typography variant="subtitle2" gutterBottom align="center">
        FOR HajOnSoft CUSTOMERS USE ONLY
      </Typography>
      <Typography variant="caption" align="center">
        This website intended for authorized use only by HajOnSoft
        customers only. Unauthorized access or use of this website may subject
        violators to administrative action, civil, and/or criminal prosecution
        under the United States Criminal Code (Title 18 U.S.C. § 1030).
      </Typography>
      <Typography variant="caption" align="center">
        When browsing this site, all activity and information may be monitored,
        intercepted, recorded, read, copied, or captured and disclosed by and to
        authorized personnel for official purposes, including criminal
        prosecution.
      </Typography>
    </div>
  </React.Fragment>
);

export default AppFooter;
