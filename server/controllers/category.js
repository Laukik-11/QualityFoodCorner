const mongoose = require('mongoose')
const Category = require('../models/category');
const { validationResult } = require('express-validator');

// @desc Get a Category By Name
// @route GET /api/category/:catergory
// @access Public
exports.getCategoryByName = async (req, res, next, name) => {
    
    try {
        
        const category = await Category.findOne({ name: name });
        
        if (category) {
            req.category = category;
        } else {
            return res.status(400).json({
                error: "Not found category by name",
            });
        }
        // It will go to next function with category info in req.category
        next();

    } catch (error) {
        return res.status(400).json({
            error: "Error in finding category",
        });
    }
};

// @desc Get a Category By Name
// @route GET /api/category/:catergory
// @access Public
exports.getCategoryById = async (req, res, next, id) => {
    
    try {

        // const category = await Category.findOne({ _id: req.params.categoryId });
        const category = await Category.findById(id);
        
        if (category) {
            req.category = category;
        } else {
            return res.status(400).json({
                error: "Not found category by Id",
            });
        }
        // It will go to next function with category info in req.category
        next();

    } catch (error) {
        return res.status(400).json({
            error: "Error in finding category",
        });
    }
};

// @desc Get a Category
// @route GET /api/category/:category
// @access Public
exports.getCategory = async (req, res) => {
    
    try{
        
        const param = req.params.category;
        
        var category = await Category.findOne({ name: param });

        if (category) {
            return res.json(category); 
        }

        if(category === null && mongoose.isValidObjectId(param)){

            category = await Category.findOne({ _id: param }); 
            
            if(category){
                return res.json(category);
            } 
            
            return res.json({
                error: "404 Not Found"
            })
        }

        return res.json({
            error: "404 Not Found"
        })

    }catch(error){
        
        console.log(error);
        
        return res.json({
            error: "Server Error"
        })
    }
}

// @desc Create a Category
// @route POST /api/category/create/:userId
// @access ADMIN
exports.createCategory = async (req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg});
        }
        
        const category = new Category(req.body);

        const categoryRegistered = await category.save();

        if (categoryRegistered) {
            return res.status(201).json({
                message: "Category Registered Successfully ...",
                category: categoryRegistered
            });
        }
        else {
            return res.status(500).json({error: "Failed to Register"});
        }

    } catch (error) {
        return res.status(400).json({
            error: 'Unable to save category'
        })
    }
}

// @desc Update a Category
// @route PUT /api/category/:catergoryId/:userId
// @access ADMIN
exports.updateCategory = async (req, res) => {

    try {

        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg ,message:"validation error" });
        }

        const _id = req.category.id

        const categoryUpdated = await Category.findByIdAndUpdate(
            {_id: _id},
            {$set: req.body},
            {new:true, useFindAndModify:false},
        );

        if (categoryUpdated) {
            return res.status(200).json({
                message: "Category Updated Successfully ...",
                category: categoryUpdated
            })
        }

        else {
            return res.status(500).json({error: "Failed to Register"});
        }

    } catch (error) {
        return res.json({
            error: "Unable to update"
        })
    }
}

// @desc Update a Category
// @route DELETE /api/category/:catergoryId/:userId
// @access ADMIN
exports.deleteCategory = async (req, res) => {

    try {

        const category = req.category
 
        const deletedCategory = await category.remove();

        if (deletedCategory) {
            return res.json({
                message: `Successfully Deleted ${deletedCategory.name} category`
            })
        }

    } catch (error) {
        
        console.log(error);
        
        return res.status(400).json({
            error: 'Failed to delete this category'
        })
    }
}

// @desc Get All Categories
// @route GET /api/categories
// @access Public
exports.getAllCategory = async (req, res) => {

    try {
        
        const categories = await Category.find();

        if (categories) {
            return res.json({
                categories: categories
            });
        }

    } catch (error) {
        return res.json({
            error: "No categories found"
        })
    }
}