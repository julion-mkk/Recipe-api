import express from 'express'
import 'dotenv/config.js'
import  { ENV } from './config/env.js'
import {db} from "./db/db.js";
import {favoriteTable} from "./db/schema.js";
import {and, eq} from "drizzle-orm";

const app = express()
const PORT = ENV.PORT || 5001

app.use(express.json());
app.get('/api/status', (req, res) => {
    res.status(200).send({success: true});
})

app.post('/api/favorites', async (req, res) => {
    try {
        const {userId, recipeId, title, image, cookTime, servings} = req.body;
        if(!userId || !recipeId || !title) {
            return res.status(400).send({success: false, error: 'invalid user id'});
        }
        const newFavorite = await db.insert(favoriteTable).values({
            userId,
            recipeId,
            title,
            image,
            cookTime,
            servings
        }).returning();
        res.status(201).send(newFavorite[0]);
    }catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).send({success: false, error: 'Internal Server Error'});
    }
})

app.delete('/api/favorites/:userId/:recipeId', async (req, res) => {
    try {
        const {userId, recipeId} = req.params;
        if(!userId || !recipeId) {
            return res.status(400).send({success: false, error: 'invalid user id or recipe id'});
        }
        await db.delete(favoriteTable).where(
           and(eq(favoriteTable.userId, userId), eq(favoriteTable.recipeId, parseInt(recipeId)))
        );
        res.status(200).send({message: "Favorite deleted successfully"});
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).send({success: false, error: 'Internal Server Error'});
    }
})

app.get('/api/favorites/:userId', async (req, res) => {
    try {
        const {userId} = req.params;
        if(!userId) {
            return res.status(400).send({success: false, error: 'invalid user id'});
        }
        const favorites = await db.select().from(favoriteTable).where(eq(favoriteTable.userId, userId))
        res.status(200).send(favorites);
    }catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).send({success: false, error: 'Internal Server Error'});
    }
})

app.listen(PORT, () => {
    console.log('Server sis running on port', PORT)
})

