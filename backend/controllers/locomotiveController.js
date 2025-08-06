const Locomotive = require('../models/Locomotive');

class LocomotiveController {
  static async getAll(req, res) {
    try {
      const locomotives = await Locomotive.findAll();
      
      res.json({
        success: true,
        data: locomotives
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const locomotive = await Locomotive.findById(id);
      
      if (!locomotive) {
        return res.status(404).json({
          success: false,
          message: 'Locomotive not found'
        });
      }

      res.json({
        success: true,
        data: locomotive
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = LocomotiveController;
