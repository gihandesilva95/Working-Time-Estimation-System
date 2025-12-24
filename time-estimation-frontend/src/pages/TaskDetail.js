import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Stack
} from '@mui/material';
import dayjs from 'dayjs';

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [estimate, setEstimate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [message, setMessage] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const loadTask = async () => {
      try {
        const res = await api.get('/tasks');
        const t = res.data.find(t => t.id === parseInt(id));
        setTask(t);
        if (user.role === 'Engineer' && t.time_estimate) {
          setEstimate(t.time_estimate);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadTask();
  }, [id, user.role]);

  if (!task) return null;

  // Engineer submits estimate
  const submitEstimate = async () => {
    try {
      await api.post(`/tasks/${id}/estimate`, { time_estimate: parseFloat(estimate) });
      setMessage({ type: 'success', text: 'Estimate submitted successfully' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to submit estimate' });
    }
  };

  // PM calculates end time
  const calculateEnd = async () => {
    if (!startTime) {
      setMessage({ type: 'error', text: 'Please select a start time' });
      return;
    }

    try {
      const res = await api.post(`/tasks/${id}/calculate`, { start_time: startTime });
      const formattedEnd = dayjs(res.data.end_time).format('DD MMM YYYY HH:mm');
      setMessage({ type: 'success', text: `End Time: ${formattedEnd}` });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to calculate end time' });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom>
          {task.title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {task.description || 'No description provided.'}
        </Typography>

        {message && (
          <Alert severity={message.type} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}

        <Stack spacing={2}>
          {user.role === 'Engineer' && (
            <>
              <TextField
                label="Time Estimate (days)"
                type="number"
                inputProps={{ step: "0.01", min: 0 }}
                value={estimate}
                onChange={e => setEstimate(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                onClick={submitEstimate}
                size="large"
              >
                Submit Estimate
              </Button>
            </>
          )}

          {user.role === 'PM' && (
            <>
              <TextField
                type="datetime-local"
                label="Start Time"
                InputLabelProps={{ shrink: true }}
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={calculateEnd}
                size="large"
              >
                Calculate End Time
              </Button>
              {task.time_estimate && (
                <Typography variant="body2" color="textSecondary">
                  Engineer's Estimate: {task.time_estimate} days
                </Typography>
              )}
            </>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
