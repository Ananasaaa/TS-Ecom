const fetchItems = async () => {
    const query = `
      {
        products(first: 10) {
          edges {
            node {
              title
              description
              variants(first: 1) {
                edges {
                  node {
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                  }
                }
              }
              images(first: 2) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    `;
    
    try {
      const response = await fetch('https://tsodykteststore.myshopify.com/api/2023-01/graphql.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': '7e174585a317d187255660745da44cc7',
        },
        body: JSON.stringify({ query }),
      });
  
      const data = await response.json();
      return data.data.products.edges;
    } catch (error) {
      console.error("Ошибка при получении товаров:", error);
    }
  };
  
  const createProductCardHTML = (defaultImage, hoverImage, title, description, price, discountPrice) => `
    <div class="product-card">
      <div class="product-image">
        <img src="${defaultImage}" class="default-img" alt="${title}">
        <img src="${hoverImage}" class="hover-img" alt="${title}">
      </div>
      <h3>${title}</h3>
      <p>${description.substring(0, 50)}lorem ipsum dollar sit ammet<p>
      <span class="price">${discountPrice ? `<s>${discountPrice}</s>` : ''} $${price}</span>
    </div>
  `;
  
  const generateProductCard = ({ node: { images, variants, title, description } }) => {
    const [defaultImageData, hoverImageData] = images.edges;
    const defaultImage = defaultImageData?.node.url || '';
    const hoverImage = hoverImageData?.node.url || defaultImage;
    const { amount: price } = variants.edges[0].node.price;
    const discountPrice = variants.edges[0].node.compareAtPrice?.amount || '';
  
    return createProductCardHTML(defaultImage, hoverImage, title, description, price, discountPrice);
  };
  
  const displayProductsOnPage = products => {
    document.getElementById("products-container").innerHTML = products.map(generateProductCard).join('');
  };
  
  const handleFAQToggle = () => {
    document.querySelectorAll(".faq-item").forEach(item => {
      item.querySelector(".faq-question").addEventListener("click", () => {
        const isOpen = item.dataset.open === "true";
        item.dataset.open = !isOpen;
        item.querySelector(".icon").textContent = isOpen ? "+" : "-";
        
        const answer = item.querySelector(".faq-answer");
        answer.style.maxHeight = isOpen ? "0" : `${answer.scrollHeight}px`;
        answer.style.transition = "max-height 0.3s ease-in-out";
      });
    });
  };
  
  document.addEventListener("DOMContentLoaded", async () => {
    const products = await fetchItems();
    if (products) {
      displayProductsOnPage(products);
    }
    handleFAQToggle();
  });
  