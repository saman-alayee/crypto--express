const { Clinic, validate, upload } = require("../models/clinic");
const express = require("express");
const router = express.Router();
const path = require("path");
const auth = require("../middleware/auth");


/**
 * @swagger
 * tags:
 *   name: Clinics
 *   description: API endpoints for managing clinics
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Clinic:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         address:
 *           type: string
 *         phone:
 *           type: string
 *         doctorName:
 *           type: string
 *         shortDescription:
 *           type: string
 *         doctorDescription:
 *           type: string
 *         attachmentFile:
 *           type: string
 *       required:
 *         - name
 *         - address
 *         - phone
 *         - doctorName
 *         - shortDescription
 *         - doctorDescription
 */

/**
 * @swagger
 * /clinics:
 *   get:
 *     summary: Get all clinics
 *     tags: [Clinics]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clinic'
 */

/**
 * @swagger
 * /clinics:
 *   post:
 *     summary: Create a new clinic
 *     tags: [Clinics]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               attachmentFile:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               doctorName:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               doctorDescription:
 *                 type: string
 *     responses:
 *       201:
 *         description: Clinic created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clinic'
 *       400:
 *         description: Bad request or missing attachmentFile
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /clinics/{id}:
 *   delete:
 *     summary: Delete a clinic by ID
 *     tags: [Clinics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the clinic to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Clinic deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clinic'
 *       404:
 *         description: Clinic not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /clinics/{id}:
 *   get:
 *     summary: Get details of a specific clinic by ID
 *     tags: [Clinics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the clinic to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clinic'
 *       404:
 *         description: Clinic not found
 *       500:
 *         description: Internal server error
 */

// ... (previous imports and code)

module.exports = router;



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
