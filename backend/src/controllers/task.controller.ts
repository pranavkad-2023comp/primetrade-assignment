import { Request, Response } from 'express';
import Task from '../models/Task.model';

// Create Task
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, status } = req.body;
    const task = await Task.create({ title, description, status, user: req.user!.id });
    res.status(201).json({ success: true, task });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Tasks (for logged-in user)
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find({ user: req.user!.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Task
export const getTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user!.id });
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }
    res.status(200).json({ success: true, task });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user!.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }
    res.status(200).json({ success: true, task });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user!.id });
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin — Get ALL tasks from ALL users
export const getAllTasksAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find().populate('user', 'name email role').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
