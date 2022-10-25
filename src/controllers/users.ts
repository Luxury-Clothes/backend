import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { query } from '../db/db';

export const searchUsers = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;

  const pageSize = Number(req.query.pageSize) || 5;

  const search = req.query.search || '';

  const allUsers = (
    await query(
      'SELECT id, username, email, is_admin FROM users WHERE LOWER(username) LIKE $1 OR LOWER(email) LIKE $2 AND id != $3;',
      [
        // @ts-ignore
        '%' + search?.toLowerCase()?.trim() + '%',
        // @ts-ignore
        '%' + search?.toLowerCase()?.trim() + '%',
        res.locals.user.id,
      ]
    )
  ).rows;

  const countUsers = allUsers.length;

  const users = (
    await query(
      'SELECT id, username, email, is_admin FROM users WHERE (LOWER(username) LIKE $1 OR LOWER(email) LIKE $2) AND id != $3 OFFSET $4 LIMIT $5;',
      [
        // @ts-ignore
        '%' + search?.toLowerCase()?.trim() + '%',
        // @ts-ignore
        '%' + search?.toLowerCase()?.trim() + '%',
        res.locals.user.id,
        pageSize * (page - 1),
        pageSize,
      ]
    )
  ).rows;

  res.status(StatusCodes.OK).json({
    users,
    countUsers,
    page,
    pages: Math.ceil(countUsers / pageSize),
  });
};

export const updateUserStatus = async (req: Request, res: Response) => {
  const { isAdmin } = req.body;
  const { id } = req.params;
  const updatedUser = (
    await query(
      'UPDATE users SET is_admin = $1 WHERE id = $2 RETURNING id, is_admin, username, email;',
      [isAdmin, id]
    )
  ).rows[0];
  res.status(StatusCodes.OK).json(updatedUser);
};
