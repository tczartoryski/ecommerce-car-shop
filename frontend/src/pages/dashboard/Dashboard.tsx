import * as React from 'react';
import { alpha } from '@mui/material/styles';;
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import AppTheme from '../../shared-theme/AppTheme';
import { CssBaseline, Box, Stack } from '@mui/material';


interface DashboardProps {
  disableCustomTheme?: boolean;
  mainContent: React.ReactNode;
 }
 
const Dashboard: React.FC<DashboardProps> = ({ disableCustomTheme, mainContent }) => {
  return (
    <AppTheme {...{ disableCustomTheme }}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header/>
            {mainContent}
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default Dashboard;
