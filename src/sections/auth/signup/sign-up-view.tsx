import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';

import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';

export function SignUpView() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role1: 'STARTUP',
    role2: 'USER',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSignUp = async () => {
    try {
      // Validate input
      if (!formData.fullName || !formData.email || !formData.password) {
        throw new Error('Missing required fields');
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/sign-in');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const renderForm = (
    <Box display="flex" flexDirection="column" gap={3}>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Sign up successful! Redirecting...</Alert>}

      <TextField
        fullWidth
        name="fullName"
        label="Full Name"
        value={formData.fullName}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        name="email"
        label="Email address"
        value={formData.email}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        name="phoneNumber"
        label="Phone Number"
        value={formData.phoneNumber}
        onChange={handleChange}
      />

      <TextField
        select
        fullWidth
        name="role1"
        label="Primary Role"
        value={formData.role1}
        onChange={handleChange}
      >
        <MenuItem value="STARTUP">Startup</MenuItem>
        <MenuItem value="INVESTOR">Investor</MenuItem>
        <MenuItem value="MENTOR">Mentor</MenuItem>
        <MenuItem value="OTHER">Other</MenuItem>
      </TextField>

      {/* <TextField
        select
        fullWidth
        name="role2"
        label="Account Type"
        value={formData.role2}
        onChange={handleChange}
      >
        <MenuItem value="USER">Regular User</MenuItem>
        <MenuItem value="ADMIN">Administrator</MenuItem>
      </TextField> */}

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSignUp}
      >
        Sign up
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign up</Typography>
        <Typography variant="body2" color="text.secondary">
          Already have an account?
          <Link href="/sign-in" variant="subtitle2" sx={{ ml: 0.5 }}>
            Sign in
          </Link>
        </Typography>
      </Box>

      {renderForm}

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>

      <Box gap={1} display="flex" justifyContent="center">
        <IconButton color="inherit" component="a" href="https://www.nexea.co/" target="_blank" rel="noopener noreferrer">
          <Iconify icon="logos:google-icon" />
        </IconButton>
        <IconButton color="inherit" component="a" href="https://www.instagram.com/nexeaventures?igsh=eWJianJxZ3Q3OTgx" target="_blank" rel="noopener noreferrer">
          <Iconify icon="skill-icons:instagram" />
        </IconButton>
        <IconButton color="inherit" component="a" href="https://x.com/nexeaventures?s=21&t=7ZTzDu0ZXEJ8f1OXJOtR4g" target="_blank" rel="noopener noreferrer">
          <Iconify icon="ri:twitter-x-fill" />
        </IconButton>
      </Box>
    </>
  );
}
