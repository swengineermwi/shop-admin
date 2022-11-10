import { g, c } from "./js/utils";

const editable = (product) => {
  const card = c("div", "prod-card col-12 col-3@md")
  const delButton = c("button", "btn btn--subtle material-icons")
  const a = c("a", "prod-card__img-link")
  const figure = c("figure", "prod-card__img")
  const image = c("img", "prod-card__img")

  const priceNameContainer = c("div", "padding-sm text-center")
  const name = c("h3", "color-inherit")
  const priceContainer = c("div", "margin-top-xs")
  const price = c("span", "prod-card__price")

  delButton.innerText = "delete"
  image.src = product.image
  name.innerText = product.name
  price.innerText = `$${product.price}`

  figure.appendChild(image)
  a.appendChild(figure)

  priceContainer.appendChild(price)
  priceNameContainer.appendChild(name)
  priceNameContainer.appendChild(priceContainer)

  card.appendChild(a)
  card.appendChild(priceNameContainer)

  return card
}

export function categoryUi(key, products, addProductCallback) {
  const grid = c("div", "grid items-center")
  const headingCol = c("div", "col-6")
  const actionCol = c("div", "col-6 flex justify-end")
  const productsCol = c("div", "grid gap-sm padding-y-md")

  // for (const key in products) {
  //   if (Object.hasOwnProperty.call(products, key)) {
  //     const product = products[key];
  //     productsCol.appendChild(editable(product))
  //   }
  // }

  const heading = c("h3")

  const action = c("button", "btn btn--primary btn--sm material-icons")
  action.value = key
  action.addEventListener("click", addProductCallback)

  heading.innerHTML = key
  action.innerText = "add"

  headingCol.appendChild(heading)
  actionCol.appendChild(action)

  grid.appendChild(headingCol)
  grid.appendChild(actionCol)
  grid.appendChild(productsCol)

  return grid
}

const shop = (categories, deleteCallback, addProductCallback) => {
  const categoriesArea = g("categories")
  categoriesArea.innerHTML = ""

  categories.forEach(category => {
    categoriesArea.appendChild(categoryUi(category.id, category.products, (e) => addProductCallback(e)))
  });
}

export default shop