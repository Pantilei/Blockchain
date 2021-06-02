import React from "react";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { routes } from "../routes";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    menuButton: {
      cursor: "pointer",
      padding: theme.spacing(2),
    },
  })
);

export default function Menu() {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  console.log("Theme: ", theme);
  const handleClick = (menuName: string) => {
    history.push(menuName);
  };

  return (
    <div className={classes.root}>
      {routes
        .filter((route) => route.menuName)
        .map((route, index) => (
          <div
            className={classes.menuButton}
            onClick={() => handleClick(route.path)}
            key={index}
          >
            {route.menuName}
          </div>
        ))}
      {/* <div className={classes.menuButton} onClick={handleClick}>
        BlockChain
      </div>
      <div className={classes.menuButton} onClick={handleClick}>
        Blocks
      </div>
      <div className={classes.menuButton} onClick={handleClick}>
        Transactions
      </div>
      <div className={classes.menuButton} onClick={handleClick}>
        Network
      </div> */}
    </div>
  );
}
