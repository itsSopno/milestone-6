const categoryContainer = document.getElementById("categoryContainer");
const cardContainer = document.getElementById("card-container");
const cartItems = document.getElementById("cartItems");
const totalEl = document.getElementById("total");
let total = 0;

// Loading Spinner
const showLoading = (container) => {
  container.innerHTML = `
    <div class="flex justify-center items-center p-6">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
    </div>
  `;
};
const hideLoading = (container) => {
  container.innerHTML = "";
};

// Load categories
const loadCategory = () => {
  showLoading(categoryContainer);

  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => {
      const categories = data.categories;
      showCategory(categories);
    })
    .catch((err) => {
      categoryContainer.innerHTML = `<p class="text-red-500">Failed to load categories!</p>`;
      console.log("Error loading categories:", err);
    });
};


const showCategory = (categories) => {
  categoryContainer.innerHTML = "";

  categories.forEach((cat) => {
    const li = document.createElement("li");
    li.id = cat.id;
    li.className =
      "hover:border-b-4 hover:border-green-600 cursor-pointer px-3 py-2 text-green-700 font-medium";
    li.textContent = cat.category_name;

    li.addEventListener("click", () => {
      loadCard(cat.id);
    });

    categoryContainer.appendChild(li);
  });
};


const loadCard = (categoryId) => {
  showLoading(cardContainer);

  fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`)
    .then((res) => res.json())
    .then((data) => {
      const plants = data.plants;
      showCard(plants);
    })
    .catch((error) => {
      cardContainer.innerHTML = `<p class="text-red-500">Error fetching plant data!</p>`;
      console.error("Error fetching plant data:", error);
    });
};


const showCard = (plants) => {
  cardContainer.innerHTML = "";

  if (!plants || plants.length === 0) {
    showEmptyMessage();
    return;
  }

  plants.forEach((plant) => {
    cardContainer.innerHTML += `
    <div class="card-m">
       <div class="card" id="plant-${plant.id}">
        <div class="card-image">
          <img src="${plant.image}" alt="${plant.name}" />
        </div>
        <div class="card-content">
          <h2>${plant.name}</h2>
          <p>${plant.description}</p>
          <div class="card-footer">
            <span class="tag">${plant.category}</span>
            <span class="price">৳${plant.price}</span>
          </div>
         <button class="add-to-cart">Add to Cart</button>
           <div class="add-btn">
           <button onclick="handleViewDetails(event)" class="add-crton">View Details</button>
           </div>
        </div>
      </div>
    `;
  });
};


const showEmptyMessage = () => {
  cardContainer.innerHTML = `
    <div class="p-4 text-center text-gray-500">
      No plants found for this category!
    </div>
  `;
};


const handleViewDetails = (e) => {
  const id = e.target.closest('.card')?.id?.split('-')[1]; 
  if (!id) return;

  fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      showDetailsNews(data.data);
    })
    .catch(err => {
      console.error("Failed to fetch plant details:", err);
    });
};

const newsDetailsModal = document.getElementById('news-details-modal');
const modalContainer = document.getElementById('modalContainer');

const showDetailsNews = (plant) => {
  newsDetailsModal.showModal();
  modalContainer.innerHTML = `
    <div id="plant-${plant.id}">
      <h1 class="text-xl font-bold">${plant.name}</h1>
      <img src="${plant.image}" alt="${plant.name}" class="w-full my-2 rounded-lg"/>
      <p>${Array.isArray(plant.description) ? plant.description.join("") : plant.description}</p>
    </div>
  `;
};


document.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-to-cart")) {
    const card = e.target.closest(".card-content");
    const title = card.querySelector("h2").innerText;
    const price = parseInt(card.querySelector(".price").innerText.replace(/[^0-9]/g, ""));

    total += price;

    const li = document.createElement("li");
    li.className = "flex items-center justify-between bg-gray-50 p-2 rounded-lg";

    li.innerHTML = `
      <span>${title}</span>
      <div class="flex items-center gap-2">
        <span class="text-gray-600">৳${price} × 1</span>
        <button class="remove-item text-red-500 font-bold">×</button>
      </div>
    `;

    li.querySelector(".remove-item").addEventListener("click", () => {
      total -= price;
      totalEl.innerText = total;
      li.remove();
    });

    cartItems.appendChild(li);
    totalEl.innerText = total;
  }
});

// Initial load
loadCategory();
loadCard("1"); // Default category
