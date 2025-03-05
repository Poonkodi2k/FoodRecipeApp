import React, { useState, useEffect } from "react";
import axios from "axios";

const MyRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchMyRecipes();
    }, []);

    const fetchMyRecipes = async () => {
        try {
            const token = localStorage.getItem("token"); // Get user token from storage
            if (!token) {
                setError("Unauthorized. Please log in.");
                setLoading(false);
                return;
            }

            const response = await axios.get("http://localhost:5000/api/recipes/my-recipes", {
                headers: { Authorization: `Bearer ${token}` }
            });

            setRecipes(response.data);
            setLoading(false);
        } catch (error) {
            setError("Failed to fetch My Recipes");
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>My Recipes</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : recipes.length === 0 ? (
                <p>No recipes found.</p>
            ) : (
                <ul>
                    {recipes.map((recipe) => (
                        <li key={recipe._id}>
                            <h3>{recipe.title}</h3>
                            <p>{recipe.instructions}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyRecipes;