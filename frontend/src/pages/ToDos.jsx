import { Button, CardContent, CardHeader, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ToDo from "./partials/ToDo";
import { useEffect, useState } from "react";
import { del, get } from "../helpers/api";

function ToDos() {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toDos, setToDos] = useState([]);
  const [lastChanged, setLastChanged] = useState(Date.now());

  // the effect loads ToDos from the server. It loads data again, when the value of `lastChanged` changes
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await get('/todos');
        setToDos(data);
      } catch (err) {
        console.error(err);
        setToDos([]);
      }
    };

    loadData();
  }, [lastChanged]);

  // logout click handler, just navigate to logout page
  const logout = () => {
    navigate('/logout');
  };

  // when drawer is closed. `changed` parameter tells us if a ToDo was changed
  const closeDrawer = (changed) => {
    if (changed) {
      setLastChanged(Date.now());
    }
    setDrawerOpen(false);
    setSelectedItem(null);
  }

  // Render ToDos List
  return (
    <>
      <CardHeader
        action={
          <Button onClick={logout}>Logout</Button>
        }
        title="My ToDos"
      />
      <CardContent sx={{ minWidth: '500px', height: 'calc(80vh - 104px)', overflow: 'auto' }}>
        <List>
          { toDos.map((toDo) => ( // iterate over ToDos and display them (by mapping each ToDo to a ListItem element)
            <ListItem
              key={toDo._id}
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={async () => {
                    // delete button click handler
                    try {
                      await del(`/todos/${toDo._id}`);
                    } catch (err) {
                      console.error(err);
                    }
                    setLastChanged(Date.now());
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemButton
                onClick={() => {
                  // list item click handler
                  setSelectedItem(toDo._id);
                  setDrawerOpen(true);
                }}
              >
                <ListItemText primary={toDo.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        { toDos.length ? <Divider /> : <></> }
        <List>
          <ListItem disablePadding>
            <ListItemButton
                onClick={() => {
                  // add item click handler
                  setSelectedItem(null);
                  setDrawerOpen(true);
                }}
              >
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Add ToDo" />
            </ListItemButton>
          </ListItem>
        </List>
      </CardContent>
      <ToDo
        open={drawerOpen}
        selectedItem={selectedItem}
        onClose={closeDrawer}
      />
    </>
  );
}

export default ToDos;
