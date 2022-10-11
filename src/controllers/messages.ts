import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { query } from '../db/db';

export const sendMessage = async (req: Request, res: Response) => {
  const { subject, message, isSend } = req.body;

  const newMessage = (
    await query(
      'INSERT INTO messages (user_id, subject, message, is_send) VALUES ($1, $2, $3, $4) RETURNING *;',
      [res.locals.user.id, subject, message, isSend]
    )
  ).rows[0];

  res.status(StatusCodes.OK).json(newMessage);
};

export const updateMessage = async (req: Request, res: Response) => {
  const { subject, message, isSend } = req.body;

  const updatedMessage = (
    await query(
      'UPDATE messages SET subject = $1, message = $2, is_send = $3, updated_at = CURRENT_DATE WHERE id = $4 RETURNING *;',
      [subject, message, isSend, req.params.id]
    )
  ).rows[0];

  res.status(StatusCodes.OK).json(updatedMessage);
};

export const getMessages = async (req: Request, res: Response) => {
  const messages = (
    await query('SELECT * FROM messages WHERE user_id = $1;', [
      res.locals.user.id,
    ])
  ).rows;
  res.status(StatusCodes.OK).json(messages);
};

export const deleteMessage = async (req: Request, res: Response) => {
  await query('DELETE FROM messages WHERE id = $1 and user_id = $2;', [
    req.params.id,
    res.locals.user.id,
  ]);

  res.status(StatusCodes.OK).json({ message: 'success' });
};
