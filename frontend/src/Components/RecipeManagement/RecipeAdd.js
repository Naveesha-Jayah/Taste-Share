import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RecipeAdd.css';

const CreateRecipe = () => {
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    media: [],
    prepTime: '',
    cookTime: '',
    savings: '',
    difficulty: 'MEDIUM',
    ingredients: [{ amount: '', name: '' }],
    instructions: ['']
  });
  const [mediaFiles, setMediaFiles] = useState([]);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (index, e) => {
    const { name, value } = e.target;
    const ingredients = [...recipe.ingredients];
    ingredients[index][name] = value;
    setRecipe({ ...recipe, ingredients });
  };

  const handleInstructionChange = (index, e) => {
    const instructions = [...recipe.instructions];
    instructions[index] = e.target.value;
    setRecipe({ ...recipe, instructions });
  };

  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, { amount: '', name: '' }]
    });
  };

  const removeIngredient = (index) => {
    const ingredients = [...recipe.ingredients];
    ingredients.splice(index, 1);
    setRecipe({ ...recipe, ingredients });
  };

  const addInstruction = () => {
    setRecipe({
      ...recipe,
      instructions: [...recipe.instructions, '']
    });
  };

  const removeInstruction = (index) => {
    const instructions = [...recipe.instructions];
    instructions.splice(index, 1);
    setRecipe({ ...recipe, instructions });
  };

  const handleMediaUpload = (e) => {
    if (e.target.files.length + mediaFiles.length > 3) {
      alert('Maximum 3 media files allowed');
      return;
    }
    setMediaFiles([...mediaFiles, ...Array.from(e.target.files)]);
  };

  const removeMedia = (index) => {
    const files = [...mediaFiles];
    files.splice(index, 1);
    setMediaFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('recipe', JSON.stringify(recipe));
      
      mediaFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await axios.post('http://localhost:8080/api/recipes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate(`/recipes/${response.data.id}`);
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert('Failed to create recipe');
    }
  };

  return (
    <div className="create-recipe">
      <h2>Create New Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Recipe Title*</label>
          <input
            type="text"
            name="title"
            value={recipe.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description*</label>
          <textarea
            name="description"
            value={recipe.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Media (Image or Video)</label>
          <div className="media-upload">
            <label className="upload-btn">
              Upload Image/Video
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleMediaUpload}
                style={{ display: 'none' }}
              />
            </label>
            <div className="media-preview">
              {mediaFiles.map((file, index) => (
                <div key={index} className="media-item">
                  <span>{file.name}</span>
                  <button type="button" onClick={() => removeMedia(index)}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Prep Time (min)</label>
              <input
                type="number"
                name="prepTime"
                value={recipe.prepTime}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Cook Time (min)</label>
              <input
                type="number"
                name="cookTime"
                value={recipe.cookTime}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Savings</label>
              <input
                type="text"
                name="savings"
                value={recipe.savings}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Difficulty</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="difficulty"
                  value="EASY"
                  checked={recipe.difficulty === 'EASY'}
                  onChange={handleInputChange}
                />
                Easy
              </label>
              <label>
                <input
                  type="radio"
                  name="difficulty"
                  value="MEDIUM"
                  checked={recipe.difficulty === 'MEDIUM'}
                  onChange={handleInputChange}
                />
                Medium
              </label>
              <label>
                <input
                  type="radio"
                  name="difficulty"
                  value="HARD"
                  checked={recipe.difficulty === 'HARD'}
                  onChange={handleInputChange}
                />
                Hard
              </label>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Ingredients*</h3>
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-row">
              <input
                type="text"
                name="amount"
                placeholder="Amount (e.g., 1 cup)"
                value={ingredient.amount}
                onChange={(e) => handleIngredientChange(index, e)}
                required
              />
              <input
                type="text"
                name="name"
                placeholder="Ingredient name"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, e)}
                required
              />
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeIngredient(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addIngredient}>
            + Add ingredient
          </button>
        </div>

        <div className="form-section">
          <h3>Instructions*</h3>
          {recipe.instructions.map((instruction, index) => (
            <div key={index} className="instruction-row">
              <textarea
                value={instruction}
                onChange={(e) => handleInstructionChange(index, e)}
                required
              />
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeInstruction(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addInstruction}>
            + Add Step
          </button>
        </div>

        <button type="submit" className="submit-btn">
          Create Recipe
        </button>
      </form>
    </div>
  );
};

export default CreateRecipe;