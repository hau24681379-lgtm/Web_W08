const categories = [
    { "id": 1, "title": "men's clothing" },
    { "id": 2, "title": "jewelery" },
    { "id": 3, "title": "electronics" },
    { "id": 4, "title": "women's clothing" }
];

const categoryMap = {
    "men's clothing": 1,
    "jewelery": 2,
    "electronics": 3,
    "women's clothing": 4
};

const productsRaw = [
    // Bổ sung các trường rating_rate và rating_count mặc định cho đơn giản
    { "id": 1, "title": "Fjallraven Foldsack No. 1 Backpack", "price": 109.95, "description": "Your perfect pack for everyday use and weekend trips.", "category": "men's clothing", "image": "p1.png" },
    { "id": 2, "title": "Mens Casual Premium Slim Fit T-Shirts", "price": 22.3, "description": "Slim-fitting style, contrast raglan long sleeve, three-button.", "category": "men's clothing", "image": "p2.png" },
    { "id": 3, "title": "Mens Cotton Jacket", "price": 55.99, "description": "great outerwear jackets for Spring/Autu...", "category": "men's clothing", "image": "p3.png" },
    { "id": 4, "title": "Solid Gold Petite Micropave", "price": 168, "description": "Satisfaction Guaranteed. Return or exchange any order within 30 days.", "category": "jewelery", "image": "p4.png" },
    { "id": 5, "title": "John Hardy Women's Chain Bracelet", "price": 695, "description": "From our Legends Collection, the Naga...", "category": "jewelery", "image": "p5.png" },
    { "id": 6, "title": "White Gold Plated Princess", "price": 9.99, "description": "Classic Created Wedding Engagement S...", "category": "jewelery", "image": "p6.png" },
    { "id": 7, "title": "WD 2TB Elements Portable Hard Drive", "price": 64, "description": "USB 3.0 and USB 2.0 Compatibility...", "category": "electronics", "image": "p7.png" },
    { "id": 8, "title": "SanDisk SSD PLUS 1TB SSD", "price": 109, "description": "Easy upgrade for faster boot up, shutdown, application load and response.", "category": "electronics", "image": "p8.png" },
    { "id": 9, "title": "Opna Women's Short Sleeve Moisture", "price": 7.95, "description": "100% Polyester; Machine wash. Run true to size.", "category": "women's clothing", "image": "p9.png" },
    { "id": 10, "title": "DANVOUY Womens T Shirt Casual Cotton", "price": 12.99, "description": "Short sleeve with three-button closure.", "category": "women's clothing", "image": "p10.png" }
];

function quoteIdent (name) {
    return `"${String(name).replace(/"/g, '""')}"`;
}

async function syncSerial (trx, table, idCol, schema = 'public') {
    const rel = `${schema}.${quoteIdent(table)}`;
    const { rows } = await trx.raw('SELECT pg_get_serial_sequence(?, ?) AS seq', [rel, idCol]);
    const seq = rows?.[0]?.seq;
    if (!seq) return;
    const maxRow = await trx(table).max({ max: idCol}).first();
    const max = Number(maxRow?.max ?? 0);
    await trx.raw('SELECT setval(?, ?, false)', [seq, max + 1]);
}

export async function seed(knex) {
    await knex.transaction(async (trx) => {
        await trx('products').del();
        await trx('categories').del();
        
        await trx('categories').insert(categories);
        
        const products = productsRaw.map((p) => ({
            id: p.id,
            title: p.title,
            price: p.price,
            description: p.description,
            image: `/imgs/${p.image}`, 
            rating_rate: 4.0, 
            rating_count: 500,
            category_id: categoryMap[p.category]
        }));

        await trx('products').insert(products);

        await syncSerial (trx, 'categories', 'id');
        await syncSerial (trx, 'products', 'id');
    });
};