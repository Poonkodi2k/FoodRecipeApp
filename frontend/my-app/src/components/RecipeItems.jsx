import React, { useEffect, useState } from 'react'; 
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';

export default function RecipeItems() {
    const recipes = useLoaderData();
    const [allRecipes, setAllRecipes] = useState(recipes);
    const [isFavRecipe, setIsFavRecipe] = useState(false);

    const navigate = useNavigate();
    const path = window.location.pathname.includes("myRecipe"); 

    // useEffect(() => {
    //     setAllRecipes(recipes);
    // }, [recipes]);
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const { data } = await axios.get("http://localhost:5000/recipe");
                setAllRecipes(data);
            } catch (error) {
                console.error("Error fetching recipes:", error);
            }
        };
        fetchRecipes();
    }, []);
    


    // // ✅ **Fixed: Deletion Issue**
    // const onDelete = async (id) => {    
    //     try {
    //         await axios.delete(`http://localhost:5000/recipe/${id}`);
            
    //         // ✅ **Update state to remove deleted recipe**
    //         setAllRecipes((prevRecipes) => prevRecipes.filter(recipe => recipe._id !== id));

    //         // ✅ **Update localStorage after deletion**
    //         let favItems = JSON.parse(localStorage.getItem("fav")) ?? [];
    //         let updatedFavItems = favItems.filter(recipe => recipe._id !== id);
    //         localStorage.setItem("fav", JSON.stringify(updatedFavItems));

    //     } catch (error) {
    //         console.error("Error deleting recipe:", error);
    //     }
    // };



    const onDelete = async (id) => {
        try {
            console.log(`Deleting recipe with ID: ${id}`);
    
            // ✅ Retrieve token from localStorage (if stored there)
            const token = localStorage.getItem("token");
    
            await axios.delete(`http://localhost:5000/recipe/${id}`, {
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // ✅ Attach token here
                }
            });
    
            // ✅ Update UI after deletion
            setAllRecipes((prevRecipes) => prevRecipes.filter(recipe => recipe._id !== id));
    
            // ✅ Update localStorage after deletion
            let favItems = JSON.parse(localStorage.getItem("fav")) ?? [];
            let updatedFavItems = favItems.filter(recipe => recipe._id !== id);
            localStorage.setItem("fav", JSON.stringify(updatedFavItems));
    
            console.log(`Successfully deleted recipe with ID: ${id}`);
        } catch (error) {
            console.error("Error deleting recipe:", error);
            if (error.response) {
                console.error("Server response:", error.response.data);
            }
        }
    };
    

  

  
    const favRecipe = (item) => {
        // Retrieve existing favorites from localStorage
        let favItems = JSON.parse(localStorage.getItem("fav")) ?? [];
    
        console.log("Before update - Favorite items:", favItems);
    
        // Check if the recipe is already in favorites
        let isFav = favItems.some(recipe => recipe._id === item._id);
    
        if (isFav) {
            // Remove from favorites
            favItems = favItems.filter(recipe => recipe._id !== item._id);
            console.log(`Removed: ${item.title}`);
        } else {
            // Add to favorites
            favItems.push(item);
            console.log(`Added: ${item.title}`);
        }
    
        // Update localStorage with new favorite list
        localStorage.setItem("fav", JSON.stringify(favItems));
    
        // Force component to re-render by updating state
        setIsFavRecipe((prevState) => !prevState);
    
        console.log("After update - Favorite items:", JSON.parse(localStorage.getItem("fav")));
    };
    

    return (
        <div className='card-container'>
            {allRecipes?.map((item, index) => (
                <div key={index} className='card' onDoubleClick={() => navigate(`/recipe/${item._id}`)}>
                    <img src={`http://localhost:5000/images/${item.coverImage}`} width="120px" height="100px" alt={item.title} />
                    <div className='card-body'>
                        <div className='title'>{item.title}</div>
                        <div className='icons'>
                            <div className='timer'><BsStopwatchFill /> {item.time}</div>
                            {!path ? (
                                <FaHeart 
                                    onClick={() => favRecipe(item)}
                                    style={{ color: JSON.parse(localStorage.getItem("fav"))?.some(res => res._id === item._id) ? "red" : "" }}
                                />
                            ) : (
                                <div className='action'>
                                    <Link to={`/editRecipe/${item._id}`} className="editIcon"><FaEdit /></Link>
                                    <MdDelete onClick={() => onDelete(item._id)} className='deleteIcon' />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
