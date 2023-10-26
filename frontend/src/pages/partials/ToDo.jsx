import { Button, Drawer, FormControl, TextField } from "@mui/material";
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { del, get, post, put } from "../../helpers/api";

function ToDo({ open, selectedItem, onClose }) {
  const [toDo, setToDo] = useState({
    title: '',
  });

  // the effect loads the selected ToDo (if given), or prepares a new empty ToDo, whenever the dialog is opened or the selectedItem changes
  useEffect(() => {
    const loadData = async () => {
      if (open && selectedItem) {
        try {
          const toDo = await get(`/todos/${selectedItem}`);
          setToDo(toDo);
        } catch (err) {
          console.error(err);
          setToDo({
            title: '',
          });
        }
      } else {
        setToDo({
          title: '',
        });
      }
    };

    loadData();
  }, [open, selectedItem]);

  // when cancel is clicked or user clicks away (Drawer onClose)
  const cancel = () => {
    onClose(false);
  }

  // when user clicks save
  const save = async () => {
    try {
      if (toDo._id) {
        if (toDo.title.trim().length !== 0) {
          await put(`/todos/${toDo._id}`, toDo);
        } else {
          await del(`/todos/${toDo._id}`);
        }
      } else {
        if (toDo.title.trim().length !== 0) {
          await post('/todos', toDo);
        }
      }
    } catch (err) {
      console.error(err);
    }
    onClose(true);
  }

  // render ToDo Drawer
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={cancel}
      SlideProps={{
        sx: { width: '60vw' },
      }}
    >
      <FormControl sx={{ margin: '16px', width: 'calc(100% - 32px)' }}>
        <TextField
          label="Title"
          value={toDo.title}
          onChange={(event) => {
            const changedToDo = {
              ...toDo,
              title: event.target.value,
            }
            setToDo(changedToDo);
          }}
        />
      </FormControl>
      <Button onClick={save}>Save</Button>
      <Button onClick={cancel}>Cancel</Button>
    </Drawer>
  );
}

// PropType validation
ToDo.propTypes = {
  open: PropTypes.bool,
  selectedItem: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default ToDo;
