import { Button, Drawer, FormControl, TextField } from "@mui/material";
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { del, get, post, put } from "../../helpers/api";

function ToDo({ open, id, onClose }) {
  const [toDo, setToDo] = useState({
    title: '',
  });

  useEffect(() => {
    const loadData = async () => {
      if (open && id) {
        try {
          const toDo = await get(`/todos/${id}`);
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
  }, [open, id]);

  const cancel = () => {
    onClose(false);
  }

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

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={cancel}
      SlideProps={{
        sx: { width: '40vw' },
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

ToDo.propTypes = {
  open: PropTypes.bool,
  id: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default ToDo;
