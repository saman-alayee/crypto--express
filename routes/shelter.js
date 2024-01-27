const { Shelter, validate, upload } = require("../models/shelters");
const express = require("express");
const router = express.Router();
const path = require("path");
const auth = require("../middleware/auth");



/**
 * @swagger
 * tags:
 *   name: Shelters
 *   description: API endpoints for managing shelters
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Shelter:
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
 *         - attachmentFile
 */

/**
 * @swagger
 * /shelters:
 *   get:
 *     summary: Get all shelters
 *     tags: [Shelters]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Shelter'
 */

/**
 * @swagger
 * /shelters:
 *   post:
 *     summary: Create a new shelter
 *     tags: [Shelters]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: attachmentFile
 *         type: file
 *         description: The attachment file to upload
 *       - in: formData
 *         name: name
 *         type: string
 *       - in: formData
 *         name: address
 *         type: string
 *       - in: formData
 *         name: phone
 *         type: string
 *       - in: formData
 *         name: doctorName
 *         type: string
 *       - in: formData
 *         name: shortDescription
 *         type: string
 *       - in: formData
 *         name: doctorDescription
 *         type: string
 *     responses:
 *       201:
 *         description: Shelter created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shelter'
 *       400:
 *         description: Bad request or missing attachment file
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /shelters/{id}:
 *   delete:
 *     summary: Delete a shelter by ID
 *     tags: [Shelters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the shelter to delete
 *     responses:
 *       200:
 *         description: Shelter deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shelter'
 *       404:
 *         description: Shelter not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /shelters/{id}:
 *   get:
 *     summary: Get details of a specific shelter by ID
 *     tags: [Shelters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the shelter to retrieve
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shelter'
 *       404:
 *         description: Shelter not found
 *       500:
 *         description: Internal server error
 */


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
