import React, { useState } from 'react';
import 'twin.macro';
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { IPostModel } from '~/models/PostModel';
import MoreVertIcon from '@material-ui/icons/MoreVert';
// import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import useSWR from 'swr';

export const PostCard: React.VFC<{ post: IPostModel }> = ({
  post,
}: {
  post: IPostModel;
}) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: me } = useSWR('/api/users/me');

  const subheader = `${post.user.name}さん • ${post.placeState} ${
    post.placeCity
  } • ${new Date(post.createdAt).toLocaleString()}`;

  return (
    <Card key={post._id} elevation={2} tw='my-5'>
      <CardHeader
        title={<h3 tw='text-3xl'>{post.title}</h3>}
        subheader={subheader}
        action={
          me &&
          me._id === post.user._id && (
            <>
              <IconButton
                tw='focus:outline-none'
                aria-label='edit'
                onClick={(e) => {
                  setMenuAnchor(e.currentTarget);
                  setMenuOpen(true);
                }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={menuAnchor}
                open={menuOpen}
                onClose={() => {
                  setMenuAnchor(null);
                  setMenuOpen(false);
                }}
              >
                <MenuItem>Edit</MenuItem>
              </Menu>
            </>
          )
        }
        avatar={
          <Avatar
            aria-label='user'
            css={{
              backgroundColor: stringToColor(post.user.name) + ' !important',
            }}
          >
            {stringToShortString(post.user.name)}
          </Avatar>
        }
      />
      <CardContent>
        <p>{post.body}</p>
      </CardContent>
      <CardActions>
        <IconButton tw='focus:outline-none'>
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

const stringToColor = (string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
};

const stringToShortString = (string) => {
  if (string.indexOf(' ') > 0) {
    return `${string.split(' ')[0][0]}${string.split(' ')[1][0]}`;
  } else {
    return string.slice(0, 2);
  }
};
