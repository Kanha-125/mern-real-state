import Listing from "../models/listing.model.js"
import { errorHandler } from "../utils/error.js"


export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body)
        res.status(201).json(listing)
    } catch (error) {
        next(error)
    }
}

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id)
    if (!listing) return next(errorHandler(404, "Listing not found"));

    if (listing.userRef.toString() !== req.user.id) {
        return next(errorHandler(401, "You are not authorized to delete this listing"))
    }

    try {
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(201).json(updatedListing)
    } catch (error) {
        next(error)
    }
}

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found"));

    if (listing.userRef.toString() !== req.user.id) {
        return next(errorHandler(401, "You are not authorized to delete this listing"))
    }

    try {
        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Listing deleted successfully" })

    } catch (error) {
        next(error)
    }

}

export const getAListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return next(errorHandler(404, "Listing not found"));
        res.status(200).json(listing)
    } catch (error) {
        next(error)
    }
}

export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.page) || 0;

        let offer = req.query.offer;
        if (offer === undefined || offer === "false") {
            offer = { $in: [false, true] };
        } else {
            offer = offer === "true";
        }

        let furnished = req.query.furnished;
        if (furnished === undefined || furnished === "false") {
            furnished = { $in: [false, true] };
        } else {
            furnished = furnished === "true";
        }

        let parking = req.query.parking;
        if (parking === undefined || parking === "false") {
            parking = { $in: [false, true] };
        } else {
            parking = parking === "true";
        }

        let type = req.query.type;
        if (type === undefined || type === "all") {
            type = { $in: ["sale", "rent"] };
        }

        const searchTerm = req.query.searchTerm || "";
        const sort = req.query.sort || "createdAt";
        const order = req.query.order === "asc" ? 1 : -1;

        const listings = await Listing.find({
            type: type,
            offer: offer,
            furnished: furnished,
            parking: parking,
            name: { $regex: searchTerm, $options: 'i' },
        })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);

        return res.status(200).json(listings);

    } catch (error) {
        next(error);
    }
};