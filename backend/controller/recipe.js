//delete update

const Recipes = require("../models/recipe");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, "../public/images");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Get all recipes
const getRecipes = async (req, res) => {
    const recipes = await Recipes.find();
    return res.json(recipes);
};

// Get a single recipe
const getRecipe = async (req, res) => {
    const recipe = await Recipes.findById(req.params.id);
    res.json(recipe);
};

// Add a new recipe
const addRecipe = async (req, res) => {
    const { title, ingredients, instructions, time } = req.body;

    if (!title || !ingredients || !instructions) {
        return res.status(400).json({ message: "Required fields can't be empty" });
    }

    const newRecipe = await Recipes.create({
        title,
        ingredients: ingredients.split(","), 
        instructions,
        time,
        coverImage: req.file ? req.file.filename : null,
        createdBy: req.user.id
    });

    return res.json(newRecipe);
};

// Edit a recipe
const editRecipe = async (req, res) => {
    const { title, ingredients, instructions, time } = req.body;
    let recipe = await Recipes.findById(req.params.id);

    if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
    }

    try {
        // Handle image update
        let coverImage = req.file ? req.file.filename : recipe.coverImage;

        // If new image is uploaded, delete the old image
        if (req.file && recipe.coverImage) {
            const oldImagePath = path.join(__dirname, "../public/images", recipe.coverImage);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        await Recipes.findByIdAndUpdate(req.params.id, { title, ingredients, instructions, time, coverImage }, { new: true });

        return res.json({ message: "Recipe updated successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Error updating recipe" });
    }
};


const deleteRecipe = async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(400).json({ message: "Invalid token" });
        }

        // Verify token (if JWT is used)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(400).json({ message: "Invalid token" });
        }

        // Proceed with deletion
        let recipe = await Recipes.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        await Recipes.deleteOne({ _id: req.params.id });

        res.json({ message: "Recipe deleted successfully" });
    } catch (err) {
        console.error("Error deleting recipe:", err);
        return res.status(500).json({ message: "Error deleting recipe" });
    }
};



module.exports = { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe, upload };
