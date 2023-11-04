import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Todo } from './models/Todo.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log('Connected to DB'))
  .catch(console.error);

app.get('/todos', async (req, res) => {
  const todos = await Todo.find();

  res.json(todos);
});

app.post('/todo/new', (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });
  todo.save();

  res.json(todo);
});

app.delete('/todo/delete/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) return;
  const result = await Todo.findByIdAndDelete(req.params.id);
  res.json(result);
});

app.get('/todo/complete/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) return;
  todo.complete = !todo.complete;
  todo.save();
  res.json(todo);
});

app.listen(3001, () => console.log('Server started on port 3001'));
