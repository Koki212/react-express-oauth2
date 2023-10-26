import { Card } from "@mui/material";
import { Outlet } from "react-router-dom";

function Master() {
  return (
    <div className="background">
      <Card elevation={5}>
        <Outlet />
      </Card>
    </div>
  );
}

export default Master;
