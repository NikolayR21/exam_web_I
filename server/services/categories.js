const config = require('../config/connection');
const listPerPage = require('../helpers/listPerPage');
const db = require('../db/index');

async function getCategories(){
    const rows = await db.query(
        `SELECT * FROM category`
    )

    return rows;
}

async function getProductsByCategory(categoryId, page=1){
    const offset = listPerPage.getOffSet(page, config.listPerPage);
    const rows = await db.query(
        `
        SELECT p.id, p.name, p.brand, p.price, category.*, (SELECT GROUP_CONCAT(product_image.imageFile SEPARATOR ', ')
        FROM product_image WHERE product_image.product_id = p.id) images, product_inventory.quantity
        FROM product AS p 
        INNER JOIN category ON p.category_id = category.categoryId 
        INNER JOIN product_inventory on p.id = product_inventory.product_id 
        WHERE p.isActive = 1 AND category.categoryId = ?
        LIMIT ?, ?;
        `,
        [categoryId, offset, config.listPerPage]
    )

    let total = await db.query(
        `
        SELECT COUNT(*) FROM product
        `
    );
    total = total[0].total

    const data = listPerPage.emptyOrRows(rows);
    const meta = {page, total};

    data.forEach(rec => {
        rec.images = rec.images.split(',')
    });

    return { data, meta }
}

module.exports = {
    getCategories,
    getProductsByCategory
}

/*
/categories - get all categories, clicking on one goes to id and all prods that belong to it
categories/:id - prod of that category

/prods - all products
/prods/:id - specific prod
/prods?category=1,2

*/