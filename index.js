const express = require("express");
const app = express();

require("dotenv").config();
const { initializeDatabase } = require("./db/db.connect");
const Recipe = require("./models/recipes.models");

app.use(express.json());

initializeDatabase();

// Problem 3, 4 & 5
async function createRecipe(newRecipe) {
  try {
    const recipe = new Recipe(newRecipe);
    const saveRecipe = await recipe.save();
    return saveRecipe;
  } catch (error) {
    throw error;
  }
}

app.post("/recipes", async (req, res) => {
  try {
    const savedRecipe = await createRecipe(req.body);
    res
      .status(201)
      .json({ message: "Recipe saved successfully", recipe: savedRecipe });
  } catch (error) {
    res.status(500).json({ error: "Failed to create new recipe." });
  }
});

// Problem 6
async function readAllRecipes(){
    try{
        const allRecipes = await Recipe.find();
        return allRecipes;
    }catch(error){
        throw error;
    }
}

app.get('/recipes', async (req, res) => {
    try{
        const recipes = await readAllRecipes();
        if(recipes.length != 0){
            res.json(recipes)
        } else {
            res.status(404).json({error: 'No recipes found.'})
        }
    }catch(error){
        res.status(500).json({error: 'Failed to fetch recipes.'})
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}.`);
});
