import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from '@mui/material';
import dayjs from 'dayjs';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const loadTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAction = (task) => {
    if (user.role === 'Engineer') {
      navigate(`/tasks/${task.id}`);
    } else if (user.role === 'PM') {
      navigate(`/tasks/${task.id}`);
    }
  };

  const formatDate = (date) => (date ? dayjs(date).format('DD MMM YYYY HH:mm') : 'N/A');

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Task List
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Task Name</b></TableCell>
              <TableCell><b>Description</b></TableCell>
              <TableCell><b>Engineer</b></TableCell>
              <TableCell><b>Time Estimation (dys)</b></TableCell>
              <TableCell><b>Start Date</b></TableCell>
              <TableCell><b>End Date</b></TableCell>
              <TableCell align="center"><b>Action</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No tasks found
                </TableCell>
              </TableRow>
            )}

            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description || '-'}</TableCell>
                <TableCell>{task.engineer?.name || '-'}</TableCell>
                <TableCell>{task.time_estimate || '-'}</TableCell>
                <TableCell>{formatDate(task.start_time)}</TableCell>
                <TableCell>{formatDate(task.end_time)}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleAction(task)}
                  >
                    {user.role === 'Engineer' ? 'Enter Estimate' : 'Calculate End Time'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
