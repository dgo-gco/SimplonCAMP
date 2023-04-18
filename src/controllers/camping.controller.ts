import { Request, Response, Router } from "express";
import Camping from "../models/camping.model";
import Controller from "../tools/controller.interface";
import { upload } from "../middlewares/upload";

export class CampingController implements Controller {
  path = "/camping";
  router = Router();

  constructor() {
    this.initializeRoute();
  }

  initializeRoute() {
    this.router.get(`${this.path}/get-campings`, this.getCampingInfo)
    this.router.post(
      `${this.path}/add-camping`,
      upload.single("img"),
      this.createCamping
    );
    this.router.put(`${this.path}/update-camping/:id`, this.updateCamping);
    this.router.delete(`${this.path}/delete-camping/:id`, this.deleteCamping);
  }

  getCampingInfo = async (req: Request, res: Response) => {
    try {
      const campingInfo = await Camping.find({}).populate('user').exec()
      return res.status(200).json({
        msg: "Here's the data",
      campingInfo
      })
    } catch (error) {
      return res.status(500).json({
        msg: "Ups! Something went wrong",
      });
    }
  };

  createCamping = async (req: Request, res: Response) => {
    try {
      const newCamping = await Camping.create({
        img: req.file!.path,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
      });
      return res.status(200).json({
        msg: "Camping created",
        newCamping,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Ups! Something went wrong",
      });
    }
  };

  updateCamping = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const camping = await Camping.findByIdAndUpdate(id, req.body);
      if (!camping) {
        return res.status(200).json({
          msg: "This camping doesnt exist",
        });
      }
      return res.status(200).json({
        msg: "Camping updated",
        camping,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Ups! Something went wrong",
      });
    }
  };

  deleteCamping = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const camping = await Camping.findByIdAndDelete(id);
      if (!camping) {
        return res.status(200).json({
          msg: "This camping doesnt exist",
        });
      }
      return res.status(200).json({
        msg: "Camping updated",
        camping,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Ups! Something went wrong",
      });
    }
  };
}
