import React from "react";

import { Button, Typography } from "neetoui";
import { Link } from "react-router-dom";

const PageNotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-gray-50 text-center">
    <Typography className="text-gray-900" style="h1" weight="extrabold">
      404
    </Typography>
    <Typography className="text-gray-600" style="h4">
      Page Not Found
    </Typography>
    <Typography className="text-gray-500" style="body1">
      Sorry, the page you are looking for does not exist.
    </Typography>
    <Link to="/">
      <Button label="Go Back Home" size="large" style="primary" />
    </Link>
  </div>
);

export default PageNotFound;
