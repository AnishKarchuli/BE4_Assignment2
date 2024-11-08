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

// Problem 7
async function readRecipeByTitle(recipeTitle){
  try{
    const recipe = await Recipe.findOne({title: recipeTitle})
    return recipe;
  }catch(error){
    throw error;
  }
}

app.get('/recipes/:title', async (req, res) => {
  try{
    const recipe = await readRecipeByTitle(req.params.title)
    if(recipe){
      res.json(recipe)
    } else {
      res.status(404).json({error: 'Recipe not found.'})
    }
  }catch(error){
    res.status(500).json({error: 'Failed to fetch recipe.'})
  }
})

// Problem 8
async function readAllRecipesByAuthor(authorName){
  try{
    const allRecipes = await Recipe.find({ author: authorName })
    return allRecipes;
  }catch(error){
    throw error;
  }
}

app.get('/recipes/author/:authorName', async (req, res) => {
  try{
    const recipes = await readAllRecipesByAuthor(req.params.authorName)
    if(recipes.length != 0){
      res.json(recipes)
    } else {
      res.status(404).json({error: 'Recipes not found.'})
    }
  }catch(error){
    res.status(500).json({error: 'Failed to fetch recipes.'})
  }
})

// Problem 9
async function readRecipesByDifficultyLevel(difficultyLevel){
  try{
    const recipes = await Recipe.find({difficulty: difficultyLevel})
    return recipes;
  }catch(error){
    throw error;
  }
}

app.get('/recipes/difficulty/:difficultyLevel', async (req, res) => {
  try{
    const recipes = await readRecipesByDifficultyLevel(req.params.difficultyLevel)
    if(recipes.length != 0){
      res.json(recipes)
    } else {
      res.status(404).json({error: 'Recipes not found.'})
    }
  }catch(error){
    res.status(500).json({error: 'Failed to fetch recipes.'})
  }
})

// Problem 10
async function updateRecipeById(recipeId, dataToUpdate){
  try{
    const updateRecipe = await Recipe.findByIdAndUpdate(recipeId, dataToUpdate, {new: true})
    return updateRecipe;
  }catch(error){
    throw error;
  }
}

app.post('/recipes/:recipeId', async (req, res) => {
  try{
    const updatedRecipe = await updateRecipeById(req.params.recipeId, req.body)
    if(updatedRecipe){
      res.status(200).json({message: 'Recipe updated successfully', updatedRecipe: updatedRecipe})
    } else {
      res.status(404).json({error: 'Recipe not found.'})
    }
  }catch(error){
    res.status(500).json({error: 'Failed to fetch recipe.'})
  }
})

// Problem 11
async function updateRecipeByTitle(recipeTitle, dataToUpdate){
  try{
    const updateRecipe = await Recipe.findOneAndUpdate({title: recipeTitle}, dataToUpdate, { new: true})
    return updateRecipe;
  }catch(error){
    throw error;
  }
}

app.post('/recipes/title/:recipeTitle', async (req, res) => {
  try{
    const updatedRecipe = await updateRecipeByTitle(req.params.recipeTitle, req.body)
    if(updatedRecipe){
      res.status(200).json({message: 'Recipe updated successfully.', updatedRecipe: updatedRecipe})
    } else {
      res.status(404).json({error: 'Recipe not found.'})
    }
  }catch(error){
    res.status(500).json({error: 'Failed to fetch recipe.'})
  }
})

// Problem 12
async function deleteRecipeById(recipeId){
  try{
    const recipe = await Recipe.findByIdAndDelete(recipeId)
    return recipe;
  }catch(error){
    throw error;
  }
}

app.delete('/recipes/:recipeId', async (req, res) => {
  try{
    const recipe = await deleteRecipeById(req.params.recipeId)
    if(recipe){
      res.status(200).json({message: 'Recipe deleted sucessfully.', deletedRecipe: recipe})
    } else {
      res.status(404).json({error: 'Recipe not found.'})
    }
  }catch(error){
    res.status(500).json({error: 'Failed to delete a recipe.'})
  }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}.`);
});
