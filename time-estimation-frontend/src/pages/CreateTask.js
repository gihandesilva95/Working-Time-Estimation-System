import { useEffect, useState } from 'react';
import api from '../api/axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CreateTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [engineerId, setEngineerId] = useState('');
  const [engineers, setEngineers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/engineers').then(res => setEngineers(res.data));
  }, []);

  const submitTask = async () => {
    await api.post('/tasks', {
      title,
      description,
      engineer_id: engineerId,
    });
    navigate('/tasks');
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Create & Assign Task
        </Typography>

        <TextField
          label="Task Title"
          fullWidth
          sx={{ mb: 2 }}
          onChange={e => setTitle(e.target.value)}
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
          onChange={e => setDescription(e.target.value)}
        />

        <TextField
          select
          label="Assign Engineer"
          fullWidth
          sx={{ mb: 3 }}
          value={engineerId}
          onChange={e => setEngineerId(e.target.value)}
        >
          {engineers.map(e => (
            <MenuItem key={e.id} value={e.id}>
              {e.name} ({e.email})
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          fullWidth
          onClick={submitTask}
          disabled={!title || !engineerId}
        >
          Create Task
        </Button>
      </Paper>
    </Container>
  );
}
