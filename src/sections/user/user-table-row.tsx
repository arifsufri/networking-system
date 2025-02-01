import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { EditUserModal } from './edit-user-modal';
import { DeleteConfirmModal } from './delete-confirm-modal';

// ----------------------------------------------------------------------

export type UserProps = {
  id: string;
  fullName: string;
  email: string;
  role1: string;
  role2: string;
  phoneNumber: string;
  avatarUrl: string;
  isVerified: boolean;
};

type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function UserTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleEditClick = () => {
    handleClosePopover();
    setOpenEditModal(true);
  };

  const handleDeleteClick = () => {
    handleClosePopover();
    setOpenDeleteModal(true);
  };

  const handleUpdateUser = async (updatedUser: UserProps) => {
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        throw new Error('Not authenticated');
      }

      const { id: userId } = JSON.parse(currentUser);

      const response = await fetch(`/api/users/${row.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId.toString(),
        },
        body: JSON.stringify({
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          role1: updatedUser.role1,
          role2: updatedUser.role2,
          phoneNumber: updatedUser.phoneNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.details || errorData.message || 'Failed to update user');
      }

      const data = await response.json();
      console.log('Update successful:', data);
      window.location.reload();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const handleDeleteUser = async () => {
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        throw new Error('Not authenticated');
      }

      const { id: userId } = JSON.parse(currentUser);

      const response = await fetch(`/api/users/${row.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId.toString(),
        },
      });

      if (!response.ok) {
        if (response.status !== 204) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete user');
        }
      }

      window.location.reload();
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>{row.fullName}</TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.role1}</TableCell>
        <TableCell>{row.role2}</TableCell>
        <TableCell>{row.phoneNumber || '-'}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
            },
          }}
        >
          <MenuItem onClick={handleEditClick}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>

      <EditUserModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        user={row}
        onSave={handleUpdateUser}
      />

      <DeleteConfirmModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDeleteUser}
        userName={row.fullName}
      />
    </>
  );
}
