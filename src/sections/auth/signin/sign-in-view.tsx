import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError('');

      const apiUrl = import.meta.env.VITE_HOST_API || '';
      const response = await fetch(`${apiUrl}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      localStorage.setItem('currentUser', JSON.stringify({
        ...data,
        isAdmin: data.role2 === 'ADMIN'
      }));

      setShowSuccess(true);
      
      setTimeout(() => {
        window.location.replace('/dashboard');
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowSuccess(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSignIn();
    }
  };

  const renderForm = (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="flex-end"
      onKeyPress={handleKeyPress}
    >
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            width: '100%', 
            mb: 2,
            '& .MuiAlert-message': {
              fontSize: '0.875rem',
            },
          }}
        >
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        name="email"
        label="Email address"
        value={formData.email}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link>

      <TextField
        fullWidth
        name="password"
        label="Password"
        value={formData.password}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        loading={loading}
        onClick={handleSignIn}
      >
        Sign in
      </LoadingButton>

      {/* Success Message Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          icon={<CheckCircleOutlineIcon fontSize="medium" />}
          sx={{
            width: '100%',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '& .MuiAlert-icon': {
              color: 'primary.contrastText',
            },
            boxShadow: (theme) => theme.customShadows.z8,
            borderRadius: 2,
            fontSize: '1rem',
            py: 1.5,
          }}
        >
          Sign in successful! Redirecting...
        </Alert>
      </Snackbar>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Don&apos;t have an account?
          <Link href="sign-up" variant="subtitle2" sx={{ ml: 0.5 }}>
            Get started
          </Link>
        </Typography>
      </Box>

      {renderForm}

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
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
