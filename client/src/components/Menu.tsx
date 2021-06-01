import React from "react";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";

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
  const theme = useTheme();
  console.log("Theme: ", theme);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    console.log("clicked: ", event.currentTarget.innerHTML);
  };

  return (
    <div className={classes.root}>
      <div className={classes.menuButton} onClick={handleClick}>
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
      </div>
    </div>
  );
}
