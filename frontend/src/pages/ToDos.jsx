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

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await get('/todos');
        console.log('GOT DATA', data);
        setToDos(data);
      } catch (err) {
        console.error(err);
        setToDos([]);
      }
    };

    loadData();
  }, [lastChanged]);

  const logout = () => {
    navigate('/logout');
  };

  const closeDrawer = (changed) => {
    if (changed) {
      setLastChanged(Date.now());
    }
    setDrawerOpen(false);
    setSelectedItem(null);
  }

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
          { toDos.map((toDo) => (
            <ListItem
              key={toDo._id}
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={async () => {
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
                  setSelectedItem(toDo._id);
                  setDrawerOpen(true);
                }}
              >
                <ListItemText primary={toDo.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        { toDos.length ? <Divider /> : <></>}
        <List>
          <ListItem disablePadding>
            <ListItemButton
                onClick={() => {
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
        id={selectedItem}
        onClose={closeDrawer}
      />
    </>
  );
}

export default ToDos;
