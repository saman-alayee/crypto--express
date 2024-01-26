const { Clinic, validate, upload } = require("../models/clinic");
const express = require("express");
const router = express.Router();
const path = require("path");
const auth = require("../middleware/auth");





router.get("/", async (req, res) => {
    const clinics = await Clinic.find().sort("name");
    res.send(clinics);
  });
  router.post("/", upload.single("attachmentFile"), async (req, res) => {
    try {
      const uploadedFile = req.file;
  
      if (!uploadedFile) {
        return res
          .status(400)
          .send("Please upload an attachmentFile using 'attachmentFile' field.");
      }
  
      const attachmentFileUrl = `${req.protocol}://${req.get("host")}/uploads/clinics/${
        uploadedFile.filename
      }`;
  
      // Extract additional fields from the request body
      const { name, address, phone, doctorName,shortDescription,doctorDescription } = req.body;
  
      const clinic = new Clinic({
        name,
        address,
        phone,
        doctorName,
        shortDescription,
        doctorDescription,
        attachmentFile: attachmentFileUrl,
      });
  
      await clinic.save();
      res.status(201).send(clinic);
    } catch (error) {
      console.error("Error during clinic creation:", error);
      res.status(500).send("An error occurred while creating the clinic.");
    }
  });
  router.delete("/:id", async (req, res) => {
    try {
      // Find the clinic by ID and delete it
      const clinic = await Clinic.findByIdAndRemove(req.params.id);
  
      if (!clinic) {
        return res.status(404).send("clinic with the given ID was not found.");
      }
  
      res.send(clinic);
    } catch (error) {
      return res.status(500).send("An error occurred while deleting the clinic.");
    }
  });
  
  // ... (previous imports and code)
  
  router.get("/:id", async (req, res) => {
    try {
      // Find the clinic by ID
      const clinic = await Clinic.findById(req.params.id);
  
      if (!clinic) {
        return res.status(404).send("clinic with the given ID was not found.");
      }
  
      res.send(clinic);
    } catch (error) {
      return res.status(500).send("An error occurred while fetching the clinic.");
    }
  });
  module.exports = router;
