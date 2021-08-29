/// <reference types="@emotion/react/types/css-prop" />
import React, { ReactNode } from 'react';
import 'twin.macro';
import clsx from 'clsx';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/client';
import {
  Container,
  createStyles,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  useTheme,
  Theme,
  Toolbar,
  AppBar,
  Drawer,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PostAddIcon from '@material-ui/icons/PostAdd';
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';
import useSWR from 'swr';

const MyDrawer: React.VFC = () => {
  const [session] = useSession();
  const { data: me } = useSWR('/api/users/me');
  return (
    <div>
      <List>
        <Divider />
        <Link href='/'>
          <ListItem button key='トップページ'>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary='トップページ' />
          </ListItem>
        </Link>
        {session && (
          <>
            <Divider />
            <Link href='/posts/new'>
              <ListItem button key='情報を投稿'>
                <ListItemIcon>
                  <PostAddIcon />
                </ListItemIcon>
                <ListItemText primary='情報を投稿' />
              </ListItem>
            </Link>
            <Divider />
            <Link href='/settings'>
              <ListItem button key='ユーザー設定'>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary='ユーザー設定' />
              </ListItem>
            </Link>
            <Divider />
            {me && me.isAdmin && (
              <>
                <Link href='/admin'>
                  <ListItem button key='管理画面'>
                    <ListItemIcon>
                      <LibraryAddCheckIcon />
                    </ListItemIcon>
                    <ListItemText primary='管理画面' />
                  </ListItem>
                </Link>
                <Divider />
              </>
            )}
            <ListItem button onClick={() => signOut()} key='ログアウト'>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary='ログアウト' />
            </ListItem>
          </>
        )}
        <Divider />
        {!session && (
          <>
            <Link href='/auth/signup'>
              <ListItem button key='ユーザー登録'>
                <ListItemIcon>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary='ユーザー登録' />
              </ListItem>
            </Link>
            <Divider />
            <Link href='/auth/signin'>
              <ListItem button key='ログイン'>
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary='ログイン' />
              </ListItem>
            </Link>
          </>
        )}
        <Divider />
      </List>
    </div>
  );
};

type Props = {
  children: ReactNode;
};

export function Layout({ children }: Props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Container maxWidth={false} className={classes.root}>
      <AppBar
        position='fixed'
        color='transparent'
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography>
            <h1 tw='text-xl'>ハートフルマップ</h1>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant='persistent'
        anchor='left'
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerToggle}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <MyDrawer />
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        {children}
      </main>
    </Container>
  );
}

const drawerWidth = 250;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  })
);
