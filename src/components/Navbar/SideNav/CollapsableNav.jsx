// CollapsableNav With Props Functinality for Dynamic UseCase
import Link from "../../Common/Link";
import { useLocation } from "react-router-dom";

import React, { useState, useEffect } from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
} from "@mui/material";
// ! Icon's
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ExpandMore from "@mui/icons-material/ExpandMore";
const CollapsableNav = ({ primary, links, icon, root, onClick }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setOpen(location.pathname.includes(root));
  }, [location.pathname, root]);

  return (
    <>
      <Link to={root}>
        <ListItemButton
          selected={location.pathname.includes(root)}
          onClick={() => {
            setOpen(prev => !prev);
          }}
        >
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText
            onClick={onClick}
            fontSize={{ xs: 2, md: 3, lg: 2 }}
            primary={primary}
          />
          <IconButton onClick={() => setOpen(prev => !prev)}>
            {open ? <ExpandMore /> : <ChevronRightOutlinedIcon />}
          </IconButton>
        </ListItemButton>
      </Link>
      <Collapse in={open} timeout="auto">
        <List component="nav">
          {links.map((navItem, index) => (
            <React.Fragment key={index}>
              <Link to={navItem?.link}>
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={onClick}
                  selected={navItem?.link === location.pathname}
                >
                  <ListItemIcon>{navItem.icon}</ListItemIcon>
                  <ListItemText
                    fontSize={{ xs: 12, md: 9, lg: 15 }}
                    primary={navItem.title}
                  />
                </ListItemButton>
              </Link>
            </React.Fragment>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default CollapsableNav;
