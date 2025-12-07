import {neon} from "@neondatabase/serverless";
import {ENV} from "../config/env.js";
import {drizzle} from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

const sql = neon(ENV.DATABASE_URL)
export const db = drizzle(sql, {schema})
