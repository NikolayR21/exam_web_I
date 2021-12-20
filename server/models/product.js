const db = require('../db/index');
const mysql = require('mysql2');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const crypt = require('../config/encrypt');