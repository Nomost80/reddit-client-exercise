import { useState } from 'react'
import Link from 'next/link'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar'
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

function Header({ user, loading }) {
  // return (
  //   <header>
  //     <nav>
  //       <ul>
  //         <li>
  //           <Link href="/">
  //             <a>Home</a>
  //           </Link>
  //         </li>
  //         <li>
  //           <Link href="/about">
  //             <a>About</a>
  //           </Link>
  //         </li>
  //         {!loading &&
  //           (user ? (
  //             <>
  //               <li>
  //                 <Link href="/profile">
  //                   <a>Profile</a>
  //                 </Link>
  //               </li>
  //               <li>
  //                 <a href="/api/logout">Logout</a>
  //               </li>
  //             </>
  //           ) : (
  //             <li>
  //               <a href="/api/login">Login</a>
  //             </li>
  //           ))}
  //       </ul>
  //     </nav>
  //
  //     <style jsx>{`
  //       header {
  //         padding: 0.2rem;
  //         color: #fff;
  //         background-color: #333;
  //       }
  //       nav {
  //         max-width: 42rem;
  //         margin: 1.5rem auto;
  //       }
  //       ul {
  //         display: flex;
  //         list-style: none;
  //         margin-left: 0;
  //         padding-left: 0;
  //       }
  //       li {
  //         margin-right: 1rem;
  //       }
  //       li:nth-child(2) {
  //         margin-right: auto;
  //       }
  //       a {
  //         color: #fff;
  //         text-decoration: none;
  //       }
  //       button {
  //         font-size: 1rem;
  //         color: #fff;
  //         cursor: pointer;
  //         border: none;
  //         background: none;
  //       }
  //     `}</style>
  //   </header>
  // )
  const [anchorEl, setAnchorEl] = useState(null)
  const isMenuOpen = Boolean(anchorEl)

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  };

  const menuId = "profile-menu"
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem>
        <Link href="/profile" >
          Profil
        </Link>
      </MenuItem>
      <MenuItem>
        <Link href="/api/logout">
          Se déconnecter
        </Link>
      </MenuItem>
    </Menu>
  )

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            <Link href="/">
              Reddit Client
            </Link>
          </Typography>
          {!loading && (user ? (
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar src={user.picture} />
            </IconButton>
          ) : <Button color="inherit" href="/api/login">Login</Button>)}
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  )
}

export default Header
