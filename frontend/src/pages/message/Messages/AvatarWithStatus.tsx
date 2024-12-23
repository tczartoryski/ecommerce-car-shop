import { Avatar, AvatarProps, Badge } from '@mui/material';
import * as React from 'react';

type AvatarWithStatusProps = AvatarProps & {
  online?: boolean;
};

export default function AvatarWithStatus(props: AvatarWithStatusProps) {
  const { online = false, ...other } = props;
  return (
    <div>
      <Badge
        color={online ? 'primary' : 'secondary'}
        variant={online ? 'standard' : 'dot'}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar  {...other} />
      </Badge>
    </div>
  );
}
