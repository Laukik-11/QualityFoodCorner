const Banner = require('../models/banner');
const formidable = require('formidable');
const fs = require('fs');
const { validationResult } = require('express-validator');

// @desc Get Banner By ID
// @route GET /api/user/:userId
// @access Public
exports.getBannerById = async (req, res, next, id) => {

    try {

        const banner = await Banner.findById(id);

        if (!banner) {
            return res.status(400).json({
                error: "No banner found by ID"
            });
        }

        req.banner = banner;

        next();
        
    } catch (error) {
        return res.status(400).json({
            error: "No banner found in database"
        });
    }
};

// @desc Get Banner By ID
// @route GET /api/user/:userId
// @access Public
exports.getBanner = async (req, res) => {

    try {

        const banner = req.banner

        if (!banner) {
            return res.status(400).json({
                error: "No banner found in database"
            });
        }

        return res.status(200).json({
            banner: banner
        });
        
    } catch (error) {
        return res.status(400).json({
            error: "No banner found in database"
        });
    }
}

// @desc Create a Banner
// @route POST /api/admin/create/shop
// @access ADMIN
exports.createBanner = async (req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg});
        }

        let form = new formidable.IncomingForm();
        form.keepExtensions = true

        form.parse(req, async (err, fields, file) => {

            // console.log(err,fields,file);
            
            if(err){
                return res.status(400).json({
                    error: "Problem with image"
                });
            }

            const { title, sinceYear, description } = fields

            if (!title) {
                return res.status(400).json({
                    error: "Title field is empty !"
                })
            }

            if (!sinceYear) {
                return res.status(400).json({
                    error: "Since Year field is empty !"
                })
            }

            if (!description) {
                return res.status(400).json({
                    error: "description field is empty !"
                })
            }

            const updatedFields = {
                title: title,
                sinceYear: sinceYear,
                description: description,
            }

            let banner = new Banner(updatedFields);

            // handle file
            if (file.bannerImage) {

                if (file.bannerImage.size>3000000) {
                    return res.status(400).json({
                        error: "File size too big"
                    })
                }

                // formidable - V2
                banner.bannerImage.data = fs.readFileSync(file.bannerImage.filepath);
                banner.bannerImage.contentType = file.bannerImage.mimetype;
            }

            // save to DB
            const bannerCreated = await banner.save();

            if (bannerCreated) {
                return res.status(201).json({
                    message: "Banner Details Added Successfully ...",
                    banner: bannerCreated
                });
            }
            else {
                return res.status(500).json({error: "Failed to Add"});
            }
        })
        
        

    } catch (error) {
        return res.status(400).json({
            error: 'Unable to save Banner Details'
        })
    }
}

// @desc Update Banner Details
// @route PUT /api/admin/create/shop/:userId
// @access ADMIN
exports.updateBannerDetails = async (req, res) => {

    try {

        var _id = req.banner.id

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg ,message:"validation error" });
        }

        const banner = await Banner.findByIdAndUpdate(
            {_id: _id},
            {$set: req.body},
            {new:true, useFindAndModify:false},
        );

        if (banner) {
            return res.status(200).json({
                message: "Banner Details Updated Successfully ...",
                banner: banner
            })
        }

    } catch (error) {
        return res.json({
            error: "Unable to update"
        })
    }
}

// @desc Update Banner Details
// @route PUT /api/admin/create/shop/:userId
// @access ADMIN
exports.deleteBanner = async (req, res) => {
    
    try {

        var banner = req.banner

        const deletedBanner = await banner.remove()

        if (deletedBanner) {
            return res.status(200).json({
                message: "Banner Details Deleted Successfully ...",
                deletedBanner: deletedBanner
            })
        }

    } catch (error) {
        return res.json({
            error: "Unable to update"
        })
    }
}