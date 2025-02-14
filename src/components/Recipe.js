// import { v4 as uuidv4} from "uuid"
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../firebase-config";
import { ReactComponent as GreyHeart } from "../images/grey-heart.svg"; // Imported svg from file as a component
import { ReactComponent as RedHeart } from "../images/red-heart.svg"; // Imported svg from file as a component
import "./Recipe.css";
import ReactTooltip from "react-tooltip";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Recipe = ({ label, image, url, ingredients, favourite, id }) => {
  // const { label, image, url, ingredients } = recipe.recipe;
  // Getting Database "table"
  const userCollectionRef = collection(db, "favourite");
  const [favouriteRecipes, setFavouriteRecipes] = useState([]);

  // Get all of the labels within the database
  const getRecipes = async () => {
    // error handling
    try {
      const data = await getDocs(userCollectionRef);
      const dbLabels = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setFavouriteRecipes(dbLabels.map((recipe) => recipe.label));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRecipes();
  }, []);

  // Add favourite to firebase DB
  const createRecipe = async () => {
    getRecipes();

    // Compares the label with the database's labels
    // checks if the label already exist in the database
    if (!favouriteRecipes.includes(label)) {
      // error handling
      try {
        await addDoc(userCollectionRef, {
          label: label,
          image: image,
          url: url,
          ingredients: ingredients,
          favourite: true,
        });
      } catch (error) {
        console.error(error);
      } finally {
        toast("Saved to Favourites!");
      }
    } else {
      toast("Already exist in Favourites!");
      // console.log("entry exist")
      // console.log(favouriteRecipes)
    }
  };

  // Delete/Remove "favourite" and refresh the page
  const deleteRecipe = async (id) => {
    // error handling
    try {
      const recipeDoc = doc(db, "favourite", id);
      await deleteDoc(recipeDoc);
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      // toast("Removed from Favourites!");
    }
  };

  //console.log("food: "+ingredients.map(ingredient => ingredient.foodId))
  return (
    <div className="main-container">
      {/* shows all of the recipe details */}

      <div className="image-container">
        {/* Redirect image to recipe details page with all the information  */}
        <Link
          className="image"
          to="/recipe-details"
          state={{
            label: label,
            image: image,
            url: url,
            ingredients: ingredients,
            favourite: favourite,
            id: id,
          }}
        >
          <img
            src={image}
            alt={label}
            width="300px"
            height="300px"
            object-fit="cover"
          />
          <h3 className="label_text"> {label} </h3>
        </Link>
        <div className="icon-container">
          {!favourite && (
            <>
              {" "}
              {/* Replaced favourite button with icon */}
              <RedHeart
                className="icon"
                onClick={createRecipe}
                data-tip="Add to Favourite"
                data-for="redHeart"
              />{" "}
            </>
          )}

          {favourite && (
            <>
              <GreyHeart
                className="icon"
                onClick={() => {
                  deleteRecipe(id);
                }}
                data-tip="Remove from Favourite"
                data-for="greyHeart"
              />
            </>
          )}
          <ReactTooltip id="redHeart" place="top" effect="solid"></ReactTooltip>
          <ReactTooltip
            id="greyHeart"
            place="top"
            effect="solid"
          ></ReactTooltip>
        </div>
      </div>
      {/* shows the ingredients */}
      {
        //--Ingredients can be seen by clicking the image--//
        //--Uncomment to show the ingredients--//
        // ingredients.map(ingredient =>
        //     <ul key={uuidv4()}>
        //         <li>{ingredient.text}</li>
        //         <li>Weight - {ingredient.weight}</li>
        //         {/* <li>ID - {ingredient.foodId}</li> */}
        //     </ul>
        // )
      }

      {/* <Link to="/recipe-detail"><button>More Detail</button></Link> */}
      <ToastContainer />
    </div>
  );
};

export default Recipe;
