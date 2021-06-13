import React, { useEffect, useState } from "react";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";
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

const Menu: React.FC = () => {
  const [clickedMenuPath, setClickedMenuPath] = useState<string>();
  const currentPath = useLocation();
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();

  useEffect(() => {
    setClickedMenuPath(currentPath.pathname);
  }, []);

  const handleClick = (path: string) => {
    setClickedMenuPath(path);
    history.push(path);
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
            style={{
              color:
                route.path == clickedMenuPath
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary,
            }}
          >
            {route.menuName}
          </div>
        ))}
    </div>
  );
};

export default Menu;
