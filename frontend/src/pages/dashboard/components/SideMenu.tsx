import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import MenuContent from './MenuContent';
import OptionsMenu from './OptionsMenu';
import { Avatar, Box, Divider, Stack, Typography } from '@mui/material';
import UserContext from '../../../hooks/user/UserContext';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

const SideMenu: React.FC = () => {
  const { user } = React.useContext(UserContext);

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
          width: drawerWidth,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
        }}
      >
        <Typography component="h1" variant="h6">
          Tom&apos;s Car Shop
        </Typography>
        <Divider sx={{ my: 1 }} />
        <MenuContent />
        <Box
          sx={{
            mt: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            paddingLeft: '0px',
            paddingBottom: '0px',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar
              sizes="small"
              alt={user?.firstName}
              src="/static/images/avatar/7.jpg"
              sx={{ width: 36, height: 36 }}
            />
            <Box sx={{ maxWidth: `calc(${drawerWidth}px - 100px)` }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  lineHeight: '16px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.firstName} {user?.lastName}
              </Typography>
              <Box
                sx={{
                  width: '140px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontSize: '0.60rem',
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {user?.email}
                </Typography>
              </Box>
            </Box>
          </Stack>
          <OptionsMenu />
        </Box>
      </Box>
    </Drawer>
  );
};

export default SideMenu;
