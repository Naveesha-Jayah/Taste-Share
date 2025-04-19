import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    prepTime: 0,
    cookTime: 0,
    difficulty: 'Easy',
    ingredients: '',
    instructions: '',
    recipeImage: ''
  });

  useEffect(() => {
    if (id && id !== 'new') {
      setIsEdit(true);
      const fetchRecipe = async () => {
        try {
          const response = await axios.get(`http://localhost:8081/recipes/${id}`);
          setRecipe(response.data);
          if (response.data.recipeImage) {
            setImagePreview(`http://localhost:8081/uploads/${response.data.recipeImage}`);
          }
        } catch (error) {
          console.error('Error fetching recipe:', error);
        }
      };
      fetchRecipe();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let imageFilename = recipe.recipeImage;
      
      // Upload new image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadResponse = await axios.post('http://localhost:8081/recipes/recipeImg', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        imageFilename = uploadResponse.data.filename;
      }
      
      const recipeData = {
        ...recipe,
        recipeImage: imageFilename
      };
      
      if (isEdit) {
        await axios.put(`http://localhost:8081/recipes/${id}`, recipeData);
      } else {
        await axios.post('http://localhost:8081/recipes', recipeData);
      }
      
      navigate('/recipes');
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  return (
    <div className="recipe-form">
      <h2>{isEdit ? 'Edit Recipe' : 'Add New Recipe'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={recipe.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={recipe.description}
            onChange={handleChange}
            rows="3"
            required
          />
        </div>
        
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Preparation Time (minutes)</label>
            <input
              type="number"
              className="form-control"
              name="prepTime"
              value={recipe.prepTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Cooking Time (minutes)</label>
            <input
              type="number"
              className="form-control"
              name="cookTime"
              value={recipe.cookTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Difficulty</label>
          <select
            className="form-select"
            name="difficulty"
            value={recipe.difficulty}
            onChange={handleChange}
            required
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Ingredients (one per line)</label>
          <textarea
            className="form-control"
            name="ingredients"
            value={recipe.ingredients}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Instructions</label>
          <textarea
            className="form-control"
            name="instructions"
            value={recipe.instructions}
            onChange={handleChange}
            rows="8"
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Recipe Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="mt-2">
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ maxHeight: '200px', maxWidth: '100%' }} 
              />
            </div>
          )}
        </div>
        
        <button type="submit" className="btn btn-primary me-2">
          {isEdit ? 'Update Recipe' : 'Save Recipe'}
        </button>
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={() => navigate('/recipes')}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default RecipeForm;