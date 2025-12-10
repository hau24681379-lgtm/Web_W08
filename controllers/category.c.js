import categoryM from "../models/category.m.js";

const catC = {
    getCategories: async (req, res) => {
        const categories = await categoryM.all();
        // Cần render một view không có logic phân trang sản phẩm
        res.render('product/cat', { categories });
    },
    getSelectCategory: async (req, res) => {
        res.send('Get Select Category');
    },
    postCategory: async (req, res) => {
        res.send('Post Category');
    },
    putCategory: async (req, res) => {
        res.send('Put Category');
    }
};

export default catC;