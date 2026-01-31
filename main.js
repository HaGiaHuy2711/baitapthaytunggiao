const API_URL = "https://api.escuelajs.co/api/v1/products";

let products = [];
let filteredProducts = [];
let currentPage = 1;
let pageSize = 10;

let sortState = {
  title: "asc",
  price: "asc"
};

// =======================
// GET ALL PRODUCTS
// =======================
async function getAllProducts() {
  try {
    const res = await fetch(API_URL);
    products = await res.json();
    filteredProducts = [...products];
    renderTable();
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

getAllProducts();

// =======================
// GET IMAGE URL (CHUẨN)
// =======================
function getImageUrl(product) {
  const PLACEHOLDER = "https://via.placeholder.com/80";

  if (!product.images || product.images.length === 0) {
    return PLACEHOLDER;
  }

  const firstImage = product.images[0];

  // Trường hợp URL hợp lệ
  if (typeof firstImage === "string" && firstImage.startsWith("http")) {
    return firstImage;
  }

  // Trường hợp string JSON
  if (typeof firstImage === "string" && firstImage.startsWith("[")) {
    try {
      const parsed = JSON.parse(firstImage);
      if (parsed.length > 0 && parsed[0].startsWith("http")) {
        return parsed[0];
      }
    } catch (e) {
      return PLACEHOLDER;
    }
  }

  return PLACEHOLDER;
}

// =======================
// RENDER TABLE
// =======================
function renderTable() {
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageData = filteredProducts.slice(start, end);

  pageData.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>
        <img src="${getImageUrl(p)}" alt="product">
      </td>
      <td>${p.title}</td>
      <td>$${p.price}</td>
      <td class="desc">${p.description}</td>
    `;
    tbody.appendChild(tr);
  });

  renderPagination();
}

// =======================
// SEARCH (onChange)
// =======================
document.getElementById("search").addEventListener("input", e => {
  const keyword = e.target.value.toLowerCase();
  filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(keyword)
  );
  currentPage = 1;
  renderTable();
});

// =======================
// PAGE SIZE
// =======================
document.getElementById("limit").addEventListener("change", e => {
  pageSize = Number(e.target.value);
  currentPage = 1;
  renderTable();
});

// =======================
// SORT TITLE
// =======================
document.getElementById("sortTitle").addEventListener("click", () => {
  sortState.title = sortState.title === "asc" ? "desc" : "asc";

  filteredProducts.sort((a, b) =>
    sortState.title === "asc"
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title)
  );

  renderTable();
});

// =======================
// SORT PRICE
// =======================
document.getElementById("sortPrice").addEventListener("click", () => {
  sortState.price = sortState.price === "asc" ? "desc" : "asc";

  filteredProducts.sort((a, b) =>
    sortState.price === "asc"
      ? a.price - b.price
      : b.price - a.price
  );

  renderTable();
});

// =======================
// PAGINATION
// =======================
function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const totalPage = Math.ceil(filteredProducts.length / pageSize);

  for (let i = 1; i <= totalPage; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;

    if (i === currentPage) {
      btn.style.fontWeight = "bold";
    }

    btn.addEventListener("click", () => {
      currentPage = i;
      renderTable();
    });

    pagination.appendChild(btn);
  }
}
