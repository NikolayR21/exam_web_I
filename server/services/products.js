const db = require('../db/index');
const listPerPage = require('../helpers/listPerPage');
const config = require('../config/connection');

async function getMultiple(page = 1){
    const offset = listPerPage.getOffSet(page, config.listPerPage);
    const rows = await db.query(
        `
        SELECT p.id, p.name, p.brand, p.price, (SELECT GROUP_CONCAT(product_image.imageFile SEPARATOR ', ')
        FROM product_image WHERE product_image.product_id = p.id) images, product_inventory.quantity
        FROM product AS p 
        INNER JOIN category ON p.category_id = category.categoryId 
        INNER JOIN product_inventory on p.id = product_inventory.product_id 
        WHERE p.isActive = 1
        LIMIT ?, ?;
        `,
        [offset, config.listPerPage]
    );

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

// async function getFilteredProducts(categoryId){
//     const offset = listPerPage.getOffSet(page, config.listPerPage);
//     const rows = await db.query(
//         `
//         SELECT p.id, p.name, p.brand, p.price, (SELECT GROUP_CONCAT(product_image.imageFile SEPARATOR ', ')
//         FROM product_image WHERE product_image.product_id = p.id) images, product_inventory.quantity
//         FROM product AS p 
//         INNER JOIN category ON p.category_id = category.categoryId 
//         INNER JOIN product_inventory on p.id = product_inventory.product_id 
//         WHERE p.isActive = 1
//         ${'AND' + categoryId.forEach(id => {
//             ' OR category.categoryId='+id
//         })}
//         LIMIT ?, ?;
//         `,
//         [offset, config.listPerPage]
//     );

//     let total = await db.query(
//         `
//         SELECT COUNT(*) FROM product 
//         WHERE p.isActive = 1
//         ${'AND' + categoryId.forEach(id => {
//             ' OR category.categoryId='+id
//         })}
//         `
//     );
//     total = total[0].total

//     const data = listPerPage.emptyOrRows(rows);
//     const meta = {page, total};

//     data.forEach(rec => {
//         rec.images = rec.images.split(',')
//     });

//     return { data, meta }
// }

async function getLatest(){
    const latest = await db.query(
        `
        SELECT p.id, p.name, p.brand, p.price, (SELECT GROUP_CONCAT(product_image.imageFile SEPARATOR ', ')
        FROM product_image WHERE product_image.product_id = p.id) images, product_inventory.quantity
        FROM product AS p 
        INNER JOIN category ON p.category_id = category.categoryId 
        INNER JOIN product_inventory on p.id = product_inventory.product_id 
        WHERE p.isActive = 1
        ORDER BY p.updated_at DESC LIMIT 10
        `
    )

    latest.forEach(rec => {
        rec.images = rec.images.split(',')
    });


    return latest;
}

async function getProduct(id){
    const product = await db.query(
        `SELECT p.id, p.name, p.brand, p.description, p.price, category.*, (SELECT GROUP_CONCAT(product_image.imageFile SEPARATOR ', ')
        FROM product_image WHERE product_image.product_id = p.id) images, product_inventory.quantity
        FROM product AS p 
        INNER JOIN category ON p.category_id = category.categoryId 
        INNER JOIN product_inventory on p.id = product_inventory.product_id 
        WHERE p.isActive = 1 AND p.id = ?
        `,
        [id]
    )

    return product;
}

module.exports = {
    getMultiple,
    getLatest,
    //getFilteredProducts,
    getProduct
}