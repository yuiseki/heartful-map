import React, { useState } from 'react';
import 'twin.macro';
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Icon,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { IPostModel } from '~/models/PostModel';
import useSWR from 'swr';
import Link from 'next/link';
import { useCallback } from 'react';
import { useRouter } from 'next/dist/client/router';
import MoreVertIcon from '@material-ui/icons/MoreVert';
// import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import TwitterIcon from '@material-ui/icons/Twitter';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import PhoneIcon from '@material-ui/icons/Phone';
import MailIcon from '@material-ui/icons/Mail';

export const PostCardView: React.VFC<{ post: IPostModel }> = ({
  post,
}: {
  post: IPostModel;
}) => {
  const router = useRouter();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: me } = useSWR('/api/users/me');

  const subheader = `${post.category} • ${post.placeState} ${
    post.placeCity
  } • ${new Date(post.createdAt).toLocaleString()}`;

  const onDelete = useCallback(() => {
    const f = async () => {
      const res = await fetch('/api/posts/' + post._id, { method: 'DELETE' });
      if (res.status === 204) {
        router.push('/');
      } else {
        console.info(res.status);
        const json = await res.json();
        console.info(json);
      }
    };
    f();
  }, []);

  return (
    <Card key={post._id} elevation={4} tw='my-5'>
      <CardHeader
        title={
          <Link href={'/posts/' + post._id}>
            <h3 tw='text-3xl'>{post.title}</h3>
          </Link>
        }
        subheader={subheader}
        action={
          me &&
          me._id === post.user._id && (
            <>
              <IconButton
                tw='focus:outline-none'
                aria-label='menu'
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
                <MenuItem
                  onClick={() => router.push(`/posts/${post._id}/edit`)}
                >
                  Edit
                </MenuItem>
                <MenuItem onClick={onDelete} color='secondary'>
                  Delete
                </MenuItem>
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
        <div>
          <pre>{post.body}</pre>
        </div>
        {post.url && (
          <div tw='my-3 text-xl'>
            <a href={post.url} tw='text-blue-500'>
              {post.url}
            </a>
          </div>
        )}
        {post.address && (
          <div tw='text-xl'>
            <p>住所：{post.address}</p>
          </div>
        )}
      </CardContent>
      <CardActions>
        <IconButton tw='focus:outline-none'>
          <ShareIcon />
        </IconButton>
        <a
          href={'https://maps.google.com/?q=' + post.address}
          target='_blank'
          rel='noreferrer'
        >
          <IconButton tw='focus:outline-none'>
            <Icon className='fa fa-map-marked-alt' />
          </IconButton>
        </a>
        {post.twitter && (
          <a href={post.twitter} target='_blank' rel='noreferrer'>
            <IconButton tw='focus:outline-none'>
              <TwitterIcon />
            </IconButton>
          </a>
        )}
        {post.instagram && (
          <a href={post.instagram} target='_blank' rel='noreferrer'>
            <IconButton tw='focus:outline-none'>
              <InstagramIcon />
            </IconButton>
          </a>
        )}
        {post.facebook && (
          <a href={post.facebook} target='_blank' rel='noreferrer'>
            <IconButton tw='focus:outline-none'>
              <FacebookIcon />
            </IconButton>
          </a>
        )}
        {post.email && (
          <a href={'mailto:' + post.email} target='_blank' rel='noreferrer'>
            <IconButton tw='focus:outline-none'>
              <MailIcon />
            </IconButton>
          </a>
        )}
        {post.tel && (
          <a href={'tel:' + post.tel} target='_blank' rel='noreferrer'>
            <IconButton tw='focus:outline-none'>
              <PhoneIcon />
            </IconButton>
          </a>
        )}
      </CardActions>
    </Card>
  );
};

const stringToColor = (string) => {
  if (string === null) {
    return '#000000';
  }
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
  if (string === null) {
    return '無名';
  }
  if (string.indexOf(' ') > 0) {
    return `${string.split(' ')[0][0]}${string.split(' ')[1][0]}`;
  } else {
    return string.slice(0, 2);
  }
};
