import { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../api/axios';

export default function Settings() {
  const [workStart, setWorkStart] = useState('');
  const [workEnd, setWorkEnd] = useState('');
  const [date, setDate] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [holidays, setHolidays] = useState([]);

  const load = async () => {
    const res = await api.get('/settings');
    setWorkStart(res.data.work_start || '');
    setWorkEnd(res.data.work_end || '');
    setHolidays(res.data.holidays || []);
  };

  useEffect(() => {
    load();
  }, []);

  const saveSettings = async () => {
    await api.post('/settings', {
      work_start: workStart,
      work_end: workEnd
    });
    alert('Working hours saved');
  };

  const addHoliday = async () => {
    if (!date) return;
    await api.post('/holidays', { date, recurring });
    setDate('');
    setRecurring(false);
    load();
  };

  const deleteHoliday = async (id) => {
    if (!window.confirm('Delete this holiday?')) return;
    await api.delete(`/holidays/${id}`);
    load();
  };

  // ✅ DATE FORMATTER
  const formatDate = (holiday) => {
    const d = new Date(holiday.date);
    const day = d.getDate();
    const month = d.toLocaleString('default', { month: 'long' });
    const year = d.getFullYear();

    if (holiday.recurring) {
      return `Every ${day} ${month}`;
    }
    return `${day} ${month} ${year}`;
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      {/* ================= WORKING HOURS ================= */}
      <Typography variant="h6">Daily Working Hours</Typography>

      <TextField
        type="time"
        label="Work Start"
        fullWidth
        margin="normal"
        value={workStart}
        onChange={(e) => setWorkStart(e.target.value)}
      />

      <TextField
        type="time"
        label="Work End"
        fullWidth
        margin="normal"
        value={workEnd}
        onChange={(e) => setWorkEnd(e.target.value)}
      />

      <Button variant="contained" sx={{ mt: 1 }} onClick={saveSettings}>
        Save Working Hours
      </Button>

      <Divider sx={{ my: 4 }} />

      {/* ================= ADD HOLIDAY ================= */}
      <Typography variant="h6">Add Holiday</Typography>

      <TextField
        type="date"
        fullWidth
        margin="normal"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={recurring}
            onChange={(e) => setRecurring(e.target.checked)}
          />
        }
        label="Recurring yearly"
      />

      <Button variant="outlined" sx={{ mt: 1 }} onClick={addHoliday}>
        Add Holiday
      </Button>

      <Divider sx={{ my: 4 }} />

      {/* ================= HOLIDAY TABLE ================= */}
      <Typography variant="h6">Holiday List</Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Holiday Type</b></TableCell>
              <TableCell align="center"><b>Action</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {holidays.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No holidays added
                </TableCell>
              </TableRow>
            )}

            {holidays.map((h) => (
              <TableRow key={h.id}>
                <TableCell>{formatDate(h)}</TableCell>
                <TableCell>
                  {h.recurring ? 'Recurring' : 'One-time'}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="error"
                    onClick={() => deleteHoliday(h.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
