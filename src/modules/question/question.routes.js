import express from 'express';
import { getAllUserQuestions } from './question.controller.js';

const questionRoutes = express.Router();

questionRoutes.get('/', getAllUserQuestions);

export default questionRoutes;
