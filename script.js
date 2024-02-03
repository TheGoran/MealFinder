/* We will be using the Meal DB API*/

const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal');

// Seach meal and fetch from the API

function searchMeal(e) {
  e.preventDefault();

  // Clear Single Meal
  single_mealEl.innerHTML = '';

  // Get Search Term
  const term = search.value;

  //Check for empty
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
       
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

        if (data.meals == null) {
          resultHeading.innerHTML = `<p>Oops looks like we dont have those in our database, please try another meal.</p>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
            <div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                <div class="meal-info" data-mealID="${meal.idMeal}">
                  <h3>${meal.strMeal}</h3>
                </div>
            </div>
            `
            )
            .join('');
        }
      });
    // Clear search text
    search.value = '';
  } else {
    alert('Please enter search term in the search box');
  }
}

// Fetch Meal by ID

function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID} `)
    .then((res) => res.json())
    .then((data) => {
    
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

// Fetch random meal from API
function getRandomMeal() {
  // Clear meals and heading
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

// Add  Meal to the DOM

function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  single_mealEl.innerHTML = `
        <div class="single-meal" >
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMealThumb}"/>
            <div class="single-meal-info">
               ${
                 meal.strCategory ? `<p> Category: ${meal.strCategory}</p>` : ''
               }                                              
                 
               ${meal.strArea ? `<p> Location: ${meal.strArea}</p>` : ''}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map((ing) => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
  single_mealEl.scrollIntoView(
    {
      block: "start",
      behavior: "smooth"

    }
  );
}

// Event Listeners

submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);
//Updated due to path beind deprecated
mealsEl.addEventListener('click', e => {
  const mealID = e.target.closest('.meal-info').dataset.mealid;
  getMealById(mealID);
});
  
  //might not be bad idea to display single as a modal instad scrolling thoug...another day 


