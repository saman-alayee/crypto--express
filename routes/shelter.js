const { Shelter, validate, upload } = require("../models/shelters");
const express = require("express");
const router = express.Router();
const path = require("path");
const auth = require("../middleware/auth");





router.get("/", async (req, res) => {
    const shelters = await Shelter.find().sort("name");
    res.send(shelters);
  });
  router.post("/", upload.single("attachmentFile"), async (req, res) => {
    try {
      const uploadedFile = req.file;
  
      if (!uploadedFile) {
        return res
          .status(400)
          .send("Please upload an attachmentFile using 'attachmentFile' field.");
      }
  
      const attachmentFileUrl = `${req.protocol}://${req.get("host")}/uploads/shelters/${
        uploadedFile.filename
      }`;
  
      // Extract additional fields from the request body
      const { name, address, phone, doctorName,shortDescription,doctorDescription } = req.body;
  
      const shelter = new Shelter({
        name,
        address,
        phone,
        doctorName,
        shortDescription,
        doctorDescription,
        attachmentFile: attachmentFileUrl,
      });
  
      await shelter.save();
      res.status(201).send(shelter);
    } catch (error) {
      console.error("Error during shelter creation:", error);
      res.status(500).send("An error occurred while creating the shelter.");
    }
  });
  router.delete("/:id", async (req, res) => {
    try {
      // Find the shelter by ID and delete it
      const shelter = await Shelter.findByIdAndRemove(req.params.id);
  
      if (!shelter) {
        return res.status(404).send("shelter with the given ID was not found.");
      }
  
      res.send(shelter);
    } catch (error) {
      return res.status(500).send("An error occurred while deleting the shelter.");
    }
  });
  
  // ... (previous imports and code)
  
  router.get("/:id", async (req, res) => {
    try {
      // Find the shelter by ID
      const shelter = await Shelter.findById(req.params.id);
  
      if (!shelter) {
        return res.status(404).send("shelter with the given ID was not found.");
      }
  
      res.send(shelter);
    } catch (error) {
      return res.status(500).send("An error occurred while fetching the shelter.");
    }
  });
  module.exports = router;
