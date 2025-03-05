const API_URL = "http://localhost:5000"; // Backend server 

// ✅ Fetch all recipes
export const fetchRecipes = async () => {
  try {
    const response = await fetch(`${API_URL}/recipe`);
    if (!response.ok) throw new Error("Recipes not found");
    return await response.json();
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
};

// ✅ Fetch a single recipe by ID
export const fetchRecipeById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/recipe/${id}`);
    if (!response.ok) throw new Error("Recipe not found");
    return await response.json();
  } catch (error) {
    console.error("Error fetching recipe:", error);
  }
};

// ✅ Add a new recipe (with file upload support)
export const addRecipe = async (recipe) => {
  try {
    const formData = new FormData();
    formData.append("title", recipe.title);
    
    // ✅ Append each ingredient separately
    recipe.ingredients.forEach(ingredient => {
      formData.append("ingredients[]", ingredient);
    });

    formData.append("instructions", recipe.instructions);
    formData.append("time", recipe.time);
    
    if (recipe.file) {
      formData.append("coverImage", recipe.file);
    }

    const response = await fetch(`${API_URL}/recipe`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: formData,
    });

    return response.ok;
  } catch (error) {
    console.error("Error adding recipe:", error);
  }
};

// ✅ Update an existing recipe
export const updateRecipe = async (id, updatedRecipe) => {
  try {
    const formData = new FormData();
    formData.append("title", updatedRecipe.title);
    
    // ✅ Append each ingredient separately
    updatedRecipe.ingredients.forEach(ingredient => {
      formData.append("ingredients[]", ingredient);
    });

    formData.append("instructions", updatedRecipe.instructions);
    formData.append("time", updatedRecipe.time);
    
    if (updatedRecipe.file) {
      formData.append("coverImage", updatedRecipe.file);
    }

    const response = await fetch(`${API_URL}/recipe/${id}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: formData,
    });

    return response.ok;
  } catch (error) {
    console.error("Error updating recipe:", error);
  }
};

